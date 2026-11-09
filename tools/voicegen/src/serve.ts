import { createHash } from "node:crypto";
import { existsSync } from "node:fs";
import { mkdir, readFile } from "node:fs/promises";
import { createServer, type ServerResponse } from "node:http";
import { fileURLToPath } from "node:url";
import { parseArgs } from "node:util";
import { audioPipeline, encodeClip } from "./audio.ts";
import { ensureProfiles, FIRST_SEED, profileFor } from "./render.ts";
import { tonePresets } from "./tones.ts";
import { connectVoiceStudio } from "./voicestudio.ts";
import { voices } from "./voices.ts";

const MAX_TEXT_LENGTH = 200;
const TYPED_VOICE = "anak";

const { values: args } = parseArgs({
  options: {
    port: { type: "string", default: "3910" },
    host: { type: "string", default: "0.0.0.0" },
    url: { type: "string", default: "http://localhost:3900" },
  },
});

const report = (line: string) => process.stdout.write(`${line}\n`);
const cacheDir = fileURLToPath(new URL("../.cache/typed/", import.meta.url));
const studio = connectVoiceStudio(args.url);
const profileId = profileFor(await ensureProfiles(studio, report), TYPED_VOICE);
const { loudness } = tonePresets.neutral;

/** VoiceStudio renders one clip at a time; queueing here keeps parallel taps from timing each other out. */
let queue: Promise<unknown> = Promise.resolve();
function serially<T>(task: () => Promise<T>): Promise<T> {
  const next = queue.then(task, task);
  queue = next.catch(() => undefined);
  return next;
}

async function clipFor(text: string): Promise<string> {
  const hash = createHash("sha256").update(JSON.stringify({ text, profileId, request: "generate", pipeline: audioPipeline(loudness), FIRST_SEED })).digest("hex");
  const path = `${cacheDir}${hash}.mp3`;
  if (existsSync(path)) return path;
  return serially(async () => {
    if (existsSync(path)) return path;
    const wav = await studio.speak({ text, seed: FIRST_SEED, profileId });
    await mkdir(cacheDir, { recursive: true });
    await encodeClip({ wav, outputPath: path, loudness });
    return path;
  });
}

function send(response: ServerResponse, status: number, type: string, body: string | Uint8Array) {
  response.writeHead(status, { "content-type": type, "access-control-allow-origin": "*", "cache-control": "no-store" });
  response.end(body);
}

const server = createServer((request, response) => {
  const [pathname, query = ""] = (request.url ?? "/").split("?", 2);
  if (pathname === "/health") {
    send(response, 200, "application/json", JSON.stringify({ voice: voices[TYPED_VOICE].profileName }));
    return;
  }
  const text = new URLSearchParams(query).get("text")?.trim() ?? "";
  if (pathname !== "/speak" || text.length === 0 || text.length > MAX_TEXT_LENGTH) {
    send(response, 400, "text/plain", `Use GET /speak?text=<1-${MAX_TEXT_LENGTH} characters>`);
    return;
  }
  clipFor(text)
    .then(async (path) => send(response, 200, "audio/mpeg", await readFile(path)))
    .catch((error: unknown) => {
      process.stderr.write(`Could not speak "${text}": ${String(error)}\n`);
      send(response, 502, "text/plain", "VoiceStudio could not render this text");
    });
});

server.listen(Number(args.port), args.host, () => {
  report(`Typed-text voice server on http://${args.host}:${args.port} using "${voices[TYPED_VOICE].profileName}"`);
});

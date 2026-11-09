import { existsSync } from "node:fs";
import { mkdir, rm, writeFile } from "node:fs/promises";
import { dirname } from "node:path";
import { fileURLToPath } from "node:url";
import { parseArgs } from "node:util";
import { encodeClip } from "./audio.ts";
import { allJobs, type ClipJob } from "./jobs.ts";
import { clipModule, readManifest, writeManifest, type Manifest } from "./manifest.ts";
import { parsePin, readPins, writePins, type Pins } from "./pins.ts";
import { writePreview } from "./preview.ts";
import { clipHash, ensureProfiles, FIRST_SEED, profileFor, renderTake, renderVerified, type Profiles } from "./render.ts";
import { connectVoiceStudio, type VoiceStudio } from "./voicestudio.ts";

const report = (line: string) => process.stdout.write(`${line}\n`);
const voicePackage = (path: string) => fileURLToPath(new URL(`../../../packages/voice/${path}`, import.meta.url));
const toolFile = (path: string) => fileURLToPath(new URL(`../${path}`, import.meta.url));
const manifestPath = voicePackage("manifest.json");
const pinsPath = toolFile("pins.json");
const clipPath = (key: string) => voicePackage(`clips/${key}.mp3`);
const csv = (value: string | undefined) => new Set(value?.split(",").map((item) => item.trim()));

const { values: args } = parseArgs({
  options: {
    only: { type: "string" },
    preview: { type: "string" },
    pin: { type: "string", multiple: true },
    approve: { type: "string" },
    force: { type: "boolean", default: false },
    url: { type: "string", default: "http://localhost:3900" },
  },
});

function approve(manifest: Manifest, keys: ReadonlySet<string>): void {
  for (const key of keys) {
    const entry = manifest[key];
    if (entry === undefined) throw new Error(`Cannot approve "${key}": no such clip in the manifest`);
    entry.verifiedBy = "listener";
    report(`approved ${key}`);
  }
}

async function generate({ studio, profiles, manifest, pins, jobs }: { studio: VoiceStudio; profiles: Profiles; manifest: Manifest; pins: Pins; jobs: readonly ClipJob[] }): Promise<number> {
  const only = csv(args.only);
  let generated = 0;
  for (const job of jobs) {
    if (args.only !== undefined && !only.has(job.id)) continue;
    const profileId = profileFor(profiles, job.voice);
    const pinnedSeed = pins[job.key];
    const hash = clipHash(job, profileId, pinnedSeed ?? FIRST_SEED);
    const previous = manifest[job.key];
    if (!args.force && previous?.hash === hash && previous.verifiedBy !== null && existsSync(clipPath(job.key))) continue;

    const take = pinnedSeed === undefined ? await renderVerified(studio, job, profileId) : await renderTake(studio, job, profileId, pinnedSeed);
    await mkdir(dirname(clipPath(job.key)), { recursive: true });
    await encodeClip({ wav: take.wav, outputPath: clipPath(job.key), loudness: job.tone.loudness });
    const verifiedBy = pinnedSeed !== undefined ? "listener" : take.verified ? "whisper" : null;
    manifest[job.key] = { hash, text: job.text, transcript: take.transcript, seed: take.seed, verifiedBy };
    await writeManifest(manifestPath, manifest);
    generated++;
    report(`${verifiedBy === null ? "WARN" : "ok  "} ${job.key}: "${job.text}" heard as "${take.transcript}" (seed ${take.seed})`);
  }
  return generated;
}

async function main(): Promise<number> {
  const jobs = allJobs();
  const manifest = await readManifest(manifestPath);

  if (args.approve !== undefined) {
    approve(manifest, csv(args.approve));
    await writeManifest(manifestPath, manifest);
    return 0;
  }

  const studio = connectVoiceStudio(args.url);
  const profiles = await ensureProfiles(studio, report);

  if (args.preview !== undefined) {
    const wanted = csv(args.preview);
    const index = await writePreview({
      studio,
      jobs: jobs.filter((job) => wanted.has(job.id)),
      profileFor: (job) => profileFor(profiles, job.voice),
      directory: toolFile("preview"),
    });
    report(`Open ${index} to listen, then run the --pin command next to the take you like.`);
    return 0;
  }

  const pins = await readPins(pinsPath);
  for (const argument of args.pin ?? []) {
    const [key, seed] = parsePin(argument);
    if (!jobs.some((job) => job.key === key)) throw new Error(`Cannot pin "${key}": no such clip`);
    pins[key] = seed;
    report(`pinned ${key} to seed ${seed}`);
  }
  if (args.pin !== undefined) await writePins(pinsPath, pins);

  const liveKeys = new Set<string>(jobs.map((job) => job.key));
  for (const key of Object.keys(manifest).filter((key) => !liveKeys.has(key))) {
    await rm(clipPath(key), { force: true });
    delete manifest[key];
  }
  const generated = await generate({ studio, profiles, manifest, pins, jobs });
  await writeManifest(manifestPath, manifest);
  await writeFile(voicePackage("src/clips.ts"), clipModule(jobs));
  report(`\nGenerated ${generated} of ${jobs.length} clip(s).`);

  const unverified = Object.entries(manifest).filter(([, entry]) => entry.verifiedBy === null);
  if (unverified.length === 0) return 0;
  report(`\nWhisper could not confirm these clips. Listen with \`pnpm voicegen --preview <id>\`, then pin a take or run \`pnpm voicegen --approve <key>\`:`);
  for (const [key, entry] of unverified) report(`  ${key}: "${entry.text}" heard as "${entry.transcript}"`);
  return 1;
}

process.exitCode = await main();

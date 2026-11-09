import { execFile } from "node:child_process";
import { mkdtemp, rm, writeFile } from "node:fs/promises";
import { tmpdir } from "node:os";
import { join } from "node:path";
import { promisify } from "node:util";
import type { Wav } from "./voicestudio.ts";

const run = promisify(execFile);

const trimLeadingSilence = "silenceremove=start_periods=1:start_threshold=-45dB:start_silence=0.04";
/** ffmpeg's silenceremove only trims reliably from the start, so the end is trimmed on the reversed clip. */
const trimTrailingSilence = ["areverse", trimLeadingSilence, "areverse"].join(",");

export function audioPipeline(loudness: number): string {
  return [trimLeadingSilence, trimTrailingSilence, `loudnorm=I=${loudness}:TP=-1.5:LRA=7`].join(",");
}

export async function encodeClip({ wav, outputPath, loudness }: { wav: Wav; outputPath: string; loudness: number }): Promise<void> {
  const workDir = await mkdtemp(join(tmpdir(), "voicegen-"));
  try {
    const inputPath = join(workDir, "in.wav");
    await writeFile(inputPath, wav);
    await run("ffmpeg", ["-y", "-loglevel", "error", "-i", inputPath, "-af", audioPipeline(loudness), "-ar", "44100", "-ac", "1", "-b:a", "64k", outputPath]);
  } finally {
    await rm(workDir, { recursive: true, force: true });
  }
}

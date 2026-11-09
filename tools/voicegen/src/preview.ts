import { mkdir, rm, writeFile } from "node:fs/promises";
import { join } from "node:path";
import { encodeClip } from "./audio.ts";
import type { ClipJob } from "./jobs.ts";
import { FIRST_SEED, renderTake } from "./render.ts";
import type { VoiceStudio } from "./voicestudio.ts";

const TAKES = 8;

type PreviewRow = { job: ClipJob; seed: number; file: string; transcript: string };

function page(rows: readonly PreviewRow[]): string {
  const items = rows
    .map(
      ({ job, seed, file, transcript }) =>
        `<tr><td>${job.key}</td><td>${seed}</td><td><audio controls preload="auto" src="${file}"></audio></td><td>${transcript}</td><td><code>pnpm voicegen --pin ${job.key}=${seed}</code></td></tr>`,
    )
    .join("\n");
  return `<!doctype html><meta charset="utf-8"><title>Tutur voice preview</title>
<style>body{font:16px system-ui;margin:24px}td{padding:6px 12px;border-bottom:1px solid #ddd}code{background:#f4f4f4;padding:2px 6px}</style>
<h1>Pick the take that sounds right</h1>
<table><tr><th>Clip</th><th>Seed</th><th>Listen</th><th>Whisper heard</th><th>Keep it</th></tr>
${items}
</table>`;
}

export async function writePreview({ studio, jobs, profileFor, directory }: {
  studio: VoiceStudio;
  jobs: readonly ClipJob[];
  profileFor: (job: ClipJob) => string;
  directory: string;
}): Promise<string> {
  await rm(directory, { recursive: true, force: true });
  await mkdir(directory, { recursive: true });
  const rows: PreviewRow[] = [];
  for (const job of jobs) {
    for (let seed = FIRST_SEED; seed < FIRST_SEED + TAKES; seed++) {
      const take = await renderTake(studio, job, profileFor(job), seed);
      const file = `${job.group}-${job.id}-${seed}.mp3`;
      await encodeClip({ wav: take.wav, outputPath: join(directory, file), loudness: job.tone.loudness });
      rows.push({ job, seed, file, transcript: take.transcript });
    }
  }
  const indexPath = join(directory, "index.html");
  await writeFile(indexPath, page(rows));
  return indexPath;
}

import { createHash } from "node:crypto";
import { audioPipeline } from "./audio.ts";
import type { ClipJob } from "./jobs.ts";
import { transcriptMatches } from "./transcript.ts";
import type { VoiceStudio, Wav } from "./voicestudio.ts";
import { REFERENCE_TEXT, voices, type VoiceId } from "./voices.ts";

export const FIRST_SEED = 42;
const MAX_ATTEMPTS = 6;

export type Take = { wav: Wav; transcript: string; verified: boolean; seed: number };

export type Profiles = ReadonlyMap<VoiceId, string>;

export async function ensureProfiles(studio: VoiceStudio, report: (line: string) => void): Promise<Profiles> {
  const profiles = new Map<VoiceId, string>();
  for (const id of Object.keys(voices).filter((key): key is VoiceId => key in voices)) {
    const voice = voices[id];
    const existing = await studio.findProfile(voice.profileName);
    if (existing !== undefined) {
      profiles.set(id, existing);
      continue;
    }
    report(`Designing voice "${voice.profileName}" (${voice.instruct})`);
    const referenceWav = await studio.speak({ text: REFERENCE_TEXT, seed: voice.designSeed, instruct: voice.instruct });
    profiles.set(id, await studio.createCloneProfile({ name: voice.profileName, referenceWav, referenceText: REFERENCE_TEXT }));
  }
  return profiles;
}

export function profileFor(profiles: Profiles, voice: VoiceId): string {
  const profileId = profiles.get(voice);
  if (profileId === undefined) throw new Error(`No VoiceStudio profile for voice "${voice}"`);
  return profileId;
}

export function clipHash(job: ClipJob, profileId: string, seed: number): string {
  const recipe = { text: job.text, request: "generate", pipeline: audioPipeline(job.tone.loudness), profileId, seed };
  return createHash("sha256").update(JSON.stringify(recipe)).digest("hex");
}

export async function renderTake(studio: VoiceStudio, job: ClipJob, profileId: string, seed: number): Promise<Take> {
  const wav = await studio.speak({ text: job.text, seed, profileId });
  const transcript = await studio.transcribe(wav);
  return { wav, transcript, verified: transcriptMatches(transcript, job.acceptedTranscripts), seed };
}

/** Sampling is random per seed, so a take Whisper can't understand is re-rolled with the next seed. */
export async function renderVerified(studio: VoiceStudio, job: ClipJob, profileId: string): Promise<Take> {
  let take = await renderTake(studio, job, profileId, FIRST_SEED);
  for (let seed = FIRST_SEED + 1; seed < FIRST_SEED + MAX_ATTEMPTS && !take.verified; seed++) {
    take = await renderTake(studio, job, profileId, seed);
  }
  return take;
}

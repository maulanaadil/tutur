import { mascotPhrases, spokenText, toneOf, words, type PhraseId, type WordId } from "@tutur/vocab";
import { tonePresets, type TonePreset } from "./tones.ts";
import type { VoiceId } from "./voices.ts";

type ClipGroup = "words" | "phrases";

export type ClipJob = {
  readonly key: `${ClipGroup}/${string}`;
  readonly group: ClipGroup;
  readonly id: string;
  /** Text sent to the TTS engine. */
  readonly text: string;
  readonly acceptedTranscripts: readonly string[];
  readonly voice: VoiceId;
  readonly tone: TonePreset;
};

function wordJob(id: WordId): ClipJob {
  const spoken = spokenText(id);
  return {
    key: `words/${id}`,
    group: "words",
    id,
    text: spoken,
    acceptedTranscripts: [spoken, words[id].label],
    voice: "anak",
    tone: tonePresets[toneOf(id)],
  };
}

function phraseJob(id: PhraseId): ClipJob {
  const { text } = mascotPhrases[id];
  return { key: `phrases/${id}`, group: "phrases", id, text, acceptedTranscripts: [text], voice: "teman", tone: tonePresets.neutral };
}

export function allJobs(): ClipJob[] {
  const wordIds = Object.keys(words).filter((id): id is WordId => id in words);
  const phraseIds = Object.keys(mascotPhrases).filter((id): id is PhraseId => id in mascotPhrases);
  return [...wordIds.map(wordJob), ...phraseIds.map(phraseJob)];
}

import type { PhraseEntry } from "./types.ts";

export const mascotPhrases = {
  hebat: { text: "Hebat!" },
  pintar: { text: "Pintar sekali!" },
  bagus: { text: "Bagus!" },
} as const satisfies Record<string, PhraseEntry>;

export type PhraseId = keyof typeof mascotPhrases;

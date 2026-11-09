/**
 * Modified Fitzgerald Key: the colour-coding AAC boards use so children learn
 * sentence structure (who + doing + what) from tile colour alone.
 */
export type WordKind = "person" | "action" | "describe" | "thing" | "social" | "negation";

/** How a word is said. "gentle" is soft and slow, for regret, sadness and tiredness. */
export type Tone = "neutral" | "gentle" | "cheerful" | "firm";

export type WordEntry = {
  readonly label: string;
  /** Pronunciation sent to the TTS engine when it differs from the label, e.g. "HP" → "hape". */
  readonly spoken?: string;
  readonly kind: WordKind;
  readonly symbol: string;
  readonly tone?: Tone;
};

export type PhraseEntry = {
  readonly text: string;
};

import type { Tone } from "@tutur/vocab";

export type TonePreset = {
  /** Integrated loudness target in LUFS; gentle words stay quieter than the rest of the board. */
  readonly loudness: number;
};

/**
 * Words are rendered exactly as VoiceStudio says them. Reshaping the pitch afterwards made them
 * sound processed, so a tone only sets how loud the word plays next to the others.
 */
export const tonePresets: Record<Tone, TonePreset> = {
  neutral: { loudness: -16 },
  gentle: { loudness: -19 },
  cheerful: { loudness: -15 },
  firm: { loudness: -14 },
};

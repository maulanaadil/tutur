export type VoiceSpec = {
  readonly profileName: string;
  readonly instruct: string;
  readonly designSeed: number;
};

export const REFERENCE_TEXT = "Halo, aku teman kamu. Ayo kita main dan belajar bersama, pelan-pelan saja ya.";

export const voices = {
  anak: { profileName: "Tutur Anak", instruct: "female, child, moderate pitch", designSeed: 7 },
  /** Praise uses a different voice so it never sounds like the child praising themselves. */
  teman: { profileName: "Tutur Teman", instruct: "female, young adult, moderate pitch", designSeed: 7 },
} as const satisfies Record<string, VoiceSpec>;

export type VoiceId = keyof typeof voices;

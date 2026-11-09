export const MASCOT_IDS = ["tari", "jali", "oki", "komo"] as const;

export type MascotId = (typeof MASCOT_IDS)[number];

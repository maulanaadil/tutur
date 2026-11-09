import { readFile, writeFile } from "node:fs/promises";
import { z } from "zod";

/** Seeds a person chose by ear with `--preview` and `--pin`. They override the automatic Whisper-checked take. */
const Pins = z.record(z.string(), z.number().int());
export type Pins = z.infer<typeof Pins>;

export async function readPins(path: string): Promise<Pins> {
  try {
    return Pins.parse(JSON.parse(await readFile(path, "utf8")));
  } catch (error) {
    if (error instanceof Error && "code" in error && error.code === "ENOENT") return {};
    throw error;
  }
}

export async function writePins(path: string, pins: Pins): Promise<void> {
  const sorted = Object.fromEntries(Object.entries(pins).sort(([a], [b]) => a.localeCompare(b)));
  await writeFile(path, `${JSON.stringify(sorted, null, 2)}\n`);
}

export function parsePin(argument: string): [key: string, seed: number] {
  const match = /^([a-z]+\/[a-z0-9_]+)=(\d+)$/.exec(argument.trim());
  if (match?.[1] === undefined || match[2] === undefined) throw new Error(`Expected --pin <group>/<id>=<seed>, got "${argument}"`);
  return [match[1], Number(match[2])];
}

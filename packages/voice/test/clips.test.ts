import assert from "node:assert/strict";
import { existsSync, readFileSync } from "node:fs";
import { test } from "node:test";
import { mascotPhrases, words } from "@tutur/vocab";

const packageFile = (path: string) => new URL(`../${path}`, import.meta.url);
const expectedKeys = [...Object.keys(words).map((id) => `words/${id}`), ...Object.keys(mascotPhrases).map((id) => `phrases/${id}`)];

test("every word and phrase has a generated clip (run `pnpm voicegen` after editing vocab)", () => {
  const missing = expectedKeys.filter((key) => !existsSync(packageFile(`clips/${key}.mp3`)));
  assert.deepEqual(missing, []);
});

test("the manifest has an entry for every clip", () => {
  const manifest: unknown = JSON.parse(readFileSync(packageFile("manifest.json"), "utf8"));
  assert.ok(typeof manifest === "object" && manifest !== null);
  assert.deepEqual(expectedKeys.filter((key) => !(key in manifest)), []);
});

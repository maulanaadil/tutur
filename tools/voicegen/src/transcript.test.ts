import assert from "node:assert/strict";
import { test } from "node:test";
import { transcriptMatches } from "./transcript.ts";

test("ignores case, punctuation and spacing", () => {
  assert.ok(transcriptMatches("Minum.", ["minum"]));
  assert.ok(transcriptMatches("Es krim!", ["es krim"]));
  assert.ok(transcriptMatches("eskrim", ["es krim"]));
  assert.ok(transcriptMatches("Mak'an", ["makan"]));
});

test("treats a silent word-final k as the same word", () => {
  assert.ok(transcriptMatches("Kaka", ["kakak"]));
  assert.ok(transcriptMatches("Tida.", ["tidak"]));
  assert.ok(!transcriptMatches("Kaki", ["kakak"]));
});

test("accepts any listed spelling", () => {
  assert.ok(transcriptMatches("HP", ["hape", "HP"]));
});

test("rejects a different word or silence", () => {
  assert.ok(!transcriptMatches("as cream", ["es krim"]));
  assert.ok(!transcriptMatches("", ["aku"]));
});

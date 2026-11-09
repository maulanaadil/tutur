import assert from "node:assert/strict";
import { test } from "node:test";
import { parsePin } from "./pins.ts";

test("parses a clip key and seed", () => {
  assert.deepEqual(parsePin("words/kamu=47"), ["words/kamu", 47]);
});

test("rejects anything else", () => {
  assert.throws(() => parsePin("kamu=47"));
  assert.throws(() => parsePin("words/kamu"));
  assert.throws(() => parsePin("words/kamu=abc"));
});

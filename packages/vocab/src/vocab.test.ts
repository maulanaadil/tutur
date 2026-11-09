import assert from "node:assert/strict";
import { test } from "node:test";
import { categories, MAX_WORDS_PER_BOARD, mascotPhrases, words } from "./index.ts";

test("every word sits on at least one board", () => {
  const placed: ReadonlySet<string> = new Set(categories.flatMap((category) => category.words));
  const orphans = Object.keys(words).filter((id) => !placed.has(id));
  assert.deepEqual(orphans, []);
});

test("every board fits the fixed grid without duplicates", () => {
  for (const category of categories) {
    assert.ok(category.words.length <= MAX_WORDS_PER_BOARD, `${category.id} has ${category.words.length} words`);
    assert.equal(new Set(category.words).size, category.words.length, `${category.id} repeats a word`);
  }
});

test("ids are safe to use as file names", () => {
  const ids = [...Object.keys(words), ...Object.keys(mascotPhrases), ...categories.map((category) => category.id)];
  for (const id of ids) assert.match(id, /^[a-z0-9_]+$/);
});

test("every word has its own symbol", () => {
  const owners = new Map<string, string>();
  for (const [id, word] of Object.entries(words)) {
    const owner = owners.get(word.symbol);
    assert.equal(owner, undefined, `${id} and ${owner} share symbol ${word.symbol}`);
    owners.set(word.symbol, id);
  }
});

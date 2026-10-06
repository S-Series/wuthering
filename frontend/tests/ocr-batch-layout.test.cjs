const { test } = require("node:test");
const assert = require("node:assert/strict");
const fs = require("node:fs");
const vm = require("node:vm");
const ts = require("typescript");
const path = require("node:path");
const exportsObject = {};
vm.runInNewContext(ts.transpileModule(fs.readFileSync(path.join(__dirname, "../src/components/features/Card/Echo/Ocr/echoBatch.layout.ts"), "utf8"), {
  compilerOptions: { module: ts.ModuleKind.CommonJS },
}).outputText, { exports: exportsObject });
const { placeBatchEntry } = exportsObject;
test("incoming placement preserves displaced inventory in the pool without copying", () => {
  const initial = { slots: ["old0", "old1"], pool: ["new0", "new1"] };
  const next = placeBatchEntry(initial, "new0", 1);
  assert.equal(next.slots[1], "new0");
  assert.equal(next.pool[0], "old1");
  assert.equal(new Set([...next.slots, ...next.pool]).size, 4);
  assert.equal(initial.slots[1], "old1");
});
test("existing slots swap and invalid drops leave state untouched", () => {
  const initial = { slots: ["a", "b"], pool: ["c"] };
  const next = placeBatchEntry(initial, "a", 1);
  assert.equal(next.slots[0], "b");
  assert.equal(next.slots[1], "a");
  for (const target of [-1, 2, NaN, 0.5]) assert.equal(placeBatchEntry(initial, "c", target), initial);
  assert.equal(placeBatchEntry(initial, "unknown", 0), initial);
});

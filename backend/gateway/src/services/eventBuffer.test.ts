import assert from "node:assert/strict";
import { EventBuffer } from "./eventBuffer.js";

const batches: number[][] = [];
const reports: { message: string; count: number }[] = [];
let release!: () => void;
const gate = new Promise<void>(resolve => { release = resolve; });
let active = 0;
const buffer = new EventBuffer<number>(async batch => {
  assert.equal(active++, 0, "batch writes must not overlap");
  batches.push(batch);
  if (batches.length === 1) await gate;
  active--;
}, (message, count) => reports.push({ message, count }), 2, 2, 1000);
assert.equal(buffer.enqueue(1), true);
assert.equal(buffer.enqueue(2), true);
assert.equal(buffer.enqueue(3), true);
assert.equal(buffer.enqueue(4), true);
assert.equal(buffer.enqueue(5), false);
const flushing = buffer.flush();
release();
await flushing;
assert.deepEqual(batches, [[1, 2], [3, 4]]);
assert.deepEqual(reports, [{ message: "telemetry buffer overflow", count: 1 }]);
buffer.enqueue(6);
await buffer.flush();
assert.deepEqual(batches[2], [6], "shutdown flush drains partial batches");

let attempts = 0;
const failed = new EventBuffer<number>(async () => { attempts++; throw new Error("DB unavailable"); },
  (message, count) => reports.push({ message, count }));
failed.enqueue(7);
await failed.flush();
await failed.flush();
assert.equal(attempts, 1, "best-effort logging must not retry indefinitely");
assert.deepEqual(reports.at(-1), { message: "telemetry batch failed", count: 1 });
console.log("PASS: bounded telemetry, batching, serialized writes, partial flush and bounded failure handling");

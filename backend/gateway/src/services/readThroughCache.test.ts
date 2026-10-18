import assert from "node:assert/strict";
import { ReadThroughCache } from "./readThroughCache.js";

const cache = new ReadThroughCache(100, 2);
let loads = 0;
let release!: (value: string) => void;
const load = () => { loads++; return new Promise<string>(resolve => { release = resolve; }); };
const first = cache.getOrLoad("key", load);
const second = cache.getOrLoad("key", load);
await Promise.resolve();
assert.equal(loads, 1);
release("old");
assert.deepEqual(await first, { value: "old", status: "MISS" });
assert.deepEqual(await second, { value: "old", status: "COALESCED" });
assert.equal((await cache.getOrLoad("key", load)).status, "HIT");

cache.clear();
let finishStale!: (value: string) => void;
let calls = 0;
const racingLoad = async () => {
  calls++;
  if (calls === 1) return new Promise<string>(resolve => { finishStale = resolve; });
  return "after write";
};
const racing = cache.getOrLoad("key", racingLoad);
await Promise.resolve();
cache.clear();
finishStale("before write");
assert.equal((await racing).value, "after write");
assert.equal((await cache.getOrLoad("key", racingLoad)).value, "after write");
assert.equal(calls, 2);

cache.clear();
let attempts = 0;
const failOnce = async () => { if (++attempts === 1) throw new Error("DB unavailable"); return "recovered"; };
await assert.rejects(cache.getOrLoad("error", failOnce));
assert.equal((await cache.getOrLoad("error", failOnce)).value, "recovered");

const originalNow = Date.now;
let now = originalNow();
Date.now = () => now;
try {
  cache.clear();
  await cache.getOrLoad("a", async () => "a");
  now++;
  await cache.getOrLoad("b", async () => "b");
  now++;
  await cache.getOrLoad("c", async () => "c");
  assert.equal((await cache.getOrLoad("a", async () => "new a")).status, "MISS");
  now += 101;
  assert.equal((await cache.getOrLoad("a", async () => "expired a")).value, "expired a");
} finally {
  Date.now = originalNow;
}
console.log("PASS: coalescing, hits, invalidation during load, failure recovery, capacity and TTL");

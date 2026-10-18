import assert from "node:assert/strict";
import { randomUUID } from "node:crypto";
import { checkRedisCache } from "./redisBoardCache.contract.js";
import { READ_CACHE, FILL_CACHE, UNLOCK_CACHE, INVALIDATE_CACHE, RECOVER_CACHE, type RedisExecutor } from "./redisBoardCache.js";

// Small Redis model for offline contract tests. The live suite executes the
// identical contract against actual Lua, including TTL and lock ownership.
class RedisModel implements RedisExecutor {
  values = new Map<string, { value: string; expires: number }>();
  get(key: string) {
    const entry = this.values.get(key);
    if (!entry || entry.expires <= Date.now()) { this.values.delete(key); return ""; }
    return entry.value;
  }
  set(key: string, value: string, ttl = Infinity) { this.values.set(key, { value, expires: Date.now() + ttl }); }
  async eval(script: string, { keys: k, arguments: a }: { keys: string[]; arguments: string[] }) {
    if (script === READ_CACHE) {
      if (!this.get(k[0])) this.set(k[0], a[0]);
      if (!this.get(k[1])) this.set(k[1], a[1], Number(a[2]));
      const version = this.get(k[0]) + ":" + this.get(k[1]);
      try {
        const entry = JSON.parse(this.get(k[2]));
        if (entry.version === version && Object.hasOwn(entry, "value")) return [version, this.get(k[2]), ""];
      } catch { /* miss */ }
      if (this.get(k[3])) return [version, "", ""];
      this.set(k[3], a[3], Number(a[4])); return [version, "", a[3]];
    }
    if (script === FILL_CACHE) {
      if (this.get(k[3]) !== a[3]) return 2;
      if (!this.get(k[0]) || !this.get(k[1]) || this.get(k[0]) + ":" + this.get(k[1]) !== a[0]) {
        this.values.delete(k[3]); return 0;
      }
      this.set(k[2], a[1], Number(a[2])); this.values.delete(k[3]); return 1;
    }
    if (script === UNLOCK_CACHE) {
      if (this.get(k[0]) === a[0]) return Number(this.values.delete(k[0]));
      return 0;
    }
    if (script === INVALIDATE_CACHE) { for (const key of k) this.set(key, a[0], Number(a[1])); return 1; }
    if (script === RECOVER_CACHE) { this.set(k[0], a[0]); return 1; }
    throw new Error("Unexpected script");
  }
  async close() {}
}

const model = new RedisModel();
await checkRedisCache(model, randomUUID());

// Evicting revision metadata while a value remains must never resurrect it.
const { RedisBoardCache } = await import("./redisBoardCache.js");
const cache = new RedisBoardCache(model, { namespace: "eviction" });
await cache.getOrLoad("key", "lists", async () => "old");
for (const key of model.values.keys()) if (key.includes(":scope:")) model.values.delete(key);
assert.equal((await cache.getOrLoad("key", "lists", async () => "new")).value, "new");
for (const key of model.values.keys()) if (key.endsWith(":epoch")) model.values.delete(key);
assert.equal((await cache.getOrLoad("key", "lists", async () => "new epoch")).value, "new epoch");
console.log("Redis board cache offline contract passed");

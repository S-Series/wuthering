import "dotenv/config";
import assert from "node:assert/strict";
import { randomUUID } from "node:crypto";
import { setTimeout as delay } from "node:timers/promises";
import { createClient } from "redis";
import { checkRedisCache } from "./redisBoardCache.contract.js";
import { createRedisExecutor } from "./boardCache.js";
import { RedisBoardCache } from "./redisBoardCache.js";

if (process.env.BOARD_REDIS_INTEGRATION !== "1") throw new Error("Set BOARD_REDIS_INTEGRATION=1 to opt in to isolated Redis test writes");
if (!process.env.REDIS_URL) throw new Error("REDIS_URL is required for the live test");
const ca = process.env.REDIS_CA_CERT?.replace(/\\n/g, "\n");
const client = createClient({ url: process.env.REDIS_URL, disableOfflineQueue: true,
  socket: { connectTimeout: 5000, reconnectStrategy: false,
    ...(process.env.REDIS_URL.startsWith("rediss:") ? { tls: true as const, ...(ca ? { ca } : {}) } : {}),
  },
});
client.on("error", () => {});
const owned = new Set<string>();
const namespace = "cache-contract-test:" + randomUUID();
let production: ReturnType<typeof createRedisExecutor> | undefined;
try {
  await client.connect();
  assert.equal(await client.ping(), "PONG");
  const started = performance.now();
  await checkRedisCache({
    async eval(script, args) {
      for (const key of args.keys) owned.add(key);
      return client.withCommandOptions({ timeout: 5000 }).eval(script, args);
    }, close: async () => {},
  }, namespace);
  console.log(`Live TLS Valkey contract passed (${Math.round(performance.now() - started)} ms, isolated namespace)`);
  // Exercise the deployed adapter's actual timeout, async connection and close.
  production = createRedisExecutor(process.env.REDIS_URL, { info() {}, warn() {} });
  let ready = false;
  for (let attempt = 0; attempt < 50; attempt++) {
    try { ready = await production.eval("return 'PONG'", { keys: [], arguments: [] }) === "PONG"; }
    catch { /* asynchronous connect */ }
    if (ready) break;
    await delay(100);
  }
  assert.ok(ready, "production adapter must become ready within the configured command deadline");
  let commands = 0;
  const adapter = {
    async eval(script: string, args: { keys: string[]; arguments: string[] }) {
      commands++;
      for (const key of args.keys) owned.add(key);
      return production!.eval(script, args);
    }, close: async () => {},
  };
  const cache = new RedisBoardCache(adapter, { namespace: namespace + ":adapter" });
  let dbLoads = 0;
  const miss = await cache.getOrLoad("probe", "lists", async () => { dbLoads++; return "ready"; });
  assert.equal(miss.status, "MISS");
  assert.equal(commands, 2, "cache miss uses two Redis round trips including lock release");
  const hitStart = performance.now();
  assert.equal((await cache.getOrLoad("probe", "lists", async () => "wrong")).status, "HIT");
  assert.equal(commands, 3, "cache hit uses one Redis round trip");
  assert.equal(dbLoads, 1);
  console.log(`Production adapter passed; sample cache hit ${Math.round(performance.now() - hitStart)} ms (local machine to Aiven)`);
  await production.close();
  await assert.rejects(production.eval("return 1", { keys: [], arguments: [] }));
} catch (error) {
  // Never dump a client error containing connection credentials.
  console.error(error instanceof assert.AssertionError ? error.message : `Live Redis test failed: ${(error as { code?: string }).code ?? (error as Error).name}`);
  process.exitCode = 1;
} finally {
  await production?.close();
  if (client.isReady && owned.size) await client.withCommandOptions({ timeout: 5000 }).unlink([...owned]);
  if (client.isOpen) client.destroy();
}

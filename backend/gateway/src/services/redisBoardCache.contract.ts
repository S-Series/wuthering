import assert from "node:assert/strict";
import { randomUUID } from "node:crypto";
import { setTimeout as delay } from "node:timers/promises";
import { RedisBoardCache, RECOVER_CACHE, type RedisExecutor } from "./redisBoardCache.js";

function deferred<T>() {
  let resolve!: (value: T) => void;
  const promise = new Promise<T>(done => { resolve = done; });
  return { promise, resolve };
}

/** Run the same concurrency contract against the model and a real Valkey service. */
export async function checkRedisCache(redis: RedisExecutor, namespace: string) {
  const options = { namespace, ttlMs: 5000, waitMs: 1500 };
  const a = new RedisBoardCache(redis, options);
  const b = new RedisBoardCache(redis, options);
  let loads = 0;
  const load = async () => { loads++; return { title: "original" }; };
  assert.equal((await a.getOrLoad("list", "lists", load)).status, "MISS");
  assert.equal((await b.getOrLoad("list", "lists", load)).status, "HIT");
  assert.equal(loads, 1, "different instances must share a cached result");
  await a.getOrLoad("false", "lists", async () => false);
  assert.equal((await b.getOrLoad("false", "lists", async () => true)).value, false);
  await a.getOrLoad("null", "lists", async () => null);
  assert.equal((await b.getOrLoad("null", "lists", async () => "wrong")).value, null);

  await a.getOrLoad("comments:1", "post:1", load);
  await a.getOrLoad("post:1", "post:1", load);
  await a.getOrLoad("post:2", "post:2", load);
  await b.invalidate(["lists", "post:1"]);
  for (const [key, scope] of [["list", "lists"], ["comments:1", "post:1"], ["post:1", "post:1"]]) {
    assert.equal((await a.getOrLoad(key, scope, load)).status, "MISS");
  }
  assert.equal((await a.getOrLoad("post:2", "post:2", load)).status, "HIT", "unrelated posts stay hot");

  const started = deferred<void>();
  const release = deferred<string>();
  let raceLoads = 0;
  const racingLoad = async () => {
    if (++raceLoads === 1) { started.resolve(); return release.promise; }
    return "after write";
  };
  const racing = a.getOrLoad("race", "post:race", racingLoad);
  await started.promise;
  await b.invalidate(["post:race"]);
  release.resolve("before write");
  assert.equal((await racing).value, "after write", "remote invalidation fences an old DB result");
  assert.equal(raceLoads, 2);
  assert.equal((await b.getOrLoad("race", "post:race", racingLoad)).value, "after write");

  let changingLoads = 0;
  const changing = await a.getOrLoad("busy", "busy-list", async () => {
    await b.invalidate(["busy-list"]);
    return ++changingLoads;
  });
  assert.equal(changing.store, "db", "continuous writes bypass caching instead of causing HTTP failures");
  assert.equal(changingLoads, 4, "cache fill retries are bounded");

  const filling = deferred<void>();
  const finish = deferred<string>();
  let stampedeLoads = 0;
  const slow = async () => { stampedeLoads++; filling.resolve(); return finish.promise; };
  const first = a.getOrLoad("stampede", "lists", slow);
  await filling.promise;
  const local = a.getOrLoad("stampede", "lists", slow);
  const remote = b.getOrLoad("stampede", "lists", slow);
  // Allow the other instance to observe the held lock.
  await delay(80);
  finish.resolve("shared");
  const shared = await Promise.all([first, local, remote]);
  assert.equal(stampedeLoads, 1, "one DB load across instances and local callers");
  assert.equal(shared[1].status, "COALESCED");
  assert.ok(shared.every(result => result.value === "shared"));

  let failures = 0;
  const dbError = new Error("DB failed");
  await assert.rejects(a.getOrLoad("error", "lists", async () => { failures++; throw dbError; }), error => error === dbError);
  assert.equal(failures, 1, "DB errors are not retried as cache failures");
  assert.equal((await b.getOrLoad("error", "lists", load)).status, "MISS");

  let offline = false;
  const faulting: RedisExecutor = {
    eval: (script, args) => offline ? Promise.reject(new Error("unavailable")) : redis.eval(script, args),
    close: async () => {},
  };
  const writer = new RedisBoardCache(faulting, options);
  await a.getOrLoad("outage", "post:outage", async () => "old");
  offline = true;
  await writer.invalidate(["post:outage"]); // A committed write must still succeed.
  assert.deepEqual(await writer.getOrLoad("outage", "post:outage", async () => "new"), {
    value: "new", status: "BYPASS", store: "db",
  });
  offline = false;
  assert.equal((await writer.getOrLoad("outage", "post:outage", async () => "new")).value, "new");
  assert.equal((await b.getOrLoad("outage", "post:outage", async () => "wrong")).value, "new", "recovery fences pre-outage values");

  // An invalidation failing during recovery must not be lost by clearing the flag.
  offline = true;
  await writer.invalidate(["lists"]);
  offline = false;
  const recovering = deferred<void>();
  const resume = deferred<void>();
  let recoveryCalls = 0;
  const recoveryRace = new RedisBoardCache({
    async eval(script, args) {
      if (script === RECOVER_CACHE && ++recoveryCalls === 1) {
        recovering.resolve(); await resume.promise;
      }
      return faulting.eval(script, args);
    }, close: async () => {},
  }, options);
  offline = true;
  await recoveryRace.invalidate(["lists"]);
  offline = false;
  const recoveryRead = recoveryRace.getOrLoad("recover-race", "lists", load);
  await recovering.promise;
  offline = true;
  await recoveryRace.invalidate(["post:outage"]);
  offline = false;
  resume.resolve();
  await recoveryRead;
  assert.equal(recoveryCalls, 2, "a second failed invalidation requires another recovery fence");

  const short = new RedisBoardCache(redis, { namespace: namespace + ":ttl", ttlMs: 50 });
  assert.equal((await short.getOrLoad("ttl", "lists", load)).status, "MISS");
  await delay(80);
  assert.equal((await short.getOrLoad("ttl", "lists", load)).status, "MISS");

  const limited = new RedisBoardCache(redis, { namespace: namespace + ":size", maxValueBytes: 64 });
  const large = "x".repeat(500);
  assert.deepEqual(await limited.getOrLoad("large", "lists", async () => large), {
    value: large, status: "BYPASS", store: "db",
  });
  assert.equal((await limited.getOrLoad("large", "lists", async () => "new")).value, "new", "oversize responses are not stored or truncated");

  // A lock expiring during a DB query must not allow the old owner to overwrite
  // a newer owner's result or delete its lock.
  const expired = new RedisBoardCache(redis, { namespace: namespace + ":lock", lockMs: 30 });
  const replacement = new RedisBoardCache(redis, { namespace: namespace + ":lock" });
  const oldStarted = deferred<void>();
  const oldFinish = deferred<string>();
  const oldFill = expired.getOrLoad("lock", "lists", async () => { oldStarted.resolve(); return oldFinish.promise; });
  await oldStarted.promise;
  await delay(60);
  await replacement.getOrLoad("lock", "lists", async () => "new owner");
  oldFinish.resolve("old owner");
  assert.equal((await oldFill).store, "db");
  assert.equal((await replacement.getOrLoad("lock", "lists", async () => "wrong")).value, "new owner");

  const isolated = new RedisBoardCache(redis, { namespace: namespace + randomUUID() });
  assert.equal((await isolated.getOrLoad("list", "lists", load)).status, "MISS", "environments use separate namespaces");
}

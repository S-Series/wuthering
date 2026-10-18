import { createHash, randomUUID } from "node:crypto";
import { setTimeout as delay } from "node:timers/promises";

export interface RedisExecutor {
  eval(script: string, options: { keys: string[]; arguments: string[] }): Promise<unknown>;
  close(): Promise<void>;
}

export type BoardCacheResult<T> = {
  value: T;
  status: "HIT" | "MISS" | "COALESCED" | "BYPASS";
  store: "redis" | "memory" | "db";
};
export interface BoardReadCache {
  getOrLoad<T>(key: string, scope: string, load: () => Promise<T>): Promise<BoardCacheResult<T>>;
  invalidate(scopes: string[]): Promise<void>;
  close(): Promise<void>;
}

// Scripts use one hash slot. Versions are random, not counters: expiry/eviction
// must never make an old cache entry look current again (the ABA problem).
export const READ_CACHE = `-- board-read-v2
local epoch = redis.call('GET', KEYS[1])
if not epoch then epoch = ARGV[1]; redis.call('SET', KEYS[1], epoch) end
local version = redis.call('GET', KEYS[2])
if not version then
  version = ARGV[2]; redis.call('SET', KEYS[2], version, 'PX', ARGV[3])
end
local current = epoch .. ':' .. version
local payload = redis.call('GET', KEYS[3]) or ''
if payload ~= '' then
  local ok, entry = pcall(cjson.decode, payload)
  if ok and type(entry) == 'table' and entry.version == current and entry.value ~= nil then
    return {current, payload, ''}
  end
end
local locked = redis.call('SET', KEYS[4], ARGV[4], 'NX', 'PX', ARGV[5])
return {current, '', locked and ARGV[4] or ''}`;

export const FILL_CACHE = `-- board-fill-v1
local epoch = redis.call('GET', KEYS[1])
local version = redis.call('GET', KEYS[2])
if redis.call('GET', KEYS[4]) ~= ARGV[4] then return 2 end
if not epoch or not version or epoch .. ':' .. version ~= ARGV[1] then
  redis.call('DEL', KEYS[4]); return 0
end
redis.call('SET', KEYS[3], ARGV[2], 'PX', ARGV[3])
redis.call('DEL', KEYS[4])
return 1`;

export const UNLOCK_CACHE = `-- board-unlock-v1
if redis.call('GET', KEYS[1]) == ARGV[1] then return redis.call('DEL', KEYS[1]) end
return 0`;

export const INVALIDATE_CACHE = `-- board-invalidate-v1
for _, key in ipairs(KEYS) do redis.call('SET', key, ARGV[1], 'PX', ARGV[2]) end
return 1`;

export const RECOVER_CACHE = `-- board-recover-v1
redis.call('SET', KEYS[1], ARGV[1]); return 1`;

export class RedisBoardCache implements BoardReadCache {
  private readonly pending = new Map<string, Promise<BoardCacheResult<unknown>>>();
  private generation = 0;
  private needsRecovery = false;
  private readonly prefix: string;
  private readonly ttlMs: number;
  private readonly versionTtlMs: number;
  private readonly waitMs: number;
  private readonly lockMs: number;
  private readonly maxValueBytes: number;

  constructor(private readonly redis: RedisExecutor, options: {
    namespace: string;
    ttlMs?: number;
    waitMs?: number;
    lockMs?: number;
    maxValueBytes?: number;
  }) {
    this.prefix = `wuwa:{board-${createHash("sha256").update(options.namespace).digest("hex").slice(0, 16)}}:v1`;
    this.ttlMs = options.ttlMs ?? 30_000;
    this.versionTtlMs = Math.max(120_000, this.ttlMs * 4);
    this.waitMs = options.waitMs ?? 1500;
    this.lockMs = options.lockMs ?? 15_000;
    this.maxValueBytes = options.maxValueBytes ?? 512 * 1024;
  }

  async getOrLoad<T>(key: string, scope: string, load: () => Promise<T>): Promise<BoardCacheResult<T>> {
    const id = createHash("sha256").update(scope + "\0" + key).digest("hex");
    const existing = this.pending.get(id);
    if (existing) {
      const result = await existing;
      return { ...result, value: result.value as T, status: "COALESCED" };
    }
    const promise = this.read(id, scope, load);
    if (this.pending.size < 256) this.pending.set(id, promise);
    try { return await promise; }
    finally { if (this.pending.get(id) === promise) this.pending.delete(id); }
  }

  private async read<T>(id: string, scope: string, load: () => Promise<T>): Promise<BoardCacheResult<T>> {
    const epochKey = this.prefix + ":epoch";
    const scopeKey = this.prefix + ":scope:" + createHash("sha256").update(scope).digest("hex");
    const valueKey = this.prefix + ":value:" + id;
    const lockKey = this.prefix + ":lock:" + id;
    const keys = [epochKey, scopeKey, valueKey];

    for (let attempt = 0; attempt < 3; attempt++) {
      const generation = this.generation;
      let version: string;
      let lockToken: string | undefined;
      const waitUntil = Date.now() + this.waitMs;
      try {
        if (this.needsRecovery) {
          // A write committed during an outage. Fence off all pre-outage values
          // before this instance resumes serving shared cached responses.
          await this.redis.eval(RECOVER_CACHE, { keys: [epochKey], arguments: [randomUUID()] });
          if (generation !== this.generation) continue;
          this.needsRecovery = false;
        }
        let poll = 0;
        while (true) {
          const token = randomUUID();
          const result = await this.redis.eval(READ_CACHE, {
            keys: [...keys, lockKey],
            arguments: [randomUUID(), randomUUID(), String(this.versionTtlMs), token, String(this.lockMs)],
          }) as [string, string, string];
          version = result[0];
          if (result[1]) {
            try {
              const entry = JSON.parse(result[1]) as { version?: unknown; value?: T };
              if (entry.version === version && Object.hasOwn(entry, "value")) {
                return { value: entry.value as T, status: poll ? "COALESCED" : "HIT", store: "redis" };
              }
            } catch { /* Malformed values are misses, never successful responses. */ }
          }
          if (result[2] === token) {
            lockToken = token;
            break;
          }
          const remaining = waitUntil - Date.now();
          if (remaining <= 0) return this.bypass(load, generation);
          await delay(Math.min(remaining, 50 * 2 ** Math.min(poll++, 3)));
        }
      } catch {
        return this.bypass(load, generation);
      }

      try {
        // DB failures must propagate; do not retry them as Redis failures.
        const value = await load();
        if (generation !== this.generation) continue;
        const payload = JSON.stringify({ version, value });
        if (Buffer.byteLength(payload, "utf8") > this.maxValueBytes) {
          return { value, status: "BYPASS", store: "db" };
        }
        let filled: number;
        try {
          filled = Number(await this.redis.eval(FILL_CACHE, {
            keys: [...keys, lockKey],
            arguments: [version!, payload, String(this.ttlMs + Math.floor(Math.random() * this.ttlMs / 10)), lockToken!],
          }));
          lockToken = undefined; // Fill also releases the owned lock atomically.
        } catch { return { value, status: "BYPASS", store: "db" }; }
        if (filled === 0) continue; // Another instance changed this scope during the DB load.
        return { value, status: filled === 1 ? "MISS" : "BYPASS", store: filled === 1 ? "redis" : "db" };
      } finally {
        if (lockToken) {
          await this.redis.eval(UNLOCK_CACHE, { keys: [lockKey], arguments: [lockToken] }).catch(() => {});
        }
      }
    }
    // A hot list may change on every fill attempt. Keep it uncached rather
    // than making otherwise successful DB reads fail because of cache churn.
    return this.bypass(load, this.generation);
  }

  private async bypass<T>(load: () => Promise<T>, generation: number): Promise<BoardCacheResult<T>> {
    let value = await load();
    if (generation !== this.generation) value = await load();
    // No local TTL cache when Redis is configured: a disconnected instance
    // cannot observe remote invalidations and must read the source of truth.
    return { value, status: "BYPASS", store: "db" };
  }

  async invalidate(scopes: string[]) {
    this.generation++;
    try {
      await this.redis.eval(INVALIDATE_CACHE, {
        keys: [...new Set(scopes)].map(scope => this.prefix + ":scope:" + createHash("sha256").update(scope).digest("hex")),
        arguments: [randomUUID(), String(this.versionTtlMs)],
      });
    } catch {
      // Do not turn a successful DB write into a retryable HTTP failure.
      this.needsRecovery = true;
    }
  }

  async close() { await this.redis.close(); }
}

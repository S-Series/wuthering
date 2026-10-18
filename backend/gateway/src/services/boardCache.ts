import { createClient } from "redis";
import { ReadThroughCache } from "./readThroughCache.js";
import { RedisBoardCache, type BoardReadCache, type RedisExecutor } from "./redisBoardCache.js";

type CacheLogger = { info: (message: string) => void; warn: (message: string) => void };

function positiveSetting(name: string, fallback: number) {
  const value = Number(process.env[name] ?? fallback);
  if (!Number.isSafeInteger(value) || value < 1) throw new Error(`${name} must be a positive integer`);
  return value;
}

/** Standard RESP/TLS works with Redis, Aiven Valkey and Upstash Redis. */
export function createRedisExecutor(url: string, log: CacheLogger): RedisExecutor {
  let parsed: URL;
  try { parsed = new URL(url); } catch { throw new Error("Invalid REDIS_URL"); }
  if (!["redis:", "rediss:"].includes(parsed.protocol)) throw new Error("REDIS_URL must use redis:// or rediss://");
  const commandTimeout = positiveSetting("REDIS_COMMAND_TIMEOUT_MS", 300);
  const ca = process.env.REDIS_CA_CERT?.replace(/\\n/g, "\n");
  const client = createClient({
    url,
    disableOfflineQueue: true,
    commandsQueueMaxLength: 256,
    socket: {
      connectTimeout: 3000,
      reconnectStrategy: retries => Math.min(500 * 2 ** Math.min(retries, 5), 10_000),
      ...(parsed.protocol === "rediss:" ? { tls: true as const, ...(ca ? { ca } : {}) } : {}),
    },
  });
  let lastWarning = 0;
  let cooldownUntil = 0;
  let disposed = false;
  let reconnectTimer: ReturnType<typeof setTimeout> | undefined;
  const warn = () => {
    if (Date.now() - lastWarning > 30_000) {
      // Never include the connection URL, password or raw client errors.
      log.warn("Board Redis cache unavailable; requests will read the database");
      lastWarning = Date.now();
    }
  };
  const connect = () => {
    if (!disposed && !client.isOpen) void client.connect().catch(warn);
  };
  client.on("error", warn);
  client.on("ready", () => log.info("Board Redis cache connection ready"));
  connect();

  return {
    async eval(script, options) {
      if (disposed || !client.isReady || Date.now() < cooldownUntil) throw new Error("Redis not ready");
      try {
        return await client.withCommandOptions({ timeout: commandTimeout }).eval(script, options);
      } catch {
        warn();
        cooldownUntil = Date.now() + 1000;
        // A command timeout must not leave an ever-growing in-flight queue on
        // a stuck socket. Flush this cache-only connection and reconnect later.
        if (client.isOpen) client.destroy();
        if (!disposed && !reconnectTimer) {
          reconnectTimer = setTimeout(() => { reconnectTimer = undefined; connect(); }, 1000);
          reconnectTimer.unref();
        }
        throw new Error("Redis cache command failed");
      }
    },
    async close() {
      disposed = true;
      if (reconnectTimer) clearTimeout(reconnectTimer);
      if (client.isOpen) client.destroy();
    },
  };
}

export function createBoardCache(log: CacheLogger): BoardReadCache {
  const url = process.env.REDIS_URL?.trim();
  if (!url) {
    log.info("REDIS_URL is unset; board cache uses process memory (10 seconds)");
    const memory = new ReadThroughCache(10_000, 256);
    return {
      async getOrLoad(key, scope, load) {
        return { ...await memory.getOrLoad(JSON.stringify([scope, key]), load), store: "memory" as const };
      },
      async invalidate() { memory.clear(); },
      async close() { memory.clear(); },
    };
  }
  const options = {
    namespace: process.env.BOARD_CACHE_NAMESPACE ?? process.env.SUPABASE_URL ?? "wuwa",
    ttlMs: positiveSetting("BOARD_CACHE_TTL_MS", 30_000),
    maxValueBytes: positiveSetting("BOARD_CACHE_MAX_VALUE_BYTES", 512 * 1024),
  };
  return new RedisBoardCache(createRedisExecutor(url, log), options);
}

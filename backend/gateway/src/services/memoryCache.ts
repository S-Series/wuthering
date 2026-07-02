import { createHash } from "node:crypto";

type CacheEntry<T> = {
  value: T;
  expiresAt: number;
  lastAccessedAt: number;
};

export class MemoryCache<T> {
  private readonly store = new Map<string, CacheEntry<T>>();
  private lastPrunedAt = 0;
  private readonly pruneIntervalMs: number;

  constructor(
    private readonly ttlMs: number,
    private readonly maxEntries: number
  ) {
    this.pruneIntervalMs = Math.max(1_000, Math.min(60_000, ttlMs / 4));
  }

  get(key: string): T | undefined {
    if (this.ttlMs <= 0 || this.maxEntries <= 0) {
      return undefined;
    }

    const entry = this.store.get(key);

    if (!entry) {
      return undefined;
    }

    if (entry.expiresAt <= Date.now()) {
      this.store.delete(key);
      return undefined;
    }

    entry.lastAccessedAt = Date.now();
    return entry.value;
  }

  has(key: string): boolean {
    if (this.ttlMs <= 0 || this.maxEntries <= 0) {
      return false;
    }

    const entry = this.store.get(key);

    if (!entry) {
      return false;
    }

    if (entry.expiresAt <= Date.now()) {
      this.store.delete(key);
      return false;
    }

    entry.lastAccessedAt = Date.now();
    return true;
  }

  set(key: string, value: T) {
    if (this.ttlMs <= 0 || this.maxEntries <= 0) {
      return;
    }

    this.pruneExpired();

    while (this.store.size >= this.maxEntries) {
      this.deleteLeastRecentlyUsed();
    }

    const now = Date.now();

    this.store.set(key, {
      value,
      expiresAt: now + this.ttlMs,
      lastAccessedAt: now,
    });
  }

  delete(key: string) {
    this.store.delete(key);
  }

  clear() {
    this.store.clear();
    this.lastPrunedAt = 0;
  }

  getRemainingTtlMs(key: string): number {
    const entry = this.store.get(key);

    if (!entry) {
      return 0;
    }

    const remaining = entry.expiresAt - Date.now();

    if (remaining <= 0) {
      this.store.delete(key);
      return 0;
    }

    return remaining;
  }

  get size() {
    this.pruneExpired(true);
    return this.store.size;
  }

  private pruneExpired(force = false) {
    const now = Date.now();

    if (!force && now - this.lastPrunedAt < this.pruneIntervalMs) {
      return;
    }

    this.lastPrunedAt = now;

    for (const [key, entry] of this.store) {
      if (entry.expiresAt <= now) {
        this.store.delete(key);
      }
    }
  }

  private deleteLeastRecentlyUsed() {
    let oldestKey: string | undefined;
    let oldestAccessedAt = Infinity;

    for (const [key, entry] of this.store) {
      if (entry.lastAccessedAt < oldestAccessedAt) {
        oldestKey = key;
        oldestAccessedAt = entry.lastAccessedAt;
      }
    }

    if (oldestKey) {
      this.store.delete(oldestKey);
    }
  }
}

export function createStableCacheKey(prefix: string, value: unknown): string {
  return `${prefix}:${createHash("sha256")
    .update(stableStringify(value))
    .digest("hex")}`;
}

export function createBufferCacheKey(prefix: string, buffer: Buffer): string {
  return `${prefix}:${createHash("sha256").update(buffer).digest("hex")}`;
}

export function createMixedBufferCacheKey(
  prefix: string,
  text: string,
  buffer: Buffer
): string {
  const hash = createHash("sha256");

  hash.update(`${prefix}:${text}:`);
  hash.update(buffer);

  return `${prefix}:${hash.digest("hex")}`;
}

function stableStringify(value: unknown): string {
  if (value === undefined) {
    return "undefined";
  }

  if (value === null || typeof value !== "object") {
    return JSON.stringify(value);
  }

  if (Buffer.isBuffer(value)) {
    return `"buffer:${createHash("sha256").update(value).digest("hex")}"`;
  }

  if (Array.isArray(value)) {
    return `[${value.map((item) => stableStringify(item)).join(",")}]`;
  }

  const record = value as Record<string, unknown>;
  const keys = Object.keys(record).sort();

  return `{${keys
    .filter((key) => typeof record[key] !== "undefined")
    .map((key) => `${JSON.stringify(key)}:${stableStringify(record[key])}`)
    .join(",")}}`;
}

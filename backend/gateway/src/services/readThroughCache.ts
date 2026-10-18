import { MemoryCache } from "./memoryCache.js";

export type ReadCacheStatus = "HIT" | "MISS" | "COALESCED";

/** Bounded, process-local cache for public reads. Failed loads are never cached. */
export class ReadThroughCache {
  private readonly values: MemoryCache<unknown>;
  private readonly pending = new Map<string, Promise<unknown>>();
  private generation = 0;

  constructor(ttlMs: number, private readonly maxEntries: number) {
    this.values = new MemoryCache(ttlMs, maxEntries);
  }

  async getOrLoad<T>(key: string, load: () => Promise<T>): Promise<{
    value: T;
    status: ReadCacheStatus;
  }> {
    const cached = this.values.get(key);
    if (cached !== undefined) return { value: cached as T, status: "HIT" };

    const pending = this.pending.get(key);
    if (pending) return { value: await pending as T, status: "COALESCED" };

    const generation = this.generation;
    const promise = Promise.resolve().then(load).then(async (value) => {
      // A write may finish while this read is in flight. Read again rather than
      // returning or repopulating the cache with a pre-write snapshot.
      if (generation !== this.generation) {
        return (await this.getOrLoad(key, load)).value;
      }
      this.values.set(key, value);
      return value;
    });

    if (this.pending.size < this.maxEntries) this.pending.set(key, promise);
    try {
      return { value: await promise, status: "MISS" };
    } finally {
      if (this.pending.get(key) === promise) this.pending.delete(key);
    }
  }

  clear() {
    this.generation++;
    this.values.clear();
    this.pending.clear();
  }
}

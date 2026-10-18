/** Bounded best-effort telemetry, never a queue for business-critical writes. */
export class EventBuffer<T> {
  private readonly queue: T[] = [];
  private timer: ReturnType<typeof setTimeout> | undefined;
  private flushing: Promise<void> | undefined;
  private dropped = 0;

  constructor(
    private readonly write: (batch: T[]) => Promise<void>,
    private readonly report: (message: string, count: number) => void,
    private readonly capacity = 1000,
    private readonly batchSize = 100,
    private readonly intervalMs = 1000,
  ) {}

  enqueue(event: T) {
    if (this.queue.length >= this.capacity) {
      this.dropped++;
      return false;
    }
    this.queue.push(event);
    if (!this.timer) {
      this.timer = setTimeout(() => { this.timer = undefined; void this.flush(); }, this.intervalMs);
      this.timer.unref();
    }
    if (this.queue.length >= this.batchSize) void this.flush();
    return true;
  }

  flush(): Promise<void> {
    if (this.flushing) return this.flushing;
    if (this.timer) clearTimeout(this.timer);
    this.timer = undefined;
    this.flushing = (async () => {
      while (this.queue.length) {
        const batch = this.queue.splice(0, this.batchSize);
        try { await this.write(batch); }
        catch { this.report("telemetry batch failed", batch.length); }
      }
      if (this.dropped) {
        this.report("telemetry buffer overflow", this.dropped);
        this.dropped = 0;
      }
    })().finally(() => { this.flushing = undefined; });
    return this.flushing;
  }
}

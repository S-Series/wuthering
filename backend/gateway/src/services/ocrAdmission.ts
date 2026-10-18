import type { FastifyReply, FastifyRequest } from "fastify";

/** Reserve capacity before reading multipart bodies, including queued uploads. */
export class OcrAdmission {
  private admitted = 0;

  constructor(private readonly capacity: number, private readonly timeoutMs = 180_000) {
    if (!Number.isSafeInteger(capacity) || capacity < 1) throw new Error("Invalid OCR capacity");
  }

  wrap(handler: (req: FastifyRequest, reply: FastifyReply, signal: AbortSignal) => Promise<unknown>) {
    return async (req: FastifyRequest, reply: FastifyReply) => {
      if (this.admitted >= this.capacity) {
        return reply.code(503).header("retry-after", "5").send({ error: "OCR capacity exhausted", retryAfterSec: 5 });
      }
      this.admitted++;
      const controller = new AbortController();
      const abort = () => controller.abort();
      const close = () => { if (!reply.raw.writableEnded) abort(); };
      req.raw.once("aborted", abort);
      reply.raw.once("close", close);
      const timer = setTimeout(abort, this.timeoutMs);
      timer.unref();
      try {
        return await handler(req, reply, controller.signal);
      } finally {
        clearTimeout(timer);
        req.raw.off("aborted", abort);
        reply.raw.off("close", close);
        // Retain the reservation until cancelled queued work has settled too.
        this.admitted--;
      }
    };
  }
}

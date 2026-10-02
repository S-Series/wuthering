import type { FastifyInstance } from "fastify";
import { readStoredAnalytics } from "../services/devAnalyticsDaily.js";

export function registerDevAnalyticsRoutes(app: FastifyInstance) {
  app.get("/api/dev/analytics", async (req, reply) => {
    const query = req.query as { days?: string };
    const days = Number(query.days ?? 7);
    if (![1, 7, 30].includes(days)) {
      return reply.code(400).send({ error: "days must be 1, 7, or 30" });
    }

    try {
      const data = await readStoredAnalytics(days);
      return reply.header("Cache-Control", "public, max-age=60").send(data);
    } catch (error) {
      req.log.error({ err: error }, "Stored analytics request failed");
      return reply.code(503).send({ error: "Stored analytics is unavailable" });
    }
  });
}

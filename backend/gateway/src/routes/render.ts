import type { FastifyInstance } from "fastify";
import { getClientKey } from "../utils/clientKey.js";
import {
  acquireRenderLock,
  canStartRender,
  releaseRenderLock,
  startRenderCooldown,
  getRenderStatus,
} from "../services/renderCooldown.js";
import { requestRenderUpstream } from "../services/renderUpstream.js";

export async function registerRenderRoutes(app: FastifyInstance) {
  app.post("/api/render/card", async (req, reply) => {
    const body = req.body;

    if (!body || typeof body !== "object") {
      return reply.code(400).send({ error: "invalid json body" });
    }

    const clientKey = getClientKey(req);
    const access = canStartRender(clientKey);

    if (!access.ok) {
      return reply.code(429).send({
        error:
          access.reason === "lock"
            ? "render request already in progress"
            : "render cooldown active",
        reason: access.reason,
        retryAfterSec: access.retryAfterSec,
      });
    }

    acquireRenderLock(clientKey);

    const result = await requestRenderUpstream(body);

    if (!result.ok) {
      releaseRenderLock(clientKey);
      return reply.code(result.statusCode).send(result.body);
    }

    releaseRenderLock(clientKey);
    startRenderCooldown(clientKey);

    return reply.header("content-type", result.contentType).send(result.buffer);
  });

  app.get("/api/render/card/status", async (req, reply) => {
    const clientKey = getClientKey(req);
    const status = getRenderStatus(clientKey);
    return reply.send(status);
  });
}

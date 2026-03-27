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
import { requireUid } from "../lib/requireAuth.js";
export async function registerRenderRoutes(app: FastifyInstance) {
  app.post("/api/render/card", async (req, reply) => {
    const body = req.body;

    if (!body || typeof body !== "object") {
      return reply.code(400).send({ error: "invalid json body" });
    }

    let uid: string;

    try {
      uid = await requireUid(req);
    } catch {
      return reply.code(401).send({ error: "unauthorized" });
    }

    const access = canStartRender(uid);

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

    acquireRenderLock(uid);

    try {
      const result = await requestRenderUpstream(body);

      if (!result.ok) {
        return reply.code(result.statusCode).send(result.body);
      }

      startRenderCooldown(uid);

      return reply
        .header("content-type", result.contentType)
        .send(result.buffer);
    } catch (error) {
      req.log.error(error);
      return reply.code(500).send({
        error: "render upstream request failed",
      });
    } finally {
      releaseRenderLock(uid);
    }
  });

  app.get("/api/render/card/status", async (req, reply) => {
    try {
      const uid = await requireUid(req);
      const status = getRenderStatus(uid);
      return reply.send(status);
    } catch (error) {
      return reply.status(401).send({
        message: "Unauthorized",
      });
    }
  });
}

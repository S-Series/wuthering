import type { FastifyInstance } from "fastify";
import {
  acquireRenderLock,
  canStartRender,
  releaseRenderLock,
  startRenderCooldown,
  getRenderStatus,
} from "../services/renderCooldown.js";
import { requestRenderUpstream } from "../services/renderUpstream.js";
import { requireUid } from "../lib/requireAuth.js";
import {
  cacheStore,
  createRenderCardCacheKey,
} from "../services/cacheStore.js";

const inFlightRenderRequests = new Map<
  string,
  Promise<Awaited<ReturnType<typeof requestRenderUpstream>>>
>();

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

    const cacheKey = createRenderCardCacheKey({
      uid,
      body,
    });

    const cached = cacheStore.renderCard.get(cacheKey);

    if (cached !== undefined) {
      return reply
        .header("content-type", cached.contentType)
        .header("x-cache", "HIT")
        .send(Buffer.from(cached.buffer));
    }

    const inFlightRequest = inFlightRenderRequests.get(cacheKey);

    if (inFlightRequest) {
      const result = await inFlightRequest;

      if (!result.ok) {
        return reply.code(result.statusCode).send(result.body);
      }

      cacheStore.renderCard.set(cacheKey, {
        contentType: result.contentType,
        buffer: Buffer.from(result.buffer),
      });

      return reply
        .header("content-type", result.contentType)
        .header("x-cache", "INFLIGHT")
        .send(Buffer.from(result.buffer));
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

    const upstreamRequest = requestRenderUpstream(body);
    inFlightRenderRequests.set(cacheKey, upstreamRequest);

    try {
      const result = await upstreamRequest;

      if (!result.ok) {
        return reply.code(result.statusCode).send(result.body);
      }

      startRenderCooldown(uid);

      cacheStore.renderCard.set(cacheKey, {
        contentType: result.contentType,
        buffer: Buffer.from(result.buffer),
      });

      return reply
        .header("content-type", result.contentType)
        .header("x-cache", "MISS")
        .send(result.buffer);
    } catch (error) {
      req.log.error(error);

      return reply.code(500).send({
        error: "render upstream request failed",
      });
    } finally {
      releaseRenderLock(uid);

      if (inFlightRenderRequests.get(cacheKey) === upstreamRequest) {
        inFlightRenderRequests.delete(cacheKey);
      }
    }
  });

  app.get("/api/render/card/status", async (req, reply) => {
    try {
      const uid = await requireUid(req);
      const status = getRenderStatus(uid);
      return reply.send(status);
    } catch {
      return reply.status(401).send({
        message: "Unauthorized",
      });
    }
  });
}
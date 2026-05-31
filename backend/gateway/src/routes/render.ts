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
import { getClientIp } from "../lib/getClientIp.js";
import { safeLogEvent } from "../lib/logEvent.js";
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
    const startedAt = Date.now();
    const body = req.body;

    if (!body || typeof body !== "object") {
      safeLogEvent({
        service: "gateway",
        feature: "render",
        eventName: "render_request",
        result: "fail",
        statusCode: 400,
        durationMs: Date.now() - startedAt,
        ip: getClientIp(req),
        message: "invalid json body",
      });
      return reply.code(400).send({ error: "invalid json body" });
    }

    let uid: string;

    try {
      uid = await requireUid(req);
    } catch {
      safeLogEvent({
        service: "gateway",
        feature: "render",
        eventName: "render_request",
        result: "fail",
        statusCode: 401,
        durationMs: Date.now() - startedAt,
        ip: getClientIp(req),
        message: "unauthorized",
      });
      return reply.code(401).send({ error: "unauthorized" });
    }

    const cacheKey = createRenderCardCacheKey({
      uid,
      body,
    });

    const cached = cacheStore.renderCard.get(cacheKey);

    if (cached !== undefined) {
      safeLogEvent({
        service: "gateway",
        feature: "render",
        eventName: "render_request",
        result: "success",
        statusCode: 200,
        durationMs: Date.now() - startedAt,
        userId: uid,
        ip: getClientIp(req),
        meta: { cache: "HIT" },
      });

      return reply
        .header("content-type", cached.contentType)
        .header("x-cache", "HIT")
        .send(Buffer.from(cached.buffer));
    }

    const inFlightRequest = inFlightRenderRequests.get(cacheKey);

    if (inFlightRequest) {
      const result = await inFlightRequest;

      if (!result.ok) {
        safeLogEvent({
          service: "gateway",
          feature: "render",
          eventName: "render_request",
          result: "fail",
          statusCode: result.statusCode,
          durationMs: Date.now() - startedAt,
          userId: uid,
          ip: getClientIp(req),
          message: "in-flight upstream error",
          meta: { cache: "INFLIGHT" },
        });

        return reply.code(result.statusCode).send(result.body);
      }

      cacheStore.renderCard.set(cacheKey, {
        contentType: result.contentType,
        buffer: Buffer.from(result.buffer),
      });

      safeLogEvent({
        service: "gateway",
        feature: "render",
        eventName: "render_request",
        result: "success",
        statusCode: 200,
        durationMs: Date.now() - startedAt,
        userId: uid,
        ip: getClientIp(req),
        meta: { cache: "INFLIGHT" },
      });

      return reply
        .header("content-type", result.contentType)
        .header("x-cache", "INFLIGHT")
        .send(Buffer.from(result.buffer));
    }

    const access = canStartRender(uid);

    if (!access.ok) {
      safeLogEvent({
        service: "gateway",
        feature: "render",
        eventName: "render_request",
        result: "fail",
        statusCode: 429,
        durationMs: Date.now() - startedAt,
        userId: uid,
        ip: getClientIp(req),
        message:
          access.reason === "lock"
            ? "render request already in progress"
            : "render cooldown active",
        meta: {
          reason: access.reason,
          retryAfterSec: access.retryAfterSec,
        },
      });

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
        safeLogEvent({
          service: "gateway",
          feature: "render",
          eventName: "render_request",
          result: "fail",
          statusCode: result.statusCode,
          durationMs: Date.now() - startedAt,
          userId: uid,
          ip: getClientIp(req),
          message: "upstream error",
          meta: { cache: "MISS" },
        });

        return reply.code(result.statusCode).send(result.body);
      }

      startRenderCooldown(uid);

      cacheStore.renderCard.set(cacheKey, {
        contentType: result.contentType,
        buffer: Buffer.from(result.buffer),
      });

      safeLogEvent({
        service: "gateway",
        feature: "render",
        eventName: "render_request",
        result: "success",
        statusCode: 200,
        durationMs: Date.now() - startedAt,
        userId: uid,
        ip: getClientIp(req),
        meta: { cache: "MISS" },
      });

      return reply
        .header("content-type", result.contentType)
        .header("x-cache", "MISS")
        .send(result.buffer);
    } catch (error) {
      req.log.error(error);

      safeLogEvent({
        service: "gateway",
        feature: "render",
        eventName: "render_request",
        result: "fail",
        statusCode: 500,
        durationMs: Date.now() - startedAt,
        userId: uid,
        ip: getClientIp(req),
        message: "render upstream request failed",
      });

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

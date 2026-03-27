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
import { requireUid } from "../lib/requireAuth.js"
export async function registerRenderRoutes(app: FastifyInstance) {
  app.post("/api/render/card", async (req, reply) => {
    let uid: string;

    try {
      uid = await requireUid(req);
    } catch {
      return reply.status(401).send({
        message: "Unauthorized",
      });
    }

    const access = canStartRender(uid);
    if (!access.ok) {
      return reply.status(429).send(access);
    }

    acquireRenderLock(uid);

    try {
      // render upstream call
      // const image = await requestRender(...)

      startRenderCooldown(uid);

      // return image
    } catch (error) {
      throw error;
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

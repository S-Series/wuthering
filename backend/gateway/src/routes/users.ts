import type { FastifyInstance } from "fastify";
import {
  syncSupabaseUser,
  verifyFirebaseRequest,
} from "../services/supabaseUsers.js";

type SyncUserBody = {
  displayName?: unknown;
  imageUrl?: unknown;
  provider?: unknown;
};

function optionalString(value: unknown, maxLength = 200) {
  if (typeof value !== "string") return null;
  const trimmed = value.trim();
  if (!trimmed) return null;
  return trimmed.slice(0, maxLength);
}

export async function registerUserRoutes(app: FastifyInstance) {
  app.post("/api/users/sync", async (req, reply) => {
    let decoded;

    try {
      decoded = await verifyFirebaseRequest(req);
    } catch {
      return reply.code(401).send({ error: "unauthorized" });
    }

    const body = (req.body ?? {}) as SyncUserBody;
    let user;

    try {
      user = await syncSupabaseUser(decoded, {
        displayName: optionalString(body.displayName),
        imageUrl: optionalString(body.imageUrl, 1000),
        provider: optionalString(body.provider),
      });
    } catch (error) {
      req.log.error(error);
      return reply.code(500).send({ error: "user sync failed" });
    }

    return reply.send(user);
  });
}

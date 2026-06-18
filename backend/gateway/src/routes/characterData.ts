import type { FastifyInstance } from "fastify";
import {
  getActiveSupabaseMembership,
  getRequiredSupabaseUser,
  isMembershipUser,
} from "../services/supabaseUsers.js";
import { supabaseAdmin } from "../lib/supabaseAdmin.js";

type CharacterDataBody = {
  data?: unknown;
};

const MAX_CHARACTER_DATA_BYTES = 2 * 1024 * 1024;

function isJsonObject(value: unknown): value is Record<string, unknown> {
  return Boolean(value) && typeof value === "object" && !Array.isArray(value);
}

export async function registerCharacterDataRoutes(app: FastifyInstance) {
  app.get("/api/character-data", async (req, reply) => {
    let user;

    try {
      user = await getRequiredSupabaseUser(req);
    } catch {
      return reply.code(401).send({ error: "unauthorized" });
    }

    const membership = await getActiveSupabaseMembership(user.id);

    if (!isMembershipUser(user, membership)) {
      return reply.code(403).send({
        error: "membership required",
        reason: "membership-required",
      });
    }

    const { data, error } = await supabaseAdmin
      .from("character_data")
      .select("data, updated_at")
      .eq("user_id", user.id)
      .maybeSingle();

    if (error) {
      req.log.error(error);
      return reply.code(500).send({ error: "character data load failed" });
    }

    return reply.send({
      ok: true,
      data: isJsonObject(data?.data) ? data.data : {},
      updatedAt: data?.updated_at ?? null,
    });
  });

  app.put("/api/character-data", async (req, reply) => {
    let user;

    try {
      user = await getRequiredSupabaseUser(req);
    } catch {
      return reply.code(401).send({ error: "unauthorized" });
    }

    const membership = await getActiveSupabaseMembership(user.id);

    if (!isMembershipUser(user, membership)) {
      return reply.code(403).send({
        error: "membership required",
        reason: "membership-required",
      });
    }

    const body = (req.body ?? {}) as CharacterDataBody;

    if (!isJsonObject(body.data)) {
      return reply.code(400).send({ error: "invalid character data" });
    }

    const payload = JSON.stringify(body.data);

    if (Buffer.byteLength(payload, "utf8") > MAX_CHARACTER_DATA_BYTES) {
      return reply.code(413).send({ error: "character data is too large" });
    }

    const now = new Date().toISOString();
    const { data, error } = await supabaseAdmin
      .from("character_data")
      .upsert(
        {
          user_id: user.id,
          data: body.data,
          updated_at: now,
        },
        { onConflict: "user_id" }
      )
      .select("updated_at")
      .single();

    if (error) {
      req.log.error(error);
      return reply.code(500).send({ error: "character data sync failed" });
    }

    return reply.send({
      ok: true,
      updatedAt: data?.updated_at ?? now,
    });
  });
}

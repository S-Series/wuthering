import type { FastifyInstance } from "fastify";
import { getRequiredSupabaseUser } from "../services/supabaseUsers.js";
import { supabaseAdmin } from "../lib/supabaseAdmin.js";

type CharacterDataBody = {
  data?: unknown;
  characterId?: unknown;
};

type CharacterDataQuery = {
  characterId?: string;
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

    const query = (req.query ?? {}) as CharacterDataQuery;
    const characterId = query.characterId?.trim();

    const { data, error } = await supabaseAdmin
      .from("character_data")
      .select("data, updated_at")
      .eq("user_id", user.id)
      .maybeSingle();

    if (error) {
      req.log.error(error);
      return reply.code(500).send({ error: "character data load failed" });
    }

    const snapshot = isJsonObject(data?.data) ? data.data : {};
    const responseData = characterId
      ? {
          [characterId]: isJsonObject(snapshot[characterId])
            ? snapshot[characterId]
            : undefined,
        }
      : snapshot;

    return reply.send({
      ok: true,
      data: characterId && responseData[characterId] === undefined
        ? {}
        : responseData,
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

    const body = (req.body ?? {}) as CharacterDataBody;

    if (!isJsonObject(body.data)) {
      return reply.code(400).send({ error: "invalid character data" });
    }

    let nextData = body.data;

    if (typeof body.characterId === "string" && body.characterId.trim()) {
      const characterId = body.characterId.trim();
      const { data: current, error: currentError } = await supabaseAdmin
        .from("character_data")
        .select("data")
        .eq("user_id", user.id)
        .maybeSingle();

      if (currentError) {
        req.log.error(currentError);
        return reply.code(500).send({ error: "character data load failed" });
      }

      nextData = {
        ...(isJsonObject(current?.data) ? current.data : {}),
        [characterId]: body.data,
      };
    }

    const payload = JSON.stringify(nextData);

    if (Buffer.byteLength(payload, "utf8") > MAX_CHARACTER_DATA_BYTES) {
      return reply.code(413).send({ error: "character data is too large" });
    }

    const now = new Date().toISOString();
    const { data, error } = await supabaseAdmin
      .from("character_data")
      .upsert(
        {
          user_id: user.id,
          data: nextData,
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

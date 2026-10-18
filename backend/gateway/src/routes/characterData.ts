import { createHash } from "node:crypto";
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
const CHARACTER_ID_PATTERN = /^[a-z0-9_]{1,80}$/;

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
    if (characterId && !CHARACTER_ID_PATTERN.test(characterId)) {
      return reply.code(400).send({ error: "invalid character id" });
    }

    const { data: rawData, error } = await supabaseAdmin
      .from("character_data")
      .select(characterId ? `data:data->${characterId}, updated_at` : "data, updated_at")
      .eq("user_id", user.id)
      .maybeSingle();
    // The projection contains a validated runtime JSON key, which the SDK's
    // compile-time select parser cannot infer.
    const data = rawData as unknown as { data: unknown; updated_at: string | null } | null;

    if (error) {
      req.log.error(error);
      return reply.code(500).send({ error: "character data load failed" });
    }

    const snapshot = isJsonObject(data?.data) ? data.data : {};
    const responseData = characterId
      ? {
          [characterId]: isJsonObject(data?.data) ? data.data : undefined,
        }
      : snapshot;

    const response = {
      ok: true,
      data: characterId && responseData[characterId] === undefined ? {} : responseData,
      updatedAt: data?.updated_at ?? null,
    };
    // Private browser cache must revalidate through authentication every time.
    const etag = '"' + createHash("sha256")
      .update(user.id + "\0" + (characterId ?? "all") + "\0" + JSON.stringify(response))
      .digest("hex") + '"';
    reply.header("cache-control", "private, no-cache").header("etag", etag)
      .header("vary", [reply.getHeader("vary"), "Authorization"].filter(Boolean).join(", "));
    const candidates = req.headers["if-none-match"]?.split(",").map(value => value.trim().replace(/^W\//, ""));
    if (candidates?.includes(etag) || candidates?.includes("*")) return reply.code(304).send();
    return reply.send(response);
  });

  app.put("/api/character-data", { bodyLimit: MAX_CHARACTER_DATA_BYTES + 1024 }, async (req, reply) => {
    let user;

    try {
      user = await getRequiredSupabaseUser(req);
    } catch {
      return reply.code(401).send({ error: "unauthorized" });
    }

    reply.header("cache-control", "no-store");
    const body = (req.body ?? {}) as CharacterDataBody;

    if (!isJsonObject(body.data)) {
      return reply.code(400).send({ error: "invalid character data" });
    }

    const characterId = typeof body.characterId === "string" ? body.characterId.trim() : "";
    if ((body.characterId !== undefined && typeof body.characterId !== "string") ||
        (characterId && !CHARACTER_ID_PATTERN.test(characterId))) {
      return reply.code(400).send({ error: "invalid character id" });
    }
    if (Buffer.byteLength(JSON.stringify(body.data), "utf8") > MAX_CHARACTER_DATA_BYTES) {
      return reply.code(413).send({ error: "character data is too large" });
    }

    if (characterId) {
      const { data, error } = await supabaseAdmin.rpc("merge_character_cloud_data", {
        target_user_id: user.id,
        target_character_id: characterId,
        character_payload: body.data,
      });
      if (error) {
        req.log.error(error);
        return reply.code(error.code === "22001" ? 413 : 500)
          .send({ error: "character data sync failed" });
      }
      return reply.send({ ok: true, updatedAt: data });
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

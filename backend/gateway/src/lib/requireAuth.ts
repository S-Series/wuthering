import type { FastifyRequest } from "fastify";
import { verifyFirebaseRequest } from "../services/supabaseUsers.js";

export async function requireUid(req: FastifyRequest): Promise<string> {
  return (await verifyFirebaseRequest(req)).uid;
}

import type { FastifyRequest } from "fastify";
import { adminAuth } from "./firebaseAdmin.js";

export async function getOptionalUid(req: FastifyRequest) {
  const authHeader = req.headers.authorization;

  if (!authHeader || !authHeader.startsWith("Bearer ")) {
    return null;
  }

  const token = authHeader.slice("Bearer ".length).trim();
  if (!token) return null;

  try {
    const decoded = await adminAuth.verifyIdToken(token);
    return decoded.uid;
  } catch {
    return null;
  }
}

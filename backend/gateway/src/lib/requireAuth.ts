import type { FastifyRequest } from "fastify";
import { adminAuth } from "./firebaseAdmin.js";

export async function requireUid(req: FastifyRequest): Promise<string> {
  const authHeader = req.headers.authorization;

  if (!authHeader || !authHeader.startsWith("Bearer ")) {
    throw new Error("Missing Authorization header");
  }

  const token = authHeader.slice("Bearer ".length).trim();
  if (!token) {
    throw new Error("Missing Firebase ID token");
  }

  const decoded = await adminAuth.verifyIdToken(token);
  return decoded.uid;
}
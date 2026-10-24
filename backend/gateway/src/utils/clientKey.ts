import type { FastifyRequest } from "fastify";
import { getClientIp } from "../lib/getClientIp.js";

export function getClientKey(req: FastifyRequest): string {
  return getClientIp(req) ?? "unknown";
}

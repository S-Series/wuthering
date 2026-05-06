import type { FastifyRequest } from "fastify";

export function getClientIp(req: FastifyRequest) {
  const forwardedFor = req.headers["x-forwarded-for"];

  if (typeof forwardedFor === "string") {
    return forwardedFor.split(",")[0]?.trim() ?? null;
  }

  if (Array.isArray(forwardedFor)) {
    return forwardedFor[0]?.split(",")[0]?.trim() ?? null;
  }

  return req.socket.remoteAddress ?? null;
}
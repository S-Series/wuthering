import type { FastifyRequest } from "fastify";
import { isIP } from "node:net";

export function getClientIp(req: FastifyRequest) {
  // Enable only behind Railway's edge, never on a directly reachable listener.
  if (process.env.CLIENT_IP_SOURCE === "railway") {
    const realIp = req.headers["x-real-ip"];
    if (typeof realIp === "string" && isIP(realIp)) return realIp;
  }
  return req.socket.remoteAddress ?? null;
}

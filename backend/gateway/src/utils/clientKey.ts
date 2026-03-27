import type { FastifyRequest } from "fastify";

export function getClientKey(req: FastifyRequest): string {
  const xfwd = req.headers["x-forwarded-for"];
  if (typeof xfwd === "string" && xfwd.length > 0) {
    return xfwd.split(",")[0].trim();
  }

  return req.ip;
}
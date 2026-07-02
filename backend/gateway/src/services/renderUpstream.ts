import { RENDER_UPSTREAM } from "../config/env.js";
import { getErrorMessage, isAbortError } from "../lib/errors.js";

export type RenderUpstreamSuccess = {
  ok: true;
  contentType: string;
  buffer: Buffer;
};

export type RenderUpstreamFailure = {
  ok: false;
  statusCode: number;
  body: Record<string, unknown>;
};

export type RenderUpstreamResult =
  | RenderUpstreamSuccess
  | RenderUpstreamFailure;

export async function requestRenderUpstream(
  body: unknown
): Promise<RenderUpstreamResult> {
  const upstreamUrl = new URL("/render/card", RENDER_UPSTREAM).toString();

  const controller = new AbortController();
  const timeoutMs = 60_000;
  const timeoutId = setTimeout(() => controller.abort(), timeoutMs);

  let upstreamRes: Response;
  try {
    upstreamRes = await fetch(upstreamUrl, {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
      },
      body: JSON.stringify(body),
      signal: controller.signal,
    });
  } catch (e: unknown) {
    const msg = isAbortError(e)
      ? "upstream timeout"
      : "upstream fetch failed";

    return {
      ok: false,
      statusCode: 504,
      body: {
        error: msg,
        detail: getErrorMessage(e),
      },
    };
  } finally {
    clearTimeout(timeoutId);
  }

  if (!upstreamRes.ok) {
    const text = await upstreamRes.text();

    return {
      ok: false,
      statusCode: 502,
      body: {
        error: "render upstream error",
        upstreamStatus: upstreamRes.status,
        upstreamBody: text.slice(0, 2000),
      },
    };
  }

  const contentType =
    upstreamRes.headers.get("content-type") ?? "application/octet-stream";
  const arrayBuffer = await upstreamRes.arrayBuffer();
  const buffer = Buffer.from(arrayBuffer);

  return {
    ok: true,
    contentType,
    buffer,
  };
}

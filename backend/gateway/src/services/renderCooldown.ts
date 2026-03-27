type RenderRejectReason = "lock" | "cooldown";

export type RenderAccessResult =
  | { ok: true }
  | {
      ok: false;
      reason: RenderRejectReason;
      retryAfterSec: number;
    };

const RENDER_LOCK_MS = 60_000;
const RENDER_COOLDOWN_MS = 5 * 60 * 1000;

const renderLocks = new Map<string, number>();
const renderCooldowns = new Map<string, number>();

function now() {
  return Date.now();
}

function getRemainingMs(expiresAt: number): number {
  return Math.max(0, expiresAt - now());
}

function clearExpired(clientKey: string) {
  const lockExpiresAt = renderLocks.get(clientKey);
  if (lockExpiresAt && lockExpiresAt <= now()) {
    renderLocks.delete(clientKey);
  }

  const cooldownExpiresAt = renderCooldowns.get(clientKey);
  if (cooldownExpiresAt && cooldownExpiresAt <= now()) {
    renderCooldowns.delete(clientKey);
  }
}

//$ Membership
export function hasRenderBypass(_clientKey: string): boolean {
  return false;
}

export function canStartRender(clientKey: string): RenderAccessResult {
  if (hasRenderBypass(clientKey)) {
    return { ok: true };
  }

  clearExpired(clientKey);

  const lockExpiresAt = renderLocks.get(clientKey);
  if (lockExpiresAt) {
    return {
      ok: false,
      reason: "lock",
      retryAfterSec: Math.ceil(getRemainingMs(lockExpiresAt) / 1000),
    };
  }

  const cooldownExpiresAt = renderCooldowns.get(clientKey);
  if (cooldownExpiresAt) {
    return {
      ok: false,
      reason: "cooldown",
      retryAfterSec: Math.ceil(getRemainingMs(cooldownExpiresAt) / 1000),
    };
  }

  return { ok: true };
}

export function acquireRenderLock(clientKey: string) {
  if (hasRenderBypass(clientKey)) return;
  renderLocks.set(clientKey, now() + RENDER_LOCK_MS);
}

export function releaseRenderLock(clientKey: string) {
  if (hasRenderBypass(clientKey)) return;
  renderLocks.delete(clientKey);
}

export function startRenderCooldown(clientKey: string) {
  if (hasRenderBypass(clientKey)) return;
  renderCooldowns.set(clientKey, now() + RENDER_COOLDOWN_MS);
}
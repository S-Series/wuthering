type RenderRejectReason = "lock" | "cooldown";

export type RenderAccessResult =
  | { ok: true }
  | {
      ok: false;
      reason: RenderRejectReason;
      retryAfterSec: number;
    };

const RENDER_LOCK_MS = 60_000;
const RENDER_COOLDOWN_MS = 10 * 60 * 1000;

const renderLocks = new Map<string, number>();
const renderCooldowns = new Map<string, number>();

type RenderStatus =
  | { status: "ready"; retryAfterSec: 0 }
  | { status: "lock"; retryAfterSec: number }
  | { status: "cooldown"; retryAfterSec: number };

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
type RenderUserKey = string;

export function hasRenderBypass(uid: RenderUserKey): boolean {
  return false;
}

export function canStartRender(uid: RenderUserKey): RenderAccessResult {
  if (hasRenderBypass(uid)) {
    return { ok: true };
  }

  clearExpired(uid);

  const lockExpiresAt = renderLocks.get(uid);
  if (lockExpiresAt) {
    return {
      ok: false,
      reason: "lock",
      retryAfterSec: Math.ceil(getRemainingMs(lockExpiresAt) / 1000),
    };
  }

  const cooldownExpiresAt = renderCooldowns.get(uid);
  if (cooldownExpiresAt) {
    return {
      ok: false,
      reason: "cooldown",
      retryAfterSec: Math.ceil(getRemainingMs(cooldownExpiresAt) / 1000),
    };
  }

  return { ok: true };
}

export function acquireRenderLock(uid: RenderUserKey) {
  if (hasRenderBypass(uid)) return;
  renderLocks.set(uid, now() + RENDER_LOCK_MS);
}

export function releaseRenderLock(uid: RenderUserKey) {
  if (hasRenderBypass(uid)) return;
  renderLocks.delete(uid);
}

export function startRenderCooldown(uid: RenderUserKey) {
  if (hasRenderBypass(uid)) return;
  renderCooldowns.set(uid, now() + RENDER_COOLDOWN_MS);
}

export function getRenderStatus(uid: RenderUserKey): RenderStatus {
  if (hasRenderBypass(uid)) {
    return { status: "ready", retryAfterSec: 0 };
  }

  clearExpired(uid);

  const lockExpiresAt = renderLocks.get(uid);
  if (lockExpiresAt) {
    return {
      status: "lock",
      retryAfterSec: Math.ceil(getRemainingMs(lockExpiresAt) / 1000),
    };
  }

  const cooldownExpiresAt = renderCooldowns.get(uid);
  if (cooldownExpiresAt) {
    return {
      status: "cooldown",
      retryAfterSec: Math.ceil(getRemainingMs(cooldownExpiresAt) / 1000),
    };
  }

  return {
    status: "ready",
    retryAfterSec: 0,
  };
}

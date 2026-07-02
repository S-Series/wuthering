import { randomUUID } from "node:crypto";
import { supabaseAdmin } from "../lib/supabaseAdmin.js";

type RenderRejectReason = "lock" | "cooldown";

export type RenderAccessResult =
  | { ok: true; lockToken: string }
  | {
      ok: false;
      reason: RenderRejectReason;
      retryAfterSec: number;
    };

const RENDER_LOCK_MS = 60_000;
const RENDER_COOLDOWN_MS = 10 * 60 * 1000;
export const MEMBER_RENDER_COOLDOWN_MS = 3 * 60 * 1000;

const RENDER_STATE_TABLE =
  process.env.RENDER_STATE_TABLE ?? "render_request_states";
const EPOCH_ISO = new Date(0).toISOString();
const SUPABASE_DISABLED = process.env.RENDER_STATE_STORE === "memory";

type RenderUserKey = string;

type RenderStatus =
  | { status: "ready"; retryAfterSec: 0 }
  | { status: "lock"; retryAfterSec: number }
  | { status: "cooldown"; retryAfterSec: number };

type RenderStateRow = {
  user_key: string;
  lock_expires_at: string;
  lock_token: string | null;
  cooldown_expires_at: string;
};

const renderLocks = new Map<string, { expiresAt: number; token: string }>();
const renderCooldowns = new Map<string, number>();
let supabaseStoreAvailable = !SUPABASE_DISABLED;
let supabaseStoreWarningShown = false;

function now() {
  return Date.now();
}

function getRemainingMs(expiresAt: number): number {
  return Math.max(0, expiresAt - now());
}

function getFutureIso(msFromNow: number) {
  return new Date(now() + msFromNow).toISOString();
}

function clearExpired(clientKey: string) {
  const lock = renderLocks.get(clientKey);
  if (lock && lock.expiresAt <= now()) {
    renderLocks.delete(clientKey);
  }

  const cooldownExpiresAt = renderCooldowns.get(clientKey);
  if (cooldownExpiresAt && cooldownExpiresAt <= now()) {
    renderCooldowns.delete(clientKey);
  }
}

function clearAllExpiredMemoryState() {
  const currentTime = now();

  for (const [key, lock] of renderLocks) {
    if (lock.expiresAt <= currentTime) {
      renderLocks.delete(key);
    }
  }

  for (const [key, expiresAt] of renderCooldowns) {
    if (expiresAt <= currentTime) {
      renderCooldowns.delete(key);
    }
  }
}

export function hasRenderBypass(_uid: RenderUserKey): boolean {
  return false;
}

function statusFromExpirations(input: {
  lockExpiresAt: number;
  cooldownExpiresAt: number;
}): RenderStatus {
  if (input.lockExpiresAt > now()) {
    return {
      status: "lock",
      retryAfterSec: Math.ceil(getRemainingMs(input.lockExpiresAt) / 1000),
    };
  }

  if (input.cooldownExpiresAt > now()) {
    return {
      status: "cooldown",
      retryAfterSec: Math.ceil(getRemainingMs(input.cooldownExpiresAt) / 1000),
    };
  }

  return {
    status: "ready",
    retryAfterSec: 0,
  };
}

function memoryStatus(uid: RenderUserKey): RenderStatus {
  clearExpired(uid);

  const lock = renderLocks.get(uid);
  const cooldownExpiresAt = renderCooldowns.get(uid) ?? 0;

  return statusFromExpirations({
    lockExpiresAt: lock?.expiresAt ?? 0,
    cooldownExpiresAt,
  });
}

function memoryTryAcquireRenderLock(uid: RenderUserKey): RenderAccessResult {
  if (hasRenderBypass(uid)) {
    return { ok: true, lockToken: "bypass" };
  }

  clearAllExpiredMemoryState();

  const status = memoryStatus(uid);

  if (status.status !== "ready") {
    return {
      ok: false,
      reason: status.status,
      retryAfterSec: status.retryAfterSec,
    };
  }

  const lockToken = randomUUID();
  renderLocks.set(uid, {
    token: lockToken,
    expiresAt: now() + RENDER_LOCK_MS,
  });

  return { ok: true, lockToken };
}

function shouldDisableSupabaseStore(error: unknown) {
  const code = (error as { code?: string })?.code;
  return code === "42P01" || code === "PGRST205";
}

function disableSupabaseStore(error: unknown) {
  if (!shouldDisableSupabaseStore(error)) return;

  supabaseStoreAvailable = false;

  if (supabaseStoreWarningShown) return;

  supabaseStoreWarningShown = true;
  console.warn(
    `[render-state] Supabase table "${RENDER_STATE_TABLE}" is not available. Falling back to in-memory render state.`
  );
}

function statusFromRow(row: RenderStateRow | null): RenderStatus {
  if (!row) {
    return { status: "ready", retryAfterSec: 0 };
  }

  return statusFromExpirations({
    lockExpiresAt: new Date(row.lock_expires_at).getTime(),
    cooldownExpiresAt: new Date(row.cooldown_expires_at).getTime(),
  });
}

async function getSupabaseRenderStatus(
  uid: RenderUserKey
): Promise<RenderStatus | null> {
  if (!supabaseStoreAvailable) return null;

  const { data, error } = await supabaseAdmin
    .from(RENDER_STATE_TABLE)
    .select("user_key, lock_expires_at, lock_token, cooldown_expires_at")
    .eq("user_key", uid)
    .maybeSingle();

  if (error) {
    disableSupabaseStore(error);
    return null;
  }

  return statusFromRow((data as RenderStateRow | null) ?? null);
}

async function tryAcquireSupabaseRenderLock(
  uid: RenderUserKey,
  attempt = 0
): Promise<RenderAccessResult | null> {
  if (!supabaseStoreAvailable) return null;

  if (hasRenderBypass(uid)) {
    return { ok: true, lockToken: "bypass" };
  }

  const lockToken = randomUUID();
  const currentIso = new Date().toISOString();
  const lockExpiresAt = getFutureIso(RENDER_LOCK_MS);

  const updateResult = await supabaseAdmin
    .from(RENDER_STATE_TABLE)
    .update({
      lock_expires_at: lockExpiresAt,
      lock_token: lockToken,
      updated_at: currentIso,
    })
    .eq("user_key", uid)
    .lte("lock_expires_at", currentIso)
    .lte("cooldown_expires_at", currentIso)
    .select("user_key")
    .maybeSingle();

  if (updateResult.error) {
    disableSupabaseStore(updateResult.error);
    return null;
  }

  if (updateResult.data) {
    return { ok: true, lockToken };
  }

  const insertResult = await supabaseAdmin
    .from(RENDER_STATE_TABLE)
    .insert({
      user_key: uid,
      lock_expires_at: lockExpiresAt,
      lock_token: lockToken,
      cooldown_expires_at: EPOCH_ISO,
      updated_at: currentIso,
    })
    .select("user_key")
    .maybeSingle();

  if (!insertResult.error) {
    return { ok: true, lockToken };
  }

  if (insertResult.error.code !== "23505") {
    disableSupabaseStore(insertResult.error);
    return null;
  }

  const status = await getSupabaseRenderStatus(uid);
  if (!status) return null;
  if (status.status === "ready") {
    return attempt < 1 ? tryAcquireSupabaseRenderLock(uid, attempt + 1) : null;
  }

  return {
    ok: false,
    reason: status.status,
    retryAfterSec: status.retryAfterSec,
  };
}

export async function tryAcquireRenderLock(
  uid: RenderUserKey
): Promise<RenderAccessResult> {
  const supabaseResult = await tryAcquireSupabaseRenderLock(uid);
  if (supabaseResult?.ok && !hasRenderBypass(uid)) {
    renderLocks.set(uid, {
      token: supabaseResult.lockToken,
      expiresAt: now() + RENDER_LOCK_MS,
    });
  }

  return supabaseResult ?? memoryTryAcquireRenderLock(uid);
}

export async function releaseRenderLock(
  uid: RenderUserKey,
  lockToken?: string
) {
  if (hasRenderBypass(uid)) return;

  if (supabaseStoreAvailable && lockToken) {
    const { error } = await supabaseAdmin
      .from(RENDER_STATE_TABLE)
      .update({
        lock_expires_at: EPOCH_ISO,
        lock_token: null,
        updated_at: new Date().toISOString(),
      })
      .eq("user_key", uid)
      .eq("lock_token", lockToken);

    if (error) {
      disableSupabaseStore(error);
    }
  }

  const currentLock = renderLocks.get(uid);
  if (!lockToken || currentLock?.token === lockToken) {
    renderLocks.delete(uid);
  }
}

export async function startRenderCooldown(
  uid: RenderUserKey,
  cooldownMs = RENDER_COOLDOWN_MS
) {
  if (hasRenderBypass(uid)) return;

  if (supabaseStoreAvailable) {
    const { error } = await supabaseAdmin
      .from(RENDER_STATE_TABLE)
      .upsert(
        {
          user_key: uid,
          cooldown_expires_at: getFutureIso(cooldownMs),
          updated_at: new Date().toISOString(),
        },
        { onConflict: "user_key" }
      );

    if (error) {
      disableSupabaseStore(error);
    }
  }

  clearAllExpiredMemoryState();
  renderCooldowns.set(uid, now() + cooldownMs);
}

export async function getRenderStatus(
  uid: RenderUserKey
): Promise<RenderStatus> {
  if (hasRenderBypass(uid)) {
    return { status: "ready", retryAfterSec: 0 };
  }

  const supabaseStatus = await getSupabaseRenderStatus(uid);
  if (supabaseStatus) {
    return supabaseStatus;
  }

  return memoryStatus(uid);
}

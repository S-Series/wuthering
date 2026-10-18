import type { FastifyRequest } from "fastify";
import { adminAuth } from "../lib/firebaseAdmin.js";
import { supabaseAdmin } from "../lib/supabaseAdmin.js";
import { ReadThroughCache } from "./readThroughCache.js";

type FirebaseToken = {
  uid: string;
  email?: string;
  email_verified?: boolean;
  firebase?: {
    sign_in_provider?: string;
  };
};

type SyncUserInput = {
  displayName?: string | null;
  imageUrl?: string | null;
  provider?: string | null;
};

type SupabaseUserRow = {
  id: string;
  firebase_uid: string;
  email: string | null;
  email_verified: boolean;
  provider: string | null;
  role: string;
  status: string;
  last_login_at: string | null;
  created_at: string;
  updated_at: string;
  membership?: SupabaseMembershipRow | null;
};

type SupabaseMembershipRow = {
  user_id: string;
  membership_level: number;
  started_at: string | null;
  expires_at: string | null;
  created_at: string;
  updated_at: string;
  nickname: string | null;
};

export type GatewayUserProfile = {
  uid: string;
  supabaseUid: string;
  email: string | null;
  nickname: string;
  imageUrl: string | null;
  role: string;
  status: string;
  membershipLevel: number;
  membershipExpiresAt: string | null;
  membershipNickname: string | null;
  isMember: boolean;
  createdAt: number;
};

export type SupabaseMembershipUser = Pick<
  SupabaseUserRow,
  "id" | "firebase_uid" | "role" | "status"
>;

// Share work only within a request. Role/status checks remain fresh per request.
const verifiedRequests = new WeakMap<FastifyRequest, Promise<FirebaseToken>>();
const requiredRequests = new WeakMap<FastifyRequest, Promise<SupabaseMembershipUser>>();
// Telemetry needs only an identifier; this cache never authorizes an operation.
const telemetryIdentities = new ReadThroughCache(60_000, 10_000);
const USER_COLUMNS = "id, firebase_uid, email, email_verified, provider, role, status, last_login_at, created_at, updated_at";
const MEMBERSHIP_COLUMNS = "membership:memberships(user_id, membership_level, started_at, expires_at, nickname, created_at, updated_at)";
const LOGIN_TOUCH_INTERVAL_MS = 5 * 60_000;

function getBearerToken(req: FastifyRequest) {
  const authHeader = req.headers.authorization;

  if (!authHeader || !authHeader.startsWith("Bearer ")) {
    return null;
  }

  const token = authHeader.slice("Bearer ".length).trim();
  return token || null;
}

function normalizeProvider(provider: string | null | undefined) {
  if (!provider) return "unknown";
  if (provider === "password") return "email";
  if (provider.endsWith(".com")) return provider.replace(".com", "");
  return provider;
}

function getProvider(decoded: FirebaseToken, input?: SyncUserInput) {
  return normalizeProvider(input?.provider ?? decoded.firebase?.sign_in_provider);
}

function isActiveMembership(membership: SupabaseMembershipRow | null) {
  if (!membership) return false;
  if (membership.membership_level <= 0) return false;

  if (!membership.expires_at) return true;

  return new Date(membership.expires_at).getTime() > Date.now();
}

function toGatewayUserProfile(
  row: SupabaseUserRow,
  membership: SupabaseMembershipRow | null,
  input?: SyncUserInput
): GatewayUserProfile {
  return {
    uid: row.firebase_uid,
    supabaseUid: row.id,
    email: row.email,
    nickname:
      input?.displayName?.trim() ||
      row.email?.split("@")[0] ||
      "User",
    imageUrl: input?.imageUrl ?? null,
    role: row.role,
    status: row.status,
    membershipLevel: membership?.membership_level ?? 0,
    membershipExpiresAt: membership?.expires_at ?? null,
    membershipNickname: membership?.nickname ?? null,
    isMember: isActiveMembership(membership),
    createdAt: new Date(row.created_at).getTime(),
  };
}

async function findSupabaseUser(firebaseUid: string, includeMembership = false) {
  const { data, error } = await supabaseAdmin
    .from("users")
    .select(includeMembership ? USER_COLUMNS + ", " + MEMBERSHIP_COLUMNS : USER_COLUMNS)
    .eq("firebase_uid", firebaseUid)
    .limit(1)
    .maybeSingle();

  if (error) {
    throw new Error(`Failed to fetch Supabase user: ${error.message}`);
  }

  return data as unknown as SupabaseUserRow | null;
}

async function createInitialMembership(
  userId: string,
  displayName?: string | null
): Promise<SupabaseMembershipRow> {
  const now = new Date().toISOString();
  const nickname = displayName?.trim() || null;

  const { data, error } = await supabaseAdmin
    .from("memberships")
    .insert({
      user_id: userId,
      membership_level: 0,
      started_at: null,
      expires_at: null,
      nickname: nickname ? nickname.slice(0, 200) : null,
      created_at: now,
      updated_at: now,
    })
    .select("*")
    .single();

  if (error) {
    // Another tab or gateway replica may have provisioned the same membership.
    if (error.code === "23505") return findSupabaseMembership(userId, displayName);
    throw new Error(`Failed to create Supabase membership: ${error.message}`);
  }

  return data as SupabaseMembershipRow;
}

async function findSupabaseMembership(
  userId: string,
  displayName?: string | null
): Promise<SupabaseMembershipRow> {
  const { data, error } = await supabaseAdmin
    .from("memberships")
    .select("*")
    .eq("user_id", userId)
    .limit(1)
    .maybeSingle();

  if (error) {
    throw new Error(`Failed to fetch Supabase membership: ${error.message}`);
  }

  if (!data) {
    return createInitialMembership(userId, displayName);
  }

  const membership = data as SupabaseMembershipRow;
  const nickname = displayName?.trim();

  if (nickname && !membership.nickname) {
    await updateMembershipNickname(userId, nickname);
    return {
      ...membership,
      nickname: nickname.slice(0, 200),
    };
  }

  return membership;
}

async function updateMembershipNickname(
  userId: string,
  displayName?: string | null
) {
  const nickname = displayName?.trim();

  if (!nickname) return;

  const { error } = await supabaseAdmin
    .from("memberships")
    .update({
      nickname: nickname.slice(0, 200),
      updated_at: new Date().toISOString(),
    })
    .eq("user_id", userId)
    .is("nickname", null);

  if (error) {
    throw new Error(`Failed to update membership nickname: ${error.message}`);
  }
}

async function insertSupabaseUser(decoded: FirebaseToken, input?: SyncUserInput) {
  const now = new Date().toISOString();

  const { data, error } = await supabaseAdmin
    .from("users")
    .insert({
      firebase_uid: decoded.uid,
      email: decoded.email ?? null,
      email_verified: Boolean(decoded.email_verified),
      provider: getProvider(decoded, input),
      role: "user",
      status: "active",
      last_login_at: now,
      created_at: now,
      updated_at: now,
    })
    .select("*")
    .single();

  if (error) {
    if (error.code === "23505") {
      const existing = await findSupabaseUser(decoded.uid);
      if (existing) return existing;
    }
    throw new Error(`Failed to create Supabase user: ${error.message}`);
  }

  return data as SupabaseUserRow;
}

async function updateSupabaseUser(
  existing: SupabaseUserRow,
  decoded: FirebaseToken,
  input?: SyncUserInput
) {
  const now = new Date().toISOString();

  const { data, error } = await supabaseAdmin
    .from("users")
    .update({
      email: decoded.email ?? existing.email,
      email_verified: Boolean(decoded.email_verified),
      provider: getProvider(decoded, input),
      last_login_at: now,
      updated_at: now,
    })
    .eq("id", existing.id)
    .select("*")
    .single();

  if (error) {
    throw new Error(`Failed to update Supabase user: ${error.message}`);
  }

  return data as SupabaseUserRow;
}

export function verifyFirebaseRequest(req: FastifyRequest) {
  const existing = verifiedRequests.get(req);
  if (existing) return existing;
  const verification = (async () => {
    const token = getBearerToken(req);
    if (!token) throw new Error("Missing Firebase ID token");
    return await adminAuth.verifyIdToken(token) as FirebaseToken;
  })();
  verifiedRequests.set(req, verification);
  return verification;
}

export async function syncSupabaseUser(
  decoded: FirebaseToken,
  input?: SyncUserInput
) {
  const existing = await findSupabaseUser(decoded.uid, true);
  const needsUpdate = existing && (
    existing.email !== (decoded.email ?? existing.email) ||
    existing.email_verified !== Boolean(decoded.email_verified) ||
    existing.provider !== getProvider(decoded, input) ||
    !existing.last_login_at ||
    Date.now() - Date.parse(existing.last_login_at) >= LOGIN_TOUCH_INTERVAL_MS
  );
  const row = existing
    ? needsUpdate ? await updateSupabaseUser(existing, decoded, input) : existing
    : await insertSupabaseUser(decoded, input);
  let membership = existing?.membership ?? await findSupabaseMembership(row.id, input?.displayName);
  const nickname = input?.displayName?.trim();
  if (nickname && !membership.nickname) {
    await updateMembershipNickname(row.id, nickname);
    membership = { ...membership, nickname: nickname.slice(0, 200) };
  }

  return toGatewayUserProfile(row, membership, input);
}

export async function getOptionalSupabaseUserId(req: FastifyRequest) {
  if (!getBearerToken(req)) return null;
  try {
    const required = requiredRequests.get(req);
    if (required) return (await required).id;
    const decoded = await verifyFirebaseRequest(req);
    return (await telemetryIdentities.getOrLoad(decoded.uid, async () => {
      const { data, error } = await supabaseAdmin.from("users").select("id")
        .eq("firebase_uid", decoded.uid).maybeSingle();
      if (error) throw error;
      return typeof data?.id === "string" ? data.id : null;
    })).value;
  } catch {
    return null;
  }
}

export function getRequiredSupabaseUser(req: FastifyRequest) {
  const existingRequest = requiredRequests.get(req);
  if (existingRequest) return existingRequest;
  const request = (async () => {
    const decoded = await verifyFirebaseRequest(req);
    const existing = await findSupabaseUser(decoded.uid);
    // Provision membership only on user sync or when a membership feature needs it.
    return (existing ?? await insertSupabaseUser(decoded)) as SupabaseMembershipUser;
  })();
  requiredRequests.set(req, request);
  return request;
}

export async function getActiveSupabaseMembership(userId: string) {
  return findSupabaseMembership(userId);
}

export function isMembershipUser(
  user: SupabaseMembershipUser,
  membership: SupabaseMembershipRow | null
) {
  return user.status.toLowerCase() === "active" && isActiveMembership(membership);
}

import type { FastifyRequest } from "fastify";
import { adminAuth } from "../lib/firebaseAdmin.js";
import { supabaseAdmin } from "../lib/supabaseAdmin.js";

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
};

export type GatewayUserProfile = {
  uid: string;
  supabaseUid: string;
  email: string | null;
  nickname: string;
  imageUrl: string | null;
  createdAt: number;
};

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

function toGatewayUserProfile(
  row: SupabaseUserRow,
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
    createdAt: new Date(row.created_at).getTime(),
  };
}

async function findSupabaseUser(firebaseUid: string) {
  const { data, error } = await supabaseAdmin
    .from("users")
    .select("*")
    .eq("firebase_uid", firebaseUid)
    .limit(1)
    .maybeSingle();

  if (error) {
    throw new Error(`Failed to fetch Supabase user: ${error.message}`);
  }

  return data as SupabaseUserRow | null;
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

export async function verifyFirebaseRequest(req: FastifyRequest) {
  const token = getBearerToken(req);
  if (!token) {
    throw new Error("Missing Firebase ID token");
  }

  return (await adminAuth.verifyIdToken(token)) as FirebaseToken;
}

export async function syncSupabaseUser(
  decoded: FirebaseToken,
  input?: SyncUserInput
) {
  const existing = await findSupabaseUser(decoded.uid);
  const row = existing
    ? await updateSupabaseUser(existing, decoded, input)
    : await insertSupabaseUser(decoded, input);

  return toGatewayUserProfile(row, input);
}

export async function getOptionalSupabaseUserId(req: FastifyRequest) {
  const token = getBearerToken(req);
  if (!token) return null;

  try {
    const decoded = (await adminAuth.verifyIdToken(token)) as FirebaseToken;
    const existing = await findSupabaseUser(decoded.uid);

    if (existing) {
      return existing.id;
    }

    const created = await insertSupabaseUser(decoded);
    return created.id;
  } catch {
    return null;
  }
}

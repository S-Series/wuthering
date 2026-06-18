import { auth } from "@/firebase/firebase";
import type { UserProfile } from "@/firebase/firebase";
import type { CharacterDataSnapshot } from "@/stores/characterDataStorage";

export type CloudSyncResult =
  | { ok: true; updatedAt: string | null }
  | { ok: false; reason: "login-required" | "membership-required" | "request-failed"; message: string };

export function isMembershipUser(user: UserProfile | null) {
  if (!user) return false;

  const status = user.status?.toLowerCase() ?? "active";
  const membershipLevel = user.membershipLevel ?? 0;
  const expiresAt = user.membershipExpiresAt;

  if (status !== "active") return false;
  if (!user.isMember && membershipLevel <= 0) return false;
  if (!expiresAt) return true;

  return new Date(expiresAt).getTime() > Date.now();
}

export async function uploadCharacterCloudData(
  data: CharacterDataSnapshot
): Promise<CloudSyncResult> {
  const gatewayUrl = import.meta.env.VITE_GATEWAY_URL;

  if (!gatewayUrl) {
    return {
      ok: false,
      reason: "request-failed",
      message: "VITE_GATEWAY_URL is missing",
    };
  }

  const user = auth.currentUser;

  if (!user) {
    return {
      ok: false,
      reason: "login-required",
      message: "로그인이 필요합니다.",
    };
  }

  const idToken = await user.getIdToken();
  const response = await fetch(`${gatewayUrl}/api/character-data`, {
    method: "PUT",
    headers: {
      "Content-Type": "application/json",
      Authorization: `Bearer ${idToken}`,
    },
    body: JSON.stringify({ data }),
  });

  if (response.status === 403) {
    return {
      ok: false,
      reason: "membership-required",
      message: "멤버십 기능입니다.",
    };
  }

  if (response.status === 401) {
    return {
      ok: false,
      reason: "login-required",
      message: "로그인이 필요합니다.",
    };
  }

  if (!response.ok) {
    return {
      ok: false,
      reason: "request-failed",
      message: `클라우드 동기화에 실패했습니다. (${response.status})`,
    };
  }

  const body = (await response.json()) as { updatedAt?: string | null };

  return {
    ok: true,
    updatedAt: body.updatedAt ?? null,
  };
}

import { auth } from "@/firebase/firebase";
import type { UserProfile } from "@/firebase/firebase";
import type { CharacterId } from "@/datas/characterStats";
import type { CharacterData } from "@/types/character.type";
import type { CharacterDataSnapshot } from "@/stores/characterDataStorage";

export type CloudSyncResult =
  | { ok: true; updatedAt: string | null }
  | { ok: false; reason: "login-required" | "membership-required" | "request-failed"; message: string };

export type CloudDownloadResult =
  | { ok: true; data: CharacterDataSnapshot; updatedAt: string | null }
  | { ok: false; reason: "login-required" | "membership-required" | "request-failed"; message: string };

export function isMembershipUser(user: UserProfile | null) {
  if (!user) return false;

  const status = user.status?.toLowerCase() ?? "active";
  const expiresAt = user.membershipExpiresAt;

  if (status !== "active") return false;
  if (!expiresAt) return true;

  return new Date(expiresAt).getTime() > Date.now();
}

export async function uploadCharacterCloudData(
  data: CharacterDataSnapshot | CharacterData,
  characterId?: CharacterId,
): Promise<CloudSyncResult> {
  const gatewayUrl = import.meta.env.VITE_GATEWAY_URL;

  if (!gatewayUrl) {
    return {
      ok: false,
      reason: "request-failed",
      message: "VITE_GATEWAY_URL is missing",
    };
  }

  const user = auth?.currentUser ?? null;

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
    body: JSON.stringify({ data, characterId }),
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

export async function downloadCharacterCloudData(
  characterId?: CharacterId
): Promise<CloudDownloadResult> {
  const gatewayUrl = import.meta.env.VITE_GATEWAY_URL;

  if (!gatewayUrl) {
    return {
      ok: false,
      reason: "request-failed",
      message: "VITE_GATEWAY_URL is missing",
    };
  }

  const user = auth?.currentUser ?? null;

  if (!user) {
    return {
      ok: false,
      reason: "login-required",
      message: "로그인이 필요합니다.",
    };
  }

  const idToken = await user.getIdToken();
  const url = new URL(`${gatewayUrl}/api/character-data`);

  if (characterId) {
    url.searchParams.set("characterId", characterId);
  }

  const response = await fetch(url.toString(), {
    method: "GET",
    headers: {
      Authorization: `Bearer ${idToken}`,
    },
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
      message: `클라우드 데이터를 불러오지 못했습니다. (${response.status})`,
    };
  }

  const body = (await response.json()) as {
    data?: unknown;
    updatedAt?: string | null;
  };

  return {
    ok: true,
    data:
      body.data && typeof body.data === "object" && !Array.isArray(body.data)
        ? body.data as CharacterDataSnapshot
        : {},
    updatedAt: body.updatedAt ?? null,
  };
}

import { doc, getDoc, setDoc } from "firebase/firestore";
import { db } from "./firebase";
import { characterStat, type CharacterId } from "@/datas/characterStats";

const GAME_SERVERS = ["Asia", "Europe", "America", "HMT (HK, MO, TW)", "Sea"] as const;
export type GameServer = typeof GAME_SERVERS[number];

function isGameServer(value: unknown): value is GameServer {
  return typeof value === "string" && GAME_SERVERS.includes(value as GameServer);
}

function isCharacterId(value: unknown): value is CharacterId {
  return typeof value === "string" && value in characterStat;
}

export type GameProfile = {
  uid: string;
  server: GameServer | null;
  gameUid: string | null;
  gameLevel: number;
  characterId: CharacterId | null;
  updatedAt: number;
};

function createDefaultGameProfile(uid: string): GameProfile {
  return {
    uid,
    server: null,
    gameUid: null,
    gameLevel: 1,
    characterId: null,
    updatedAt: Date.now(),
  };
}

export function normalizeGameProfile(raw: unknown, uid: string): GameProfile {
  const data =
    raw && typeof raw === "object"
      ? (raw as Record<string, unknown>)
      : {};

  return {
    uid,
    server: isGameServer(data.server) ? data.server : null,
    gameUid: typeof data.gameUid === "string" ? data.gameUid : null,
    gameLevel: typeof data.gameLevel === "number" ? data.gameLevel : 1,
    characterId: isCharacterId(data.characterId) ? data.characterId : null,
    updatedAt: typeof data.updatedAt === "number" ? data.updatedAt : Date.now(),
  };
}

export async function getGameProfile(uid: string): Promise<GameProfile> {
  const ref = doc(db, "gameProfiles", uid);
  const snap = await getDoc(ref);

  if (!snap.exists()) {
    return createDefaultGameProfile(uid);
  }

  return normalizeGameProfile(snap.data(), uid);
}

export async function saveUserNickname(uid: string, nickname: string) {
  await setDoc(
    doc(db, "users", uid),
    { nickname: nickname.trim() },
    { merge: true }
  );
}

export async function saveGameProfile(
  uid: string,
  next: Partial<Omit<GameProfile, "uid">>
): Promise<GameProfile> {
  const ref = doc(db, "gameProfiles", uid);
  const prev = await getGameProfile(uid);

  const merged: GameProfile = {
    ...prev,
    ...next,
    uid,
    updatedAt: Date.now(),
  };

  await setDoc(ref, merged);

  return merged;
}
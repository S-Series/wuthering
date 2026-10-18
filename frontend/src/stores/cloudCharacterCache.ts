import type { CharacterId } from "@/datas/characterStats";
import type { CharacterDataSnapshot } from "@/stores/characterDataStorage";

export type CloudCharacterDataCache = {
  status: "idle" | "loading" | "success" | "error";
  data: CharacterDataSnapshot;
  updatedAt: string | null;
  fetchedForUid: string | null;
  loadedAll: boolean;
  loadedCharacterIds: CharacterId[];
};

export function hasCloudSnapshot(cache: CloudCharacterDataCache, uid: string, characterId?: CharacterId) {
  return cache.fetchedForUid === uid && cache.status === "success" &&
    (cache.loadedAll || Boolean(characterId && cache.loadedCharacterIds.includes(characterId)));
}

export function mergeCloudSnapshot(
  previous: CloudCharacterDataCache,
  uid: string,
  data: CharacterDataSnapshot,
  updatedAt: string | null,
  characterId?: CharacterId,
): CloudCharacterDataCache {
  const sameUser = previous.fetchedForUid === uid;
  const merged = characterId ? { ...(sameUser ? previous.data : {}) } : { ...data };
  if (characterId) {
    if (data[characterId]) merged[characterId] = data[characterId];
    else delete merged[characterId];
  }
  return {
    status: "success", data: merged, updatedAt, fetchedForUid: uid,
    loadedAll: !characterId || (sameUser && previous.loadedAll),
    loadedCharacterIds: characterId
      ? [...new Set([...(sameUser ? previous.loadedCharacterIds : []), characterId])]
      : [],
  };
}

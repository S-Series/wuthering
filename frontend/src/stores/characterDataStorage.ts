import type { CharacterId } from "@/datas/characterStats";
import type { CharacterData } from "@/types/character.type";

export const CHARACTER_DATA_STORAGE_KEY = "wm-character-data";

export type CharacterDataSnapshot = Partial<Record<CharacterId, CharacterData>>;

export function readCharacterDataSnapshot(): CharacterDataSnapshot {
  try {
    const raw = localStorage.getItem(CHARACTER_DATA_STORAGE_KEY);
    if (!raw) return {};

    const parsed = JSON.parse(raw);
    if (!parsed || typeof parsed !== "object" || Array.isArray(parsed)) {
      return {};
    }

    return parsed as CharacterDataSnapshot;
  } catch {
    return {};
  }
}

import { characterIds } from "@/datas/characters";
import type { CharacterId } from "@/datas/characterStats";

// Retain the original key to migrate favorites created before cloud support.
export const CHARACTER_FAVORITES_STORAGE_KEY = "wuthering.characters.favorites";

export function readFavoriteCharacters(): CharacterId[] {
  try {
    const saved: unknown = JSON.parse(localStorage.getItem(CHARACTER_FAVORITES_STORAGE_KEY) ?? "[]");
    if (!Array.isArray(saved)) return [];
    return characterIds.filter(id => saved.includes(id));
  } catch {
    return [];
  }
}

export function writeFavoriteCharacters(favorites: readonly CharacterId[]) {
  try {
    localStorage.setItem(CHARACTER_FAVORITES_STORAGE_KEY, JSON.stringify(favorites));
  } catch { /* In-memory favorites remain usable when browser storage is unavailable. */ }
}

/** A missing legacy cloud value preserves local state; an explicit false clears it. */
export function resolveCharacterFavorite(saved: unknown, fallback = false): boolean {
  return typeof saved === "boolean" ? saved : fallback;
}

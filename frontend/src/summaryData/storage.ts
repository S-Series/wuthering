import type { CharacterSummaryStore } from "./types";

const STORAGE_KEY = "character_stat_data";
const VERSION = 1;
export const CHARACTER_SUMMARY_UPDATED_EVENT = "wuthering:character-summary-updated";

export function loadSummaryStore(): CharacterSummaryStore {
  const raw = localStorage.getItem(STORAGE_KEY);
  if (!raw) {
    return { version: VERSION, data: {} };
  }

  try {
    const parsed = JSON.parse(raw) as CharacterSummaryStore;
    if (parsed.version !== VERSION) {
      return { version: VERSION, data: {} };
    }
    return parsed;
  } catch {
    return { version: VERSION, data: {} };
  }
}

export function saveSummaryStore(store: CharacterSummaryStore) {
  localStorage.setItem(STORAGE_KEY, JSON.stringify(store));
}

export function saveCharacterScores(scores: Record<string, number>) {
  const now = Date.now();

  saveSummaryStore({
    version: VERSION,
    data: Object.fromEntries(
      Object.entries(scores).map(([characterId, score]) => [
        characterId,
        {
          characterId,
          score,
          updatedAt: now,
        },
      ])
    ),
  });
}

export function saveCharacterScore(
  characterId: string,
  score: number
) {
  const store = loadSummaryStore();

  store.data[characterId] = {
    characterId,
    score,
    updatedAt: Date.now(),
  };

  saveSummaryStore(store);
}

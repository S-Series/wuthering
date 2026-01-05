import type { CharacterSummaryStore } from "./types";

const STORAGE_KEY = "character_stat_data";
const VERSION = 1;

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

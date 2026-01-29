import type { CharacterSummary } from "./types";
import { loadSummaryStore, saveSummaryStore } from "./storage";

export function updateCharacterSummary(
  characterId: string,
  score: number
) {
  const store = loadSummaryStore();

  const summary: CharacterSummary = {
    characterId,
    score,
    updatedAt: Date.now(),
  };

  store.data[characterId] = summary;
  saveSummaryStore(store);
}

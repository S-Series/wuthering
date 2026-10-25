import { characterIds } from '@/datas/characters';
import { harmony, type HarmonyId } from '@/datas/harmonies';
import { calcAllEchoScore, calcFinalScore, calcFinalStat } from '@/runtime/characterData.helpers';
import type { CharacterDataSnapshot } from '@/stores/characterDataStorage';
import { CHARACTER_SUMMARY_UPDATED_EVENT, saveCharacterScores } from './storage';

export const NOTICE_SCORE_REFRESH_KEY = 'wuthering.homeNotice.scoresRecalculatedId';

/** Rebuild the summary cache once per notice, using the same equipped gear and active sets as the card. */
export function refreshScoresForNotice(noticeId: number, characters: CharacterDataSnapshot): boolean {
  const version = String(noticeId);
  if (localStorage.getItem(NOTICE_SCORE_REFRESH_KEY) === version) return false;

  const scores = Object.fromEntries(characterIds.map(id => {
    const data = characters[id];
    if (!data) return [id, 0];
    const counts: Partial<Record<HarmonyId, number>> = {};
    for (const index of data.echoDataIndex.slice(0, 5)) {
      const setId = data.echoData[index]?.setId;
      if (setId && Object.prototype.hasOwnProperty.call(harmony, setId)) counts[setId] = (counts[setId] ?? 0) + 1;
    }
    const activeSets = Object.fromEntries(Object.entries(counts).map(([id, count]) => [
      id, Math.max(0, ...harmony[id as HarmonyId].option.filter(option => count >= option.count).map(option => option.count)),
    ])) as Partial<Record<HarmonyId, number>>;
    const stats = calcFinalStat(data, data.echoDataIndex, activeSets);
    const score = calcFinalScore(data, stats, data.weaponId, calcAllEchoScore(data))[1];
    if (!Number.isFinite(score)) throw new Error(`Cannot recalculate score for ${id}`);
    return [id, score];
  }));

  // Record completion only after the entire calculation and cache write succeed.
  saveCharacterScores(scores);
  localStorage.setItem(NOTICE_SCORE_REFRESH_KEY, version);
  window.dispatchEvent(new Event(CHARACTER_SUMMARY_UPDATED_EVENT));
  return true;
}

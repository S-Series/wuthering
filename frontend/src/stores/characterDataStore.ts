import { defineStore } from "pinia";
import { ref, computed, watch } from "vue";

import { character } from "@/datas/characters";
import { type CharacterId } from "@/datas/characterStats";
import { createEmptyCharacterData, type CharacterData, type CharacterStat } from "@/types/character.type";
import { calcBaseStat, calcFinalStat } from "@/runtime/characterData.helpers";
import { characterScoreSheet } from "@/datas/characterScoreSheet";
import { FixedStats } from "@/datas/stats";
import { saveCharacterScore } from "@/summaryData/storage";
import { harmony, type HarmonyId } from "@/datas/echos";

type ScoreList = [
  [number, number], [number, number], [number, number], [number, number], [number, number],
  [number, number], [number, number], [number, number], [number, number], [number, number],
];

const STORAGE_KEY = "wm-character-data";

const normalizeCharacterData = (
  id: CharacterId,
  savedData?: Partial<CharacterData>
): CharacterData => {
  const base = createEmptyCharacterData(id);
  if (!savedData) return base;

  const safeEchoData = Array.from({ length: 10 }, (_, index) => {
    const baseEcho = base.echoData[index];
    const savedEcho = savedData.echoData?.[index];
    return {
      ...baseEcho,
      ...savedEcho,
      echoId: savedEcho?.echoId ?? baseEcho.echoId ?? "",
      setId: savedEcho?.setId ?? baseEcho.setId ?? "",
      cost: savedEcho?.cost ?? baseEcho.cost,
      mainOption: {
        ...baseEcho.mainOption,
        ...savedEcho?.mainOption,
        statId: savedEcho?.mainOption?.statId ?? baseEcho.mainOption.statId ?? "dummy",
        statValue: savedEcho?.mainOption?.statValue ?? baseEcho.mainOption.statValue ?? -1,
      },
      subOptions: Array.from({ length: 5 }, (_, subIndex) => {
        const baseSub = baseEcho.subOptions[subIndex];
        const savedSub = savedEcho?.subOptions?.[subIndex];
        return {
          ...baseSub,
          ...savedSub,
          statId: savedSub?.statId ?? baseSub.statId ?? "dummy",
          statValue: savedSub?.statValue ?? baseSub.statValue ?? -1,
        };
      }),
    };
  }) as CharacterData["echoData"];

  const safeEchoIndex = (() => {
    const used = new Set<number>();
    const result = Array.from({ length: 10 }, (_, index) => {
      const v = savedData.echoDataIndex?.[index] ?? base.echoDataIndex[index];
      if (typeof v === "number" && Number.isInteger(v) && v >= 0 && v < 10 && !used.has(v)) {
        used.add(v);
        return v;
      }
      return null;
    });
    const missing = Array.from({ length: 10 }, (_, i) => i).filter((v) => !used.has(v));
    let ptr = 0;
    return result.map((v) => (v !== null ? v : missing[ptr++])) as CharacterData["echoDataIndex"];
  })();

  const safeConstell = Array.from(
    { length: base.constell.length },
    (_, index) => savedData.constell?.[index] ?? base.constell[index]
  ) as CharacterData["constell"];

  return { ...base, ...savedData, weaponId: savedData.weaponId ?? base.weaponId, constell: safeConstell, echoData: safeEchoData, echoDataIndex: safeEchoIndex };
};

export const useCharacterStore = defineStore("character", () => {
  const ALL_IDS = Object.keys(character) as CharacterId[];

  const loadAllCharacters = (): Record<CharacterId, CharacterData> => {
    let saved: Partial<Record<CharacterId, CharacterData>> = {};
    try {
      const raw = localStorage.getItem(STORAGE_KEY);
      if (raw) saved = JSON.parse(raw) as Partial<Record<CharacterId, CharacterData>>;
    } catch { saved = {}; }
    return Object.fromEntries(
      ALL_IDS.map((id) => [id, normalizeCharacterData(id, saved[id])])
    ) as Record<CharacterId, CharacterData>;
  };

  const ALL_CHARACTERS = ref<Record<CharacterId, CharacterData>>(loadAllCharacters());
  const characterId = ref<CharacterId>(
    (localStorage.getItem("selectedCharacterId") as CharacterId) || "rover_spectro"
  );

  watch(ALL_CHARACTERS, (v) => localStorage.setItem(STORAGE_KEY, JSON.stringify(v)), { deep: true });
  watch(characterId, (v) => {
    if (v !== "rover_spectro") localStorage.setItem("selectedCharacterId", v);
  });

  const characterData = computed<CharacterData>(() =>
    ALL_CHARACTERS.value[characterId.value] ?? createEmptyCharacterData(characterId.value)
  );

  const characterBaseStat = computed<CharacterStat | null>(() => calcBaseStat(characterData.value));
  const characterFinalStat = computed<CharacterStat | null>(() => calcFinalStat(characterData.value));

  const equipmentScore = computed<ScoreList>(() => {
    const echoData = characterData.value.echoData;
    const scoreData = characterScoreSheet[characterId.value];
    const empty: ScoreList = [[0,0],[0,0],[0,0],[0,0],[0,0],[0,0],[0,0],[0,0],[0,0],[0,0]];
    if (!scoreData || !echoData) return empty;

    const resList: ScoreList = [[0,0],[0,0],[0,0],[0,0],[0,0],[0,0],[0,0],[0,0],[0,0],[0,0]];
    const ret: ScoreList = [[0,0],[0,0],[0,0],[0,0],[0,0],[0,0],[0,0],[0,0],[0,0],[0,0]];

    for (let i = 0; i < 10; i++) {
      const loopData = echoData[i].subOptions;
      const score: [number, number] = [
        (() => {
          let temp = 0;
          const idx_A = loopData.findIndex((item) => item.statId === FixedStats.critRate.id);
          if (idx_A !== -1) temp += loopData[idx_A].statValue * 2;
          const idx_B = loopData.findIndex((item) => item.statId === FixedStats.critDmg.id);
          if (idx_B !== -1) temp += loopData[idx_B].statValue;
          return temp;
        })(),
        (() => {
          let temp = 0;
          for (let j = 0; j < loopData.length; j++) {
            if (loopData[j].statId === FixedStats.resonanceBns.id) {
              resList[i] = [i, loopData[j].statValue];
              continue;
            }
            const multiply = scoreData[loopData[j].statId] ?? 0;
            temp += loopData[j].statValue * multiply;
          }
          return temp;
        })(),
      ];
      ret[i] = score;
    }

    const sortedResList = [...resList].sort((a, b) => b[1] - a[1]) as ScoreList;
    for (let i = 0; i < scoreData.maxResCount; i++) {
      ret[sortedResList[i][0]][1] += (scoreData.resonanceBns ?? 0) * sortedResList[i][1];
    }

    const scoreList = [
      11.6 * (scoreData.hpPct ?? 0), 11.6 * (scoreData.atkPct ?? 0),
      14.7 * (scoreData.defPct ?? 0), 10.5 * (scoreData.critRate ?? 0),
      21.0 * (scoreData.critDmg ?? 0), 11.6 * (scoreData.basicBns ?? 0),
      11.6 * (scoreData.heavyBns ?? 0), 11.6 * (scoreData.skillBns ?? 0),
      11.6 * (scoreData.liberationBns ?? 0),
    ];
    const score = [...scoreList].sort((a, b) => b - a).slice(0, 5).reduce((s, v) => s + v, 0);
    const scoreWithRes = [...scoreList, 12.4 * (scoreData.resonanceBns ?? 0)]
      .sort((a, b) => b - a).slice(0, 5).reduce((s, v) => s + v, 0);
    const magicNumber = 100 / ((score * (5 - scoreData.maxResCount) + scoreWithRes * scoreData.maxResCount) / 5);

    for (let i = 0; i < 10; i++) ret[i][1] = Math.ceil(ret[i][1] * 10 * magicNumber) / 10;
    return ret;
  });

  const harmonySet = computed<Record<HarmonyId, number>>(() => {
    const echoData = characterData.value.echoData;
    const ret = Object.fromEntries(Object.values(harmony).map((item) => [item.id, 0])) as Record<HarmonyId, number>;
    for (const item of echoData) {
      if (!item || !item.setId) continue;
      if (!Object.prototype.hasOwnProperty.call(ret, item.setId)) continue;
      ret[item.setId] += 1;
    }
    return ret;
  });

  watch([() => characterData.value.echoDataIndex, equipmentScore], ([idx]) => {
    const finalScore =
      equipmentScore.value[idx[0]][1] + equipmentScore.value[idx[1]][1] +
      equipmentScore.value[idx[2]][1] + equipmentScore.value[idx[3]][1] +
      equipmentScore.value[idx[4]][1];
    saveCharacterScore(characterId.value, finalScore);
  });

  function setCharacterId(id: CharacterId) { characterId.value = id; }

  function patchCharacterData(patch: Partial<CharacterData>) {
    const id = characterId.value;
    ALL_CHARACTERS.value = {
      ...ALL_CHARACTERS.value,
      [id]: {
        ...(ALL_CHARACTERS.value[id] ?? createEmptyCharacterData(id)),
        ...patch,
      },
    };
  }

  return {
    characterId, characterData, characterBaseStat, characterFinalStat,
    equipmentScore, harmonySet,
    setCharacterId, patchCharacterData,
  };
});

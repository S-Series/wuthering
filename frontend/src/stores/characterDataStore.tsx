import { createContext, useContext, useEffect, useMemo, useState } from "react";

import { character } from "@/datas/characters";
import { type CharacterId } from "@/datas/characterStats";
import { createEmptyCharacterData, type CharacterData, type CharacterStat } from "@/types/character.type";
import { calcBaseStat, calcFinalStat } from "@/runtime/characterData.helpers";
import { characterScoreSheet } from "@/datas/characterScoreSheet";
import { FixedStats } from "@/datas/stats";
import { saveCharacterScore } from "@/summaryData/storage";
import { harmony, type HarmonyId } from "@/datas/echos";

type ScoreList = [
  [number, number],
  [number, number],
  [number, number],
  [number, number],
  [number, number],
  [number, number],
  [number, number],
  [number, number],
  [number, number],
  [number, number]
]

type ContextType = {
  characterId: CharacterId;
  setCharacterId: React.Dispatch<React.SetStateAction<CharacterId>>;
  characterData: CharacterData;
  patchCharacterData: (patch: Partial<CharacterData>) => void;
  characterBaseStat: CharacterStat | null;
  characterFinalStat: CharacterStat | null;
  equipmentScore: ScoreList;
  harmonySet: Record<HarmonyId, number>;
};

const CharacterContext = createContext<ContextType | null>(null);

const STORAGE_KEY = "wm-character-data";

const normalizeCharacterData = (
  id: CharacterId,
  savedData?: Partial<CharacterData>
): CharacterData => {
  const base = createEmptyCharacterData(id);

  if (!savedData) return base;

  const safeEchoData = Array.from(
    { length: 10 },
    (_, index) => savedData.echoData?.[index] ?? base.echoData[index]
  ) as CharacterData["echoData"];

  const safeEchoIndex = (() => {
    const used = new Set<number>();

    const result = Array.from({ length: 10 }, (_, index) => {
      const v = savedData.echoDataIndex?.[index] ?? base.echoDataIndex[index];

      if (v >= 0 && v < 10 && !used.has(v)) {
        used.add(v);
        return v;
      }

      return null;
    });

    const missing = Array.from({ length: 10 }, (_, i) => i).filter(v => !used.has(v));

    let ptr = 0;

    return result.map(v => {
      if (v !== null) return v;
      return missing[ptr++];
    }) as CharacterData["echoDataIndex"];
  })();

  return {
    ...base,
    ...savedData,
    echoData: safeEchoData,
    echoDataIndex: safeEchoIndex,
  };
};

export function CharacterProvider({ children }: { children: React.ReactNode }) {

  const ALL_IDS = useMemo(() => Object.keys(character) as CharacterId[], []);
  const [ALL_CHARACTERS, setALL_CHARACTERS] = useState<Record<CharacterId, CharacterData>>(() => {
    let saved: Partial<Record<CharacterId, CharacterData>> = {};

    try {
      const raw = localStorage.getItem(STORAGE_KEY);
      if (raw) saved = JSON.parse(raw);
    } catch {
      saved = {};
    }

    const full = Object.fromEntries(
      ALL_IDS.map((id) => [
        id,
        normalizeCharacterData(id, saved[id]),
      ])
    ) as Record<CharacterId, CharacterData>;

    return full;
  });

  const patchCharacterData = (patch: Partial<CharacterData>) => {
    setALL_CHARACTERS((prev) => ({
      ...prev,
      [characterId]: {
        ...(prev[characterId] ?? createEmptyCharacterData(characterId)),
        ...patch,
      },
    }));
  };

  useEffect(() => {
    localStorage.setItem(STORAGE_KEY, JSON.stringify(ALL_CHARACTERS));
  }, [ALL_CHARACTERS]);

  const [characterId, setCharacterId] = useState<CharacterId>("rover_spectro");
  const characterData = useMemo<CharacterData>(() => {
    return ALL_CHARACTERS[characterId] ?? createEmptyCharacterData(characterId);
  }, [ALL_CHARACTERS, characterId]);

  const characterBaseStat = useMemo<CharacterStat | null>(() => {
    return calcBaseStat(characterData);
  }, [characterData]);

  const characterFinalStat = useMemo<CharacterStat | null>(() => {
    return calcFinalStat(characterData);
  }, [characterData]);

  const equipmentScore = useMemo<ScoreList>(() => {
    const echoData = characterData.echoData;
    const scoreData = characterScoreSheet[characterId];

    if (!scoreData || !echoData) return [[0, 0], [0, 0], [0, 0], [0, 0], [0, 0], [0, 0], [0, 0], [0, 0], [0, 0], [0, 0]];

    let resList: ScoreList = [[0, 0], [0, 0], [0, 0], [0, 0], [0, 0], [0, 0], [0, 0], [0, 0], [0, 0], [0, 0]];
    let ret: ScoreList = [[0, 0], [0, 0], [0, 0], [0, 0], [0, 0], [0, 0], [0, 0], [0, 0], [0, 0], [0, 0]];

    for (let i = 0; i < 10; i++) {
      const loopData = echoData[i].subOptions;
      const score: [number, number] = [
        (() => {
          let temp = 0;
          const idx_A = loopData.findIndex((item) => item.statId === FixedStats.critRate.id);
          if (idx_A !== -1) { temp += loopData[idx_A].statValue * 2 };
          const idx_B = loopData.findIndex((item) => item.statId === FixedStats.critDmg.id);
          if (idx_B !== -1) { temp += loopData[idx_B].statValue };
          return temp;
        })(),
        (() => {
          let temp = 0;
          for (let j = 0; j < loopData.length; j++) {
            if (loopData[j].statId === FixedStats.resonanceBns.id) {
              //resList[j] = [i, loopData[j].statValue];
              resList[i] = [i, loopData[j].statValue];
              continue;
            }
            const multiply = scoreData[loopData[j].statId] ?? 0;
            temp += loopData[j].statValue * multiply;
          }
          return temp;
        })(),
      ]
      ret[i] = score;
    }

    const sortedResList = [...resList].sort((a, b) => b[1] - a[1]) as ScoreList;
    for (let i = 0; i < scoreData.maxResCount; i++) {
      ret[sortedResList[i][0]][1] += (scoreData.resonanceBns ?? 0) * sortedResList[i][1];
    }

    const scoreList = [
      // higest value * score value = maxScore
      11.6 * (scoreData.hpPct ?? 0),
      11.6 * (scoreData.atkPct ?? 0),
      14.7 * (scoreData.defPct ?? 0),
      10.5 * (scoreData.critRate ?? 0),
      21.0 * (scoreData.critDmg ?? 0),
      11.6 * (scoreData.basicBns ?? 0),
      11.6 * (scoreData.heavyBns ?? 0),
      11.6 * (scoreData.skillBns ?? 0),
      11.6 * (scoreData.liberationBns ?? 0),
    ];
    const score = [...scoreList].sort((a, b) => b - a).slice(0, 5).reduce((sum, value) => sum + value, 0);
    const scoreWithRes = [...scoreList, 12.4 * (scoreData.resonanceBns ?? 0)].sort((a, b) => b - a).slice(0, 5).reduce((sum, value) => sum + value, 0);

    const magicNumber = 100 / ((score * (5 - scoreData.maxResCount) + scoreWithRes * scoreData.maxResCount) / 5);

    for (let i = 0; i < 10; i++) {
      ret[i][1] = Math.ceil(ret[i][1] * 10 * magicNumber) / 10;
    }

    return ret;
  }, [characterId, characterData.echoData])

  const harmonySet = useMemo<Record<HarmonyId, number>>(() => {
    const echoData = characterData.echoData;
    let ret = Object.fromEntries(Object.values(harmony).map((item) => [item.id, 0])
    ) as Record<HarmonyId, number>;

    for (const item of echoData) {
      if (!item || !item.setId) continue;
      if (!Object.prototype.hasOwnProperty.call(ret, item.setId)) continue;
      ret[item.setId] += 1;
    }

    return ret;
  }, [characterData.echoData]);

  //$ ============================================

  useEffect(() => {
    if (characterId === "rover_spectro") return;
    localStorage.setItem("selectedCharacterId", characterId);
  }, [characterId])

  useEffect(() => {
    saveCharacterScore(characterId, equipmentScore[0][1] + equipmentScore[1][1] + equipmentScore[2][1] + equipmentScore[3][1] + equipmentScore[4][1]
    )
  }, [equipmentScore])

  const values = {
    characterId,
    setCharacterId,
    characterData,
    patchCharacterData,
    characterBaseStat,
    characterFinalStat,
    equipmentScore,
    harmonySet
  };

  return (
    <CharacterContext.Provider value={values}>
      {children}
    </CharacterContext.Provider>
  );
}

export function useCharacter() {
  const ctx = useContext(CharacterContext);
  if (!ctx) throw new Error("useCharacter must be used inside CharacterProvider");
  return ctx;
}

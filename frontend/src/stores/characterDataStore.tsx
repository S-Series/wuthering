import { createContext, useContext, useEffect, useMemo, useState } from "react";

import { character } from "@/datas/characters";
import { type CharacterId } from "@/datas/characterStats";
import { createEmptyCharacterData, type CharacterData, type CharacterStat } from "@/types/character.type";
import { calcBaseStat, calcFinalStat } from "@/runtime/characterData.helpers";
import { getCharacterScore } from "@/datas/characterScoreSheet";
import { FixedStats } from "@/datas/stats";
import { saveCharacterScore } from "@/summaryData/storage";
import { harmony, type HarmonyId } from "@/datas/harmonies";

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
  harmonySet: Partial<Record<HarmonyId, number>>;
};

const CharacterContext = createContext<ContextType | null>(null);

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
  }) as unknown as CharacterData["echoData"];

  const safeEchoIndex = (() => {
    const used = new Set<number>();

    const result = Array.from({ length: 10 }, (_, index) => {
      const v = savedData.echoDataIndex?.[index] ?? base.echoDataIndex[index];

      if (
        typeof v === "number" &&
        Number.isInteger(v) &&
        v >= 0 &&
        v < 10 &&
        !used.has(v)
      ) {
        used.add(v);
        return v;
      }

      return null;
    });

    const missing = Array.from({ length: 10 }, (_, i) => i).filter(
      (v) => !used.has(v)
    );

    let ptr = 0;

    return result.map((v) => {
      if (v !== null) return v;
      return missing[ptr++];
    }) as CharacterData["echoDataIndex"];
  })();

  const safeConstell = Array.from(
    { length: base.constell.length },
    (_, index) => savedData.constell?.[index] ?? base.constell[index]
  ) as CharacterData["constell"];

  return {
    ...base,
    ...savedData,
    weaponId: savedData.weaponId ?? base.weaponId,
    constell: safeConstell,
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

  const harmonySet = useMemo<Partial<Record<HarmonyId, number>>>(() => {
    const echoData = characterData.echoData;

    const values = Object.fromEntries(
      Object.values(harmony).map((item) => [item.id, 0])
    ) as Record<HarmonyId, number>;

    for (const item of echoData) {
      if (!item?.setId) continue;
      if (!Object.prototype.hasOwnProperty.call(values, item.setId)) continue;
      values[item.setId] += 1;
    }

    const adjusted = Object.fromEntries(
      Object.entries(values)
        .map(([id, count]) => {
          const harmonyId = id as HarmonyId;
          const optionCounts = harmony[harmonyId].option.map((opt) => opt.count);

          const activeCount = optionCounts
            .filter((requiredCount) => count >= requiredCount)
            .sort((a, b) => b - a)[0] ?? 0;

          return [harmonyId, activeCount] as const;
        })
        .filter(([_, activeCount]) => activeCount > 0)
    ) as Partial<Record<HarmonyId, number>>;

    console.log(adjusted);

    return adjusted;
  }, [characterData]);

  const characterBaseStat = useMemo<CharacterStat | null>(() => {
    return calcBaseStat(characterData);
  }, [characterData]);

  const characterFinalStat = useMemo<CharacterStat | null>(() => {
    return calcFinalStat(characterData, harmonySet ?? {});
  }, [characterData]);

  const [compensation, setCompensation] = useState(0);
  const equipmentScore = useMemo<ScoreList>(() => {
    const echoData = characterData.echoData;
    const scoreData = getCharacterScore(
      characterData.characterId,
      characterData.weaponId ?? null,
      characterData.constell[0],
      [
        characterData.echoData[characterData.echoDataIndex[0]],
        characterData.echoData[characterData.echoDataIndex[1]],
        characterData.echoData[characterData.echoDataIndex[2]],
        characterData.echoData[characterData.echoDataIndex[3]],
        characterData.echoData[characterData.echoDataIndex[4]],
      ]
    );

    if (!scoreData || !echoData) return [[0, 0], [0, 0], [0, 0], [0, 0], [0, 0], [0, 0], [0, 0], [0, 0], [0, 0], [0, 0]];
    
    setCompensation(scoreData.scoreComp ?? 0);

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
    
    const resonanceBns = scoreData.resonanceBns ?? 0;
    const pickedList = characterData.echoDataIndex.slice(0, 5);
    const unPickedList = characterData.echoDataIndex.slice(5);

    const picked = pickedList
      .map(i => resList[i])
      .sort((a, b) => b[1] - a[1])
      .slice(0, scoreData.maxResCount);

    const unpicked = unPickedList.map(i => resList[i]);

    for (const [index, value] of [...picked, ...unpicked]) {
      ret[index][1] += resonanceBns * value;
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
     
    const score = [...scoreList].sort((a, b) => b - a)
      .slice(0, 5).reduce((sum, value) => sum + value, 0);

    const scoreWithRes = [...scoreList, 12.4 * (scoreData.resonanceBns ?? 0)]
      .sort((a, b) => b - a).slice(0, 5)
      .reduce((sum, value) => sum + value, 0);

    const magicNumber = 100 / ((score * (5 - scoreData.maxResCount) + scoreWithRes * scoreData.maxResCount) / 5);

    for (let i = 0; i < 10; i++) {
      ret[i][1] = Math.ceil(ret[i][1] * 10 * magicNumber) / 10;
    }

    return ret;
  }, [characterId, characterData.echoData, characterData.echoDataIndex])



  //$ ============================================

  useEffect(() => {
    if (characterId === "rover_spectro") return;
    localStorage.setItem("selectedCharacterId", characterId);
  }, [characterId])

  useEffect(() => {
    const finalScore
      = equipmentScore[characterData.echoDataIndex[0]][1]
      + equipmentScore[characterData.echoDataIndex[1]][1]
      + equipmentScore[characterData.echoDataIndex[2]][1]
      + equipmentScore[characterData.echoDataIndex[3]][1]
      + equipmentScore[characterData.echoDataIndex[4]][1]
      + compensation;
    saveCharacterScore(characterId, finalScore);
  }, [characterData.echoDataIndex, equipmentScore])

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

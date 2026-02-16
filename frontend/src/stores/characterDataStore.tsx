import { createContext, useContext, useEffect, useMemo, useState } from "react";

import { character } from "@/datas/characters";
import { characterStat, type CharacterId } from "@/datas/characterStats";
import { createEmptyCharacterData, type CharacterData, type CharacterStat } from "@/types/character.type";
import { calcBaseStat, calcFinalStat } from "@/runtime/characterData.helpers";

type ContextType = {
  characterId: CharacterId;
  setCharacterId: React.Dispatch<React.SetStateAction<CharacterId>>;
  characterData: CharacterData;
  patchCharacterData: (patch: Partial<CharacterData>) => void;
  characterBaseStat: CharacterStat | null;
  characterFinalStat: CharacterStat | null;
};

const CharacterContext = createContext<ContextType | null>(null);

const STORAGE_KEY = "wm-character-data";

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
      ALL_IDS.map((id) => [id, saved[id] ?? createEmptyCharacterData(id)])
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

  const values = {
    characterId,
    setCharacterId,
    characterData,
    patchCharacterData,
    characterBaseStat,
    characterFinalStat,
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

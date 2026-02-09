import type { CharacterId } from "@/datas/characterStats";
import type { StatId } from "@/datas/stats";
import { create } from "zustand";
import { persist } from "zustand/middleware";

export type SavedCharacter = {
  characterId: CharacterId;

  constellCharacter: 0 | 1 | 2 | 3 | 4 | 5 | 6;
  constellWeapon: 1 | 2 | 3 | 4 | 5;

  weaponId: string | null;

  echoIds: string[];
  statIds: StatId[];
  statValues: number[];
};

export type SaveData = {
  version: 1;
  characters: Partial<Record<CharacterId, SavedCharacter>>;
};

const STORAGE_KEY = "wm-save-data";
const VERSION = 1 as const;

const createEmptySaveData = (): SaveData => ({
  version: VERSION,
  characters: {},
});

type SaveStore = {
  saveData: SaveData;

  // 조회
  getCharacter: (characterId: CharacterId) => SavedCharacter | null;

  // 저장/갱신
  setCharacter: (characterId: CharacterId, data: SavedCharacter) => void;
  upsertCharacter: (characterId: CharacterId, patch: Partial<SavedCharacter>) => void;

  // 삭제
  removeCharacter: (characterId: CharacterId) => void;

  // 전체
  clearAll: () => void;

  // 내보내기/가져오기
  exportJson: () => string;
  importJson: (json: string) => void;
};

export const useSaveStore = create<SaveStore>()(
  persist(
    (set, get) => ({
      saveData: createEmptySaveData(),

      getCharacter: (characterId) => {
        return get().saveData.characters[characterId] ?? null;
      },

      setCharacter: (characterId, data) => {
        set((state) => ({
          saveData: {
            ...state.saveData,
            characters: {
              ...state.saveData.characters,
              [characterId]: data,
            },
          },
        }));
      },

      upsertCharacter: (characterId, patch) => {
        set((state) => {
          const prev = state.saveData.characters[characterId];

          const base: SavedCharacter =
            prev ??
            {
              characterId,
              constellCharacter: 0,
              constellWeapon: 1,
              weaponId: null,
              echoIds: [],
              statIds: [],
              statValues: [],
            };

          const next: SavedCharacter = {
            ...base,
            ...patch,
            characterId,
          };

          return {
            saveData: {
              ...state.saveData,
              characters: {
                ...state.saveData.characters,
                [characterId]: next,
              },
            },
          };
        });
      },

      removeCharacter: (characterId) => {
        set((state) => {
          const { [characterId]: _, ...rest } = state.saveData.characters;
          return {
            saveData: {
              ...state.saveData,
              characters: rest,
            },
          };
        });
      },

      clearAll: () => {
        set({ saveData: createEmptySaveData() });
      },

      exportJson: () => {
        return JSON.stringify(get().saveData);
      },

      importJson: (json) => {
        const parsed = JSON.parse(json) as SaveData;

        if (!parsed || parsed.version !== VERSION || !parsed.characters) {
          return;
        }

        set({ saveData: parsed });
      },
    }),
    {
      name: STORAGE_KEY,
      version: VERSION,
      partialize: (s) => ({ saveData: s.saveData }),
    }
  )
);

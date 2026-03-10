import { type ElementType, type AttackType } from "@/datas/characters";
import type { CharacterId, CharacterStat } from "@/datas/characterStats";
import type { Weapon } from "@/datas/weapon";
import type { WeaponStat } from "@/datas/weaponStats";
import { type EchoRuntime, createEmptyEchoRuntime } from "@/runtime/echo.runtime";

export type WeaponData = Weapon & WeaponStat

export type SelectedCharacterRuntime = {
  characterId: CharacterId | null;
  characterStat: CharacterStat | null;
  weaponData: WeaponData | null;
  constell: [number, number];
  echoes: [
    EchoRuntime,
    EchoRuntime,
    EchoRuntime,
    EchoRuntime,
    EchoRuntime,
    EchoRuntime,
    EchoRuntime,
    EchoRuntime,
    EchoRuntime,
    EchoRuntime
  ];
};

export type CharacterFinalStat = {
  hp: number;
  atk: number;
  def: number;
  resBns: number;
  critRate: number;
  critDmg: number;
  attackBns: Record<AttackType, number>;
  elementBns: Record<ElementType, number>;
};

export const createInitialSelectedCharacterRuntime =
  (): SelectedCharacterRuntime => ({
    characterId: null,
    characterStat: null,
    weaponData: null,
    constell: [0, 0],
    echoes: [
      createEmptyEchoRuntime(4),
      createEmptyEchoRuntime(3),
      createEmptyEchoRuntime(3),
      createEmptyEchoRuntime(1),
      createEmptyEchoRuntime(1),
      createEmptyEchoRuntime(4),
      createEmptyEchoRuntime(3),
      createEmptyEchoRuntime(3),
      createEmptyEchoRuntime(1),
      createEmptyEchoRuntime(1),
    ]
  });

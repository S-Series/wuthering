import { type CharacterId } from "@/datas/characterStats";
import { type WeaponId } from "@/datas/weapon";
import { createEmptyEchoRuntime, type EchoRuntime } from "@/runtime/echo.runtime";

export type CharacterRank = "Empty" | "B" | "A" | "S" | "SS" | "SSS";

export type CharacterData = {
    characterId: CharacterId;
    weaponId: WeaponId | null;
    constell: [number, number];
    echoData: [EchoRuntime, EchoRuntime, EchoRuntime, EchoRuntime, EchoRuntime];
}

export type CharacterStat = {
  hp: number;
  atk: number;
  def: number;
  resonanceBns: number;
  critRate: number;
  critDmg: number;

  aero: number;
  fusion: number;
  glacio: number;
  electro: number;
  havoc: number;
  spectro: number;

  basic: number;
  heavy: number;
  skill: number;
  liberation: number;
  heal: number;

  dummy: number;
};

export const createEmptyCharacterData = (id: CharacterId): CharacterData => ({
    characterId: id,
    weaponId: null,
    constell: [0, 1],
    echoData: [
        createEmptyEchoRuntime(4),
        createEmptyEchoRuntime(3),
        createEmptyEchoRuntime(3),
        createEmptyEchoRuntime(1),
        createEmptyEchoRuntime(1),
    ]
});
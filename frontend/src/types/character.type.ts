import { type CharacterId } from "@/datas/characterStats";
import { type WeaponId } from "@/datas/weapon";
import { createEmptyEchoRuntime, type EchoRuntime } from "@/runtime/echo.runtime";

export type CharacterRank = "Empty" | "B" | "A" | "S" | "SS" | "SSS";

export type CharacterData = {
  characterId: CharacterId;
  weaponId: WeaponId | null;
  constell: [number, number];
  echoData: [
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
  echoDataIndex: [
    number,
    number,
    number,
    number,
    number,
    number,
    number,
    number,
    number,
    number,
  ]
};

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
    createEmptyEchoRuntime(4),
    createEmptyEchoRuntime(3),
    createEmptyEchoRuntime(3),
    createEmptyEchoRuntime(1),
    createEmptyEchoRuntime(1),
  ],
  echoDataIndex: [0, 1, 2, 3, 4, 5, 6, 7, 8, 9],
});

export const getCharacterRank = (score: number):CharacterRank => {
    if (score >= 300) return "SSS"
    else if (score >= 250) return "SS"
    else if (score >= 225) return "S"
    else if (score >= 200) return "A"
    else if (score === 0) return "Empty"
    else return "B"
}

export const getEquipmentRank = (score: number):CharacterRank => {
    if (score >= 65) return "SSS"
    else if (score >= 60) return "SS"
    else if (score >= 55) return "S"
    else if (score >= 50) return "A"
    else if (score === 0) return "Empty"
    else return "B"
}
import { character } from "@/datas/characters";
import { weapon } from "@/datas/weapon";
import { type EchoRuntime } from "@/runtime/echo.runtime";

export type CharacterId = keyof typeof character;
type WeaponLeaf =
  (typeof weapon)[keyof typeof weapon][keyof (typeof weapon)[keyof typeof weapon]];
export type WeaponId = WeaponLeaf["id"];

export type SelectedCharacterRuntime = {
  characterId: CharacterId | null;
  weaponId: WeaponId | null;
  constell: [number, number];
  echoes: [
    EchoRuntime | null,
    EchoRuntime | null,
    EchoRuntime | null,
    EchoRuntime | null,
    EchoRuntime | null
  ];
};

export const createInitialSelectedCharacterRuntime =
  (): SelectedCharacterRuntime => ({
    characterId: null,
    weaponId: null,
    constell: [0, 0],
    echoes: [null, null, null, null, null],
  });

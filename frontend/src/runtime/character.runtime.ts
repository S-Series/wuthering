import { type EchoRuntime } from "./echo.runtime";

export type CharacterRuntime = {
  characterId: string;

  characterResonance: number;

  weapon: {
    weaponId: string;
    weaponResonance: number;
  };

  echoes: {
    slot1: EchoRuntime | null;
    slot2: EchoRuntime | null;
    slot3: EchoRuntime | null;
    slot4: EchoRuntime | null;
    slot5: EchoRuntime | null;
  };
};

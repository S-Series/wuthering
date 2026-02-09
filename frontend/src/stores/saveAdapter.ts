import type { StatId } from "@/datas/stats";
import type { EchoRuntime } from "@/runtime/echo.runtime";
import type { SelectedCharacterRuntime, WeaponData } from "@/runtime/character.runtime";
import type { SavedCharacter } from "@/stores/saveStore";

export const extractSavedCharacter = (runtime: SelectedCharacterRuntime): SavedCharacter | null => {
  const characterId = runtime.characterId;
  if (!characterId) return null;

  const echoIds: string[] = ["", "", "", "", ""];
  const statIds: StatId[] = [];
  const statValues: number[] = [];

  const STAT_PER_ECHO = 6;

  for (let i = 0; i < 5; i++) {
    const echo = runtime.echoes[i];

    if (!echo) {
      echoIds[i] = "";
      for (let k = 0; k < STAT_PER_ECHO; k++) {
        statIds.push("dummy");
        statValues.push(-1);
      }
      continue;
    }

    echoIds[i] = echo.echoId;

    statIds.push(echo.mainOption.statId);
    statValues.push(echo.mainOption.statValue);

    for (const s of echo.subOptions) {
      statIds.push(s.statId);
      statValues.push(s.statValue);
    }
  }

  return {
    characterId,
    constellCharacter: (runtime.constell[0] ?? 0) as 0 | 1 | 2 | 3 | 4 | 5 | 6,
    constellWeapon: (runtime.constell[1] ?? 1) as 1 | 2 | 3 | 4 | 5,
    weaponId: runtime.weaponData?.id ?? null,
    echoIds,
    statIds,
    statValues,
  };
};

const clampConstellCharacter = (v: number): 0 | 1 | 2 | 3 | 4 | 5 | 6 => {
  if (v <= 0) return 0;
  if (v === 1) return 1;
  if (v === 2) return 2;
  if (v === 3) return 3;
  if (v === 4) return 4;
  if (v === 5) return 5;
  return 6;
};

const clampConstellWeapon = (v: number): 1 | 2 | 3 | 4 | 5 => {
  if (v <= 1) return 1;
  if (v === 2) return 2;
  if (v === 3) return 3;
  if (v === 4) return 4;
  return 5;
};

export const hydrateSelectedCharacter = (args: {
  base: SelectedCharacterRuntime;
  saved: SavedCharacter;
  weaponById: (id: string) => WeaponData | null;
  makeEchoRuntime: (echoId: string) => EchoRuntime;
}): SelectedCharacterRuntime => {
  const { base, saved, weaponById, makeEchoRuntime } = args;

  const next: SelectedCharacterRuntime = {
    ...base,
  };

  next.characterId = saved.characterId;

  next.constell = [
    clampConstellCharacter(saved.constellCharacter as number),
    clampConstellWeapon(saved.constellWeapon as number),
  ];

  next.weaponData = saved.weaponId ? weaponById(saved.weaponId) : null;

  const echoes: (EchoRuntime | null)[] = [null, null, null, null, null];

  const STAT_PER_ECHO = 6;

  for (let i = 0; i < 5; i++) {
    const echoId = saved.echoIds[i];
    if (!echoId) {
      echoes[i] = null;
      continue;
    }

    const raw = makeEchoRuntime(echoId);
    const echo: EchoRuntime = {
      ...raw,
      mainOption: { ...raw.mainOption },
      subOptions: raw.subOptions.map((s) => ({ ...s })) as EchoRuntime["subOptions"],
    };

    const baseCursor = i * STAT_PER_ECHO;

    const mainId = saved.statIds[baseCursor];
    const mainVal = saved.statValues[baseCursor];
    if (mainId !== undefined) echo.mainOption.statId = mainId;
    if (mainVal !== undefined) echo.mainOption.statValue = mainVal;

    for (let j = 0; j < 5; j++) {
      const idx = baseCursor + 1 + j;
      const sid = saved.statIds[idx];
      const sval = saved.statValues[idx];
      if (sid !== undefined) echo.subOptions[j].statId = sid;
      if (sval !== undefined) echo.subOptions[j].statValue = sval;
    }

    echoes[i] = echo;
  }

  next.echoes = echoes as SelectedCharacterRuntime["echoes"];
  return next;
};

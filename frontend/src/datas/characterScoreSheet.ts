import type { EchoRuntime } from "@/runtime/echo.runtime";
import type { CharacterId } from "./characterStats";
import { FixedStats, type StatId } from "./stats";
import type { WeaponId } from "./weapon";

type StatWeightMap = Partial<Record<StatId, number>>;
export interface CharacterScore extends StatWeightMap {
  maxResCount: number; //$ Legacy data (UnUse)
  isCritInvalid?: boolean;
  scoreComp?: number;
}

const BaseSheet: Partial<CharacterScore> = {
  [FixedStats.hpPct.id]: 0,
  [FixedStats.atkPct.id]: 0,
  [FixedStats.defPct.id]: 0,

  [FixedStats.critRate.id]: 3.0,
  [FixedStats.critDmg.id]: 1.5,

  [FixedStats.basicBns.id]: 0,
  [FixedStats.heavyBns.id]: 0,
  [FixedStats.skillBns.id]: 0,
  [FixedStats.liberationBns.id]: 0,

  [FixedStats.resonanceBns.id]: 1,
  isCritInvalid: false,
};

export const characterScoreSheet: Record<CharacterId, CharacterScore> = {
    lucilla: {
    ...BaseSheet,
    [FixedStats.atkPct.id]: 1.0,
    [FixedStats.skillBns.id]: 0.5,
    [FixedStats.liberationBns.id]: 1.0,
    [FixedStats.resonanceBns.id]: 1.2,
    maxResCount: 0,
  },
    lucy: {
    ...BaseSheet,
    [FixedStats.atkPct.id]: 1.0,
    [FixedStats.skillBns.id]: 0.5,
    [FixedStats.liberationBns.id]: 1.0,
    [FixedStats.resonanceBns.id]: 1.2,
    maxResCount: 0,
  },
    rebecca: {
    ...BaseSheet,
    [FixedStats.atkPct.id]: 1.0,
    [FixedStats.skillBns.id]: 0.5,
    [FixedStats.liberationBns.id]: 1.0,
    [FixedStats.resonanceBns.id]: 1.2,
    maxResCount: 0,
  },
  denia: {
    ...BaseSheet,
    [FixedStats.atkPct.id]: 1.0,
    [FixedStats.skillBns.id]: 0.5,
    [FixedStats.liberationBns.id]: 1.0,
    [FixedStats.resonanceBns.id]: 1.2,
    maxResCount: 0,
  },
  hiyuki: {
    ...BaseSheet,
    [FixedStats.atkPct.id]: 1.5,
    [FixedStats.skillBns.id]: 0.2,
    [FixedStats.liberationBns.id]: 1.3,
    maxResCount: 0,
  },
  sigrika: {
    ...BaseSheet,
    [FixedStats.atkPct.id]: 1.5,
    [FixedStats.resonanceBns.id]: 1.2,
    maxResCount: 5,
  },
  luuk_herssen: {
    ...BaseSheet,
    [FixedStats.atkPct.id]: 1.5,
    [FixedStats.basicBns.id]: 1.5,
    [FixedStats.resonanceBns.id]: 1.1,
    maxResCount: 4,
  },
  aemeath: {
    ...BaseSheet,
    [FixedStats.atkPct.id]: 1.5,

    [FixedStats.basicBns.id]: 0.25,
    [FixedStats.liberationBns.id]: 1.25,

    [FixedStats.resonanceBns.id]: 1.2,
    maxResCount: 4,
  },
  mornye: {
    ...BaseSheet,
    [FixedStats.defPct.id]: 3.0,

    [FixedStats.critRate.id]: 1,
    [FixedStats.critDmg.id]: 1,

    [FixedStats.liberationBns.id]: 1.0,

    [FixedStats.resonanceBns.id]: 2,
    maxResCount: 5,
  },
  lynae: {
    ...BaseSheet,
    [FixedStats.atkPct.id]: 1.5,

    [FixedStats.basicBns.id]: 1.1,
    [FixedStats.skillBns.id]: 0.2,
    [FixedStats.liberationBns.id]: 0.2,

    [FixedStats.resonanceBns.id]: 1.1,
    maxResCount: 4,
  },
  chisa: {
    ...BaseSheet,
    [FixedStats.atkPct.id]: 1.5,

    [FixedStats.liberationBns.id]: 1.2,

    [FixedStats.resonanceBns.id]: 1.2,
    maxResCount: 5,
  },
  buling: {
    ...BaseSheet,
    [FixedStats.atkPct.id]: 1.5,

    [FixedStats.critRate.id]: 1.0,
    [FixedStats.critDmg.id]: 0.5,

    [FixedStats.liberationBns.id]: 0.5,

    [FixedStats.resonanceBns.id]: 1.2,
    maxResCount: 5,
  },
  //* ===========================================================
  aalto: {
    ...BaseSheet,
    [FixedStats.atkPct.id]: 1.5,

    [FixedStats.basicBns.id]: 0.25,
    [FixedStats.skillBns.id]: 1.0,
    [FixedStats.liberationBns.id]: 0.25,

    [FixedStats.resonanceBns.id]: 1.0,
    maxResCount: 4,
  },
  baizhi: {
    ...BaseSheet,
    [FixedStats.hpPct.id]: 2.0,

    [FixedStats.liberationBns.id]: 0.1,

    [FixedStats.resonanceBns.id]: 1.0,
    maxResCount: 5,
  },
  brant: {
    ...BaseSheet,
    [FixedStats.atkPct.id]: 1.2,

    [FixedStats.basicBns.id]: 1.5,
    [FixedStats.liberationBns.id]: 0.1,

    [FixedStats.resonanceBns.id]: 1.5,
    maxResCount: 5,
  },
  calcharo: {
    ...BaseSheet,
    [FixedStats.atkPct.id]: 1.5,

    [FixedStats.basicBns.id]: 0.3,
    [FixedStats.skillBns.id]: 0.1,
    [FixedStats.liberationBns.id]: 1.1,

    [FixedStats.resonanceBns.id]: 1.0,
    maxResCount: 4,
  },
  camellya: {
    ...BaseSheet,
    [FixedStats.atkPct.id]: 1.5,

    [FixedStats.basicBns.id]: 1.15,
    [FixedStats.liberationBns.id]: 0.35,

    [FixedStats.resonanceBns.id]: 1.0,
    maxResCount: 3,
  },
  cantarella: {
    ...BaseSheet,
    [FixedStats.atkPct.id]: 1.5,

    [FixedStats.basicBns.id]: 1.0,
    [FixedStats.skillBns.id]: 0.5,

    [FixedStats.resonanceBns.id]: 1.0,
    maxResCount: 4,
  },
  carlotta: {
    ...BaseSheet,
    [FixedStats.atkPct.id]: 1.5,

    [FixedStats.skillBns.id]: 1.5,

    [FixedStats.resonanceBns.id]: 1.0,
    maxResCount: 4,
  },
  changli: {
    ...BaseSheet,
    [FixedStats.atkPct.id]: 1.5,

    [FixedStats.skillBns.id]: 1.1,
    [FixedStats.liberationBns.id]: 0.4,

    [FixedStats.resonanceBns.id]: 1.0,
    maxResCount: 3,
  },
  chiaccona: {
    ...BaseSheet,
    [FixedStats.atkPct.id]: 1.5,

    [FixedStats.skillBns.id]: 0.5,
    [FixedStats.liberationBns.id]: 1.0,

    [FixedStats.resonanceBns.id]: 1.0,
    maxResCount: 4,
  },
  chixia: { //치샤
    ...BaseSheet, 
    [FixedStats.atkPct.id]: 1.5,

    [FixedStats.skillBns.id]: 1.0,
    [FixedStats.liberationBns.id]: 0.5,

    [FixedStats.resonanceBns.id]: 0.1,
    maxResCount: 3,
  },
  danjin: {
    ...BaseSheet,
    [FixedStats.atkPct.id]: 1.5,

    [FixedStats.basicBns.id]: 0.3,
    [FixedStats.heavyBns.id]: 1.0,
    [FixedStats.skillBns.id]: 0.75,
    [FixedStats.liberationBns.id]: 0.45,

    [FixedStats.resonanceBns.id]: 1.0,
    maxResCount: 3,
  },
  encore: {
    ...BaseSheet,
    [FixedStats.atkPct.id]: 1.5,

    [FixedStats.basicBns.id]: 1.0,
    [FixedStats.skillBns.id]: 0.5,

    [FixedStats.resonanceBns.id]: 1.0,
    maxResCount: 3,
  },
  jianxin: { //감심
    ...BaseSheet, 
    [FixedStats.atkPct.id]: 1.5,

    [FixedStats.heavyBns.id]: 1.0,
    [FixedStats.liberationBns.id]: 0.5,

    [FixedStats.resonanceBns.id]: 1.0,
    maxResCount: 4,
  },
  jinhsi: { //그뫼엥
    ...BaseSheet, 
    [FixedStats.atkPct.id]: 1.5,

    [FixedStats.basicBns.id]: 0,
    [FixedStats.heavyBns.id]: 0,
    [FixedStats.skillBns.id]: 1.2,
    [FixedStats.liberationBns.id]: 0.6,

    [FixedStats.resonanceBns.id]: 1.0,
    maxResCount: 2,
  },
  jiyan: { //기염
    ...BaseSheet, 
    [FixedStats.atkPct.id]: 1.5,

    [FixedStats.heavyBns.id]: 1.0,
    [FixedStats.skillBns.id]: 0.5,

    [FixedStats.resonanceBns.id]: 1.0,
    maxResCount: 4,
  },
  lingyang: { //능ㅋㅋ
    ...BaseSheet, 
    [FixedStats.atkPct.id]: 1.5,

    [FixedStats.basicBns.id]: 1.0,
    [FixedStats.liberationBns.id]: 0.5,

    [FixedStats.resonanceBns.id]: 1.0,
    maxResCount: 1,
  },
  lumi: {
    ...BaseSheet,
    [FixedStats.atkPct.id]: 1.5,

    [FixedStats.basicBns.id]: 1.0,
    [FixedStats.liberationBns.id]: 0.5,

    [FixedStats.resonanceBns.id]: 1.0,
    maxResCount: 3,
  },
  mortefi: {
    ...BaseSheet,
    [FixedStats.atkPct.id]: 1.5,

    [FixedStats.skillBns.id]: 0.5,
    [FixedStats.liberationBns.id]: 1.0,

    [FixedStats.resonanceBns.id]: 1.0,
    maxResCount: 3,
  },
  phoebe: {
    ...BaseSheet,
    [FixedStats.atkPct.id]: 1.5,

    [FixedStats.heavyBns.id]: 1.0,
    [FixedStats.liberationBns.id]: 0.5,

    [FixedStats.resonanceBns.id]: 1.0,
    maxResCount: 3,
  },
  roccia: {
    ...BaseSheet,
    [FixedStats.atkPct.id]: 1.5,

    [FixedStats.heavyBns.id]: 1.0,
    [FixedStats.skillBns.id]: 0.5,

    [FixedStats.resonanceBns.id]: 1.0,
    maxResCount: 4,
  },
  rover_spectro: {
    ...BaseSheet,
    [FixedStats.atkPct.id]: 1.5,

    [FixedStats.heavyBns.id]: 1.0,
    [FixedStats.skillBns.id]: 0.5,

    [FixedStats.resonanceBns.id]: 1.0,
    maxResCount: 3,
  },
  rover_havoc: {
    ...BaseSheet,
    [FixedStats.atkPct.id]: 1.5,

    [FixedStats.heavyBns.id]: 1.0,
    [FixedStats.skillBns.id]: 0.5,

    [FixedStats.resonanceBns.id]: 1.0,
    maxResCount: 3,
  },
  rover_aero: {
    ...BaseSheet,
    [FixedStats.atkPct.id]: 1.5,

    [FixedStats.heavyBns.id]: 1.0,
    [FixedStats.skillBns.id]: 0.5,

    [FixedStats.resonanceBns.id]: 1.0,
    maxResCount: 3,
  },
  sanhua: {
    ...BaseSheet,
    [FixedStats.atkPct.id]: 1.5,

    [FixedStats.liberationBns.id]: 1.0,

    [FixedStats.resonanceBns.id]: 0.5,
    maxResCount: 1,
  },
  shorekeeper: {
    ...BaseSheet,
    [FixedStats.hpPct.id]: 3.0,

    [FixedStats.critRate.id]: 0,
    [FixedStats.critDmg.id]: 1.0,

    [FixedStats.liberationBns.id]: 1.0,

    [FixedStats.resonanceBns.id]: 2.0,
    maxResCount: 5,
  },
  taoqi: {
    ...BaseSheet,
    [FixedStats.defPct.id]: 2.0,

    [FixedStats.critRate.id]: 1.5,
    [FixedStats.critDmg.id]: 0.75,

    [FixedStats.basicBns.id]: 0,
    [FixedStats.heavyBns.id]: 0,
    [FixedStats.skillBns.id]: 0,
    [FixedStats.liberationBns.id]: 1.0,

    [FixedStats.resonanceBns.id]: 1.0,
    maxResCount: 4,
  },
  verina: {
    ...BaseSheet,
    [FixedStats.atkPct.id]: 3,

    [FixedStats.critRate.id]: 1.0,
    [FixedStats.critDmg.id]: 0.5,

    [FixedStats.basicBns.id]: 0.3,
    [FixedStats.skillBns.id]: 0.3,
    [FixedStats.liberationBns.id]: 0.3,

    [FixedStats.resonanceBns.id]: 2.0,
    maxResCount: 5,
  },
  xiangliyao: { //큐브남
    ...BaseSheet, 
    [FixedStats.atkPct.id]: 1.5,

    [FixedStats.basicBns.id]: 0.1,
    [FixedStats.skillBns.id]: 0.3,
    [FixedStats.liberationBns.id]: 1.1,

    [FixedStats.resonanceBns.id]: 1.0,
    maxResCount: 3,
  },
  yangyang: {
    ...BaseSheet,
    [FixedStats.atkPct.id]: 1.5,

    [FixedStats.basicBns.id]: 0.5,
    [FixedStats.liberationBns.id]: 0.5,

    [FixedStats.resonanceBns.id]: 1.0,
    maxResCount: 5,
  },
  yinlin: {
    ...BaseSheet,
    [FixedStats.atkPct.id]: 1.5,

    [FixedStats.skillBns.id]: 1.0,
    [FixedStats.liberationBns.id]: 0.5,

    [FixedStats.resonanceBns.id]: 1.0,
    maxResCount: 3,
  },
  youhu: {
    ...BaseSheet,
    [FixedStats.atkPct.id]: 1.5,
    
    [FixedStats.critRate.id]: 1.0,
    [FixedStats.critDmg.id]: 0.5,
    
    [FixedStats.skillBns.id]: 1.0,

    [FixedStats.resonanceBns.id]: 1.5,
    maxResCount: 5,
  },
  yuanwu: {
    ...BaseSheet,
    [FixedStats.defPct.id]: 1.0,

    [FixedStats.skillBns.id]: 0.5,
    [FixedStats.liberationBns.id]: 0.5,

    [FixedStats.resonanceBns.id]: 1.0,
    maxResCount: 5,
  },
  zani: {
    ...BaseSheet,
    [FixedStats.atkPct.id]: 1.5,

    [FixedStats.heavyBns.id]: 1.2,
    [FixedStats.skillBns.id]: 0.1,
    [FixedStats.liberationBns.id]: 0.2,

    [FixedStats.resonanceBns.id]: 1.0,
    maxResCount: 4,
  },
  zhezhi: {
    ...BaseSheet, //ㅈㅈ
    [FixedStats.atkPct.id]: 1.5,

    [FixedStats.basicBns.id]: 1.1,
    [FixedStats.skillBns.id]: 0.1,
    [FixedStats.liberationBns.id]: 0.1,

    [FixedStats.resonanceBns.id]: 1.0,
    maxResCount: 4,
  },
  cartethyia: {
    ...BaseSheet,
    [FixedStats.hpPct.id]: 2.0,
    [FixedStats.atkPct.id]: 0,
    [FixedStats.defPct.id]: 0,

    [FixedStats.basicBns.id]: 1.0,
    [FixedStats.liberationBns.id]: 0.5,

    [FixedStats.resonanceBns.id]: 1.0,
    maxResCount: 3,
  },
  lupa: {
    ...BaseSheet,
    [FixedStats.atkPct.id]: 1.5,

    [FixedStats.basicBns.id]: 0.1,
    [FixedStats.heavyBns.id]: 0.1,
    [FixedStats.skillBns.id]: 0.2,
    [FixedStats.liberationBns.id]: 1.1,

    [FixedStats.resonanceBns.id]: 1.0,
    maxResCount: 3,
  },
  phrolova: {
    ...BaseSheet,
    [FixedStats.atkPct.id]: 1.5,

    [FixedStats.basicBns.id]: 0.1,
    [FixedStats.skillBns.id]: 1.4,
    [FixedStats.liberationBns.id]: 0.5,

    [FixedStats.resonanceBns.id]: 0,
    maxResCount: 0,
  },
  augusta: {
    ...BaseSheet,
    [FixedStats.atkPct.id]: 1.5,

    [FixedStats.heavyBns.id]: 1.5,

    [FixedStats.resonanceBns.id]: 1.0,
    maxResCount: 4,
  },
  iuno: {
    ...BaseSheet,
    [FixedStats.atkPct.id]: 1.5,

    [FixedStats.skillBns.id]: 0.3,
    [FixedStats.liberationBns.id]: 1.2,

    [FixedStats.resonanceBns.id]: 1.2,
    maxResCount: 4,
  },
  galbrena: {
    ...BaseSheet,
    [FixedStats.atkPct.id]: 1.5,

    [FixedStats.heavyBns.id]: 1.0,

    [FixedStats.resonanceBns.id]: 1.0,
    maxResCount: 3,
  },
  qiuyuan: {
    ...BaseSheet,
    [FixedStats.atkPct.id]: 1.5,

    [FixedStats.heavyBns.id]: 1,

    [FixedStats.resonanceBns.id]: 1,
    maxResCount: 4,
  },
} as const;

export function getCharacterScore(
  characterId: CharacterId,
  weaponId: WeaponId | null,
  constell: number,
  echoData: [EchoRuntime, EchoRuntime, EchoRuntime, EchoRuntime, EchoRuntime]
): CharacterScore {
  const base = characterScoreSheet[characterId];

  if (!base) throw new Error(`Unknown characterId: ${characterId}`);

  const result: CharacterScore = { ...base };

  switch (characterId) {
    //$ Cost3 Res Option
    case "sigrika": {
      const cost3MainOptionResCount =
        echoData?.filter(
          (item) =>
            item.cost === 3 &&
            item.mainOption.statId === FixedStats.resonanceBns.id
        ).length ?? 0;

      if (cost3MainOptionResCount >= 1) {
        result[FixedStats.resonanceBns.id] = 1;
        result["maxResCount"] = 2;
        result["scoreComp"] = -30;
      }
      break;
    }
    case "brant": {
      const cost3MainOptionResCount =
        echoData?.filter(
          (item) =>
            item.cost === 3 &&
            item.mainOption.statId === FixedStats.resonanceBns.id
        ).length ?? 0;

      if (cost3MainOptionResCount >= 2) {
        if (weaponId === "sword004") {
          // 브랜트 전무
          result[FixedStats.resonanceBns.id] = 1;
          result["maxResCount"] = 3;
        }
        result["scoreComp"] = -24;
      }
      break;
    }

    //$ Constell
    case "iuno": {
      //유노 1돌+
      if (constell >= 1) {
        result[FixedStats.resonanceBns.id] = 1;
        result["maxResCount"] = 2;
      }
      break;
    }
    case "encore": {
      //앙코 2돌+
      if (constell >= 2) {
        result["maxResCount"] = 1;
      }
      break;
    }
    case "zhezhi": {
      //절지 1돌+
      if (constell >= 1) {
        result["maxResCount"] = 3;
      }
      break;
    }
    case "yinlin": {
      //음림 2돌+
      if (constell >= 2) {
        result["maxResCount"] = 3;
      }
      break;
    }
    case "calcharo": {
      //카카루 1돌+
      if (constell >= 2) {
        result["maxResCount"] = 2;
      }
      break;
    }
  }

  return result;
}

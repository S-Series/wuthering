import type { CharacterId } from "./characterStats";
import { harmony, type HarmonyId } from "./harmonies";
import { FixedStats, type StatId } from "./stats";

export type CharacterMeta = {
  harmonySets: HarmonyId[];
  cost4MainStats: StatId[];
  cost3MainStats: StatId[];
  statType: Extract<StatId, "atk" | "hp" | "def">;
  resReq: number;
  subResReq: number;
  isNeedCrit: boolean;
};

type CharacterMetaBase = Omit<
  CharacterMeta,
  | "resReq" 
  | "subResReq" 
  | "cost3MainStats" 
  | "cost1MainStats"
>;

const baseMeta: CharacterMetaBase = {
  harmonySets: [harmony.Tunes.id],
  cost4MainStats: [FixedStats.critRate.id, FixedStats.critDmg.id],
  statType: "atk",
  isNeedCrit: true,
};

export const characterMeta: Record<CharacterId, CharacterMeta> = {
  //*== ver 3.5 ===========================//
  /* yangyang_secondary: {
    ...baseMeta,
    harmonySets: [harmony..id],
    cost3MainStats: [
FixedStats..id, 
FixedStats.atkPct.id],
  },
  suisui: {
    ...baseMeta,
    harmonySets: [harmony..id],
    cost3MainStats: [
FixedStats..id, 
FixedStats.atkPct.id],
    
  },*/

  //*== ver 3.5 ===========================//
  suisui: {
    ...baseMeta,
    harmonySets: [harmony.Song.id],
    cost4MainStats: [
      FixedStats.healBns.id,
      FixedStats.hpPct.id,
      FixedStats.critDmg.id,
    ],
    cost3MainStats: [FixedStats.resonanceBns.id, FixedStats.hpPct.id],
    statType: "hp",
    isNeedCrit: false,
    resReq: 260,
    subResReq: 50,
  },
  xuanling: {
    ...baseMeta,
    harmonySets: [harmony.Song.id],
    cost3MainStats: [FixedStats.havocBns.id, FixedStats.atkPct.id],
    resReq: 125,
    subResReq: 25,
  },

  //*== ver 3.4 ===========================//
  lucilla: {
    ...baseMeta,
    harmonySets: [harmony.Snowfall.id, harmony.Clouds.id],
    cost3MainStats: [FixedStats.glacioBns.id, FixedStats.atkPct.id],
    resReq: 100,
    subResReq: 0,
  },
  rebecca: {
    ...baseMeta,
    harmonySets: [
      harmony.Adam.id,
      harmony.Thunder.id,
      harmony.Memories.id,
      harmony.Tunes.id,
    ],
    cost3MainStats: [FixedStats.electroBns.id, FixedStats.atkPct.id],
    resReq: 125,
    subResReq: 25,
  },
  lucy: {
    ...baseMeta,
    harmonySets: [
      harmony.Adam.id,
      harmony.Light.id,
      harmony.Radiance.id,
      harmony.Leap.id,
      harmony.Revelation.id,
      harmony.Memories.id,
      harmony.Tunes.id,
    ],
    cost3MainStats: [FixedStats.spectroBns.id, FixedStats.atkPct.id],
    resReq: 125,
    subResReq: 25,
  },

  //*== ver 3.3 ===========================//
  denia: {
    ...baseMeta,
    harmonySets: [harmony.Foam.id, harmony.Memories.id],
    cost3MainStats: [FixedStats.fusionBns.id, FixedStats.atkPct.id],
    resReq: 125,
    subResReq: 30,
  },
  hiyuki: {
    ...baseMeta,
    harmonySets: [harmony.Snowfall.id],
    cost4MainStats: [
      FixedStats.critRate.id,
      FixedStats.critDmg.id,
      FixedStats.atkPct.id,
    ],
    cost3MainStats: [FixedStats.glacioBns.id, FixedStats.atkPct.id],
    resReq: 125,
    subResReq: 25,
  },

  //*== ver 3.2 ===========================//
  sigrika: {
    ...baseMeta,
    harmonySets: [harmony.Sound.id],
    cost3MainStats: [
      FixedStats.aeroBns.id,
      FixedStats.atkPct.id,
      FixedStats.resonanceBns.id,
    ],
    resReq: 150,
    subResReq: 50,
  },

  //*== ver 3.1 ===========================//
  luuk_herssen: {
    ...baseMeta,
    harmonySets: [harmony.Revelation.id],
    cost3MainStats: [FixedStats.spectroBns.id, FixedStats.atkPct.id],
    resReq: 125,
    subResReq: 25,
  },
  aemeath: {
    ...baseMeta,
    harmonySets: [harmony.Star.id],
    cost3MainStats: [FixedStats.fusionBns.id, FixedStats.atkPct.id],
    resReq: 125,
    subResReq: 25,
  },

  //*== ver 3.0 ===========================//
  mornye: {
    ...baseMeta,
    harmonySets: [harmony.Halo.id],
    cost4MainStats: [
      FixedStats.defPct.id,
      FixedStats.healBns.id,
      FixedStats.critDmg.id,
    ],
    cost3MainStats: [FixedStats.resonanceBns.id, FixedStats.defPct.id],
    statType: "def",
    isNeedCrit: false,
    resReq: 260,
    subResReq: 50,
  },
  lynae: {
    ...baseMeta,
    harmonySets: [harmony.Leap.id, harmony.Revelation.id],
    cost3MainStats: [FixedStats.spectroBns.id, FixedStats.atkPct.id],
    resReq: 130,
    subResReq: 30,
  },

  //$== ver 2.X ===========================//
  //*== ver 2.8 ===========================//
  chisa: {
    ...baseMeta,
    harmonySets: [harmony.Fate.id, harmony.Veil.id, harmony.Eclipse.id],
    cost3MainStats: [FixedStats.havocBns.id, FixedStats.atkPct.id],
    resReq: 135,
    subResReq: 35,
  },
  buling: {
    ...baseMeta,
    harmonySets: [harmony.Rejuvent.id],
    cost4MainStats: [FixedStats.atkPct.id, FixedStats.healBns.id],
    cost3MainStats: [FixedStats.resonanceBns.id, FixedStats.atkPct.id],
    isNeedCrit: false,
    resReq: 160,
    subResReq: 60,
  },

  //*== ver 2.7 ===========================//
  qiuyuan: {
    ...baseMeta,
    harmonySets: [
      harmony.Law.id,
      harmony.Gale.id,
      harmony.Sound.id,
      harmony.Pilgrimage.id,
      harmony.Welkin.id,
    ],
    cost3MainStats: [FixedStats.aeroBns.id, FixedStats.atkPct.id],
    resReq: 130,
    subResReq: 30,
  },
  galbrena: {
    ...baseMeta,
    harmonySets: [
      harmony.Shadow.id,
      harmony.Rift.id,
      harmony.Star.id,
      harmony.Foam.id,
    ],
    cost3MainStats: [FixedStats.fusionBns.id, FixedStats.atkPct.id],
    resReq: 120,
    subResReq: 20,
  },

  //*== ver 2.6 ===========================//
  iuno: {
    ...baseMeta,
    harmonySets: [
      harmony.Crown.id,
      harmony.Gale.id,
      harmony.Welkin.id,
      harmony.Pilgrimage.id,
      harmony.Sound.id,
    ],
    cost3MainStats: [FixedStats.aeroBns.id, FixedStats.atkPct.id],
    resReq: 130,
    subResReq: 30,
  },
  augusta: {
    ...baseMeta,
    harmonySets: [harmony.Crown.id, harmony.Thunder.id],
    cost3MainStats: [FixedStats.electroBns.id, FixedStats.atkPct.id],
    resReq: 125,
    subResReq: 25,
  },

  //*== ver 2.5 ===========================//
  phrolova: {
    ...baseMeta,
    harmonySets: [harmony.Dream.id, harmony.Eclipse.id, harmony.Veil.id],
    cost3MainStats: [FixedStats.havocBns.id, FixedStats.atkPct.id],
    resReq: 100,
    subResReq: 0,
  },

  //*== ver 2.4 ===========================//
  lupa: {
    ...baseMeta,
    harmonySets: [harmony.Clawprint.id],
    cost3MainStats: [FixedStats.fusionBns.id, FixedStats.atkPct.id],
    resReq: 120,
    subResReq: 20,
  },
  cartethyia: {
    ...baseMeta,
    harmonySets: [harmony.Pilgrimage.id],
    cost3MainStats: [],
    statType: "hp",
    resReq: 120,
    subResReq: 20,
  },

  //*== ver 2.3 ===========================//
  chiaccona: {
    ...baseMeta,
    harmonySets: [harmony.Welkin.id],
    cost3MainStats: [FixedStats.aeroBns.id, FixedStats.atkPct.id],
    resReq: 120,
    subResReq: 20,
  },
  zani: {
    ...baseMeta,
    harmonySets: [harmony.Radiance.id],
    cost3MainStats: [FixedStats.spectroBns.id, FixedStats.atkPct.id],
    resReq: 125,
    subResReq: 25,
  },

  //*== ver 2.2 ===========================//
  cantarella: {
    ...baseMeta,
    harmonySets: [harmony.Veil.id],
    cost3MainStats: [FixedStats.havocBns.id, FixedStats.atkPct.id],
    resReq: 130,
    subResReq: 30,
  },
  rover_aero: {
    ...baseMeta,
    harmonySets: [harmony.Welkin.id],
    cost3MainStats: [
      FixedStats.aeroBns.id,
      FixedStats.atkPct.id,
      FixedStats.resonanceBns.id,
    ],
    resReq: 130,
    subResReq: 30,
  },

  //*== ver 2.1 ===========================//
  brant: {
    ...baseMeta,
    harmonySets: [harmony.Courage.id],
    cost3MainStats: [
      FixedStats.resonanceBns.id,
      FixedStats.fusionBns.id,
      FixedStats.atkPct.id,
    ],
    resReq: 260,
    subResReq: 60,
  },
  phoebe: {
    ...baseMeta,
    harmonySets: [harmony.Radiance.id],
    cost3MainStats: [FixedStats.spectroBns.id, FixedStats.atkPct.id],
    resReq: 120,
    subResReq: 20,
  },

  //*== ver 2.0 ===========================//
  roccia: {
    ...baseMeta,
    harmonySets: [harmony.Veil.id],
    cost3MainStats: [FixedStats.havocBns.id, FixedStats.atkPct.id],
    resReq: 130,
    subResReq: 30,
  },
  carlotta: {
    ...baseMeta,
    harmonySets: [harmony.Frosty.id],
    cost3MainStats: [FixedStats.glacioBns.id, FixedStats.atkPct.id],
    resReq: 110,
    subResReq: 30,
  },

  //$== ver 1.X ===========================//
  //*== ver 1.4 ===========================//
  lumi: {
    ...baseMeta,
    harmonySets: [harmony.Clouds.id],
    cost3MainStats: [FixedStats.electroBns.id, FixedStats.atkPct.id],
    resReq: 120,
    subResReq: 20,
  },
  camellya: {
    ...baseMeta,
    harmonySets: [harmony.Eclipse.id],
    cost3MainStats: [FixedStats.havocBns.id, FixedStats.atkPct.id],
    resReq: 120,
    subResReq: 20,
  },

  //*== ver 1.3 ===========================//
  youhu: {
    ...baseMeta,
    harmonySets: [harmony.Rejuvent.id],
    cost3MainStats: [FixedStats.resonanceBns.id, FixedStats.atkPct.id],
    resReq: 200,
    subResReq: 50,
  },
  shorekeeper: {
    ...baseMeta,
    harmonySets: [harmony.Rejuvent.id],
    cost3MainStats: [FixedStats.resonanceBns.id],
    statType: "hp",
    isNeedCrit: false,
    resReq: 260,
    subResReq: 50,
  },

  //*== ver 1.2 ===========================//
  xiangliyao: {
    ...baseMeta,
    harmonySets: [harmony.Thunder.id],
    cost3MainStats: [FixedStats.electroBns.id, FixedStats.atkPct.id],
    resReq: 120,
    subResReq: 20,
  },
  zhezhi: {
    //?��?
    ...baseMeta,
    harmonySets: [harmony.Empyrean.id, harmony.Frost.id, harmony.Clouds.id],
    cost3MainStats: [FixedStats.glacioBns.id, FixedStats.atkPct.id],
    resReq: 130,
    subResReq: 30,
  },

  //*== ver 1.1 ===========================//
  changli: {
    ...baseMeta,
    harmonySets: [harmony.Rift.id],
    cost3MainStats: [FixedStats.fusionBns.id, FixedStats.atkPct.id],
    resReq: 120,
    subResReq: 20,
  },
  jinhsi: {
    ...baseMeta,
    harmonySets: [harmony.Light.id],
    cost3MainStats: [FixedStats.spectroBns.id, FixedStats.atkPct.id],
    resReq: 110,
    subResReq: 10,
  },

  //*== ver 1.0 ===========================//
  yinlin: {
    ...baseMeta,
    harmonySets: [harmony.Thunder.id, harmony.Empyrean.id, harmony.Clouds.id],
    cost3MainStats: [FixedStats.electroBns.id, FixedStats.atkPct.id],
    resReq: 120,
    subResReq: 20,
  },
  jiyan: {
    //기염
    ...baseMeta,
    harmonySets: [harmony.Gale.id],
    cost3MainStats: [FixedStats.aeroBns.id, FixedStats.atkPct.id],
    resReq: 130,
    subResReq: 30,
  },
  rover_havoc: {
    ...baseMeta,
    harmonySets: [harmony.Eclipse.id],
    cost3MainStats: [FixedStats.havocBns.id, FixedStats.atkPct.id],
    resReq: 120,
    subResReq: 20,
  },

  //$== ver open ===========================//
  //# 5??
  rover_spectro: {
    ...baseMeta,
    harmonySets: [harmony.Radiance.id],
    cost3MainStats: [FixedStats.spectroBns.id, FixedStats.atkPct.id],
    resReq: 130,
    subResReq: 30,
  },
  verina: {
    ...baseMeta,
    harmonySets: [harmony.Rejuvent.id],
    cost3MainStats: [FixedStats.resonanceBns.id],
    isNeedCrit: false,
    resReq: 200,
    subResReq: 50,
  },
  calcharo: {
    ...baseMeta,
    harmonySets: [harmony.Thunder.id],
    cost3MainStats: [FixedStats.electroBns.id, FixedStats.atkPct.id],
    resReq: 130,
    subResReq: 30,
  },
  encore: {
    ...baseMeta,
    harmonySets: [harmony.Rift.id],
    cost3MainStats: [FixedStats.fusionBns.id, FixedStats.atkPct.id],
    resReq: 120,
    subResReq: 20,
  },
  jianxin: {
    //감심
    ...baseMeta,
    harmonySets: [harmony.Gale.id, harmony.Clouds.id],
    cost3MainStats: [FixedStats.aeroBns.id, FixedStats.atkPct.id],
    resReq: 130,
    subResReq: 30,
  },
  lingyang: {
    ...baseMeta,
    harmonySets: [harmony.Frost.id],
    cost3MainStats: [FixedStats.glacioBns.id, FixedStats.atkPct.id],
    resReq: 120,
    subResReq: 20,
  },
  //# 4??
  sanhua: {
    ...baseMeta,
    harmonySets: [harmony.Clouds.id],
    cost3MainStats: [FixedStats.glacioBns.id, FixedStats.atkPct.id],
    resReq: 100,
    subResReq: 5,
  },
  baizhi: {
    ...baseMeta,
    harmonySets: [harmony.Rejuvent.id],
    cost3MainStats: [FixedStats.resonanceBns.id],
    resReq: 200,
    subResReq: 60,
  },
  chixia: {
    // 주근�?
    ...baseMeta,
    harmonySets: [harmony.Rift.id],
    cost3MainStats: [FixedStats.fusionBns.id, FixedStats.atkPct.id],
    resReq: 120,
    subResReq: 20,
  },
  mortefi: {
    ...baseMeta,
    harmonySets: [harmony.Rift.id, harmony.Clouds.id],
    cost3MainStats: [FixedStats.fusionBns.id, FixedStats.atkPct.id],
    resReq: 120,
    subResReq: 20,
  },
  yuanwu: {
    ...baseMeta,
    harmonySets: [
      harmony.Rejuvent.id,
      harmony.Clouds.id,
      harmony.Thunder.id,
      harmony.Empyrean.id,
    ],
    cost3MainStats: [FixedStats.resonanceBns.id, FixedStats.defPct.id],
    statType: "def",
    resReq: 150,
    subResReq: 50,
  },
  yangyang: {
    ...baseMeta,
    harmonySets: [harmony.Gale.id, harmony.Clouds.id],
    cost3MainStats: [
      FixedStats.resonanceBns.id,
      FixedStats.aeroBns.id,
      FixedStats.atkPct.id,
    ],
    resReq: 150,
    subResReq: 50,
  },
  aalto: {
    ...baseMeta,
    harmonySets: [harmony.Gale.id, harmony.Clouds.id],
    cost3MainStats: [FixedStats.aeroBns.id, FixedStats.atkPct.id],
    resReq: 130,
    subResReq: 30,
  },
  taoqi: {
    ...baseMeta,
    harmonySets: [harmony.Eclipse.id, harmony.Clouds.id],
    cost3MainStats: [FixedStats.havocBns.id, FixedStats.defPct.id],
    statType: "def",
    isNeedCrit: false,
    resReq: 130,
    subResReq: 30,
  },
  danjin: {
    ...baseMeta,
    harmonySets: [harmony.Eclipse.id, harmony.Veil.id],
    cost3MainStats: [FixedStats.havocBns.id, FixedStats.atkPct.id],
    resReq: 120,
    subResReq: 20,
  },
};

export function getCharacterMeta(
  characterId: CharacterId,
  constell: number,
): CharacterMeta {
  const base = characterMeta[characterId];
  if (!base) throw new Error("Character Meta Load Failed: Invalid Character ID")

  const result: CharacterMeta = { ...base };

  switch (characterId){
    case "lynae": {
      // 린네 6돌
      if (constell >= 1) {
        result.resReq = 110;
        result.subResReq = 10;
      }
      break;
    }
    case "iuno": {
      // 유노 1돌
      if (constell >= 1) {
        result.resReq = 110;
        result.subResReq = 10;
      }
      break;
    }
    case "encore": {
      // 앙코 2돌
      if (constell >= 2) {
        result.resReq = 110;
        result.subResReq = 10;
      }
      break;
    }
    case "zhezhi": {
      // 절지 1돌
      if (constell >= 1) {
        result.resReq = 120;
        result.subResReq = 20;
      }
      break;
    }
    case "yinlin": {
      // 음림 2돌
      if (constell >= 2) {
        result.resReq = 110;
        result.subResReq = 10;
      }
      break;
    }
    case "calcharo": {
      // 카카루 1돌
      if (constell >= 2) {
        result.resReq = 110;
        result.subResReq = 10;
      }
      break;
    }
  }

  return result;
}


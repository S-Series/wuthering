import { FixedStats, type StatId } from "./stats";

export interface WeaponStat {
    atk: number,
    value: number[],
    statType: StatId[],
}

export const weaponStat = {
  //#region StraightSword
  sword001: {
    atk: 587,
    value: [24.3, 12.8],
    statType: ["CritRate", "ResonanceBns"],
  },
  sword002: {
    atk: 587,
    value: [48.6, 12],
    statType: ["CritDmg", "atkPct"],
  },
  sword003: {
    atk: 587,
    value: [24.3, 12],
    statType: ["CritRate", "atkPct"],
  },
  sword004: {
    atk: 412,
    value: [77, 8],
    statType: ["ResonanceBns", "CritRate"],
  },
  sword005: {
    atk: 587,
    value: [38.8, 0],
    statType: ["ResonanceBns", "atk"],
  },
  sword006: {
    atk: 412,
    value: [72.2, 12],
    statType: [FixedStats.hpPct.id, FixedStats.hpPct.id],
  },
  sword007: {
    atk: 587,
    value: [24.3, 12],
    statType: [FixedStats.CritRate.id, FixedStats.atkPct.id],
  },
  //$ --------------------------------------
  sword101: {
    atk: 462,
    value: [18.2, 0],
    statType: ["atkPct", "atk"],
  },
  sword102: {
    atk: 337,
    value: [51.8, 0],
    statType: ["ResonanceBns", "atk"],
  },
  sword103: {
    atk: 387,
    value: [36.4, 0],
    statType: ["atkPct", "atk"],
  },
  sword104: {
    atk: 412,
    value: [30.3, 0],
    statType: ["atkPct", "atk"],
  },
  sword105: {
    atk: 412,
    value: [30.3, 0],
    statType: ["atkPct", "atk"],
  },
  sword106: {
    atk: 387,
    value: [36.4, 0],
    statType: ["atkPct", "atk"],
  },
  sword107: {
    atk: 462,
    value: [18.2, 0],
    statType: ["atkPct", "atk"],
  },
  sword108: {
    atk: 462,
    value: [18.2, 0],
    statType: ["atkPct", "atk"],
  },
  sword109: {
    atk: 412,
    value: [20.2, 0],
    statType: [FixedStats.CritRate.id, FixedStats.dummy.id],
  },
  //#endregion

  //#region GreatSword
  broadblade001: {
    atk: 587,
    value: [36.4, 12.8],
    statType: ["atkPct", "ResonanceBns"],
  },
  broadblade002: {
    atk: 587,
    value: [48.6, 12],
    statType: ["CritDmg", "typeBns"],
  },
  broadblade003: {
    atk: 587,
    value: [24.3, 12],
    statType: ["CritRate", "typeBns"],
  },
  broadblade004: {
    atk: 587,
    value: [48.6, 12],
    statType: [FixedStats.CritDmg.id, FixedStats.atkPct.id],
  },
  broadblade005: {
    atk: 675,
    value: [12.1, 12],
    statType: [FixedStats.CritRate.id, FixedStats.atkPct.id],
  },
  //$ --------------------------------------------------
  broadblade101: {
    atk: 337,
    value: [51.8, 0],
    statType: ["ResonanceBns", "atk"],
  },
  broadblade102: {
    atk: 412,
    value: [32.4, 0],
    statType: ["ResonanceBns", "atk"],
  },
  broadblade103: {
    atk: 337,
    value: [61.5, 0],
    statType: ["defPct", "atk"],
  },
  broadblade104: {
    atk: 412,
    value: [30.3, 0],
    statType: ["atkPct", "atk"],
  },
  broadblade105: {
    atk: 412,
    value: [20.2, 0],
    statType: ["CritRate", "atk"],
  },
  broadblade106: {
    atk: 462,
    value: [18.2, 0],
    statType: ["atkPct", "atk"],
  },
  broadblade107: {
    atk: 462,
    value: [18.2, 0],
    statType: ["atkPct", "atk"],
  },
  broadblade108: {
    atk: 412,
    value: [40.5, 0],
    statType: [FixedStats.CritDmg.id, FixedStats.dummy.id],
  },
  //#endregion

  //#region Gauntlet
  gauntlet001: {
    atk: 587,
    value: [36.4, 12.8],
    statType: ["atkPct", "ResonanceBns"],
  },
  gauntlet002: {
    atk: 587,
    value: [24.3, 12],
    statType: ["CritRate", "typeBns"],
  },
  gauntlet003: {
    atk: 587,
    value: [24.3, 12],
    statType: ["CritRate", "atkPct"],
  },
  gauntlet004: {
    atk: 587,
    value: [48.6, 12],
    statType: ["CritDmg", "atkPct"],
  },
  gauntlet005: {
    atk: 500,
    value: [36.0, 12],
    statType: [FixedStats.CritRate.id, FixedStats.atkPct.id],
  },
  //$ ---------------------------------------
  gauntlet101: {
    atk: 337,
    value: [51.8, 0],
    statType: ["ResonanceBns", "atk"],
  },
  gauntlet102: {
    atk: 387,
    value: [38.8, 0],
    statType: ["ResonanceBns", "atk"],
  },
  gauntlet103: {
    atk: 337,
    value: [61.5, 0],
    statType: ["defPct", "atk"],
  },
  gauntlet104: {
    atk: 412,
    value: [30.3, 0],
    statType: ["atkPct", "atk"],
  },
  gauntlet105: {
    atk: 412,
    value: [20.2, 0],
    statType: ["CritRate", "atk"],
  },
  gauntlet106: {
    atk: 462,
    value: [18.2, 0],
    statType: ["atkPct", "atk"],
  },
  gauntlet107: {
    atk: 462,
    value: [18.2, 0],
    statType: ["atkPct", "atk"],
  },
  gauntlet108: {
    atk: 412,
    value: [40.5, 0],
    statType: [FixedStats.CritDmg.id, FixedStats.dummy.id],
  },
  //#endregion

  //#region Firearm
  pistol001: {
    atk: 587,
    value: [24.3, 12.8],
    statType: ["CritRate", "ResonanceBns"],
  },
  pistol002: {
    atk: 500,
    value: [72, 12],
    statType: ["CritDmg", "atkPct"],
  },
  pistol003: {
    atk: 500,
    value: [36, 12],
    statType: ["CritRate", "atkPct"],
  },
  pistol004: {
    atk: 587,
    value: [48.6, 12],
    statType: [FixedStats.CritDmg.id, FixedStats.atkPct.id],
  },
  //$ -------------------------------------------
  pistol101: {
    atk: 337,
    value: [51.8, 0],
    statType: ["ResonanceBns", "atk"],
  },
  pistol102: {
    atk: 387,
    value: [36.4, 0],
    statType: ["atkPct", "atk"],
  },
  pistol103: {
    atk: 412,
    value: [30.3, 0],
    statType: ["atkPct", "atk"],
  },
  pistol104: {
    atk: 412,
    value: [30.3, 0],
    statType: ["atkPct", "atk"],
  },
  pistol105: {
    atk: 387,
    value: [36.4, 0],
    statType: ["atkPct", "atk"],
  },
  pistol106: {
    atk: 462,
    value: [18.2, 0],
    statType: ["atkPct", "atk"],
  },
  pistol107: {
    atk: 462,
    value: [18.2, 0],
    statType: ["atkPct", "atk"],
  },
  pistol108: {
    atk: 412,
    value: [20.2, 0],
    statType: [FixedStats.CritRate.id, FixedStats.dummy.id],
  },
  //#endregion

  //#region Amplifter
  rectifier001: {
    atk: 500,
    value: [53.9, 12.8],
    statType: ["atkPct", "ResonanceBns"],
  },
  rectifier002: {
    atk: 500,
    value: [36, 12],
    statType: ["CritRate", "typeBns"],
  },
  rectifier003: {
    atk: 500,
    value: [72, 12],
    statType: ["CritDmg", "atkPct"],
  },
  rectifier004: {
    atk: 412,
    value: [77, 12],
    statType: ["ResonanceBns", "hpPct"],
  },
  rectifier005: {
    atk: 500,
    value: [36, 12],
    statType: ["CritRate", "atkPct"],
  },
  rectifier006: {
    atk: 500,
    value: [72, 12],
    statType: ["CritDmg", "atkPct"],
  },
  rectifier007: {
    atk: 587,
    value: [24.3, 12],
    statType: [FixedStats.CritRate.id, FixedStats.atkPct.id],
  },
  //$ -----------------------------------------------
  rectifier101: {
    atk: 337,
    value: [51.8, 0],
    statType: ["ResonanceBns", "atk"],
  },
  rectifier102: {
    atk: 337,
    value: [51.8, 0],
    statType: ["ResonanceBns", "atk"],
  },
  rectifier103: {
    atk: 462,
    value: [18.2, 0],
    statType: ["atkPct", "atk"],
  },
  rectifier104: {
    atk: 337,
    value: [51.8, 0],
    statType: ["ResonanceBns", "atk"],
  },
  rectifier105: {
    atk: 387,
    value: [36.4, 0],
    statType: ["atkPct", "atk"],
  },
  rectifier106: {
    atk: 412,
    value: [30.3, 0],
    statType: ["hpPct", "atk"],
  },
  rectifier107: {
    atk: 412,
    value: [20.2, 0],
    statType: ["CritRate", "atk"],
  },
  rectifier108: {
    atk: 462,
    value: [18.2, 0],
    statType: ["atkPct", "atk"],
  },
  rectifier109: {
    atk: 462,
    value: [18.2, 0],
    statType: ["atkPct", "atk"],
  },
  rectifier110: {
    atk: 412,
    value: [40.5, 0],
    statType: [FixedStats.CritDmg.id, FixedStats.dummy.id],
  },
  //#endregion
} as const satisfies Record<string, WeaponStat>;

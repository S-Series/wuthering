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
    statType: ["critRate", "resonanceBns"],
  },
  sword002: {
    atk: 587,
    value: [48.6, 12],
    statType: ["critDmg", "atkPct"],
  },
  sword003: {
    atk: 587,
    value: [24.3, 12],
    statType: ["critRate", "atkPct"],
  },
  sword004: {
    atk: 412,
    value: [77, 8],
    statType: ["resonanceBns", "critRate"],
  },
  sword005: {
    atk: 587,
    value: [38.8, 0],
    statType: ["resonanceBns", "atk"],
  },
  sword006: {
    atk: 412,
    value: [72.2, 12],
    statType: [FixedStats.hpPct.id, FixedStats.hpPct.id],
  },
  sword007: {
    atk: 587,
    value: [24.3, 12],
    statType: [FixedStats.critRate.id, FixedStats.atkPct.id],
  },
  sword008: { //* 레이저 변형: 신상시
    atk: 587,
    value: [38.8, 12],
    statType: [FixedStats.resonanceBns.id, FixedStats.atkPct.id],
  },
  sword009: { //* 영원한 샛별: 에이메스 전무
    atk: 587,
    value: [24.3, 12],
    statType: [FixedStats.critRate.id, FixedStats.typeBns.id],
  },
  sword010: { //* 서린 불꽃: 히유키 전무
    atk: 587,
    value: [24.3, 12],
    statType: [FixedStats.critRate.id, FixedStats.atkPct.id],
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
    statType: ["resonanceBns", "atk"],
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
  sword109: { //* 예리한 날개깃
    atk: 412,
    value: [20.2, 0],
    statType: [FixedStats.critRate.id, FixedStats.dummy.id],
  },
  //#endregion

  //#region GreatSword
  broadblade001: {
    atk: 587,
    value: [36.4, 12.8],
    statType: ["atkPct", "resonanceBns"],
  },
  broadblade002: {
    atk: 587,
    value: [48.6, 12],
    statType: ["critDmg", "typeBns"],
  },
  broadblade003: {
    atk: 587,
    value: [24.3, 12],
    statType: ["critRate", "typeBns"],
  },
  broadblade004: {
    atk: 587,
    value: [48.6, 12],
    statType: [FixedStats.critDmg.id, FixedStats.atkPct.id],
  },
  broadblade005: {
    atk: 675,
    value: [12.1, 12],
    statType: [FixedStats.critRate.id, FixedStats.atkPct.id],
  },
  broadblade006: { //* 에너지 절단: 신상시
    atk: 587,
    value: [48.6, 12],
    statType: [FixedStats.critDmg.id, FixedStats.atkPct.id],
  },
  broadblade007: { //* 쿠모키리: 치사전무
    atk: 500,
    value: [36.0, 12],
    statType: [FixedStats.critRate.id, FixedStats.atkPct.id],
  },
  broadblade008: { //* 별하늘 연산 측정기 : 모니에 전무
    atk: 412,
    value: [77.0, 16],
    statType: [FixedStats.resonanceBns.id, FixedStats.defPct.id]
  },
  //$ --------------------------------------------------
  broadblade101: {
    atk: 337,
    value: [51.8, 0],
    statType: ["resonanceBns", "atk"],
  },
  broadblade102: {
    atk: 412,
    value: [32.4, 0],
    statType: ["resonanceBns", "atk"],
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
    statType: ["critRate", "atk"],
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
  broadblade108: { //* 금빛 하늘: 신패스
    atk: 412,
    value: [40.5, 0],
    statType: [FixedStats.critDmg.id, FixedStats.dummy.id],
  },
  //#endregion

  //#region Gauntlet
  gauntlet001: {
    atk: 587,
    value: [36.4, 12.8],
    statType: ["atkPct", "resonanceBns"],
  },
  gauntlet002: {
    atk: 587,
    value: [24.3, 12],
    statType: ["critRate", "typeBns"],
  },
  gauntlet003: {
    atk: 587,
    value: [24.3, 12],
    statType: ["critRate", "atkPct"],
  },
  gauntlet004: {
    atk: 587,
    value: [48.6, 12],
    statType: ["critDmg", "atkPct"],
  },
  gauntlet005: {
    atk: 500,
    value: [36.0, 12],
    statType: [FixedStats.critRate.id, FixedStats.atkPct.id],
  },
  gauntlet006: { //* 격동의 조력: 신상시
    atk: 587,
    value: [24.3, 12],
    statType: [FixedStats.critRate.id, FixedStats.atkPct.id],
  },
  gauntlet007: { //* 한낮의 의지: 루크 헤르센 전무
    atk: 587,
    value: [24.3, 12],
    statType: [FixedStats.critRate.id, FixedStats.atkPct.id],
  },
  gauntlet008: { //* 솔스원의 해석: 시그리카 전무
    atk: 587,
    value: [48.6, 12],
    statType: [FixedStats.critDmg.id, FixedStats.atkPct.id],
  },
  //$ ---------------------------------------
  gauntlet101: {
    atk: 337,
    value: [51.8, 0],
    statType: ["resonanceBns", "atk"],
  },
  gauntlet102: {
    atk: 387,
    value: [38.8, 0],
    statType: ["resonanceBns", "atk"],
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
    statType: ["critRate", "atk"],
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
  gauntlet108: { //* 거침없는 비상: 신패스
    atk: 412,
    value: [40.5, 0],
    statType: [FixedStats.critDmg.id, FixedStats.dummy.id],
  },
  //#endregion

  //#region Firearm
  pistol001: {
    atk: 587,
    value: [24.3, 12.8],
    statType: ["critRate", "resonanceBns"],
  },
  pistol002: {
    atk: 500,
    value: [72, 12],
    statType: ["critDmg", "atkPct"],
  },
  pistol003: {
    atk: 500,
    value: [36, 12],
    statType: ["critRate", "atkPct"],
  },
  pistol004: {
    atk: 587,
    value: [48.6, 12],
    statType: [FixedStats.critDmg.id, FixedStats.atkPct.id],
  },
  pistol005: { //* 위산의 파동: 신상시
    atk: 587,
    value: [48.6, 12],
    statType: [FixedStats.critDmg.id, FixedStats.atkPct.id],
  },
  pistol006: { //* 스펙트럼 블래스터: 린네전무
    atk: 587,
    value: [24.3, 12],
    statType: [FixedStats.critRate.id, FixedStats.atkPct.id],
  },
  //$ -------------------------------------------
  pistol101: {
    atk: 337,
    value: [51.8, 0],
    statType: ["resonanceBns", "atk"],
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
  pistol108: { //* 태양 불꽃
    atk: 412,
    value: [20.2, 0],
    statType: [FixedStats.critRate.id, FixedStats.dummy.id],
  },
  //#endregion

  //#region Amplifter
  rectifier001: {
    atk: 500,
    value: [53.9, 12.8],
    statType: ["atkPct", "resonanceBns"],
  },
  rectifier002: {
    atk: 500,
    value: [36, 12],
    statType: ["critRate", "typeBns"],
  },
  rectifier003: {
    atk: 500,
    value: [72, 12],
    statType: ["critDmg", "atkPct"],
  },
  rectifier004: {
    atk: 412,
    value: [77, 12],
    statType: ["resonanceBns", "hpPct"],
  },
  rectifier005: {
    atk: 500,
    value: [36, 12],
    statType: ["critRate", "atkPct"],
  },
  rectifier006: {
    atk: 500,
    value: [72, 12],
    statType: ["critDmg", "atkPct"],
  },
  rectifier007: {
    atk: 587,
    value: [24.3, 12],
    statType: [FixedStats.critRate.id, FixedStats.atkPct.id],
  },
  rectifier008: { //* 보손 관측기: 신상시
    atk: 525,
    value: [38.8, 12],
    statType: [FixedStats.resonanceBns.id, FixedStats.atkPct.id],
  },
  rectifier009: { //* 위조된 작은별 (데니아)
    atk: 500,
    value: [36.0, 12],
    statType: [FixedStats.critRate.id, FixedStats.atkPct.id],
  },
  //$ -----------------------------------------------
  rectifier101: {
    atk: 337,
    value: [51.8, 0],
    statType: ["resonanceBns", "atk"],
  },
  rectifier102: {
    atk: 337,
    value: [51.8, 0],
    statType: ["resonanceBns", "atk"],
  },
  rectifier103: {
    atk: 462,
    value: [18.2, 0],
    statType: ["atkPct", "atk"],
  },
  rectifier104: {
    atk: 337,
    value: [51.8, 0],
    statType: ["resonanceBns", "atk"],
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
    statType: ["critRate", "atk"],
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
    statType: [FixedStats.critDmg.id, FixedStats.dummy.id],
  },
  //#endregion

  dummy: {
    atk: 0,
    value: [0.0, 0.0],
    statType: ["dummy", "dummy"],
  }
} as const satisfies Record<string, WeaponStat>;

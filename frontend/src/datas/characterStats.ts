export interface CharacterStat {
  baseHp: number;
  baseAtk: number;
  baseDef: number;

  CritRate: number;
  CritDmg: number;
  healBns: number;
  ResonanceBns: number;

  atkPct: number;
  hpPct: number;
  defPct: number;

  typeBns: readonly number[];
}

export const characterStat = {
  /* Temp Data
  temp: {
    baseHp: 0,
    baseAtk: 0,
    baseDef: 0,

    CritRate: 5.0,
    CritDmg: 150.0,
    healBns: 0.0,
    ResonanceBns: 100.0,

    atkPct: 0.0,
    hpPct: 0.0,
    defPct: 0.0,

    typeBns: [0, 0.0],
  },
  */

  // == 3.2 ======================================= //
  /* sigrika: {
    baseHp: 0,
    baseAtk: 0,
    baseDef: 0,

    CritRate: 5.0,
    CritDmg: 150.0,
    healBns: 0.0,
    ResonanceBns: 100.0,

    atkPct: 0.0,
    hpPct: 0.0,
    defPct: 0.0,

    typeBns: [0, 0.0],
  },
  */
  // == 3.1 ======================================= //
  luuk_herssen: {
    baseHp: 0,
    baseAtk: 0,
    baseDef: 0,

    CritRate: 5.0,
    CritDmg: 150.0,
    healBns: 0.0,
    ResonanceBns: 100.0,

    atkPct: 0.0,
    hpPct: 0.0,
    defPct: 0.0,

    typeBns: [0, 0.0],
  },
  aemeath: {
    baseHp: 11025,
    baseAtk: 425,
    baseDef: 1148,

    CritRate: 13.0,
    CritDmg: 150.0,
    healBns: 0.0,
    ResonanceBns: 100.0,

    atkPct: 12.0,
    hpPct: 0.0,
    defPct: 0.0,

    typeBns: [0, 0.0],
  },
  // == 3.0 ======================================= //
  mornye: {
    baseHp: 15375,
    baseAtk: 287,
    baseDef: 1356,

    CritRate: 5.0,
    CritDmg: 150.0,
    healBns: 0.0,
    ResonanceBns: 100.0,

    atkPct: 0.0,
    hpPct: 0.0,
    defPct: 15.2,

    typeBns: [0, 12.0],
  },
  lynae: {
    baseHp: 12237,
    baseAtk: 375,
    baseDef: 1197,

    CritRate: 13.0,
    CritDmg: 150.0,
    healBns: 0.0,
    ResonanceBns: 100.0,

    atkPct: 12.0,
    hpPct: 0.0,
    defPct: 0.0,

    typeBns: [0, 0.0],
  },
  // == 2.8 ======================================= //
  chisa: {
    baseHp: 10775,
    baseAtk: 437,
    baseDef: 1136,

    CritRate: 13.0,
    CritDmg: 150.0,
    healBns: 0.0,
    ResonanceBns: 100.0,

    atkPct: 12.0,
    hpPct: 0.0,
    defPct: 0.0,

    typeBns: [0, 0.0],
  },
  buling: {
    baseHp: 9850,
    baseAtk: 262,
    baseDef: 1075,

    CritRate: 5.0,
    CritDmg: 150.0,
    healBns: 0.0,
    ResonanceBns: 100.0,

    atkPct: 12.0,
    hpPct: 0.0,
    defPct: 0.0,

    typeBns: [0, 12.0],
  },
  // =========================================== //
  aalto: {
    baseHp: 9850,
    baseAtk: 262,
    baseDef: 1075,

    CritRate: 5.0,
    CritDmg: 150.0,
    healBns: 0.0,
    ResonanceBns: 100.0,

    atkPct: 12.0,
    hpPct: 0.0,
    defPct: 0.0,

    typeBns: [0, 12.0],
  },
  baizhi: {
    baseHp: 12812,
    baseAtk: 212,
    baseDef: 1002,

    CritRate: 5.0,
    CritDmg: 150.0,
    healBns: 12.0,
    ResonanceBns: 100.0,

    atkPct: 0.0,
    hpPct: 12.0,
    defPct: 0.0,

    typeBns: [0, 0.0],
  },
  brant: {
    baseHp: 11675,
    baseAtk: 375,
    baseDef: 1307,

    CritRate: 13.0,
    CritDmg: 150.0,
    healBns: 0.0,
    ResonanceBns: 100.0,

    atkPct: 12.0,
    hpPct: 0.0,
    defPct: 0.0,

    typeBns: [0, 0.0],
  },
  calcharo: {
    baseHp: 10500,
    baseAtk: 437,
    baseDef: 1185,

    CritRate: 5.0,
    CritDmg: 166.0,
    healBns: 0.0,
    ResonanceBns: 100.0,

    atkPct: 12.0,
    hpPct: 0.0,
    defPct: 0.0,

    typeBns: [0, 0.0],
  },
  camellya: {
    baseHp: 10325,
    baseAtk: 450,
    baseDef: 1161,

    CritRate: 5.0,
    CritDmg: 166.0,
    healBns: 0.0,
    ResonanceBns: 100.0,

    atkPct: 12.0,
    hpPct: 0.0,
    defPct: 0.0,

    typeBns: [15.0, 15.0],
  },
  cantarella: {
    baseHp: 11600,
    baseAtk: 400,
    baseDef: 1099,

    CritRate: 13.0,
    CritDmg: 150.0,
    healBns: 20.0,
    ResonanceBns: 100.0,

    atkPct: 12.0,
    hpPct: 0.0,
    defPct: 0.0,

    typeBns: [20, 0.0],
  },
  carlotta: {
    baseHp: 12450,
    baseAtk: 462,
    baseDef: 1197,

    CritRate: 13.0,
    CritDmg: 150.0,
    healBns: 0.0,
    ResonanceBns: 100.0,

    atkPct: 12.0,
    hpPct: 0.0,
    defPct: 0.0,

    typeBns: [0, 0.0],
  },
  changli: {
    baseHp: 10388,
    baseAtk: 462,
    baseDef: 1099,

    CritRate: 13.0,
    CritDmg: 150.0,
    healBns: 0.0,
    ResonanceBns: 100.0,

    atkPct: 12.0,
    hpPct: 0.0,
    defPct: 0.0,

    typeBns: [0, 0.0],
  },
  chiaccona: {
    baseHp: 12237,
    baseAtk: 375,
    baseDef: 1197,

    CritRate: 5.0,
    CritDmg: 166.0,
    healBns: 0.0,
    ResonanceBns: 100.0,

    atkPct: 12.0,
    hpPct: 0.0,
    defPct: 0.0,

    typeBns: [0, 0.0],
  },
  chixia: {
    baseHp: 9087,
    baseAtk: 300,
    baseDef: 953,

    CritRate: 5.0,
    CritDmg: 150.0,
    healBns: 0.0,
    ResonanceBns: 100.0,

    atkPct: 12.0,
    hpPct: 0.0,
    defPct: 0.0,

    typeBns: [0, 12.0],
  },
  danjin: {
    baseHp: 9437,
    baseAtk: 262,
    baseDef: 1148,

    CritRate: 5.0,
    CritDmg: 150.0,
    healBns: 0.0,
    ResonanceBns: 100.0,

    atkPct: 12.0,
    hpPct: 0.0,
    defPct: 0.0,

    typeBns: [0, 12.0],
  },
  encore: {
    baseHp: 10512,
    baseAtk: 425,
    baseDef: 1246,

    CritRate: 5.0,
    CritDmg: 150.0,
    healBns: 0.0,
    ResonanceBns: 100.0,

    atkPct: 12.0,
    hpPct: 0.0,
    defPct: 0.0,

    typeBns: [0, 12.0],
  },
  jianxin: {
    baseHp: 14112,
    baseAtk: 337,
    baseDef: 1124,

    CritRate: 13.0,
    CritDmg: 150.0,
    healBns: 0.0,
    ResonanceBns: 100.0,

    atkPct: 12.0,
    hpPct: 0.0,
    defPct: 0.0,

    typeBns: [20, 0.0],
  },
  jinhsi: {
    baseHp: 10825,
    baseAtk: 412,
    baseDef: 1258,

    CritRate: 13.0,
    CritDmg: 150.0,
    healBns: 0.0,
    ResonanceBns: 100.0,

    atkPct: 12.0,
    hpPct: 0.0,
    defPct: 0.0,

    typeBns: [0, 20.0],
  },
  jiyan: {
    baseHp: 10487,
    baseAtk: 437,
    baseDef: 1185,

    CritRate: 13.0,
    CritDmg: 150.0,
    healBns: 0.0,
    ResonanceBns: 100.0,

    atkPct: 12.0,
    hpPct: 0.0,
    defPct: 0.0,

    typeBns: [0, 0.0],
  },
  lingyang: {
    baseHp: 10387,
    baseAtk: 437,
    baseDef: 1209,

    CritRate: 5.0,
    CritDmg: 150.0,
    healBns: 0.0,
    ResonanceBns: 100.0,

    atkPct: 12.0,
    hpPct: 0.0,
    defPct: 0.0,

    typeBns: [0, 12.0],
  },
  lumi: {
    baseHp: 8500,
    baseAtk: 337,
    baseDef: 879,

    CritRate: 13.0,
    CritDmg: 150.0,
    healBns: 0.0,
    ResonanceBns: 100.0,

    atkPct: 12.0,
    hpPct: 0.0,
    defPct: 0.0,

    typeBns: [0, 0.0],
  },
  mortefi: {
    baseHp: 10025,
    baseAtk: 250,
    baseDef: 1136,

    CritRate: 5.0,
    CritDmg: 150.0,
    healBns: 0.0,
    ResonanceBns: 100.0,

    atkPct: 12.0,
    hpPct: 0.0,
    defPct: 0.0,

    typeBns: [0, 12.0],
  },
  phoebe: {
    baseHp: 10825,
    baseAtk: 412,
    baseDef: 1258,

    CritRate: 5.0,
    CritDmg: 166.0,
    healBns: 0.0,
    ResonanceBns: 100.0,

    atkPct: 12.0,
    hpPct: 0.0,
    defPct: 0.0,

    typeBns: [0, 0.0],
  },
  roccia: {
    baseHp: 12250,
    baseAtk: 375,
    baseDef: 1197,

    CritRate: 5.0,
    CritDmg: 166.0,
    healBns: 0.0,
    ResonanceBns: 100.0,

    atkPct: 12.0,
    hpPct: 0.0,
    defPct: 0.0,

    typeBns: [0, 0.0],
  },
  rover_spectro: {
    baseHp: 11400,
    baseAtk: 375,
    baseDef: 1368,

    CritRate: 5.0,
    CritDmg: 150.0,
    healBns: 0.0,
    ResonanceBns: 100.0,

    atkPct: 12.0,
    hpPct: 0.0,
    defPct: 0.0,

    typeBns: [0, 12.0],
  },
  rover_havoc: {
    baseHp: 10825,
    baseAtk: 412,
    baseDef: 1258,

    CritRate: 5.0,
    CritDmg: 150.0,
    healBns: 0.0,
    ResonanceBns: 100.0,

    atkPct: 12.0,
    hpPct: 0.0,
    defPct: 0.0,

    typeBns: [0, 12.0],
  },
  rover_aero: {
    baseHp: 10775,
    baseAtk: 437,
    baseDef: 1136,

    CritRate: 5.0,
    CritDmg: 150.0,
    healBns: 0.0,
    ResonanceBns: 100.0,

    atkPct: 12.0,
    hpPct: 0.0,
    defPct: 0.0,

    typeBns: [12, 0.0],
  },
  sanhua: {
    baseHp: 10062,
    baseAtk: 275,
    baseDef: 941,

    CritRate: 5.0,
    CritDmg: 150.0,
    healBns: 0.0,
    ResonanceBns: 100.0,

    atkPct: 12.0,
    hpPct: 0.0,
    defPct: 0.0,

    typeBns: [0, 12.0],
  },
  shorekeeper: {
    baseHp: 16712,
    baseAtk: 287,
    baseDef: 1099,

    CritRate: 5.0,
    CritDmg: 150.0,
    healBns: 0.0,
    ResonanceBns: 100.0,

    atkPct: 0.0,
    hpPct: 12.0,
    defPct: 0.0,

    typeBns: [12.0, 0.0],
  },
  taoqi: {
    baseHp: 8950,
    baseAtk: 225,
    baseDef: 1564,

    CritRate: 5.0,
    CritDmg: 150.0,
    healBns: 0.0,
    ResonanceBns: 100.0,

    atkPct: 0.0,
    hpPct: 0.0,
    defPct: 15.2,

    typeBns: [0, 12.0],
  },
  verina: {
    baseHp: 14237,
    baseAtk: 337,
    baseDef: 1099,

    CritRate: 5.0,
    CritDmg: 150.0,
    healBns: 0.0,
    ResonanceBns: 100.0,

    atkPct: 12.0,
    hpPct: 0.0,
    defPct: 0.0,

    typeBns: [12, 0.0],
  },
  xiangliyao: {
    baseHp: 10625,
    baseAtk: 425,
    baseDef: 1222,

    CritRate: 5.0,
    CritDmg: 166.0,
    healBns: 0.0,
    ResonanceBns: 100.0,

    atkPct: 12.0,
    hpPct: 0.0,
    defPct: 0.0,

    typeBns: [0, 0.0],
  },
  yangyang: {
    baseHp: 10200,
    baseAtk: 250,
    baseDef: 1099,

    CritRate: 5.0,
    CritDmg: 150.0,
    healBns: 0.0,
    ResonanceBns: 100.0,

    atkPct: 12.0,
    hpPct: 0.0,
    defPct: 0.0,

    typeBns: [0, 12.0],
  },
  yinlin: {
    baseHp: 11000,
    baseAtk: 400,
    baseDef: 1283,

    CritRate: 13.0,
    CritDmg: 150.0,
    healBns: 0.0,
    ResonanceBns: 100.0,

    atkPct: 12.0,
    hpPct: 0.0,
    defPct: 0.0,

    typeBns: [0, 0.0],
  },
  youhu: {
    baseHp: 9975,
    baseAtk: 262,
    baseDef: 1051,

    CritRate: 13.0,
    CritDmg: 150.0,
    healBns: 0.0,
    ResonanceBns: 100.0,

    atkPct: 12.0,
    hpPct: 0.0,
    defPct: 0.0,

    typeBns: [0, 0.0],
  },
  yuanwu: {
    baseHp: 8525,
    baseAtk: 225,
    baseDef: 1637,

    CritRate: 5.0,
    CritDmg: 150.0,
    healBns: 0.0,
    ResonanceBns: 100.0,

    atkPct: 0.0,
    hpPct: 0.0,
    defPct: 15.2,

    typeBns: [0, 12.0],
  },
  zani: {
    baseHp: 10775,
    baseAtk: 437,
    baseDef: 1136,

    CritRate: 13.0,
    CritDmg: 150.0,
    healBns: 0.0,
    ResonanceBns: 100.0,

    atkPct: 12.0,
    hpPct: 0.0,
    defPct: 0.0,

    typeBns: [0, 0.0],
  },
  zhezhi: {
    baseHp: 12250,
    baseAtk: 375,
    baseDef: 1197,

    CritRate: 13.0,
    CritDmg: 150.0,
    healBns: 0.0,
    ResonanceBns: 100.0,

    atkPct: 12.0,
    hpPct: 0.0,
    defPct: 0.0,

    typeBns: [0, 0.0],
  },
  cartethyia: {
    baseHp: 14800,
    baseAtk: 312,
    baseDef: 611,

    CritRate: 13.0,
    CritDmg: 150.0,
    healBns: 0.0,
    ResonanceBns: 100.0,

    atkPct: 0.0,
    hpPct: 12.0,
    defPct: 0.0,

    typeBns: [0, 0.0],
  },
  lupa: {
    baseHp: 11912,
    baseAtk: 387,
    baseDef: 1185,

    CritRate: 13.0,
    CritDmg: 150.0,
    healBns: 0.0,
    ResonanceBns: 100.0,

    atkPct: 12.0,
    hpPct: 0.0,
    defPct: 0.0,

    typeBns: [0, 0.0],
  },
  phrolova: {
    baseHp: 10775,
    baseAtk: 437,
    baseDef: 1136,

    CritRate: 13.0,
    CritDmg: 150.0,
    healBns: 0.0,
    ResonanceBns: 100.0,

    atkPct: 12.0,
    hpPct: 0.0,
    defPct: 0.0,

    typeBns: [0, 0.0],
  },
  augusta: {
    baseHp: 10300,
    baseAtk: 462,
    baseDef: 1112,

    CritRate: 13.0,
    CritDmg: 150.0,
    healBns: 0.0,
    ResonanceBns: 100.0,

    atkPct: 12.0,
    hpPct: 0.0,
    defPct: 0.0,

    typeBns: [0, 0.0],
  },
  iuno: {
    baseHp: 10525,
    baseAtk: 450,
    baseDef: 1124,

    CritRate: 13.0,
    CritDmg: 150.0,
    healBns: 0.0,
    ResonanceBns: 100.0,

    atkPct: 12.0,
    hpPct: 0.0,
    defPct: 0.0,

    typeBns: [0, 0.0],
  },
  galbrena: {
    baseHp: 10000,
    baseAtk: 500,
    baseDef: 1000,

    CritRate: 5.0,
    CritDmg: 166.0,
    healBns: 0.0,
    ResonanceBns: 100.0,

    atkPct: 0.0,
    hpPct: 0.0,
    defPct: 0.0,

    typeBns: [0, 0.0],
  },
  qiuyuan: {
    baseHp: 10000,
    baseAtk: 500,
    baseDef: 1000,

    CritRate: 5.0,
    CritDmg: 150.0,
    healBns: 0.0,
    ResonanceBns: 100.0,

    atkPct: 0.0,
    hpPct: 0.0,
    defPct: 0.0,

    typeBns: [0, 0.0],
  },
} as const;
export type CharacterId = keyof typeof characterStat;

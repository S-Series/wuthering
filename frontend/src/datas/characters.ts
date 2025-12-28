export const WeaponTypes = [
  "sword",
  "broadblade",
  "gauntlet",
  "pistol",
  "rectifier",
] as const;
export type WeaponType = (typeof WeaponTypes)[number];

export const ElementTypes = [
  "aero",
  "glacio",
  "fusion",
  "electro",
  "havoc",
  "spectro",
] as const;
export type ElementType = (typeof ElementTypes)[number];

export interface Character {
  en: string;
  kr: string;
  jp: string;
  zh: string;
  hasSkin: boolean;
  weapon: WeaponType;
  element: ElementType;
  type: "basic" | "heavy" | "skill" | "liberation" | "heal";
  version: number;
  isElite: boolean;
  region: //==================================================//
  | "Spastract Collective" // = //@ 스페이스트렉 콜렉티브 (라하이 로이)
    | "Statotchi Academy" // == //@ 스타토치 아카데미 (라하이 로이)
    //========================================================//
    | "Fractsidus" // ========= //@ 잔성회
    | "Seven Hills" // ======== //@ 일곱언덕 (리나시타)
    | "Ragunna" // ============ //@ 라군나 (리나시타)
    //========================================================//
    | "Black Shores" // ======= //@ 검은해안
    | "Huanglong" // ========== //@ 황룡
    | "Unknown"; // =========== //@ 기타, 알 수 없음
  //==========================================================//
}

export const character: Record<string, Character> = {
  //$== ver 3.X ===========================//
  //*== ver 3.0 ===========================//

  //@== ver 2.X ===========================//
  //*== ver 2.8 ===========================//
  //*== ver 2.7 ===========================//
  //*== ver 2.6 ===========================//
  //*== ver 2.5 ===========================//
  //*== ver 2.4 ===========================//
  //*== ver 2.3 ===========================//
  //*== ver 2.2 ===========================//
  cantarella: {
    en: "cantarella",
    kr: "칸타렐라",
    jp: "カンタレラ",
    zh: "坎特蕾拉",
    hasSkin: false,
    weapon: "rectifier",
    element: "havoc",
    type: "basic",
    version: 2.2,
    isElite: true,
    region: "Ragunna",
  },
  rover_aero: {
    en: "rover : Aero",
    kr: "방랑자 (기류)",
    jp: "漂泊者",
    zh: "漂泊者",
    hasSkin: false,
    weapon: "sword",
    element: "aero",
    type: "heal",
    version: 2.2,
    isElite: true,
    region: "Unknown",
  },

  //*== ver 2.1 ===========================//
  brant: {
    en: "brant",
    kr: "브랜트",
    jp: "ブラント",
    zh: "布兰特",
    hasSkin: false,
    weapon: "sword",
    element: "fusion",
    type: "basic",
    version: 2.1,
    isElite: true,
    region: "Ragunna",
  },
  phoebe: {
    en: "phoebe",
    kr: "페비",
    jp: "フィービー",
    zh: "菲比",
    hasSkin: false,
    weapon: "rectifier",
    element: "spectro",
    type: "heavy",
    version: 2.1,
    isElite: true,
    region: "Ragunna",
  },
  //*== ver 2.0 ===========================//
  roccia: {
    en: "roccia",
    kr: "로코코",
    jp: "ロココ",
    zh: "洛可可",
    hasSkin: false,
    weapon: "gauntlet",
    element: "havoc",
    type: "heavy",
    version: 2.0,
    isElite: true,
    region: "Ragunna",
  },
  carlotta: {
    en: "carlotta",
    kr: "카를로타",
    jp: "カルロッタ",
    zh: "珂莱塔",
    hasSkin: false,
    weapon: "pistol",
    element: "glacio",
    type: "skill",
    version: 2.0,
    isElite: true,
    region: "Ragunna",
  },

  //$== ver 1.X ===========================//
  //*== ver 1.4 ===========================//
  lumi: {
    en: "lumi",
    kr: "루미",
    jp: "灯灯",
    zh: "灯灯",
    hasSkin: false,
    weapon: "broadblade",
    element: "electro",
    type: "skill",
    version: 1.4,
    isElite: false,
    region: "Huanglong",
  },
  camellya: {
    en: "camellya",
    kr: "카멜리아",
    jp: "ツバキ",
    zh: "椿",
    hasSkin: false,
    weapon: "sword",
    element: "havoc",
    type: "basic",
    version: 1.4,
    isElite: true,
    region: "Black Shores",
  },

  //*== ver 1.3 ===========================//
  youhu: {
    en: "youhu",
    kr: "유호",
    jp: "釉瑚",
    zh: "釉瑚",
    hasSkin: false,
    weapon: "gauntlet",
    element: "glacio",
    type: "heal",
    version: 1.3,
    isElite: false,
    region: "Huanglong",
  },
  shorekeeper: {
    en: "shorekeeper",
    kr: "파수인",
    jp: "ショアキーパー",
    zh: "守岸人",
    hasSkin: false,
    weapon: "rectifier",
    element: "spectro",
    type: "heal",
    version: 1.3,
    isElite: true,
    region: "Black Shores",
  },

  //*== ver 1.2 ===========================//
  xiangliyao: {
    en: "xiangliyao",
    kr: "상리요",
    jp: "相里要",
    zh: "相里要",
    hasSkin: false,
    weapon: "gauntlet",
    element: "electro",
    type: "liberation",
    version: 1.2,
    isElite: true,
    region: "Huanglong",
  },
  zhezhi: {
    en: "zhezhi",
    kr: "절지",
    jp: "折枝",
    zh: "折枝",
    hasSkin: false,
    weapon: "rectifier",
    element: "glacio",
    type: "skill",
    version: 1.2,
    isElite: true,
    region: "Huanglong",
  },

  //*== ver 1.1 ===========================//
  changli: {
    en: "changli",
    kr: "장리",
    jp: "長離",
    zh: "长离",
    hasSkin: false,
    weapon: "sword",
    element: "fusion",
    type: "skill",
    version: 1.1,
    isElite: true,
    region: "Huanglong",
  },
  jinhsi: {
    en: "jinhsi",
    kr: "금희",
    jp: "今汐",
    zh: "今汐",
    hasSkin: true,
    weapon: "broadblade",
    element: "spectro",
    type: "skill",
    version: 1.1,
    isElite: true,
    region: "Huanglong",
  },

  //*== ver 1.0 ===========================//
  yinlin: {
    en: "yinlin",
    kr: "음림",
    jp: "吟霖",
    zh: "吟霖",
    hasSkin: false,
    weapon: "rectifier",
    element: "electro",
    type: "skill",
    version: 1.0,
    isElite: true,
    region: "Huanglong",
  },
  jiyan: {
    en: "jiyan",
    kr: "기염",
    jp: "忌炎",
    zh: "忌炎",
    hasSkin: false,
    weapon: "broadblade",
    element: "aero",
    type: "heavy",
    version: 1.0,
    isElite: true,
    region: "Huanglong",
  },
  rover_havoc: {
    en: "rover : Havoc",
    kr: "방랑자 (인멸)",
    jp: "漂泊者",
    zh: "漂泊者",
    hasSkin: false,
    weapon: "sword",
    element: "havoc",
    type: "liberation",
    version: 1.0,
    isElite: true,
    region: "Unknown",
  },

  //$== ver 0.0 ===========================//
  rover_spectro: {
    en: "rover : Spectro",
    kr: "방랑자 (회절)",
    jp: "漂泊者",
    zh: "漂泊者",
    hasSkin: false,
    weapon: "sword",
    element: "spectro",
    type: "liberation",
    version: 1.0,
    isElite: true,
    region: "Unknown",
  },
};

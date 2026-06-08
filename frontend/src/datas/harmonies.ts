import { FixedStats, type StatId } from "./stats";

export type HarmonyStatOption = {
  statId: StatId;
  value: number;
};
type HarmonyOptionEntry = {
  count: number;
  options: HarmonyStatOption[];
};

export interface HarmonyOption {
  id: string;
  en: string;
  kr: string;
  jp: string;
  zh: string;
  option: HarmonyOptionEntry[];
  colorCode: string;
}

export const harmony = {
  /*
  asdf: {
    id: "",
    en: "",
    kr: "",
    jp: "",
    zh: "",
    option: [
      {
        count: 2,
        options: [
          { statId: FixedStats..id, value: .0 },
        ],
      },
      {
        count: 5,
        options: [
          { statId: FixedStats..id, value: .0 },
        ],
      },
    ],
    colorCode: "#",
  },
  */

  //#region Ver3.0 Echos
  Adam: {
    id: "Adam",
    en: "Shadow of Shattered Dreams",
    kr: "꿈을 깨뜨리는 망령의 악몽",
    jp: "ナイトメア・スペクター",
    zh: "碎梦亡鬼之魇",
    option: [
      {
        count: 1,
        options: [
          { statId: FixedStats.basicBns.id, value: 35.0 },
          { statId: FixedStats.heavyBns.id, value: 35.0 },
        ],
      },
    ],
    colorCode: "#",
  },
  Memories: {
    id: "Memories",
    en: "Reel of Spliced Memories",
    kr: "마음을 엮은 꿈의 그림자",
    jp: "モンタージュ・シルエット",
    zh: "剪心辑梦之影",
    option: [
      {
        count: 2,
        options: [
          { statId: FixedStats.atkPct.id, value: 10.0 },
        ],
      },
      {
        count: 5,
        options: [],
      },
    ],
    colorCode: "#",
  },
  Snowfall: {
    id: "Snowfall",
    en: "Wishes of Quiet Snowfall",
    kr: "소리 없이 내려앉은 기도의 눈",
    jp: "静寂祈念の雪",
    zh: "雪落无声之愿",
    option: [
      {
        count: 2,
        options: [
          { statId: FixedStats.glacioBns.id, value: 10.0 },
        ],
      },
      {
        count: 5,
        options: [
          { statId: FixedStats.glacioBns.id, value: 10.0 },
          { statId: FixedStats.critRate.id, value: 25.0 },
        ],
      },
    ],
    colorCode: "#",
  },
  Star: {
    id: "Star",
    en: "Trailblazing Star",
    kr: "긴 여정을 떠나는 별",
    jp: "アストロ・ロード",
    zh: "長路啟航之星",
    option: [
      {
        count: 2,
        options: [
          { statId: FixedStats.fusionBns.id, value: 10.0 },
        ],
      },
      {
        count: 5,
        options: [
          { statId: FixedStats.critRate.id, value: 20.0 },
          { statId: FixedStats.fusionBns.id, value: 20.0 },
        ],
      },
    ],
    colorCode: "#",
  },
  Sound: {
    id: "Sound",
    en: "Sound of True Name",
    kr: "함의의 소리를 따라",
    jp: "セマンティック・ウィッシュ",
    zh: "聽喚語義之願",
    option: [
      {
        count: 2,
        options: [
          { statId: FixedStats.aeroBns.id, value: 10.0 },
        ],
      },
      {
        count: 5,
        options: [
          { statId: FixedStats.aeroBns.id, value: 15.0 },
        ],
      },
    ],
    colorCode: "#",
  },
  Foam: {
    id: "Foam",
    en: "Chromatic Foam",
    kr: "오색찬란한 거품",
    jp: "パティナ・フォーム",
    zh: "斑駁粉飾之沫",
    option: [
      {
        count: 2,
        options: [
          { statId: FixedStats.fusionBns.id, value: 10.0 },
        ],
      },
      {
        count: 5,
        options: [
          { statId: FixedStats.fusionBns.id, value: 10.0 },
        ],
      },
    ],
    colorCode: "#",
  },
  Leap: {
    id: "Leap",
    en: "Pact of Neonlight Leap",
    kr: "역광 속 눈부신 서약",
    jp: "リフレクト・ブレイズ",
    zh: "逆光跃彩之约",
    option: [
      {
        count: 2,
        options: [
          { statId: FixedStats.spectroBns.id, value: 10.0 },
        ],
      },
      {
        count: 5,
        options: [
          { statId: FixedStats.spectroBns.id, value: 30.0 },
          { statId: FixedStats.basicBns.id, value: 40.0 },
        ],
      },
    ],
    colorCode: "#",
  },
  Halo: {
    id: "Halo",
    en: "Halo of Starry Radiance",
    kr: "빛을 쫓는 별의 고리",
    jp: "スターブライト・リング",
    zh: "星构寻辉之环",
    option: [
      {
        count: 2,
        options: [
          { statId: FixedStats.healBns.id, value: 10.0 },
        ],
      },
      {
        count: 5,
        options: [
          { statId: FixedStats.dummy.id, value: .0 },
        ],
      },
    ],
    colorCode: "#",
  },
  Revelation: {
    id: "Revelation",
    en: "Rite of Cilded Revelation",
    kr: "흐르는 금빛 속 진리의 답",
    jp: "ゴールデン・ヴァリアント",
    zh: "流金溯真之式",
    option: [
      {
        count: 2,
        options: [
          { statId: FixedStats.spectroBns.id, value: 10.0 },
        ],
      },
      {
        count: 5,
        options: [
          { statId: FixedStats.dummy.id, value: .0 },
        ],
      },
    ],
    colorCode: "#",
  },
  //#endregion

  //#region Ver2.0 Echos
  Fate: {
    id: "Fate",
    en: "Thread of Severed Fate",
    kr: "운명을 붕괴시키는 현",
    jp: "命理崩壊の弦",
    zh: "命理崩毁之弦",
    option: [
      {
        count: 3,
        options: [
          { statId: FixedStats.atkPct.id, value: 20.0 },
          { statId: FixedStats.liberationBns.id, value: 30.0 },
        ],
      },
    ],
    colorCode: "#",
  },
  Frosty: {
    id: "Frosty",
    en: "Frosty Resolve",
    kr: "냉철한 결단",
    jp: "フロステッド・ハート",
    zh: "凌冽决断之心",
    option: [
      {
        count: 2,
        options: [
          { statId: FixedStats.skillBns.id, value: 12.0 },
        ],
      },
      {
        count: 5,
        options: [
          { statId: FixedStats.glacioBns.id, value: 22.5 },
          { statId: FixedStats.skillBns.id, value: 36.0 },
        ],
      },
    ],
    colorCode: "#",
  },
  Radiance: {
    id: "Radiance",
    en: "Eternal Radiance",
    kr: "영원의 광채",
    jp: "エターナル・ライト",
    zh: "此间永驻之光",
    option: [
      {
        count: 2,
        options: [
          { statId: FixedStats.spectroBns.id, value: 10.0 },
        ],
      },
      {
        count: 5,
        options: [
          { statId: FixedStats.critRate.id, value: 20.0 },
          { statId: FixedStats.spectroBns.id, value: 15.0 },
        ],
      },
    ],
    colorCode: "#",
  },
  Veil: {
    id: "Veil",
    en: "Midnight Veil",
    kr: "어둠의 장막",
    jp: "ミッドナイト・ベール",
    zh: "幽夜隐匿之帷",
    option: [
      {
        count: 2,
        options: [
          { statId: FixedStats.havocBns.id, value: 10.0 },
        ],
      },
      {
        count: 5,
        options: [
          { statId: FixedStats.dummy.id, value: .0 },
        ],
      },
    ],
    colorCode: "#",
  },
  Empyrean: {
    id: "Empyrean",
    en: "Empyrean Anthem",
    kr: "하늘의 합주곡",
    jp: "セレッシャル・アンサム",
    zh: "高天共奏之曲",
    option: [
      {
        count: 2,
        options: [
          { statId: FixedStats.resonanceBns.id, value: 10.0 },
        ],
      },
      {
        count: 5,
        options: [
          { statId: FixedStats.dummy.id, value: .0 },
        ],
      },
    ],
    colorCode: "#",
  },
  Courage: {
    id: "Courage",
    en: "Tidebreaking Courage",
    kr: "파도에 맞선 용기",
    jp: "タイズターニング・ヴァラ",
    zh: "无惧浪涛之勇",
    option: [
      {
        count: 2,
        options: [
          { statId: FixedStats.resonanceBns.id, value: 10.0 },
        ],
      },
      {
        count: 5,
        options: [
          { statId: FixedStats.atkPct.id, value: 15.0 },
          { statId: FixedStats.typeBns.id, value: 30.0 },
        ],
      },
    ],
    colorCode: "#",
  },
  Welkin: {
    id: "Welkin",
    en: "Gusts of Welkin",
    kr: "끝없는 하늘",
    jp: "バウンドレス・スカイ",
    zh: "流云逝尽之空",
    option: [
      {
        count: 2,
        options: [
          { statId: FixedStats.aeroBns.id, value: 10.0 },
        ],
      },
      {
        count: 5,
        options: [
          { statId: FixedStats.aeroBns.id, value: 30.0 },
        ],
      },
    ],
    colorCode: "#",
  },
  Pilgrimage: {
    id: "Pilgrimage",
    en: "Windward Pilgrimage",
    kr: "영광이 깃든 바람",
    jp: "グロリアス・ウィンド",
    zh: "愿戴荣光之旅",
    option: [
      {
        count: 2,
        options: [
          { statId: FixedStats.aeroBns.id, value: 10.0 },
        ],
      },
      {
        count: 5,
        options: [
          { statId: FixedStats.aeroBns.id, value: 30.0 },
          { statId: FixedStats.critRate.id, value: 10.0 },
        ],
      },
    ],
    colorCode: "#",
  },
  Clawprint: {
    id: "Clawprint",
    en: "Flaming Clawprint",
    kr: "울부짖는 불꽃",
    jp: "ハウリング・フレイム",
    zh: "奔狼燎原之焰",
    option: [
      {
        count: 2,
        options: [
          { statId: FixedStats.fusionBns.id, value: 10.0 },
        ],
      },
      {
        count: 5,
        options: [
          { statId: FixedStats.fusionBns.id, value: 15.0 },
          { statId: FixedStats.liberationBns.id, value: 20.0 },
        ],
      },
    ],
    colorCode: "#",
  },
  Dream: {
    id: "Dream",
    en: "Dream of the Lost",
    kr: "뒤틀린 피안의 꿈",
    jp: "ロスト・ドリーム",
    zh: "失序彼岸之梦",
    option: [
      {
        count: 3,
        options: [
          { statId: FixedStats.critRate.id, value: 20.0 },
        ],
      },
    ],
    colorCode: "#",
  },
  Crown: {
    id: "Crown",
    en: "Crown of Valor",
    kr: "영광의 칼날로 만들어진 왕관",
    jp: "グローリーフォージ・クラウン",
    zh: "荣斗铸锋之冠",
    option: [
      {
        count: 3,
        options: [
          { statId: FixedStats.atkPct.id, value: 30.0 },
          { statId: FixedStats.critDmg.id, value: 20.0 },
        ],
      },
    ],
    colorCode: "#",
  },
  Law: {
    id: "Law",
    en: "Law of Harmony",
    kr: "만물의 숨결에 비롯된 울림",
    jp: "エーテル・レゾナンス",
    zh: "息界同调之律",
    option: [
      {
        count: 3,
        options: [
          { statId: FixedStats.heavyBns.id, value: 30.0 },
        ],
      },
    ],
    colorCode: "#",
  },
  Shadow: {
    id: "Shadow",
    en: "Flamewing's Shadow",
    kr: "불타는 깃털을 펼친 사냥꾼의 그림자",
    jp: "インフェルノ・シャドウ",
    zh: "焚羽猎魔之影",
    option: [
      {
        count: 3,
        options: [
          { statId: FixedStats.fusionBns.id, value: 16.0 },
        ],
      },
    ],
    colorCode: "#",
  },

  //#endregion

  //#region Ver1.0 Echos
  Frost: {
    id: "Frost",
    en: "Freezing Frost",
    kr: "야밤의 서리",
    jp: "夜にこびり付く白霜",
    zh: "凝夜白霜",
    option: [
      {
        count: 2,
        options: [
          { statId: FixedStats.glacioBns.id, value: 10.0 },
        ],
      },
      {
        count: 5,
        options: [
          { statId: FixedStats.glacioBns.id, value: 30.0 },
        ],
      },
    ],
    colorCode: "#",
  },
  Rift: {
    id: "Rift",
    en: "Molten Rift",
    kr: "솟구치는 용암",
    jp: "山を轟かせる崩火",
    zh: "熔山裂谷",
    option: [
      {
        count: 2,
        options: [
          { statId: FixedStats.fusionBns.id, value: 10.0},
        ],
      },
      {
        count: 5,
        options: [
          { statId: FixedStats.fusionBns.id, value: 30.0},
        ],
      },
    ],
    colorCode: "#",
  },
  Thunder: {
    id: "Thunder",
    en: "Void Thunder",
    kr: "울려퍼지는 뇌음",
    jp: "空を切り裂く冥雷",
    zh: "彻空冥雷",
    option: [
      {
        count: 2,
        options: [
          { statId: FixedStats.electroBns.id, value: 10.0},
        ],
      },
      {
        count: 5,
        options: [
          { statId: FixedStats.electroBns.id, value: 30.0},
        ],
      },
    ],
    colorCode: "#",
  },
  Gale: {
    id: "Gale",
    en: "Sierra Gale",
    kr: "스쳐가는 바람",
    jp: "谷を突き抜ける長風",
    zh: "啸谷长风",
    option: [
      {
        count: 2,
        options: [
          { statId: FixedStats.fusionBns.id, value: 10.0},
        ],
      },
      {
        count: 5,
        options: [
          { statId: FixedStats.fusionBns.id, value: 30.0},
        ],
      },
    ],
    colorCode: "#",
  },
  Light: {
    id: "Light",
    en: "Celestial Light",
    kr: "빛나는 별",
    jp: "闇を取り払う浮星",
    zh: "浮星祛暗",
    option: [
      {
        count: 2,
        options: [
          { statId: FixedStats.spectroBns.id, value: 10.0},
        ],
      },
      {
        count: 5,
        options: [
          { statId: FixedStats.spectroBns.id, value: 30.0},
        ],
      },
    ],
    colorCode: "#",
  },
  Eclipse: {
    id: "Eclipse",
    en: "Sun-sinking Eclipse",
    kr: "빛을 삼키는 해",
    jp: "二度と輝かない沈日",
    zh: "沉日劫明",
    option: [
      {
        count: 2,
        options: [
          { statId: FixedStats.havocBns.id, value: 10.0},
        ],
      },
      {
        count: 5,
        options: [
          { statId: FixedStats.havocBns.id, value: 10.0},
        ],
      },
    ],
    colorCode: "#cc99cc",
  },
  Rejuvent: {
    id: "Rejuvent",
    en: "Rejuvenating Glow",
    kr: "찬란한 광휘",
    jp: "喧騒に隠す回光",
    zh: "隐世回光",
    option: [
      {
        count: 2,
        options: [
          { statId: FixedStats.healBns.id, value: 15.0},
        ],
      },
      {
        count: 5,
        options: [
          { statId: FixedStats.atkPct.id, value: 15.0},
        ],
      },
    ],
    colorCode: "#",
  },
  Clouds: {
    id: "Clouds",
    en: "Moonlit Clouds",
    kr: "떠오르는 구름",
    jp: "月を窺う軽雲",
    zh: "轻云出月",
    option: [
      {
        count: 2,
        options: [
          { statId: FixedStats.resonanceBns.id, value: 10.0},
        ],
      },
      {
        count: 5,
        options: [
          { statId: FixedStats.dummy.id, value: .0 },
        ],
      },
    ],
    colorCode: "#",
  },
  Tunes: {
    id: "Tunes",
    en: "Lingering Tunes",
    kr: "끊임없는 잔향",
    jp: "絶えない余韻",
    zh: "不绝余音",
    option: [
      {
        count: 2,
        options: [
          { statId: FixedStats.atkPct.id, value: 10.0},
        ],
      },
      {
        count: 5,
        options: [
          { statId: FixedStats.atkPct.id, value: 20.0},
        ],
      },
    ],
    colorCode: "#",
  },
  //#endregion
} as const satisfies Record<string, HarmonyOption>;

export type HarmonyId = (typeof harmony)[keyof typeof harmony]["id"];
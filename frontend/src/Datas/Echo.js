import { FixedStats } from "./Stats";

const hpPct = "hpPct";

export const echoData = {
  //#region Ver1.0 Echos
  Frost: {
    en: "Freezing Frost",
    kr: "야밤의 서리",
    jp: "夜にこびり付く白霜",
    zh: "凝夜白霜"
  },
  Rift: {
    en: "Molten Rift",
    kr: "솟구치는 용암",
    jp: "山を轟かせる崩火",
    zh: "熔山裂谷"
  },
  Thunder: {
    en: "Void Thunder",
    kr: "울려퍼지는 뇌음",
    jp: "空を切り裂く冥雷",
    zh: "彻空冥雷"
  },
  Gale: {
    en: "Sierra Gale",
    kr: "스쳐가는 바람",
    jp: "谷を突き抜ける長風",
    zh: "啸谷长风"
  },
  Light: {
    en: "Celestial Light",
    kr: "빛나는 별",
    jp: "闇を取り払う浮星",
    zh: "浮星祛暗"
  },
  Eclipse: {
    en: "Sun-sinking Eclipse",
    kr: "빛을 삼키는 해",
    jp: "二度と輝かない沈日",
    zh: "沉日劫明"
  },
  Rejuvent: {
    en: "Rejuvenating Glow",
    kr: "찬란한 광휘",
    jp: "喧騒に隠す回光",
    zh: "隐世回光"
  },
  Clouds: {
    en: "Moonlit Clouds",
    kr: "떠오르는 구름",
    jp: "月を窺う軽雲",
    zh: "轻云出月"
  },
  Tunes: {
    en: "Lingering Tunes",
    kr: "끊임없는 잔향",
    jp: "絶えない余韻",
    zh: "不绝余音"
  },
  //#endregion
  //#region Ver2.0 Echos
  Frosty: {
    en: "Frosty Resolve",
    kr: "냉철한 결단",
    jp: "フロステッド・ハート",
    zh: "凌冽决断之心"
  },
  Radiance: {
    en: "Eternal Radiance",
    kr: "영원의 광채",
    jp: "エターナル・ライト",
    zh: "此间永驻之光"
  },
  Veil: {
    en: "Midnight Veil",
    kr: "어둠의 장막",
    jp: "ミッドナイト・ベール",
    zh: "幽夜隐匿之帷"
  },
  Empyrean: {
    en: "Empyrean Anthem",
    kr: "하늘의 합주곡",
    jp: "セレッシャル・アンサム",
    zh: "高天共奏之曲"
  },
  Courage: {
    en: "Tidebreaking Courage",
    kr: "파도에 맞선 용기",
    jp: "タイズターニング・ヴァラ",
    zh: "无惧浪涛之勇"
  },
  Welkin: {
    en: "Gusts of Welkin",
    kr: "끝없는 하늘",
    jp: "バウンドレス・スカイ",
    zh: "流云逝尽之空"
  },
  UnKnownEcho01: {
    en: "UnKnown",
    kr: "영광이 깃든 바람",
    jp: "グロリアス・ウィンド",
    zh: "愿戴荣光之旅"
  },
  UnKnownEcho02: {
    en: "UnKnown",
    kr: "울부짖는 불꽃",
    jp: "ハウリング・フレイム",
    zh: "奔狼燎原之焰"
  },
  //#endregion
  //#region Ver3.0 Echos
};
export const echoDict = {
  Cost4: {
    "W75": {
      "en": "Nightmare: Tempest Mephis",
      "kr": "악몽 · 천둥의 비늘",
      "jp": "雷刹のウロコ",
      "zh": "朔雷之鳞",
      "type": [
        [echoData.Thunder],
      ],
      "stats": [
        {[FixedStats.hpPct]: 12}
      ]
    },
    "H80": {
      "en": "Nightmare: Crownless",
      "kr": "악몽 · 크라운리스",
      "jp": "無冠者",
      "zh": "无冠者",
      "type": "",
      "stats": []
    },
    "H71": {
      "en": "Nightmare: Feilian Beringal",
      "kr": "악몽 · 폭주의 고릴라",
      "jp": "飛廉の大猿",
      "zh": "飞廉之猩",
      "type": "",
      "stats": []
    },
    "N74": {
      "en": "Nightmare: Lampylumen Myriad",
      "kr": "악몽 · 반디의 군세",
      "jp": "輝き蛍の軍勢",
      "zh": "辉萤军势",
      "type": "",
      "stats": []
    },
    "H73": {
      "en": "Nightmare: Mourning Aix",
      "kr": "악몽 · 애곡하는 아익스",
      "jp": "哀切の凶鳥",
      "zh": "哀声鸷",
      "type": "",
      "stats": []
    },
    "R56": {
      "en": "Mech Abomination",
      "kr": "조립식 로봇",
      "jp": "機械アボミネーション",
      "zh": "聚械机偶",
      "type": "",
      "stats": []
    },
    "H72": {
      "en": "Nightmare: Impermanence Heron",
      "kr": "악몽 · 음험한 백로",
      "jp": "無情のサギ",
      "zh": "无常凶鹭",
      "type": "",
      "stats": []
    },
    "H81": {
      "en": "Dreamless",
      "kr": "무망자",
      "jp": "無妄者",
      "zh": "无妄者",
      "type": "",
      "stats": []
    },
    "Z01": {
      "en": "Jué",
      "kr": "용의 별자리",
      "jp": "角",
      "zh": "角",
      "type": "",
      "stats": []
    },
    "X78": {
      "en": "Fallacy of No Return",
      "kr": "돌아갈 곳이 없는 오류",
      "jp": "フェイタルエラー",
      "zh": "无归的谬误",
      "type": "",
      "stats": []
    },
    "W83": {
      "en": "Lorelei",
      "kr": "로렐라이",
      "jp": "ローレライ",
      "zh": "罗蕾莱",
      "type": "",
      "stats": []
    },
    "W84": {
      "en": "Sentry Construct",
      "kr": "이성(異性) 무장",
      "jp": "ゼノコロッサス",
      "zh": "异构武装",
      "type": "",
      "stats": []
    },
    "H82": {
      "en": "Dragon of Dirge",
      "kr": "탄식의 고룡",
      "jp": "嘆きのドレイク",
      "zh": "叹息古龙",
      "type": "",
      "stats": []
    },
    "W93": {
      "en": "Hecate",
      "kr": "헤카테",
      "jp": "ヘカテー",
      "zh": "赫卡忒",
      "type": "",
      "stats": []
    },
    "Z02": {
      "en": "Reminiscence: Fleurdelys",
      "kr": "공명의 메아리 · 플뢰르 드 리스",
      "jp": "響き渡る共鳴・フルールドリス",
      "zh": "共鸣回响·芙露德莉斯",
      "type": "",
      "stats": []
    },
    "W85": {
      "en": "",
      "kr": "악몽 · 켈피",
      "jp": "ナイトメア・ケルピー",
      "zh": "梦魇·凯尔匹",
      "type": "",
      "stats": []
    },
    "W86": {
      "en": "",
      "kr": "영광의 사자",
      "jp": "誉れのライオネス",
      "zh": "荣耀狮像",
      "type": "",
      "stats": []
    },
    "W76": {
      "en": "Nightmare: Thundering Mephis",
      "kr": "악몽 · 뇌운의 비늘",
      "jp": "雲閃のウロコ",
      "zh": "云闪之鳞",
      "type": "",
      "stats": []
    },
    "H91": {
      "en": "Bell-Borne Geochelone",
      "kr": "타종 거북이",
      "jp": "鳴鐘の亀",
      "zh": "鸣钟之龟",
      "type": "",
      "stats": []
    },
    "W77": {
      "en": "Nightmare: Inferno Rider",
      "kr": "악몽 · 지옥불 기사",
      "jp": "燎原の炎騎",
      "zh": "燎照之骑",
      "type": "",
      "stats": []
    }
  },
  Cost3: {
    "H51": {
      "en": "Hoochief",
      "kr": "까부는 원숭이",
      "jp": "いたずら猿",
      "zh": "戏猿",
      "type": "",
      "stats": []
    },
    "R55": {
      "en": "Carapace",
      "kr": "트랜스카",
      "jp": "恐刃の車",
      "zh": "车刃镰",
      "type": "",
      "stats": []
    },
    "X53": {
      "en": "Autopuppet Scout",
      "kr": "경전차 로봇",
      "jp": "巡回のカラクリ",
      "zh": "巡哨机傀",
      "type": "",
      "stats": []
    },
    "H53": {
      "en": "Glacio Dreadmane",
      "kr": "갈기늑대 · 눈꽃",
      "jp": "雪鬣狼",
      "zh": "雪鬃狼",
      "type": "",
      "stats": []
    },
    "Z11": {
      "en": "Lumiscale Construct",
      "kr": "용비늘의 기축",
      "jp": "浮遊鱗機（ふゆうりんき）",
      "zh": "游鳞机枢",
      "type": "",
      "stats": []
    },
    "H54": {
      "en": "Lightcrusher",
      "kr": "흑월의 야수",
      "jp": "光踏獣（こうとうじゅう）",
      "zh": "踏光兽",
      "type": "",
      "stats": []
    },
    "W64": {
      "en": "Questless Knight",
      "kr": "방랑 기사",
      "jp": "回歴の騎士",
      "zh": "巡游骑士",
      "type": "",
      "stats": []
    },
    "W65": {
      "en": "Diurnus Knight",
      "kr": "백야 기사",
      "jp": "炎昼の騎士",
      "zh": "幻昼骑士",
      "type": "",
      "stats": []
    },
    "W66": {
      "en": "Nocturnus Knight",
      "kr": "흑야 기사",
      "jp": "闇夜の騎士",
      "zh": "暗夜骑士",
      "type": "",
      "stats": []
    },
    "W67": {
      "en": "Abyssal Patricius",
      "kr": "파트리시우스 귀족",
      "jp": "アビサル・パトリシウス",
      "zh": "毒冠贵族",
      "type": "",
      "stats": []
    },
    "W68": {
      "en": "Abyssal Gladius",
      "kr": "글라디우스 귀족",
      "jp": "アビサル・グラディウス",
      "zh": "持刃贵族",
      "type": "",
      "stats": []
    },
    "W69": {
      "en": "Abyssal Mercator",
      "kr": "메르카토르 귀족",
      "jp": "アビサル・メルカトル",
      "zh": "凝水贵族",
      "type": "",
      "stats": []
    },
    "R41": {
      "en": "Chop Chop",
      "kr": "유령 인형",
      "jp": "フロートアルマ",
      "zh": "浮灵偶",
      "type": "",
      "stats": []
    },
    "W70": {
      "en": "Vitreum Dancer",
      "kr": "블레이드 댄서",
      "jp": "ヴィトルムダンサー",
      "zh": "琉璃刀伶",
      "type": "",
      "stats": []
    },
    "R42": {
      "en": "Cuddle Wuddle",
      "kr": "거대 인형",
      "jp": "ビッグベア",
      "zh": "巨布偶",
      "type": "",
      "stats": []
    },
    "S56": {
      "en": "Rage Against the Statue",
      "kr": "조각상을 재구성하는 돌멩이",
      "jp": "彫像を再構築する岩拳",
      "zh": "重塑雕像的拳砾",
      "type": "",
      "stats": []
    },
    "H47": {
      "en": "Hurriclaw",
      "kr": "소용돌이 곰",
      "jp": "ハリケーン熊",
      "zh": "飓力熊",
      "type": "",
      "stats": []
    },
    "W71": {
      "en": "Capitaneus",
      "kr": "카피타네우스",
      "jp": "カピタネウス",
      "zh": "荣光节使",
      "type": "",
      "stats": []
    },
    "W72": {
      "en": "",
      "kr": "전도사의 경지",
      "jp": "伝道師の空殻",
      "zh": "传道者的遗形",
      "type": "",
      "stats": []
    },
    "H55": {
      "en": "",
      "kr": "사우로수쿠스",
      "jp": "クラトスクス",
      "zh": "角鳄",
      "type": "",
      "stats": []
    },
    "H42": {
      "en": "Violet-Feathered Heron",
      "kr": "보라색 왜가리",
      "jp": "紫羽サギ",
      "zh": "紫羽鹭",
      "type": "",
      "stats": []
    },
    "H41": {
      "en": "Cyan-Feathered Heron",
      "kr": "초록색 왜가리",
      "jp": "青羽サギ",
      "zh": "青羽鹭",
      "type": "",
      "stats": []
    },
    "S55": {
      "en": "Stonewall Bracer",
      "kr": "거암 투사",
      "jp": "巨岩の闘士",
      "zh": "坚岩斗士",
      "type": "",
      "stats": []
    },
    "W61": {
      "en": "Flautist",
      "kr": "마접의 악사",
      "jp": "宣諭の楽手",
      "zh": "奏谕乐师",
      "type": "",
      "stats": []
    },
    "W60": {
      "en": "Tambourinist",
      "kr": "초혼의 악사",
      "jp": "金鈴の楽手",
      "zh": "振铎乐师",
      "type": "",
      "stats": []
    },
    "W63": {
      "en": "Rocksteady Guardian",
      "kr": "불굴의 호위",
      "jp": "磐石の守り手",
      "zh": "磐石守卫",
      "type": "",
      "stats": []
    },
    "W62": {
      "en": "Chasm Guardian",
      "kr": "심연의 위병",
      "jp": "冥淵の守り手",
      "zh": "冥渊守卫",
      "type": "",
      "stats": []
    },
    "H46": {
      "en": "Viridblaze Saurian",
      "kr": "그린멜팅카멜레온",
      "jp": "熔解トカゲ",
      "zh": "绿熔蜥",
      "type": "",
      "stats": []
    },
    "S06": {
      "en": "Roseshroom",
      "kr": "가시장미버섯",
      "jp": "トゲバラタケ",
      "zh": "刺玫菇",
      "type": "",
      "stats": []
    },
    "H49": {
      "en": "Havoc Dreadmane",
      "kr": "갈기늑대 · 암흑",
      "jp": "闇鬣狼",
      "zh": "暗鬃狼",
      "type": "",
      "stats": []
    },
    "H48": {
      "en": "Spearback",
      "kr": "화살곰",
      "jp": "黒棘熊",
      "zh": "箭簇熊",
      "type": "",
      "stats": []
    }
  },
  Cost1: {
    "H19": {
      "en": "Hooscamp",
      "kr": "어린 원숭이",
      "jp": "猿の幼体",
      "zh": "幼猿",
      "type": "",
      "stats": []
    },
    "H11": {
      "en": "Diamondclaw",
      "kr": "결정화 전갈",
      "jp": "結晶化サソリ",
      "zh": "晶螯蝎",
      "type": "",
      "stats": []
    },
    "H02": {
      "en": "Chirpuff",
      "kr": "쮸쮸복어",
      "jp": "ジュルッポ",
      "zh": "啾啾河豚",
      "type": "",
      "stats": []
    },
    "X54": {
      "en": "Traffic Illuminator",
      "kr": "신호등 로봇",
      "jp": "信号機モドキ",
      "zh": "通行灯偶",
      "type": "",
      "stats": []
    },
    "G05": {
      "en": "Clang Bang",
      "kr": "딩동동",
      "jp": "チリン",
      "zh": "叮咚咚",
      "type": "",
      "stats": []
    },
    "H21": {
      "en": "Lava Larva",
      "kr": "용암 벌레",
      "jp": "溶岩虫",
      "zh": "融火虫",
      "type": "",
      "stats": []
    },
    "H22": {
      "en": "Dwarf Cassowary",
      "kr": "피그미타조",
      "jp": "地駝鳥",
      "zh": "侏侏鸵",
      "type": "",
      "stats": []
    },
    "H23": {
      "en": "Galescourge Stalker",
      "kr": "갈기늑대 · 바람",
      "jp": "風鬣狼",
      "zh": "风鬃狼",
      "type": "",
      "stats": []
    },
    "H24": {
      "en": "Voltscourge Stalker",
      "kr": "갈기늑대 · 천둥",
      "jp": "雷鬣狼",
      "zh": "雷鬃狼",
      "type": "",
      "stats": []
    },
    "H25": {
      "en": "Frostscourge Stalker",
      "kr": "갈기늑대 · 서리",
      "jp": "霜鬣狼",
      "zh": "霜鬃狼",
      "type": "",
      "stats": []
    },
    "R01": {
      "en": "Chop Chop: Headless",
      "kr": "유령 인형 · 헤드",
      "jp": "フロートアルマ・ヘッド",
      "zh": "浮灵偶·海德",
      "type": "",
      "stats": []
    },
    "R02": {
      "en": "Chop Chop: Leftless",
      "kr": "유령 인형 · 레프",
      "jp": "フロートアルマ・レフト",
      "zh": "浮灵偶·蕾弗",
      "type": "",
      "stats": []
    },
    "R03": {
      "en": "Chop Chop: Rightless",
      "kr": "유령 인형 · 라잇",
      "jp": "フロートアルマ・ライト",
      "zh": "浮灵偶·莱特",
      "type": "",
      "stats": []
    },
    "R04": {
      "en": "Fae Ignis",
      "kr": "페이 이그니스",
      "jp": "フェイイグニス",
      "zh": "幽翎火",
      "type": "",
      "stats": []
    },
    "R05": {
      "en": "Nimbus Wraith",
      "kr": "구름 바다 요정",
      "jp": "雲の妖精",
      "zh": "云海妖精",
      "type": "",
      "stats": []
    },
    "R06": {
      "en": "Hocus Pocus",
      "kr": "미스터 매직",
      "jp": "ミスター・マギア",
      "zh": "魔术先生",
      "type": "",
      "stats": []
    },
    "R07": {
      "en": "Lottie Lost",
      "kr": "쓸쓸한 아가씨",
      "jp": "ミス・ロンリー",
      "zh": "寂寞小姐",
      "type": "",
      "stats": []
    },
    "R08": {
      "en": "Diggy Duggy",
      "kr": "근무 인형",
      "jp": "サクサクベア",
      "zh": "工头布偶",
      "type": "",
      "stats": []
    },
    "R09": {
      "en": "Chest Mimic",
      "kr": "미믹",
      "jp": "秘蔵ミミック",
      "zh": "欺诈奇藏",
      "type": "",
      "stats": []
    },
    "S10": {
      "en": "Golden Junrock",
      "kr": "금석 암괴",
      "jp": "愚者のゴールドの岩塊",
      "zh": "愚金幼岩",
      "type": "",
      "stats": []
    },
    "S11": {
      "en": "Calcified Junrock",
      "kr": "유약 암괴",
      "jp": "ミカーレの岩塊",
      "zh": "釉变幼岩",
      "type": "",
      "stats": []
    },
    "N15": {
      "en": "Aero Prism",
      "kr": "기류 프리즘",
      "jp": "気動のプリズム",
      "zh": "气动棱镜",
      "type": "",
      "stats": []
    },
    "W32": {
      "en": "La Guardia",
      "kr": "라 과디어",
      "jp": "ガルディア",
      "zh": "卫冕节使",
      "type": "",
      "stats": []
    },
    "W33": {
      "en": "Sagittario",
      "kr": "사지타리오",
      "jp": "サジタリオ",
      "zh": "赦罪节使",
      "type": "",
      "stats": []
    },
    "W34": {
      "en": "Sacerdos",
      "kr": "사체르도스",
      "jp": "サケルドス",
      "zh": "慈悲节使",
      "type": "",
      "stats": []
    },
    "H26": {
      "en": "Aero Drake",
      "kr": "드레이크 · 기류",
      "jp": "ドレイクの幼体・気動",
      "zh": "小翼龙·气动",
      "type": "",
      "stats": []
    },
    "H27": {
      "en": "Electro Drake",
      "kr": "드레이크 · 전도",
      "jp": "ドレイクの幼体・電導",
      "zh": "小翼龙·导电",
      "type": "",
      "stats": []
    },
    "H28": {
      "en": "Glacio Drake",
      "kr": "드레이크 · 응결",
      "jp": "ドレイクの幼体・凝縮",
      "zh": "小翼龙·冷凝",
      "type": "",
      "stats": []
    },
    "H29": {
      "en": "",
      "kr": "드레이크 · 용융",
      "jp": "ドレイクの幼体・焦熱",
      "zh": "小翼龙·热熔",
      "type": "",
      "stats": []
    },
    "H30": {
      "en": "",
      "kr": "드레이크 · 회절",
      "jp": "ドレイクの幼体・回折",
      "zh": "小翼龙·衍射",
      "type": "",
      "stats": []
    },
    "H31": {
      "en": "",
      "kr": "드레이크 · 인멸",
      "jp": "ドレイクの幼体・消滅",
      "zh": "小翼龙·湮灭",
      "type": "",
      "stats": []
    },
    "W35": {
      "en": "",
      "kr": "고행자의 인형",
      "jp": "狂信者の血肉",
      "zh": "苦信者的作俑",
      "type": "",
      "stats": []
    },
    "S08": {
      "en": "Vanguard Junrock",
      "kr": "선봉 암괴",
      "jp": "先兵岩塊",
      "zh": "先锋幼岩",
      "type": "",
      "stats": []
    },
    "S09": {
      "en": "Fission Junrock",
      "kr": "분열 암괴",
      "jp": "壊れかけ岩塊",
      "zh": "裂变幼岩",
      "type": "",
      "stats": []
    },
    "W25": {
      "en": "Electro Predator",
      "kr": "경칩의 사냥꾼",
      "jp": "春雷の狩人",
      "zh": "惊蛰猎手",
      "type": "",
      "stats": []
    },
    "W30": {
      "en": "Fusion Warrior",
      "kr": "오열하는 전사",
      "jp": "慟哭の戦士",
      "zh": "鸣泣战士",
      "type": "",
      "stats": []
    },
    "W31": {
      "en": "Havoc Warrior",
      "kr": "심판하는 전사",
      "jp": "審判の戦士",
      "zh": "审判战士",
      "type": "",
      "stats": []
    },
    "G02": {
      "en": "Snip Snap",
      "kr": "칵찰찰",
      "jp": "カチャチャ",
      "zh": "咔嚓嚓",
      "type": "",
      "stats": []
    },
    "G03": {
      "en": "Zig Zag",
      "kr": "아즈즈",
      "jp": "アツツ",
      "zh": "阿嗞嗞",
      "type": "",
      "stats": []
    },
    "G01": {
      "en": "Whiff Whaff",
      "kr": "후슈슈",
      "jp": "フシュシュ",
      "zh": "呼咻咻",
      "type": "",
      "stats": []
    },
    "G04": {
      "en": "Tick Tack",
      "kr": "우글글",
      "jp": "ウカカ",
      "zh": "呜咔咔",
      "type": "",
      "stats": []
    },
    "W26": {
      "en": "Glacio Predator",
      "kr": "상강의 사냥꾼",
      "jp": "破霜の狩人",
      "zh": "破霜猎手",
      "type": "",
      "stats": []
    },
    "W27": {
      "en": "Aero Predator",
      "kr": "부메랑 사냥꾼",
      "jp": "徘徊の狩人",
      "zh": "巡徊猎手",
      "type": "",
      "stats": []
    },
    "H12": {
      "en": "Cruisewing",
      "kr": "순회나비",
      "jp": "遊弋蝶",
      "zh": "游弋蝶",
      "type": "",
      "stats": []
    },
    "H08": {
      "en": "Sabyr Boar",
      "kr": "쇄아멧돼지",
      "jp": "砕牙イノシシ",
      "zh": "碎獠猪",
      "type": "",
      "stats": []
    },
    "H01": {
      "en": "Gulpuff",
      "kr": "꾹꾹복어",
      "jp": "グルッポ",
      "zh": "咕咕河豚",
      "type": "",
      "stats": []
    },
    "H05": {
      "en": "Excarat",
      "kr": "두더지",
      "jp": "モグロン",
      "zh": "遁地鼠",
      "type": "",
      "stats": []
    },
    "H06": {
      "en": "Baby Viridblaze Saurian",
      "kr": "그린멜팅카멜레온(유체)",
      "jp": "熔解トカゲ（幼体）",
      "zh": "绿熔蜥（稚形）",
      "type": "",
      "stats": []
    },
    "S05": {
      "en": "Young Roseshroom",
      "kr": "가시장미버섯(유체)",
      "jp": "トゲバラタケ（幼体）",
      "zh": "刺玫菇（稚形）",
      "type": "",
      "stats": []
    },
    "H09": {
      "en": "Fusion Dreadmane",
      "kr": "갈기늑대 · 불꽃",
      "jp": "火鬣狼",
      "zh": "火鬃狼",
      "type": "",
      "stats": []
    },
    "H15": {
      "en": "Hoartoise",
      "kr": "서릿땅거북",
      "jp": "寒霜亀",
      "zh": "寒霜陆龟",
      "type": "",
      "stats": []
    },
    "N12": {
      "en": "Fusion Prism",
      "kr": "용융 프리즘",
      "jp": "焦熱のプリズム",
      "zh": "热熔棱镜",
      "type": "",
      "stats": []
    },
    "N11": {
      "en": "Glacio Prism",
      "kr": "응결 프리즘",
      "jp": "凝縮のプリズム",
      "zh": "冷凝棱镜",
      "type": "",
      "stats": []
    },
    "N14": {
      "en": "Spectro Prism",
      "kr": "회절 프리즘",
      "jp": "回折のプリズム",
      "zh": "衍射棱镜",
      "type": "",
      "stats": []
    },
    "N13": {
      "en": "Havoc Prism",
      "kr": "인멸 프리즘",
      "jp": "消滅のプリズム",
      "zh": "湮灭棱镜",
      "type": "",
      "stats": []
    }
  }
};

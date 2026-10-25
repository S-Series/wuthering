// Numeric community targets adapted from kedaygon/wuwa_yeejalky_overlay (MIT).
// Snapshot: eda99e57a9ce0dae5501603fd3d3bc4f9d05f8dd, 2026-07-17. Checked 2026-10-24.
// Missing entries/primary values use the linked DennLog near-final values as provisional baselines.
import type { CharacterId } from '../characterStats';
import type { BuildTargetBaseline } from './types';

export const buildTargetBaselines = {
  "hsin": {
    "primary": "atk",
    "weaponId": "rectifier012",
    "variants": [
      {
        "id": "43311-권장-critDmg",
        "label": "권장",
        "costs": [
          4,
          3,
          3,
          1,
          1
        ],
        "main4": [
          "critDmg"
        ],
        "main3": null,
        "main3Options": [
          [
            "electroBns",
            "atkPct"
          ],
          [
            "atkPct",
            "atkPct"
          ]
        ],
        "allowed3": [
          "electroBns",
          "atkPct"
        ],
        "main1": "atkPct",
        "baseline": {
          "atk": 2200,
          "resonanceBns": 120,
          "critRate": 70,
          "critDmg": 270
        },
        "mainText": "크확,크피",
        "subText": "피증or공퍼/공퍼",
        "main4Exact": [
          "critDmg"
        ],
        "mainStatAdjusted": false
      },
      {
        "id": "43311-권장-critRate",
        "label": "권장",
        "costs": [
          4,
          3,
          3,
          1,
          1
        ],
        "main4": [
          "critRate"
        ],
        "main3": null,
        "main3Options": [
          [
            "electroBns",
            "atkPct"
          ],
          [
            "atkPct",
            "atkPct"
          ]
        ],
        "allowed3": [
          "electroBns",
          "atkPct"
        ],
        "main1": "atkPct",
        "baseline": {
          "atk": 2200,
          "resonanceBns": 120,
          "critRate": 92,
          "critDmg": 226
        },
        "mainText": "크확,크피",
        "subText": "피증or공퍼/공퍼",
        "main4Exact": [
          "critRate"
        ],
        "mainStatAdjusted": true
      }
    ],
    "sets": [
      "Vigil",
      "Thunder"
    ],
    "setRules": [
      [
        {
          "id": "Vigil",
          "count": 5
        }
      ],
      [
        {
          "id": "Thunder",
          "count": 5
        }
      ]
    ],
    "setCount": 5,
    "setText": "꿈으로 세상을 비추는 마음 / 울려퍼지는 뇌음",
    "sourceKind": "supplement",
    "sourceUrl": "https://www.dennlog.com/ko/games/wutheringwaves/characters/Hsin",
    "supplementedStats": [],
    "notes": "",
    "sourcePrimary": "2200",
    "sourceEnergy": "120"
  },
  "suoming": {
    "primary": "atk",
    "weaponId": "sword013",
    "variants": [
      {
        "id": "43311-권장-critDmg",
        "label": "권장",
        "costs": [
          4,
          3,
          3,
          1,
          1
        ],
        "main4": [
          "critDmg"
        ],
        "main3": null,
        "main3Options": [
          [
            "electroBns",
            "atkPct"
          ],
          [
            "atkPct",
            "atkPct"
          ]
        ],
        "allowed3": [
          "electroBns",
          "atkPct"
        ],
        "main1": "atkPct",
        "baseline": {
          "atk": 2400,
          "resonanceBns": 120,
          "critRate": 70,
          "critDmg": 270
        },
        "mainText": "크확,크피",
        "subText": "피증or공퍼/공퍼",
        "main4Exact": [
          "critDmg"
        ],
        "mainStatAdjusted": false
      },
      {
        "id": "43311-권장-critRate",
        "label": "권장",
        "costs": [
          4,
          3,
          3,
          1,
          1
        ],
        "main4": [
          "critRate"
        ],
        "main3": null,
        "main3Options": [
          [
            "electroBns",
            "atkPct"
          ],
          [
            "atkPct",
            "atkPct"
          ]
        ],
        "allowed3": [
          "electroBns",
          "atkPct"
        ],
        "main1": "atkPct",
        "baseline": {
          "atk": 2400,
          "resonanceBns": 120,
          "critRate": 92,
          "critDmg": 226
        },
        "mainText": "크확,크피",
        "subText": "피증or공퍼/공퍼",
        "main4Exact": [
          "critRate"
        ],
        "mainStatAdjusted": true
      }
    ],
    "sets": [
      "Vigil",
      "Thunder"
    ],
    "setRules": [
      [
        {
          "id": "Vigil",
          "count": 5
        }
      ],
      [
        {
          "id": "Thunder",
          "count": 5
        }
      ]
    ],
    "setCount": 5,
    "setText": "꿈으로 세상을 비추는 마음 / 울려퍼지는 뇌음",
    "sourceKind": "supplement",
    "sourceUrl": "https://www.dennlog.com/ko/games/wutheringwaves/characters/Suoming",
    "supplementedStats": [],
    "notes": "",
    "sourcePrimary": "2400",
    "sourceEnergy": "120"
  },
  "jingran": {
    "primary": "hp",
    "weaponId": "broadblade009",
    "variants": [
      {
        "id": "43311-권장-critDmg",
        "label": "권장",
        "costs": [
          4,
          3,
          3,
          1,
          1
        ],
        "main4": [
          "critDmg"
        ],
        "main3": null,
        "main3Options": [
          [
            "hpPct",
            "hpPct"
          ]
        ],
        "allowed3": [
          "hpPct"
        ],
        "main1": "hpPct",
        "baseline": {
          "hp": 52000,
          "resonanceBns": 120,
          "critRate": 50,
          "critDmg": 320
        },
        "mainText": "크확,크피",
        "subText": "체퍼/체퍼",
        "main4Exact": [
          "critDmg"
        ],
        "mainStatAdjusted": false
      },
      {
        "id": "43311-권장-critRate",
        "label": "권장",
        "costs": [
          4,
          3,
          3,
          1,
          1
        ],
        "main4": [
          "critRate"
        ],
        "main3": null,
        "main3Options": [
          [
            "hpPct",
            "hpPct"
          ]
        ],
        "allowed3": [
          "hpPct"
        ],
        "main1": "hpPct",
        "baseline": {
          "hp": 52000,
          "resonanceBns": 120,
          "critRate": 72,
          "critDmg": 276
        },
        "mainText": "크확,크피",
        "subText": "체퍼/체퍼",
        "main4Exact": [
          "critRate"
        ],
        "mainStatAdjusted": true
      }
    ],
    "sets": [
      "Lamp"
    ],
    "setRules": [
      [
        {
          "id": "Lamp",
          "count": 5
        }
      ]
    ],
    "setCount": 5,
    "setText": "황천길을 밝히는 등불",
    "sourceKind": "supplement",
    "sourceUrl": "https://www.dennlog.com/ko/games/wutheringwaves/characters/Jingran",
    "supplementedStats": [],
    "notes": "",
    "sourcePrimary": "52000",
    "sourceEnergy": "120"
  },
  "qingxiao": {
    "primary": "atk",
    "weaponId": "sword012",
    "variants": [
      {
        "id": "43311-권장-critDmg",
        "label": "권장",
        "costs": [
          4,
          3,
          3,
          1,
          1
        ],
        "main4": [
          "critDmg"
        ],
        "main3": null,
        "main3Options": [
          [
            "aeroBns",
            "atkPct"
          ],
          [
            "atkPct",
            "atkPct"
          ]
        ],
        "allowed3": [
          "aeroBns",
          "atkPct"
        ],
        "main1": "atkPct",
        "baseline": {
          "atk": 2600,
          "resonanceBns": 120,
          "critRate": 80,
          "critDmg": 280
        },
        "mainText": "크확,크피",
        "subText": "피증or공퍼/공퍼",
        "main4Exact": [
          "critDmg"
        ],
        "mainStatAdjusted": false
      },
      {
        "id": "43311-권장-critRate",
        "label": "권장",
        "costs": [
          4,
          3,
          3,
          1,
          1
        ],
        "main4": [
          "critRate"
        ],
        "main3": null,
        "main3Options": [
          [
            "aeroBns",
            "atkPct"
          ],
          [
            "atkPct",
            "atkPct"
          ]
        ],
        "allowed3": [
          "aeroBns",
          "atkPct"
        ],
        "main1": "atkPct",
        "baseline": {
          "atk": 2600,
          "resonanceBns": 120,
          "critRate": 100,
          "critDmg": 240
        },
        "mainText": "크확,크피",
        "subText": "피증or공퍼/공퍼",
        "main4Exact": [
          "critRate"
        ],
        "mainStatAdjusted": true
      }
    ],
    "sets": [
      "Heart"
    ],
    "setRules": [
      [
        {
          "id": "Heart",
          "count": 5
        }
      ]
    ],
    "setCount": 5,
    "setText": "악을 씻어내는 마음",
    "sourceKind": "supplement",
    "sourceUrl": "https://www.dennlog.com/ko/games/wutheringwaves/characters/Qingxiao",
    "supplementedStats": [],
    "notes": "",
    "sourcePrimary": "2600",
    "sourceEnergy": "120"
  },
  "suisui": {
    "primary": "hp",
    "weaponId": "rectifier011",
    "variants": [
      {
        "id": "43311-권장",
        "label": "권장",
        "costs": [
          4,
          3,
          3,
          1,
          1
        ],
        "main4": [
          "critDmg",
          "healBns",
          "hpPct"
        ],
        "main3": null,
        "main3Options": [
          [
            "resonanceBns",
            "hpPct"
          ],
          [
            "hpPct",
            "hpPct"
          ]
        ],
        "allowed3": [
          "hpPct",
          "resonanceBns"
        ],
        "main1": "hpPct",
        "baseline": {
          "hp": 42000,
          "resonanceBns": 260
        },
        "mainText": "치유,체퍼,크피",
        "subText": "공효or체퍼/체퍼"
      }
    ],
    "sets": [
      "Song"
    ],
    "setRules": [
      [
        {
          "id": "Song",
          "count": 5
        }
      ]
    ],
    "setCount": 5,
    "setText": "내려앉은 깃털의 노래",
    "sourceKind": "supplement",
    "sourceUrl": "https://www.dennlog.com/ko/games/wutheringwaves/characters/Suisui",
    "supplementedStats": [],
    "notes": "",
    "sourcePrimary": "42000",
    "sourceEnergy": "260"
  },
  "xuanling": {
    "primary": "atk",
    "weaponId": "sword011",
    "variants": [
      {
        "id": "43311-속속",
        "label": "속속",
        "costs": [
          4,
          3,
          3,
          1,
          1
        ],
        "main4": [
          "critDmg"
        ],
        "main3": [
          "havocBns",
          "havocBns"
        ],
        "main3Options": [
          [
            "havocBns",
            "atkPct"
          ],
          [
            "atkPct",
            "atkPct"
          ]
        ],
        "allowed3": [
          "havocBns",
          "atkPct"
        ],
        "main1": "atkPct",
        "baseline": {
          "atk": 2100,
          "critRate": 70,
          "critDmg": 260,
          "resonanceBns": 130
        },
        "mainText": "크피",
        "subText": "인멸피증/공퍼 · 인멸피증or공퍼/공퍼"
      },
      {
        "id": "43311-속공",
        "label": "속공",
        "costs": [
          4,
          3,
          3,
          1,
          1
        ],
        "main4": [
          "critDmg"
        ],
        "main3": [
          "havocBns",
          "atkPct"
        ],
        "main3Options": [
          [
            "havocBns",
            "atkPct"
          ],
          [
            "atkPct",
            "atkPct"
          ]
        ],
        "allowed3": [
          "havocBns",
          "atkPct"
        ],
        "main1": "atkPct",
        "baseline": {
          "atk": 2400,
          "critRate": 70,
          "critDmg": 260,
          "resonanceBns": 130
        },
        "mainText": "크피",
        "subText": "인멸피증/공퍼 · 인멸피증or공퍼/공퍼"
      }
    ],
    "sets": [
      "Song"
    ],
    "setRules": [
      [
        {
          "id": "Song",
          "count": 5
        }
      ]
    ],
    "setCount": 5,
    "setText": "내려앉은 깃털의 노래[43311]",
    "sourceKind": "community",
    "sourceUrl": "https://github.com/kedaygon/wuwa_yeejalky_overlay/blob/eda99e57a9ce0dae5501603fd3d3bc4f9d05f8dd/wuwa_chars.json",
    "supplementedStats": [],
    "notes": "속속으로 에코작 해두는게 좋음",
    "sourcePrimary": "2100[속속] 2400[속공]",
    "sourceEnergy": "125~130"
  },
  "rover_electro": {
    "primary": "atk",
    "weaponId": "sword002",
    "variants": [
      {
        "id": "43311-권장-critRate",
        "label": "권장",
        "costs": [
          4,
          3,
          3,
          1,
          1
        ],
        "main4": [
          "critRate"
        ],
        "main3": null,
        "main3Options": [
          [
            "atkPct",
            "atkPct"
          ],
          [
            "electroBns",
            "atkPct"
          ],
          [
            "resonanceBns",
            "atkPct"
          ]
        ],
        "allowed3": [
          "electroBns",
          "atkPct",
          "resonanceBns"
        ],
        "main1": "atkPct",
        "baseline": {
          "atk": 2200,
          "resonanceBns": 130,
          "critRate": 70,
          "critDmg": 220
        },
        "mainText": "크확,크피",
        "subText": "공퍼or피증or공효/공퍼",
        "main4Exact": [
          "critRate"
        ],
        "mainStatAdjusted": false
      },
      {
        "id": "43311-권장-critDmg",
        "label": "권장",
        "costs": [
          4,
          3,
          3,
          1,
          1
        ],
        "main4": [
          "critDmg"
        ],
        "main3": null,
        "main3Options": [
          [
            "atkPct",
            "atkPct"
          ],
          [
            "electroBns",
            "atkPct"
          ],
          [
            "resonanceBns",
            "atkPct"
          ]
        ],
        "allowed3": [
          "electroBns",
          "atkPct",
          "resonanceBns"
        ],
        "main1": "atkPct",
        "baseline": {
          "atk": 2200,
          "resonanceBns": 130,
          "critRate": 48,
          "critDmg": 264
        },
        "mainText": "크확,크피",
        "subText": "공퍼or피증or공효/공퍼",
        "main4Exact": [
          "critDmg"
        ],
        "mainStatAdjusted": true
      }
    ],
    "sets": [
      "Reflection",
      "Clouds",
      "Thunder"
    ],
    "setRules": [
      [
        {
          "id": "Reflection",
          "count": 5
        }
      ],
      [
        {
          "id": "Clouds",
          "count": 5
        }
      ],
      [
        {
          "id": "Thunder",
          "count": 5
        }
      ]
    ],
    "setCount": 5,
    "setText": "거울 그림자에 번개가 스치는 찰나 / 떠오르는 구름 / 울려퍼지는 뇌음",
    "sourceKind": "supplement",
    "sourceUrl": "https://www.dennlog.com/ko/games/wutheringwaves/characters/Rover_Electro",
    "supplementedStats": [],
    "notes": "",
    "sourcePrimary": "2200",
    "sourceEnergy": "130"
  },
  "lucilla": {
    "primary": "atk",
    "weaponId": "rectifier010",
    "variants": [
      {
        "id": "34311-속속",
        "label": "속속",
        "costs": [
          3,
          4,
          3,
          1,
          1
        ],
        "main4": [
          "critDmg"
        ],
        "main3": [
          "glacioBns",
          "glacioBns"
        ],
        "main3Options": [
          [
            "glacioBns",
            "atkPct"
          ],
          [
            "atkPct",
            "atkPct"
          ]
        ],
        "allowed3": [
          "glacioBns",
          "atkPct"
        ],
        "main1": "atkPct",
        "baseline": {
          "atk": 2100,
          "critRate": 75,
          "critDmg": 265
        },
        "mainText": "크피",
        "subText": "응결피증/공퍼 · 응결피증or공퍼/공퍼"
      },
      {
        "id": "34311-속공",
        "label": "속공",
        "costs": [
          3,
          4,
          3,
          1,
          1
        ],
        "main4": [
          "critDmg"
        ],
        "main3": [
          "glacioBns",
          "atkPct"
        ],
        "main3Options": [
          [
            "glacioBns",
            "atkPct"
          ],
          [
            "atkPct",
            "atkPct"
          ]
        ],
        "allowed3": [
          "glacioBns",
          "atkPct"
        ],
        "main1": "atkPct",
        "baseline": {
          "atk": 2400,
          "critRate": 75,
          "critDmg": 265
        },
        "mainText": "크피",
        "subText": "응결피증/공퍼 · 응결피증or공퍼/공퍼"
      }
    ],
    "sets": [
      "Snowfall",
      "Clouds"
    ],
    "setRules": [
      [
        {
          "id": "Snowfall",
          "count": 5
        }
      ],
      [
        {
          "id": "Clouds",
          "count": 5
        }
      ]
    ],
    "setCount": 5,
    "setText": "소리없이 내려앉은 기도의 눈[34311]\n떠오르는 구름[43311]",
    "sourceKind": "community",
    "sourceUrl": "https://github.com/kedaygon/wuwa_yeejalky_overlay/blob/eda99e57a9ce0dae5501603fd3d3bc4f9d05f8dd/wuwa_chars.json",
    "supplementedStats": [],
    "notes": "시그리카,갈브레나는 에코모드 일때 메인딜러로 기용, 서리모드 기도셋 메인 에코는 글로모스",
    "sourcePrimary": "2100[속속]2400[속공]",
    "sourceEnergy": "0"
  },
  "rebecca": {
    "primary": "atk",
    "weaponId": "pistol008",
    "variants": [
      {
        "id": "43311-속속",
        "label": "속속",
        "costs": [
          4,
          3,
          3,
          1,
          1
        ],
        "main4": [
          "critRate"
        ],
        "main3": [
          "electroBns",
          "electroBns"
        ],
        "main3Options": [
          [
            "electroBns",
            "atkPct"
          ],
          [
            "atkPct",
            "atkPct"
          ]
        ],
        "allowed3": [
          "electroBns",
          "atkPct"
        ],
        "main1": "atkPct",
        "baseline": {
          "atk": 2100,
          "critRate": 70,
          "critDmg": 285,
          "resonanceBns": 130
        },
        "mainText": "크리티컬",
        "subText": "전도피증/공퍼 · 전도피증or공퍼/공퍼"
      },
      {
        "id": "43311-속공",
        "label": "속공",
        "costs": [
          4,
          3,
          3,
          1,
          1
        ],
        "main4": [
          "critRate"
        ],
        "main3": [
          "electroBns",
          "atkPct"
        ],
        "main3Options": [
          [
            "electroBns",
            "atkPct"
          ],
          [
            "atkPct",
            "atkPct"
          ]
        ],
        "allowed3": [
          "electroBns",
          "atkPct"
        ],
        "main1": "atkPct",
        "baseline": {
          "atk": 2300,
          "critRate": 70,
          "critDmg": 285,
          "resonanceBns": 130
        },
        "mainText": "크리티컬",
        "subText": "전도피증/공퍼 · 전도피증or공퍼/공퍼"
      }
    ],
    "sets": [
      "Adam",
      "Memories",
      "Thunder",
      "Tunes"
    ],
    "setRules": [
      [
        {
          "id": "Adam",
          "count": 5
        }
      ],
      [
        {
          "id": "Memories",
          "count": 5
        }
      ],
      [
        {
          "id": "Thunder",
          "count": 5
        }
      ],
      [
        {
          "id": "Tunes",
          "count": 5
        }
      ]
    ],
    "setCount": 5,
    "setText": "꿈을 깨뜨리는 망령의 악몽[4]\n마음을 엮은 꿈의 그림자/울려퍼지는 뇌음/끊임없는 잔향[2셋3311]",
    "sourceKind": "community",
    "sourceUrl": "https://github.com/kedaygon/wuwa_yeejalky_overlay/blob/eda99e57a9ce0dae5501603fd3d3bc4f9d05f8dd/wuwa_chars.json",
    "supplementedStats": [],
    "notes": "반주가 강공 부스트이긴 한데 루시 제외 시간에따라 증가하는 버프라 루시 말곤 효용성이 낮음, 2셋 속공 큰 차이 없음",
    "sourcePrimary": "2100[속속]2300[속공]",
    "sourceEnergy": "125~130"
  },
  "lucy": {
    "primary": "atk",
    "weaponId": "pistol007",
    "variants": [
      {
        "id": "43311-속속",
        "label": "속속",
        "costs": [
          4,
          3,
          3,
          1,
          1
        ],
        "main4": [
          "critRate"
        ],
        "main3": [
          "spectroBns",
          "spectroBns"
        ],
        "main3Options": [
          [
            "spectroBns",
            "atkPct"
          ],
          [
            "atkPct",
            "atkPct"
          ]
        ],
        "allowed3": [
          "spectroBns",
          "atkPct"
        ],
        "main1": "atkPct",
        "baseline": {
          "atk": 2200,
          "critRate": 70,
          "critDmg": 265,
          "resonanceBns": 130
        },
        "mainText": "크리티컬",
        "subText": "회절피증/공퍼 · 회절피증or공퍼/공퍼"
      },
      {
        "id": "43311-속공",
        "label": "속공",
        "costs": [
          4,
          3,
          3,
          1,
          1
        ],
        "main4": [
          "critRate"
        ],
        "main3": [
          "spectroBns",
          "atkPct"
        ],
        "main3Options": [
          [
            "spectroBns",
            "atkPct"
          ],
          [
            "atkPct",
            "atkPct"
          ]
        ],
        "allowed3": [
          "spectroBns",
          "atkPct"
        ],
        "main1": "atkPct",
        "baseline": {
          "atk": 2500,
          "critRate": 70,
          "critDmg": 265,
          "resonanceBns": 130
        },
        "mainText": "크리티컬",
        "subText": "회절피증/공퍼 · 회절피증or공퍼/공퍼"
      }
    ],
    "sets": [
      "Adam",
      "Light",
      "Revelation",
      "Radiance",
      "Tunes",
      "Memories"
    ],
    "setRules": [
      [
        {
          "id": "Adam",
          "count": 5
        }
      ],
      [
        {
          "id": "Light",
          "count": 5
        }
      ],
      [
        {
          "id": "Revelation",
          "count": 5
        }
      ],
      [
        {
          "id": "Radiance",
          "count": 5
        }
      ],
      [
        {
          "id": "Tunes",
          "count": 5
        }
      ],
      [
        {
          "id": "Memories",
          "count": 5
        }
      ]
    ],
    "setCount": 5,
    "setText": "꿈을 깨뜨리는 망령의 악몽[4]\n빛나는 별/흐르는 금빛 속 진리의 답/영원의 광채[2셋3311]\n끊임없는 잔향/마음을 엮은 꿈의 그림자[2셋3311]",
    "sourceKind": "community",
    "sourceUrl": "https://github.com/kedaygon/wuwa_yeejalky_overlay/blob/eda99e57a9ce0dae5501603fd3d3bc4f9d05f8dd/wuwa_chars.json",
    "supplementedStats": [],
    "notes": "2셋 속공 속속 큰 차이 없음",
    "sourcePrimary": "2200[속속]2500[속공]",
    "sourceEnergy": "125~130"
  },
  "denia": {
    "primary": "atk",
    "weaponId": "rectifier009",
    "variants": [
      {
        "id": "43311-속공-critDmg",
        "label": "속공",
        "costs": [
          4,
          3,
          3,
          1,
          1
        ],
        "main4": [
          "critDmg"
        ],
        "main3": [
          "fusionBns",
          "atkPct"
        ],
        "main3Options": [
          [
            "fusionBns",
            "atkPct"
          ],
          [
            "atkPct",
            "atkPct"
          ]
        ],
        "allowed3": [
          "fusionBns",
          "atkPct"
        ],
        "main1": "atkPct",
        "baseline": {
          "atk": 2300,
          "critRate": 75,
          "critDmg": 275,
          "resonanceBns": 125
        },
        "mainText": "크확,크피",
        "subText": "속성피증/공퍼 · 속성피증or공퍼/공퍼",
        "main4Exact": [
          "critDmg"
        ],
        "mainStatAdjusted": false
      },
      {
        "id": "43311-속공-critRate",
        "label": "속공",
        "costs": [
          4,
          3,
          3,
          1,
          1
        ],
        "main4": [
          "critRate"
        ],
        "main3": [
          "fusionBns",
          "atkPct"
        ],
        "main3Options": [
          [
            "fusionBns",
            "atkPct"
          ],
          [
            "atkPct",
            "atkPct"
          ]
        ],
        "allowed3": [
          "fusionBns",
          "atkPct"
        ],
        "main1": "atkPct",
        "baseline": {
          "atk": 2300,
          "critRate": 97,
          "critDmg": 231,
          "resonanceBns": 125
        },
        "mainText": "크확,크피",
        "subText": "속성피증/공퍼 · 속성피증or공퍼/공퍼",
        "main4Exact": [
          "critRate"
        ],
        "mainStatAdjusted": true
      },
      {
        "id": "43311-공공-critDmg",
        "label": "공공",
        "costs": [
          4,
          3,
          3,
          1,
          1
        ],
        "main4": [
          "critDmg"
        ],
        "main3": [
          "atkPct",
          "atkPct"
        ],
        "main3Options": [
          [
            "fusionBns",
            "atkPct"
          ],
          [
            "atkPct",
            "atkPct"
          ]
        ],
        "allowed3": [
          "fusionBns",
          "atkPct"
        ],
        "main1": "atkPct",
        "baseline": {
          "atk": 2600,
          "critRate": 75,
          "critDmg": 275,
          "resonanceBns": 125
        },
        "mainText": "크확,크피",
        "subText": "속성피증/공퍼 · 속성피증or공퍼/공퍼",
        "main4Exact": [
          "critDmg"
        ],
        "mainStatAdjusted": false
      },
      {
        "id": "43311-공공-critRate",
        "label": "공공",
        "costs": [
          4,
          3,
          3,
          1,
          1
        ],
        "main4": [
          "critRate"
        ],
        "main3": [
          "atkPct",
          "atkPct"
        ],
        "main3Options": [
          [
            "fusionBns",
            "atkPct"
          ],
          [
            "atkPct",
            "atkPct"
          ]
        ],
        "allowed3": [
          "fusionBns",
          "atkPct"
        ],
        "main1": "atkPct",
        "baseline": {
          "atk": 2600,
          "critRate": 97,
          "critDmg": 231,
          "resonanceBns": 125
        },
        "mainText": "크확,크피",
        "subText": "속성피증/공퍼 · 속성피증or공퍼/공퍼",
        "main4Exact": [
          "critRate"
        ],
        "mainStatAdjusted": true
      }
    ],
    "sets": [
      "Foam",
      "Memories"
    ],
    "setRules": [
      [
        {
          "id": "Foam",
          "count": 5
        }
      ],
      [
        {
          "id": "Memories",
          "count": 5
        }
      ]
    ],
    "setCount": 5,
    "setText": "오색찬란한 거품[43311]\n마음을 엮은 꿈의 그림자[43311]",
    "sourceKind": "community",
    "sourceUrl": "https://github.com/kedaygon/wuwa_yeejalky_overlay/blob/eda99e57a9ce0dae5501603fd3d3bc4f9d05f8dd/wuwa_chars.json",
    "supplementedStats": [],
    "notes": "루크랑 채용시 공효 좀 더 높은게 좋음, 그림자셋 사용시 4코는 보이드모스, 2돌이상은 공공",
    "sourcePrimary": "2300[2600공공]",
    "sourceEnergy": "120~125"
  },
  "hiyuki": {
    "primary": "atk",
    "weaponId": "sword010",
    "variants": [
      {
        "id": "43311-속공",
        "label": "속공",
        "costs": [
          4,
          3,
          3,
          1,
          1
        ],
        "main4": [
          "critDmg"
        ],
        "main3": [
          "glacioBns",
          "atkPct"
        ],
        "main3Options": [
          [
            "glacioBns",
            "atkPct"
          ],
          [
            "atkPct",
            "atkPct"
          ]
        ],
        "allowed3": [
          "glacioBns",
          "atkPct"
        ],
        "main1": "atkPct",
        "baseline": {
          "atk": 2500,
          "critRate": 75,
          "critDmg": 260,
          "resonanceBns": 125
        },
        "mainText": "크피",
        "subText": "응결피증/공퍼 · 응결피증or공퍼/공퍼"
      },
      {
        "id": "43311-속속",
        "label": "속속",
        "costs": [
          4,
          3,
          3,
          1,
          1
        ],
        "main4": [
          "critDmg"
        ],
        "main3": [
          "glacioBns",
          "glacioBns"
        ],
        "main3Options": [
          [
            "glacioBns",
            "atkPct"
          ],
          [
            "atkPct",
            "atkPct"
          ]
        ],
        "allowed3": [
          "glacioBns",
          "atkPct"
        ],
        "main1": "atkPct",
        "baseline": {
          "atk": 2200,
          "critRate": 75,
          "critDmg": 260,
          "resonanceBns": 125
        },
        "mainText": "크피",
        "subText": "응결피증/공퍼 · 응결피증or공퍼/공퍼"
      }
    ],
    "sets": [
      "Snowfall"
    ],
    "setRules": [
      [
        {
          "id": "Snowfall",
          "count": 5
        }
      ]
    ],
    "setCount": 5,
    "setText": "소리 없이 내려앉은 기도의 눈[43311]",
    "sourceKind": "community",
    "sourceUrl": "https://github.com/kedaygon/wuwa_yeejalky_overlay/blob/eda99e57a9ce0dae5501603fd3d3bc4f9d05f8dd/wuwa_chars.json",
    "supplementedStats": [],
    "notes": "풀돌은 4코 공퍼 사용 가능\n공컷은 2850",
    "sourcePrimary": "2500[속공] 2200[속속]",
    "sourceEnergy": "120[최소] 125[권장]"
  },
  "sigrika": {
    "primary": "atk",
    "weaponId": "gauntlet008",
    "variants": [
      {
        "id": "43311-권장",
        "label": "권장",
        "costs": [
          4,
          3,
          3,
          1,
          1
        ],
        "main4": [
          "critRate"
        ],
        "main3": null,
        "main3Options": [
          [
            "resonanceBns",
            "atkPct"
          ],
          [
            "atkPct",
            "atkPct"
          ]
        ],
        "allowed3": [
          "atkPct",
          "resonanceBns"
        ],
        "main1": "atkPct",
        "baseline": {
          "atk": 2600,
          "critRate": 70,
          "critDmg": 270,
          "resonanceBns": 150
        },
        "mainText": "크확",
        "subText": "공효or공퍼/공퍼 · 공퍼/공퍼"
      }
    ],
    "sets": [
      "Sound"
    ],
    "setRules": [
      [
        {
          "id": "Sound",
          "count": 5
        }
      ]
    ],
    "setCount": 5,
    "setText": "함의의 소리를 따라[43311]",
    "sourceKind": "community",
    "sourceUrl": "https://github.com/kedaygon/wuwa_yeejalky_overlay/blob/eda99e57a9ce0dae5501603fd3d3bc4f9d05f8dd/wuwa_chars.json",
    "supplementedStats": [],
    "notes": "부옵으로 공효 35% 이상 챙길 수 있으면\n3코 공퍼 2개 채용 가능하다고 함\n파수인 2돌이면 속성 피증, 공퍼가 우위\n그리고 공명 스킬도 찍어줄 수 있으면 찍어주셈",
    "sourcePrimary": "2600",
    "sourceEnergy": "150"
  },
  "luuk_herssen": {
    "primary": "atk",
    "weaponId": "gauntlet007",
    "variants": [
      {
        "id": "34311-속공",
        "label": "속공",
        "costs": [
          3,
          4,
          3,
          1,
          1
        ],
        "main4": [
          "critDmg"
        ],
        "main3": [
          "spectroBns",
          "atkPct"
        ],
        "main3Options": [
          [
            "spectroBns",
            "atkPct"
          ],
          [
            "atkPct",
            "atkPct"
          ]
        ],
        "allowed3": [
          "spectroBns",
          "atkPct"
        ],
        "main1": "atkPct",
        "baseline": {
          "atk": 2650,
          "critRate": 75,
          "critDmg": 260,
          "resonanceBns": 125
        },
        "mainText": "크피",
        "subText": "회절피증/공퍼 · 회절피증or공퍼/공퍼"
      },
      {
        "id": "34311-속속",
        "label": "속속",
        "costs": [
          3,
          4,
          3,
          1,
          1
        ],
        "main4": [
          "critDmg"
        ],
        "main3": [
          "spectroBns",
          "spectroBns"
        ],
        "main3Options": [
          [
            "spectroBns",
            "atkPct"
          ],
          [
            "atkPct",
            "atkPct"
          ]
        ],
        "allowed3": [
          "spectroBns",
          "atkPct"
        ],
        "main1": "atkPct",
        "baseline": {
          "atk": 2350,
          "critRate": 75,
          "critDmg": 260,
          "resonanceBns": 125
        },
        "mainText": "크피",
        "subText": "회절피증/공퍼 · 회절피증or공퍼/공퍼"
      }
    ],
    "sets": [
      "Revelation"
    ],
    "setRules": [
      [
        {
          "id": "Revelation",
          "count": 5
        }
      ]
    ],
    "setCount": 5,
    "setText": "흐르는 금빛 속 진리의 답[34311]",
    "sourceKind": "community",
    "sourceUrl": "https://github.com/kedaygon/wuwa_yeejalky_overlay/blob/eda99e57a9ce0dae5501603fd3d3bc4f9d05f8dd/wuwa_chars.json",
    "supplementedStats": [],
    "notes": "메인 에코는 3코 트윈 노바 시리즈\n메인에코로 트윈 노바 · 콜라사르 블레이드 장착시\n트윈 노바 · 네뷸러스 캐논도 같이 장착해야\n회절 피해 보너스로 바뀌니 주의",
    "sourcePrimary": "2650[속공] 2350[속속]",
    "sourceEnergy": "120[이상] 125[권장]"
  },
  "aemeath": {
    "primary": "atk",
    "weaponId": "sword009",
    "variants": [
      {
        "id": "43311-공공",
        "label": "공공",
        "costs": [
          4,
          3,
          3,
          1,
          1
        ],
        "main4": [
          "critDmg"
        ],
        "main3": [
          "atkPct",
          "atkPct"
        ],
        "main3Options": [
          [
            "atkPct",
            "atkPct"
          ],
          [
            "fusionBns",
            "atkPct"
          ]
        ],
        "allowed3": [
          "fusionBns",
          "atkPct"
        ],
        "main1": "atkPct",
        "baseline": {
          "atk": 2600,
          "critRate": 70,
          "critDmg": 270,
          "resonanceBns": 125
        },
        "mainText": "크피",
        "subText": "공퍼/공퍼 · 용융피증or공퍼/공퍼"
      },
      {
        "id": "43311-속공",
        "label": "속공",
        "costs": [
          4,
          3,
          3,
          1,
          1
        ],
        "main4": [
          "critDmg"
        ],
        "main3": [
          "fusionBns",
          "atkPct"
        ],
        "main3Options": [
          [
            "atkPct",
            "atkPct"
          ],
          [
            "fusionBns",
            "atkPct"
          ]
        ],
        "allowed3": [
          "fusionBns",
          "atkPct"
        ],
        "main1": "atkPct",
        "baseline": {
          "atk": 2300,
          "critRate": 70,
          "critDmg": 270,
          "resonanceBns": 125
        },
        "mainText": "크피",
        "subText": "공퍼/공퍼 · 용융피증or공퍼/공퍼"
      }
    ],
    "sets": [
      "Star"
    ],
    "setRules": [
      [
        {
          "id": "Star",
          "count": 5
        }
      ]
    ],
    "setCount": 5,
    "setText": "긴 여정을 떠나는 별[43311]",
    "sourceKind": "community",
    "sourceUrl": "https://github.com/kedaygon/wuwa_yeejalky_overlay/blob/eda99e57a9ce0dae5501603fd3d3bc4f9d05f8dd/wuwa_chars.json",
    "supplementedStats": [],
    "notes": "",
    "sourcePrimary": "2600[공공] 2300[속공]",
    "sourceEnergy": "125 ~"
  },
  "mornye": {
    "primary": "def",
    "weaponId": "broadblade008",
    "variants": [
      {
        "id": "43311-권장",
        "label": "권장",
        "costs": [
          4,
          3,
          3,
          1,
          1
        ],
        "main4": [
          "critRate",
          "defPct"
        ],
        "main3": null,
        "main3Options": [
          [
            "defPct",
            "defPct"
          ],
          [
            "resonanceBns",
            "defPct"
          ]
        ],
        "allowed3": [
          "defPct",
          "resonanceBns"
        ],
        "main1": "defPct",
        "baseline": {
          "def": 3500,
          "resonanceBns": 240,
          "critRate": 20
        },
        "mainText": "방어력[크확20% 맞추면됨]",
        "subText": "방어력/방어력 · 공효/방어력"
      }
    ],
    "sets": [
      "Halo"
    ],
    "setRules": [
      [
        {
          "id": "Halo",
          "count": 5
        }
      ]
    ],
    "setCount": 5,
    "setText": "빛을 쫓는 별의 고리[43311]",
    "sourceKind": "community",
    "sourceUrl": "https://github.com/kedaygon/wuwa_yeejalky_overlay/blob/eda99e57a9ce0dae5501603fd3d3bc4f9d05f8dd/wuwa_chars.json",
    "supplementedStats": [],
    "notes": "기묘한 울림 사용시 3코 공효 2개 필수",
    "sourcePrimary": "3500",
    "sourceEnergy": "240"
  },
  "lynae": {
    "primary": "atk",
    "weaponId": "pistol006",
    "variants": [
      {
        "id": "43311-속공",
        "label": "속공",
        "costs": [
          4,
          3,
          3,
          1,
          1
        ],
        "main4": [
          "critDmg"
        ],
        "main3": [
          "spectroBns",
          "atkPct"
        ],
        "main3Options": [
          [
            "spectroBns",
            "atkPct"
          ],
          [
            "atkPct",
            "atkPct"
          ]
        ],
        "allowed3": [
          "spectroBns",
          "atkPct"
        ],
        "main1": "atkPct",
        "baseline": {
          "atk": 2350,
          "critRate": 70,
          "critDmg": 260,
          "resonanceBns": 130
        },
        "mainText": "크피",
        "subText": "회절피증/공퍼 · 회절피증or공퍼/공퍼"
      },
      {
        "id": "43311-속속",
        "label": "속속",
        "costs": [
          4,
          3,
          3,
          1,
          1
        ],
        "main4": [
          "critDmg"
        ],
        "main3": [
          "spectroBns",
          "spectroBns"
        ],
        "main3Options": [
          [
            "spectroBns",
            "atkPct"
          ],
          [
            "atkPct",
            "atkPct"
          ]
        ],
        "allowed3": [
          "spectroBns",
          "atkPct"
        ],
        "main1": "atkPct",
        "baseline": {
          "atk": 2050,
          "critRate": 70,
          "critDmg": 260,
          "resonanceBns": 130
        },
        "mainText": "크피",
        "subText": "회절피증/공퍼 · 회절피증or공퍼/공퍼"
      }
    ],
    "sets": [
      "Leap"
    ],
    "setRules": [
      [
        {
          "id": "Leap",
          "count": 5
        }
      ]
    ],
    "setCount": 5,
    "setText": "역광 속 눈부신 서약[43311]",
    "sourceKind": "community",
    "sourceUrl": "https://github.com/kedaygon/wuwa_yeejalky_overlay/blob/eda99e57a9ce0dae5501603fd3d3bc4f9d05f8dd/wuwa_chars.json",
    "supplementedStats": [],
    "notes": "",
    "sourcePrimary": "2350[속공] 2050[속속]",
    "sourceEnergy": "130 ~"
  },
  "chisa": {
    "primary": "atk",
    "weaponId": "broadblade007",
    "variants": [
      {
        "id": "43311-속공",
        "label": "속공",
        "costs": [
          4,
          3,
          3,
          1,
          1
        ],
        "main4": [
          "critDmg"
        ],
        "main3": [
          "havocBns",
          "atkPct"
        ],
        "main3Options": [
          [
            "havocBns",
            "atkPct"
          ],
          [
            "atkPct",
            "atkPct"
          ]
        ],
        "allowed3": [
          "havocBns",
          "atkPct"
        ],
        "main1": "atkPct",
        "baseline": {
          "atk": 2300,
          "critRate": 80,
          "critDmg": 260,
          "resonanceBns": 130
        },
        "mainText": "크피",
        "subText": "인멸피증/공퍼 · 인멸피증or공퍼/공퍼"
      },
      {
        "id": "43311-속속",
        "label": "속속",
        "costs": [
          4,
          3,
          3,
          1,
          1
        ],
        "main4": [
          "critDmg"
        ],
        "main3": [
          "havocBns",
          "havocBns"
        ],
        "main3Options": [
          [
            "havocBns",
            "atkPct"
          ],
          [
            "atkPct",
            "atkPct"
          ]
        ],
        "allowed3": [
          "havocBns",
          "atkPct"
        ],
        "main1": "atkPct",
        "baseline": {
          "atk": 2000,
          "critRate": 80,
          "critDmg": 260,
          "resonanceBns": 130
        },
        "mainText": "크피",
        "subText": "인멸피증/공퍼 · 인멸피증or공퍼/공퍼"
      }
    ],
    "sets": [
      "Fate",
      "Eclipse",
      "Veil",
      "Clouds"
    ],
    "setRules": [
      [
        {
          "id": "Fate",
          "count": 3
        },
        {
          "id": "Eclipse",
          "count": 2
        }
      ],
      [
        {
          "id": "Fate",
          "count": 3
        },
        {
          "id": "Veil",
          "count": 2
        }
      ],
      [
        {
          "id": "Fate",
          "count": 3
        },
        {
          "id": "Clouds",
          "count": 2
        }
      ],
      [
        {
          "id": "Clouds",
          "count": 5
        }
      ]
    ],
    "setCount": 3,
    "setText": "운명을 붕괴시키는 현[3세트]\n빛을 삼키는 해[2세트] or 어둠의 장막[2세트] / 떠오르는 구름[2세트]",
    "sourceKind": "community",
    "sourceUrl": "https://github.com/kedaygon/wuwa_yeejalky_overlay/blob/eda99e57a9ce0dae5501603fd3d3bc4f9d05f8dd/wuwa_chars.json",
    "supplementedStats": [],
    "notes": "구원과 마찬가지로 2세트로 떠오르는 구름을 선택해서 공효 맞추는게 정신 건강에 좋음",
    "sourcePrimary": "2300[속공] 2000[속속]",
    "sourceEnergy": "130"
  },
  "buling": {
    "primary": "atk",
    "weaponId": "rectifier001",
    "variants": [
      {
        "id": "43311-권장",
        "label": "권장",
        "costs": [
          4,
          3,
          3,
          1,
          1
        ],
        "main4": [
          "healBns",
          "atkPct"
        ],
        "main3": null,
        "main3Options": [
          [
            "atkPct",
            "atkPct"
          ],
          [
            "resonanceBns",
            "atkPct"
          ]
        ],
        "allowed3": [
          "atkPct",
          "resonanceBns"
        ],
        "main1": "atkPct",
        "baseline": {
          "atk": 1600,
          "resonanceBns": 165
        },
        "mainText": "치유보너스or공퍼",
        "subText": "공퍼ㅣ공효/공퍼 · 공퍼ㅣ공효/공퍼"
      }
    ],
    "sets": [
      "Rejuvent"
    ],
    "setRules": [
      [
        {
          "id": "Rejuvent",
          "count": 5
        }
      ]
    ],
    "setCount": 5,
    "setText": "찬란한 광휘[43311]",
    "sourceKind": "community",
    "sourceUrl": "https://github.com/kedaygon/wuwa_yeejalky_overlay/blob/eda99e57a9ce0dae5501603fd3d3bc4f9d05f8dd/wuwa_chars.json",
    "supplementUrl": "https://www.dennlog.com/ko/games/wutheringwaves/characters/Buling",
    "supplementedStats": [
      "atk"
    ],
    "notes": "변주 채용시 부옵 공효 1줄+4코 오류로 공효컷 쌀먹가능, 아니면 3코 공효 섞으면 됨",
    "sourcePrimary": "—",
    "sourceEnergy": "165"
  },
  "qiuyuan": {
    "primary": "atk",
    "weaponId": "sword007",
    "variants": [
      {
        "id": "43311-속공",
        "label": "속공",
        "costs": [
          4,
          3,
          3,
          1,
          1
        ],
        "main4": [
          "critDmg"
        ],
        "main3": [
          "aeroBns",
          "atkPct"
        ],
        "main3Options": [
          [
            "aeroBns",
            "atkPct"
          ],
          [
            "atkPct",
            "atkPct"
          ]
        ],
        "allowed3": [
          "aeroBns",
          "atkPct"
        ],
        "main1": "atkPct",
        "baseline": {
          "atk": 2350,
          "critRate": 70,
          "critDmg": 260,
          "resonanceBns": 130
        },
        "mainText": "크피",
        "subText": "기류피증/공퍼 · 기류피증or공퍼/공퍼"
      },
      {
        "id": "43311-속속",
        "label": "속속",
        "costs": [
          4,
          3,
          3,
          1,
          1
        ],
        "main4": [
          "critDmg"
        ],
        "main3": [
          "aeroBns",
          "aeroBns"
        ],
        "main3Options": [
          [
            "aeroBns",
            "atkPct"
          ],
          [
            "atkPct",
            "atkPct"
          ]
        ],
        "allowed3": [
          "aeroBns",
          "atkPct"
        ],
        "main1": "atkPct",
        "baseline": {
          "atk": 2050,
          "critRate": 70,
          "critDmg": 260,
          "resonanceBns": 130
        },
        "mainText": "크피",
        "subText": "기류피증/공퍼 · 기류피증or공퍼/공퍼"
      }
    ],
    "sets": [
      "Law",
      "Gale",
      "Welkin",
      "Pilgrimage",
      "Clouds"
    ],
    "setRules": [
      [
        {
          "id": "Law",
          "count": 3
        },
        {
          "id": "Gale",
          "count": 2
        }
      ],
      [
        {
          "id": "Law",
          "count": 3
        },
        {
          "id": "Welkin",
          "count": 2
        }
      ],
      [
        {
          "id": "Law",
          "count": 3
        },
        {
          "id": "Pilgrimage",
          "count": 2
        }
      ],
      [
        {
          "id": "Law",
          "count": 3
        },
        {
          "id": "Clouds",
          "count": 2
        }
      ],
      [
        {
          "id": "Clouds",
          "count": 5
        }
      ]
    ],
    "setCount": 3,
    "setText": "만물의 숨결에 비롯된 울림[3세트]\n스쳐가는 바람[2세트] or 끝없는 하늘[2세트]\nor 영광이 깃든 바람[2세트] / 떠오르는 구름[43311]",
    "sourceKind": "community",
    "sourceUrl": "https://github.com/kedaygon/wuwa_yeejalky_overlay/blob/eda99e57a9ce0dae5501603fd3d3bc4f9d05f8dd/wuwa_chars.json",
    "supplementedStats": [],
    "notes": "떠오르는 구름 세트 사용시 파티딜이 더 높고 공명 효율 요구치 10% 감소함",
    "sourcePrimary": "2350[속공] 2050[속속]",
    "sourceEnergy": "130 ~"
  },
  "galbrena": {
    "primary": "atk",
    "weaponId": "pistol004",
    "variants": [
      {
        "id": "34311-속공",
        "label": "속공",
        "costs": [
          3,
          4,
          3,
          1,
          1
        ],
        "main4": [
          "critRate"
        ],
        "main3": [
          "fusionBns",
          "atkPct"
        ],
        "main3Options": [
          [
            "fusionBns",
            "atkPct"
          ],
          [
            "atkPct",
            "atkPct"
          ]
        ],
        "allowed3": [
          "fusionBns",
          "atkPct"
        ],
        "main1": "atkPct",
        "baseline": {
          "atk": 2550,
          "critRate": 60,
          "critDmg": 285,
          "resonanceBns": 120
        },
        "mainText": "크확",
        "subText": "용융피증/공퍼 · 용융피증or공퍼/공퍼"
      },
      {
        "id": "34311-속속",
        "label": "속속",
        "costs": [
          3,
          4,
          3,
          1,
          1
        ],
        "main4": [
          "critRate"
        ],
        "main3": [
          "fusionBns",
          "fusionBns"
        ],
        "main3Options": [
          [
            "fusionBns",
            "atkPct"
          ],
          [
            "atkPct",
            "atkPct"
          ]
        ],
        "allowed3": [
          "fusionBns",
          "atkPct"
        ],
        "main1": "atkPct",
        "baseline": {
          "atk": 2250,
          "critRate": 60,
          "critDmg": 285,
          "resonanceBns": 120
        },
        "mainText": "크확",
        "subText": "용융피증/공퍼 · 용융피증or공퍼/공퍼"
      }
    ],
    "sets": [
      "Shadow",
      "Rift"
    ],
    "setRules": [
      [
        {
          "id": "Shadow",
          "count": 3
        },
        {
          "id": "Rift",
          "count": 2
        }
      ]
    ],
    "setCount": 3,
    "setText": "불타는 깃털을 펼친 사냥꾼의 그림자[3세트(크확20%)]\n솟구치는 용암[2세트] or 울부짖는 늑대의 불꽃[2세트]",
    "sourceKind": "community",
    "sourceUrl": "https://github.com/kedaygon/wuwa_yeejalky_overlay/blob/eda99e57a9ce0dae5501603fd3d3bc4f9d05f8dd/wuwa_chars.json",
    "supplementedStats": [],
    "notes": "메인 에코는 3코 코로사우루스",
    "sourcePrimary": "2550[속공] 2250[속속]",
    "sourceEnergy": "120 ~"
  },
  "iuno": {
    "primary": "atk",
    "weaponId": "gauntlet005",
    "variants": [
      {
        "id": "43311-속공",
        "label": "속공",
        "costs": [
          4,
          3,
          3,
          1,
          1
        ],
        "main4": [
          "critDmg"
        ],
        "main3": [
          "aeroBns",
          "atkPct"
        ],
        "main3Options": [
          [
            "aeroBns",
            "atkPct"
          ],
          [
            "atkPct",
            "atkPct"
          ]
        ],
        "allowed3": [
          "aeroBns",
          "atkPct"
        ],
        "main1": "atkPct",
        "baseline": {
          "atk": 2300,
          "critRate": 80,
          "critDmg": 260,
          "resonanceBns": 130
        },
        "mainText": "크피",
        "subText": "기류피증/공퍼 · 기류피증or공퍼/공퍼"
      },
      {
        "id": "43311-속속",
        "label": "속속",
        "costs": [
          4,
          3,
          3,
          1,
          1
        ],
        "main4": [
          "critDmg"
        ],
        "main3": [
          "aeroBns",
          "aeroBns"
        ],
        "main3Options": [
          [
            "aeroBns",
            "atkPct"
          ],
          [
            "atkPct",
            "atkPct"
          ]
        ],
        "allowed3": [
          "aeroBns",
          "atkPct"
        ],
        "main1": "atkPct",
        "baseline": {
          "atk": 2000,
          "critRate": 80,
          "critDmg": 260,
          "resonanceBns": 130
        },
        "mainText": "크피",
        "subText": "기류피증/공퍼 · 기류피증or공퍼/공퍼"
      }
    ],
    "sets": [
      "Crown",
      "Gale",
      "Welkin",
      "Pilgrimage",
      "Clouds"
    ],
    "setRules": [
      [
        {
          "id": "Crown",
          "count": 3
        },
        {
          "id": "Gale",
          "count": 2
        }
      ],
      [
        {
          "id": "Crown",
          "count": 3
        },
        {
          "id": "Welkin",
          "count": 2
        }
      ],
      [
        {
          "id": "Crown",
          "count": 3
        },
        {
          "id": "Pilgrimage",
          "count": 2
        }
      ],
      [
        {
          "id": "Crown",
          "count": 3
        },
        {
          "id": "Clouds",
          "count": 2
        }
      ],
      [
        {
          "id": "Clouds",
          "count": 5
        }
      ]
    ],
    "setCount": 3,
    "setText": "영광의 칼날로 만들어진 왕관[3세트(크피20%)]\n스쳐가는 바람[2세트] or 끝없는 하늘[2세트]\nor 영광이 깃든 바람[2세트]\n떠오르는 구름[43311]",
    "sourceKind": "community",
    "sourceUrl": "https://github.com/kedaygon/wuwa_yeejalky_overlay/blob/eda99e57a9ce0dae5501603fd3d3bc4f9d05f8dd/wuwa_chars.json",
    "supplementedStats": [],
    "notes": "",
    "sourcePrimary": "2300[속공] 2000[속속]",
    "sourceEnergy": "130 ~"
  },
  "augusta": {
    "primary": "atk",
    "weaponId": "broadblade005",
    "variants": [
      {
        "id": "43311-속공",
        "label": "속공",
        "costs": [
          4,
          3,
          3,
          1,
          1
        ],
        "main4": [
          "critRate"
        ],
        "main3": [
          "electroBns",
          "atkPct"
        ],
        "main3Options": [
          [
            "electroBns",
            "atkPct"
          ],
          [
            "atkPct",
            "atkPct"
          ]
        ],
        "allowed3": [
          "electroBns",
          "atkPct"
        ],
        "main1": "atkPct",
        "baseline": {
          "atk": 2750,
          "critRate": 73,
          "critDmg": 220,
          "resonanceBns": 125
        },
        "mainText": "크확",
        "subText": "전도피증/공퍼 · 전도피증or공퍼/공퍼"
      },
      {
        "id": "43311-속속",
        "label": "속속",
        "costs": [
          4,
          3,
          3,
          1,
          1
        ],
        "main4": [
          "critRate"
        ],
        "main3": [
          "electroBns",
          "electroBns"
        ],
        "main3Options": [
          [
            "electroBns",
            "atkPct"
          ],
          [
            "atkPct",
            "atkPct"
          ]
        ],
        "allowed3": [
          "electroBns",
          "atkPct"
        ],
        "main1": "atkPct",
        "baseline": {
          "atk": 2400,
          "critRate": 73,
          "critDmg": 220,
          "resonanceBns": 125
        },
        "mainText": "크확",
        "subText": "전도피증/공퍼 · 전도피증or공퍼/공퍼"
      }
    ],
    "sets": [
      "Crown",
      "Thunder"
    ],
    "setRules": [
      [
        {
          "id": "Crown",
          "count": 3
        },
        {
          "id": "Thunder",
          "count": 2
        }
      ]
    ],
    "setCount": 3,
    "setText": "영광의 칼날로 만들어진 왕관[3세트(크피20%)]\n울려퍼지는 뇌음[2세트]",
    "sourceKind": "community",
    "sourceUrl": "https://github.com/kedaygon/wuwa_yeejalky_overlay/blob/eda99e57a9ce0dae5501603fd3d3bc4f9d05f8dd/wuwa_chars.json",
    "supplementedStats": [],
    "notes": "2돌파: 4코 크리/크피 자유\n풀돌: 4코 크피",
    "sourcePrimary": "2750[속공] 2400[속속]",
    "sourceEnergy": "125 ~"
  },
  "phrolova": {
    "primary": "atk",
    "weaponId": "rectifier007",
    "variants": [
      {
        "id": "43311-속공",
        "label": "속공",
        "costs": [
          4,
          3,
          3,
          1,
          1
        ],
        "main4": [
          "critDmg"
        ],
        "main3": [
          "havocBns",
          "atkPct"
        ],
        "main3Options": [
          [
            "havocBns",
            "atkPct"
          ],
          [
            "atkPct",
            "atkPct"
          ]
        ],
        "allowed3": [
          "havocBns",
          "atkPct"
        ],
        "main1": "atkPct",
        "baseline": {
          "atk": 2500,
          "critRate": 70,
          "critDmg": 265
        },
        "mainText": "크피",
        "subText": "인멸피증/공퍼 · 인멸피증or공퍼/공퍼"
      },
      {
        "id": "43311-속속",
        "label": "속속",
        "costs": [
          4,
          3,
          3,
          1,
          1
        ],
        "main4": [
          "critDmg"
        ],
        "main3": [
          "havocBns",
          "havocBns"
        ],
        "main3Options": [
          [
            "havocBns",
            "atkPct"
          ],
          [
            "atkPct",
            "atkPct"
          ]
        ],
        "allowed3": [
          "havocBns",
          "atkPct"
        ],
        "main1": "atkPct",
        "baseline": {
          "atk": 2200,
          "critRate": 70,
          "critDmg": 265
        },
        "mainText": "크피",
        "subText": "인멸피증/공퍼 · 인멸피증or공퍼/공퍼"
      }
    ],
    "sets": [
      "Dream",
      "Eclipse",
      "Veil"
    ],
    "setRules": [
      [
        {
          "id": "Dream",
          "count": 3
        },
        {
          "id": "Eclipse",
          "count": 2
        }
      ],
      [
        {
          "id": "Dream",
          "count": 3
        },
        {
          "id": "Veil",
          "count": 2
        }
      ]
    ],
    "setCount": 3,
    "setText": "뒤틀린 피안의 꿈[3세트(크확20%)]\n빛을 삼키는 해[2세트] or 어둠의 장막[2세트]",
    "sourceKind": "community",
    "sourceUrl": "https://github.com/kedaygon/wuwa_yeejalky_overlay/blob/eda99e57a9ce0dae5501603fd3d3bc4f9d05f8dd/wuwa_chars.json",
    "supplementedStats": [],
    "notes": "로코코 칸타렐라와 함께 사용",
    "sourcePrimary": "2500[속공] 2200[속속]",
    "sourceEnergy": "0"
  },
  "lupa": {
    "primary": "atk",
    "weaponId": "broadblade004",
    "variants": [
      {
        "id": "43311-속공",
        "label": "속공",
        "costs": [
          4,
          3,
          3,
          1,
          1
        ],
        "main4": [
          "critDmg",
          "hpPct"
        ],
        "main3": [
          "fusionBns",
          "atkPct"
        ],
        "main3Options": [
          [
            "fusionBns",
            "atkPct"
          ],
          [
            "atkPct",
            "atkPct"
          ]
        ],
        "allowed3": [
          "fusionBns",
          "atkPct"
        ],
        "main1": "atkPct",
        "baseline": {
          "atk": 2300,
          "critRate": 70,
          "critDmg": 260,
          "resonanceBns": 120
        },
        "mainText": "크확\n크피[1체인+파수인시 고려]",
        "subText": "용융피증/공퍼 · 용융피증or공퍼/공퍼"
      },
      {
        "id": "43311-속속",
        "label": "속속",
        "costs": [
          4,
          3,
          3,
          1,
          1
        ],
        "main4": [
          "critDmg",
          "hpPct"
        ],
        "main3": [
          "fusionBns",
          "fusionBns"
        ],
        "main3Options": [
          [
            "fusionBns",
            "atkPct"
          ],
          [
            "atkPct",
            "atkPct"
          ]
        ],
        "allowed3": [
          "fusionBns",
          "atkPct"
        ],
        "main1": "atkPct",
        "baseline": {
          "atk": 2000,
          "critRate": 70,
          "critDmg": 260,
          "resonanceBns": 120
        },
        "mainText": "크확\n크피[1체인+파수인시 고려]",
        "subText": "용융피증/공퍼 · 용융피증or공퍼/공퍼"
      }
    ],
    "sets": [
      "Clawprint"
    ],
    "setRules": [
      [
        {
          "id": "Clawprint",
          "count": 5
        }
      ]
    ],
    "setCount": 5,
    "setText": "울부짖는 늑대의 불꽃[43311]",
    "sourceKind": "community",
    "sourceUrl": "https://github.com/kedaygon/wuwa_yeejalky_overlay/blob/eda99e57a9ce0dae5501603fd3d3bc4f9d05f8dd/wuwa_chars.json",
    "supplementedStats": [],
    "notes": "1체인에 크확 20퍼 증가가 있어서 1체인 이상이면 4코 주옵 크리피해를 쓸수도 있으나 4코 주옵은 크확이 정배",
    "sourcePrimary": "2300[속공] 2000[속속]",
    "sourceEnergy": "120"
  },
  "cartethyia": {
    "primary": "hp",
    "weaponId": "sword006",
    "variants": [
      {
        "id": "44111-44111",
        "label": "44111",
        "costs": [
          4,
          4,
          1,
          1,
          1
        ],
        "main4": [
          "critRate",
          "critDmg"
        ],
        "main3": null,
        "allowed3": [
          "hpPct"
        ],
        "main1": "hpPct",
        "baseline": {
          "hp": 50000,
          "critRate": 70,
          "critDmg": 260,
          "resonanceBns": 120
        },
        "mainText": "크확,크피",
        "subText": "/체% · /체%",
        "main4Exact": [
          "critRate",
          "critDmg"
        ]
      }
    ],
    "sets": [
      "Pilgrimage"
    ],
    "setRules": [
      [
        {
          "id": "Pilgrimage",
          "count": 5
        }
      ]
    ],
    "setCount": 5,
    "setText": "영광이 깃든 바람[44111]",
    "sourceKind": "community",
    "sourceUrl": "https://github.com/kedaygon/wuwa_yeejalky_overlay/blob/eda99e57a9ce0dae5501603fd3d3bc4f9d05f8dd/wuwa_chars.json",
    "supplementedStats": [],
    "notes": "샤콘과 기류 방랑자 파티 사용",
    "sourcePrimary": "50000[44111]",
    "sourceEnergy": "120"
  },
  "chiaccona": {
    "primary": "atk",
    "weaponId": "pistol003",
    "variants": [
      {
        "id": "43311-속공",
        "label": "속공",
        "costs": [
          4,
          3,
          3,
          1,
          1
        ],
        "main4": [
          "critDmg"
        ],
        "main3": [
          "aeroBns",
          "atkPct"
        ],
        "main3Options": [
          [
            "aeroBns",
            "atkPct"
          ],
          [
            "atkPct",
            "atkPct"
          ]
        ],
        "allowed3": [
          "aeroBns",
          "atkPct"
        ],
        "main1": "atkPct",
        "baseline": {
          "atk": 2100,
          "critRate": 75,
          "critDmg": 275,
          "resonanceBns": 120
        },
        "mainText": "크피",
        "subText": "기류피증/공퍼 · 기류피증or공퍼/공퍼"
      },
      {
        "id": "43311-속속",
        "label": "속속",
        "costs": [
          4,
          3,
          3,
          1,
          1
        ],
        "main4": [
          "critDmg"
        ],
        "main3": [
          "aeroBns",
          "aeroBns"
        ],
        "main3Options": [
          [
            "aeroBns",
            "atkPct"
          ],
          [
            "atkPct",
            "atkPct"
          ]
        ],
        "allowed3": [
          "aeroBns",
          "atkPct"
        ],
        "main1": "atkPct",
        "baseline": {
          "atk": 1800,
          "critRate": 75,
          "critDmg": 275,
          "resonanceBns": 120
        },
        "mainText": "크피",
        "subText": "기류피증/공퍼 · 기류피증or공퍼/공퍼"
      }
    ],
    "sets": [
      "Welkin"
    ],
    "setRules": [
      [
        {
          "id": "Welkin",
          "count": 5
        }
      ]
    ],
    "setCount": 5,
    "setText": "끝없는 하늘[43311]",
    "sourceKind": "community",
    "sourceUrl": "https://github.com/kedaygon/wuwa_yeejalky_overlay/blob/eda99e57a9ce0dae5501603fd3d3bc4f9d05f8dd/wuwa_chars.json",
    "supplementedStats": [],
    "notes": "카르티시아 전용 서포터로 사용",
    "sourcePrimary": "2100[속공] 1800[속속]",
    "sourceEnergy": "120 ~"
  },
  "zani": {
    "primary": "atk",
    "weaponId": "gauntlet004",
    "variants": [
      {
        "id": "34311-속속-critRate",
        "label": "속속",
        "costs": [
          3,
          4,
          3,
          1,
          1
        ],
        "main4": [
          "critRate"
        ],
        "main3": [
          "spectroBns",
          "spectroBns"
        ],
        "main3Options": [
          [
            "spectroBns",
            "atkPct"
          ],
          [
            "atkPct",
            "atkPct"
          ]
        ],
        "allowed3": [
          "spectroBns",
          "atkPct"
        ],
        "main1": "atkPct",
        "baseline": {
          "atk": 2100,
          "critRate": 70,
          "critDmg": 280,
          "resonanceBns": 130
        },
        "mainText": "크확[2돌크피]",
        "subText": "회절피증/공퍼 · 회절피증or공퍼/공퍼",
        "main4Exact": [
          "critRate"
        ],
        "mainStatAdjusted": false
      },
      {
        "id": "34311-속속-critDmg",
        "label": "속속",
        "costs": [
          3,
          4,
          3,
          1,
          1
        ],
        "main4": [
          "critDmg"
        ],
        "main3": [
          "spectroBns",
          "spectroBns"
        ],
        "main3Options": [
          [
            "spectroBns",
            "atkPct"
          ],
          [
            "atkPct",
            "atkPct"
          ]
        ],
        "allowed3": [
          "spectroBns",
          "atkPct"
        ],
        "main1": "atkPct",
        "baseline": {
          "atk": 2100,
          "critRate": 48,
          "critDmg": 324,
          "resonanceBns": 130
        },
        "mainText": "크확[2돌크피]",
        "subText": "회절피증/공퍼 · 회절피증or공퍼/공퍼",
        "main4Exact": [
          "critDmg"
        ],
        "mainStatAdjusted": true
      },
      {
        "id": "34311-속공-critRate",
        "label": "속공",
        "costs": [
          3,
          4,
          3,
          1,
          1
        ],
        "main4": [
          "critRate"
        ],
        "main3": [
          "spectroBns",
          "atkPct"
        ],
        "main3Options": [
          [
            "spectroBns",
            "atkPct"
          ],
          [
            "atkPct",
            "atkPct"
          ]
        ],
        "allowed3": [
          "spectroBns",
          "atkPct"
        ],
        "main1": "atkPct",
        "baseline": {
          "atk": 2400,
          "critRate": 70,
          "critDmg": 280,
          "resonanceBns": 130
        },
        "mainText": "크확[2돌크피]",
        "subText": "회절피증/공퍼 · 회절피증or공퍼/공퍼",
        "main4Exact": [
          "critRate"
        ],
        "mainStatAdjusted": false
      },
      {
        "id": "34311-속공-critDmg",
        "label": "속공",
        "costs": [
          3,
          4,
          3,
          1,
          1
        ],
        "main4": [
          "critDmg"
        ],
        "main3": [
          "spectroBns",
          "atkPct"
        ],
        "main3Options": [
          [
            "spectroBns",
            "atkPct"
          ],
          [
            "atkPct",
            "atkPct"
          ]
        ],
        "allowed3": [
          "spectroBns",
          "atkPct"
        ],
        "main1": "atkPct",
        "baseline": {
          "atk": 2400,
          "critRate": 48,
          "critDmg": 324,
          "resonanceBns": 130
        },
        "mainText": "크확[2돌크피]",
        "subText": "회절피증/공퍼 · 회절피증or공퍼/공퍼",
        "main4Exact": [
          "critDmg"
        ],
        "mainStatAdjusted": true
      }
    ],
    "sets": [
      "Radiance"
    ],
    "setRules": [
      [
        {
          "id": "Radiance",
          "count": 5
        }
      ]
    ],
    "setCount": 5,
    "setText": "영원의 광채[34311]",
    "sourceKind": "community",
    "sourceUrl": "https://github.com/kedaygon/wuwa_yeejalky_overlay/blob/eda99e57a9ce0dae5501603fd3d3bc4f9d05f8dd/wuwa_chars.json",
    "supplementedStats": [],
    "notes": "2돌파 + 필드 편성시 크확 + 20% 페비와 함께 쓰는걸 추천\n없다면 아쉬운 대로 회랑자",
    "sourcePrimary": "2100[속속], 2400[속공]",
    "sourceEnergy": "125~130"
  },
  "cantarella": {
    "primary": "atk",
    "weaponId": "rectifier006",
    "variants": [
      {
        "id": "43311-권장",
        "label": "권장",
        "costs": [
          4,
          3,
          3,
          1,
          1
        ],
        "main4": [
          "critRate"
        ],
        "main3": null,
        "main3Options": [
          [
            "havocBns",
            "atkPct"
          ],
          [
            "atkPct",
            "atkPct"
          ]
        ],
        "allowed3": [
          "havocBns",
          "atkPct"
        ],
        "main1": "atkPct",
        "baseline": {
          "atk": 1800,
          "critRate": 70,
          "critDmg": 280,
          "resonanceBns": 130
        },
        "mainText": "크확",
        "subText": "인멸피증/공퍼 · 인멸피증or공퍼/공퍼"
      }
    ],
    "sets": [
      "Veil",
      "Clouds"
    ],
    "setRules": [
      [
        {
          "id": "Veil",
          "count": 5
        }
      ],
      [
        {
          "id": "Clouds",
          "count": 5
        }
      ]
    ],
    "setCount": 5,
    "setText": "어둠의 장막[43311]\n떠오르는 구름[43311]",
    "sourceKind": "community",
    "sourceUrl": "https://github.com/kedaygon/wuwa_yeejalky_overlay/blob/eda99e57a9ce0dae5501603fd3d3bc4f9d05f8dd/wuwa_chars.json",
    "supplementedStats": [],
    "notes": "로코코 등과 함께 사용 or 절지 대용으로 사용",
    "sourcePrimary": "1800",
    "sourceEnergy": "130"
  },
  "rover_aero": {
    "primary": "atk",
    "weaponId": "sword005",
    "variants": [
      {
        "id": "43311-권장-critDmg",
        "label": "권장",
        "costs": [
          4,
          3,
          3,
          1,
          1
        ],
        "main4": [
          "critDmg"
        ],
        "main3": [
          "aeroBns",
          "atkPct"
        ],
        "main3Options": [
          [
            "aeroBns",
            "atkPct"
          ],
          [
            "atkPct",
            "atkPct"
          ],
          [
            "resonanceBns",
            "atkPct"
          ]
        ],
        "allowed3": [
          "aeroBns",
          "atkPct",
          "resonanceBns"
        ],
        "main1": "atkPct",
        "baseline": {
          "atk": 1900,
          "critRate": 60,
          "critDmg": 200,
          "resonanceBns": 150
        },
        "mainText": "크확,크피",
        "subText": "기류피증 l 공퍼/공퍼 · 기류피증 l 공명효율/공퍼",
        "main4Exact": [
          "critDmg"
        ],
        "mainStatAdjusted": false
      },
      {
        "id": "43311-권장-critRate",
        "label": "권장",
        "costs": [
          4,
          3,
          3,
          1,
          1
        ],
        "main4": [
          "critRate"
        ],
        "main3": [
          "aeroBns",
          "atkPct"
        ],
        "main3Options": [
          [
            "aeroBns",
            "atkPct"
          ],
          [
            "atkPct",
            "atkPct"
          ],
          [
            "resonanceBns",
            "atkPct"
          ]
        ],
        "allowed3": [
          "aeroBns",
          "atkPct",
          "resonanceBns"
        ],
        "main1": "atkPct",
        "baseline": {
          "atk": 1900,
          "critRate": 82,
          "critDmg": 156,
          "resonanceBns": 150
        },
        "mainText": "크확,크피",
        "subText": "기류피증 l 공퍼/공퍼 · 기류피증 l 공명효율/공퍼",
        "main4Exact": [
          "critRate"
        ],
        "mainStatAdjusted": true
      },
      {
        "id": "43311-공효-critDmg",
        "label": "공효",
        "costs": [
          4,
          3,
          3,
          1,
          1
        ],
        "main4": [
          "critDmg"
        ],
        "main3": [
          "aeroBns",
          "resonanceBns"
        ],
        "main3Options": [
          [
            "aeroBns",
            "atkPct"
          ],
          [
            "atkPct",
            "atkPct"
          ],
          [
            "resonanceBns",
            "atkPct"
          ]
        ],
        "allowed3": [
          "aeroBns",
          "atkPct",
          "resonanceBns"
        ],
        "main1": "atkPct",
        "baseline": {
          "atk": 1900,
          "critRate": 60,
          "critDmg": 200,
          "resonanceBns": 200
        },
        "mainText": "크확,크피",
        "subText": "기류피증 l 공퍼/공퍼 · 기류피증 l 공명효율/공퍼",
        "main4Exact": [
          "critDmg"
        ],
        "mainStatAdjusted": false
      },
      {
        "id": "43311-공효-critRate",
        "label": "공효",
        "costs": [
          4,
          3,
          3,
          1,
          1
        ],
        "main4": [
          "critRate"
        ],
        "main3": [
          "aeroBns",
          "resonanceBns"
        ],
        "main3Options": [
          [
            "aeroBns",
            "atkPct"
          ],
          [
            "atkPct",
            "atkPct"
          ],
          [
            "resonanceBns",
            "atkPct"
          ]
        ],
        "allowed3": [
          "aeroBns",
          "atkPct",
          "resonanceBns"
        ],
        "main1": "atkPct",
        "baseline": {
          "atk": 1900,
          "critRate": 82,
          "critDmg": 156,
          "resonanceBns": 200
        },
        "mainText": "크확,크피",
        "subText": "기류피증 l 공퍼/공퍼 · 기류피증 l 공명효율/공퍼",
        "main4Exact": [
          "critRate"
        ],
        "mainStatAdjusted": true
      }
    ],
    "sets": [
      "Pilgrimage",
      "Rejuvent"
    ],
    "setRules": [
      [
        {
          "id": "Pilgrimage",
          "count": 5
        }
      ],
      [
        {
          "id": "Rejuvent",
          "count": 5
        }
      ]
    ],
    "setCount": 5,
    "setText": "영광이 깃든 바람[43311] / 찬란한 광휘[43311]",
    "sourceKind": "community",
    "sourceUrl": "https://github.com/kedaygon/wuwa_yeejalky_overlay/blob/eda99e57a9ce0dae5501603fd3d3bc4f9d05f8dd/wuwa_chars.json",
    "supplementedStats": [],
    "notes": "혈맹의 약속은 메인스토리 클리어시 획득 가능\n스킬 및 에코작은 사이클 용 최소 육성 권장\n파수인으로 대체 가능\n찬란한 광휘 사용시 기존 힐러 세팅 그대로",
    "sourcePrimary": "1900",
    "sourceEnergy": "150[피증+공%]\n200[피증+공효]"
  },
  "brant": {
    "primary": "atk",
    "weaponId": "sword004",
    "variants": [
      {
        "id": "43311-권장",
        "label": "권장",
        "costs": [
          4,
          3,
          3,
          1,
          1
        ],
        "main4": [
          "critRate"
        ],
        "main3": null,
        "main3Options": [
          [
            "resonanceBns",
            "atkPct"
          ],
          [
            "fusionBns",
            "atkPct"
          ]
        ],
        "allowed3": [
          "fusionBns",
          "atkPct",
          "resonanceBns"
        ],
        "main1": "atkPct",
        "baseline": {
          "atk": 1700,
          "critRate": 75,
          "critDmg": 220,
          "resonanceBns": 270
        },
        "mainText": "크확",
        "subText": "공명효율/공퍼 · 공명효율or용융피증/공퍼"
      }
    ],
    "sets": [
      "Courage"
    ],
    "setRules": [
      [
        {
          "id": "Courage",
          "count": 5
        }
      ]
    ],
    "setCount": 5,
    "setText": "파도에 맞선 용기[43311]",
    "sourceKind": "community",
    "sourceUrl": "https://github.com/kedaygon/wuwa_yeejalky_overlay/blob/eda99e57a9ce0dae5501603fd3d3bc4f9d05f8dd/wuwa_chars.json",
    "supplementedStats": [],
    "notes": "일공피 >> 공% / 용융속성 전용 서포터로 사용하거나, 일반공격 피해 버프를 주는 아군과 사용 최대 공효 280",
    "sourcePrimary": "1700",
    "sourceEnergy": "270[최소 250]"
  },
  "phoebe": {
    "primary": "atk",
    "weaponId": "rectifier005",
    "variants": [
      {
        "id": "43311-43311",
        "label": "43311",
        "costs": [
          4,
          3,
          3,
          1,
          1
        ],
        "main4": [
          "critDmg"
        ],
        "main3": null,
        "main3Options": [
          [
            "spectroBns",
            "atkPct"
          ],
          [
            "atkPct",
            "atkPct"
          ]
        ],
        "allowed3": [
          "spectroBns",
          "atkPct"
        ],
        "main1": "atkPct",
        "baseline": {
          "atk": 2200,
          "critRate": 70,
          "critDmg": 280,
          "resonanceBns": 120
        },
        "mainText": "크피",
        "subText": "회절피증/공퍼 · 회절피증or공퍼/공퍼"
      }
    ],
    "sets": [
      "Radiance"
    ],
    "setRules": [
      [
        {
          "id": "Radiance",
          "count": 5
        }
      ]
    ],
    "setCount": 5,
    "setText": "영원의 광채[43311][44111]",
    "sourceKind": "community",
    "sourceUrl": "https://github.com/kedaygon/wuwa_yeejalky_overlay/blob/eda99e57a9ce0dae5501603fd3d3bc4f9d05f8dd/wuwa_chars.json",
    "supplementedStats": [],
    "notes": "메인딜로 기용할시 서포터로 회랑자 채용",
    "sourcePrimary": "2200[43311]",
    "sourceEnergy": "120"
  },
  "roccia": {
    "primary": "atk",
    "weaponId": "gauntlet003",
    "variants": [
      {
        "id": "43311-권장-critDmg",
        "label": "권장",
        "costs": [
          4,
          3,
          3,
          1,
          1
        ],
        "main4": [
          "critDmg"
        ],
        "main3": null,
        "main3Options": [
          [
            "havocBns",
            "atkPct"
          ],
          [
            "atkPct",
            "atkPct"
          ]
        ],
        "allowed3": [
          "havocBns",
          "atkPct"
        ],
        "main1": "atkPct",
        "baseline": {
          "atk": 2250,
          "critRate": 65,
          "critDmg": 280,
          "resonanceBns": 130
        },
        "mainText": "크확,크피",
        "subText": "인멸피증/공퍼 · 인멸피증or공퍼/공퍼",
        "main4Exact": [
          "critDmg"
        ],
        "mainStatAdjusted": false
      },
      {
        "id": "43311-권장-critRate",
        "label": "권장",
        "costs": [
          4,
          3,
          3,
          1,
          1
        ],
        "main4": [
          "critRate"
        ],
        "main3": null,
        "main3Options": [
          [
            "havocBns",
            "atkPct"
          ],
          [
            "atkPct",
            "atkPct"
          ]
        ],
        "allowed3": [
          "havocBns",
          "atkPct"
        ],
        "main1": "atkPct",
        "baseline": {
          "atk": 2250,
          "critRate": 87,
          "critDmg": 236,
          "resonanceBns": 130
        },
        "mainText": "크확,크피",
        "subText": "인멸피증/공퍼 · 인멸피증or공퍼/공퍼",
        "main4Exact": [
          "critRate"
        ],
        "mainStatAdjusted": true
      }
    ],
    "sets": [
      "Veil"
    ],
    "setRules": [
      [
        {
          "id": "Veil",
          "count": 5
        }
      ]
    ],
    "setCount": 5,
    "setText": "어둠의 장막[43311]",
    "sourceKind": "community",
    "sourceUrl": "https://github.com/kedaygon/wuwa_yeejalky_overlay/blob/eda99e57a9ce0dae5501603fd3d3bc4f9d05f8dd/wuwa_chars.json",
    "supplementedStats": [],
    "notes": "구름 세트 기용시 공효 요구치 -10",
    "sourcePrimary": "2250",
    "sourceEnergy": "130"
  },
  "carlotta": {
    "primary": "atk",
    "weaponId": "pistol002",
    "variants": [
      {
        "id": "43311-권장",
        "label": "권장",
        "costs": [
          4,
          3,
          3,
          1,
          1
        ],
        "main4": [
          "critRate"
        ],
        "main3": null,
        "main3Options": [
          [
            "glacioBns",
            "atkPct"
          ],
          [
            "atkPct",
            "atkPct"
          ]
        ],
        "allowed3": [
          "glacioBns",
          "atkPct"
        ],
        "main1": "atkPct",
        "baseline": {
          "atk": 2350,
          "critRate": 70,
          "critDmg": 290,
          "resonanceBns": 130
        },
        "mainText": "크확",
        "subText": "응결피증/공퍼 · 공퍼/공퍼"
      }
    ],
    "sets": [
      "Frosty"
    ],
    "setRules": [
      [
        {
          "id": "Frosty",
          "count": 5
        }
      ]
    ],
    "setCount": 5,
    "setText": "냉철한 결단[43311]",
    "sourceKind": "community",
    "sourceUrl": "https://github.com/kedaygon/wuwa_yeejalky_overlay/blob/eda99e57a9ce0dae5501603fd3d3bc4f9d05f8dd/wuwa_chars.json",
    "supplementedStats": [],
    "notes": "파티에 절지가 있을 시 공효 110이면 충분",
    "sourcePrimary": "2350",
    "sourceEnergy": "130"
  },
  "lumi": {
    "primary": "atk",
    "weaponId": "broadblade001",
    "variants": [
      {
        "id": "43311-권장",
        "label": "권장",
        "costs": [
          4,
          3,
          3,
          1,
          1
        ],
        "main4": [
          "critRate"
        ],
        "main3": null,
        "main3Options": [
          [
            "electroBns",
            "atkPct"
          ],
          [
            "atkPct",
            "atkPct"
          ]
        ],
        "allowed3": [
          "electroBns",
          "atkPct"
        ],
        "main1": "atkPct",
        "baseline": {
          "atk": 2000,
          "critRate": 60,
          "critDmg": 200,
          "resonanceBns": 110
        },
        "mainText": "크확",
        "subText": "전도피증/공퍼 · 전도피증or공퍼/공퍼"
      }
    ],
    "sets": [
      "Thunder",
      "Clouds"
    ],
    "setRules": [
      [
        {
          "id": "Thunder",
          "count": 5
        }
      ],
      [
        {
          "id": "Clouds",
          "count": 5
        }
      ]
    ],
    "setCount": 5,
    "setText": "울려퍼지는 뇌음[43311] / 떠오르는 구름[43311]",
    "sourceKind": "community",
    "sourceUrl": "https://github.com/kedaygon/wuwa_yeejalky_overlay/blob/eda99e57a9ce0dae5501603fd3d3bc4f9d05f8dd/wuwa_chars.json",
    "supplementedStats": [],
    "notes": "안전하게 딜링 가능한 메인딜러, 모든 피해판정이 거의 일반 공격 판정, 숙련도 높을수록 포텐셜 향상",
    "sourcePrimary": "2000",
    "sourceEnergy": "110"
  },
  "camellya": {
    "primary": "atk",
    "weaponId": "sword003",
    "variants": [
      {
        "id": "43311-권장-critDmg",
        "label": "권장",
        "costs": [
          4,
          3,
          3,
          1,
          1
        ],
        "main4": [
          "critDmg"
        ],
        "main3": null,
        "main3Options": [
          [
            "havocBns",
            "atkPct"
          ],
          [
            "atkPct",
            "atkPct"
          ]
        ],
        "allowed3": [
          "havocBns",
          "atkPct"
        ],
        "main1": "atkPct",
        "baseline": {
          "atk": 2450,
          "critRate": 65,
          "critDmg": 280,
          "resonanceBns": 120
        },
        "mainText": "크확,크피",
        "subText": "인멸피증/공퍼 · 인멸피증or공퍼/공퍼",
        "main4Exact": [
          "critDmg"
        ],
        "mainStatAdjusted": false
      },
      {
        "id": "43311-권장-critRate",
        "label": "권장",
        "costs": [
          4,
          3,
          3,
          1,
          1
        ],
        "main4": [
          "critRate"
        ],
        "main3": null,
        "main3Options": [
          [
            "havocBns",
            "atkPct"
          ],
          [
            "atkPct",
            "atkPct"
          ]
        ],
        "allowed3": [
          "havocBns",
          "atkPct"
        ],
        "main1": "atkPct",
        "baseline": {
          "atk": 2450,
          "critRate": 87,
          "critDmg": 236,
          "resonanceBns": 120
        },
        "mainText": "크확,크피",
        "subText": "인멸피증/공퍼 · 인멸피증or공퍼/공퍼",
        "main4Exact": [
          "critRate"
        ],
        "mainStatAdjusted": true
      }
    ],
    "sets": [
      "Eclipse"
    ],
    "setRules": [
      [
        {
          "id": "Eclipse",
          "count": 5
        }
      ]
    ],
    "setCount": 5,
    "setText": "빛을 삼키는 해[43311]",
    "sourceKind": "community",
    "sourceUrl": "https://github.com/kedaygon/wuwa_yeejalky_overlay/blob/eda99e57a9ce0dae5501603fd3d3bc4f9d05f8dd/wuwa_chars.json",
    "supplementedStats": [],
    "notes": "",
    "sourcePrimary": "2450",
    "sourceEnergy": "120"
  },
  "youhu": {
    "primary": "atk",
    "weaponId": "gauntlet002",
    "variants": [
      {
        "id": "43311-권장",
        "label": "권장",
        "costs": [
          4,
          3,
          3,
          1,
          1
        ],
        "main4": [
          "healBns"
        ],
        "main3": null,
        "main3Options": [
          [
            "glacioBns",
            "atkPct"
          ]
        ],
        "allowed3": [
          "glacioBns",
          "atkPct"
        ],
        "main1": "atkPct",
        "baseline": {
          "atk": 2000,
          "resonanceBns": 130
        },
        "mainText": "치유보너스",
        "subText": "응결피증/공퍼 · 응결피증/공퍼"
      }
    ],
    "sets": [
      "Rejuvent"
    ],
    "setRules": [
      [
        {
          "id": "Rejuvent",
          "count": 5
        }
      ]
    ],
    "setCount": 5,
    "setText": "찬란한 광휘[43311]",
    "sourceKind": "community",
    "sourceUrl": "https://github.com/kedaygon/wuwa_yeejalky_overlay/blob/eda99e57a9ce0dae5501603fd3d3bc4f9d05f8dd/wuwa_chars.json",
    "supplementUrl": "https://www.dennlog.com/ko/games/wutheringwaves/characters/Youhu",
    "supplementedStats": [
      "atk"
    ],
    "notes": "협동 공격 버프 28초간 100% 부스트, 서포터로 사용시 악센트 채용",
    "sourcePrimary": "—",
    "sourceEnergy": "130"
  },
  "shorekeeper": {
    "primary": "hp",
    "weaponId": "rectifier004",
    "variants": [
      {
        "id": "43311-권장",
        "label": "권장",
        "costs": [
          4,
          3,
          3,
          1,
          1
        ],
        "main4": [
          "healBns",
          "hpPct"
        ],
        "main3": null,
        "main3Options": [
          [
            "resonanceBns",
            "hpPct"
          ]
        ],
        "allowed3": [
          "hpPct",
          "resonanceBns"
        ],
        "main1": "hpPct",
        "baseline": {
          "hp": 45000,
          "resonanceBns": 240
        },
        "mainText": "체퍼,치유보너스",
        "subText": "공효/체퍼 · 공효/체퍼"
      },
      {
        "id": "43111-권장",
        "label": "권장",
        "costs": [
          4,
          3,
          1,
          1,
          1
        ],
        "main4": [
          "healBns",
          "hpPct"
        ],
        "main3": null,
        "allowed3": [
          "hpPct",
          "resonanceBns"
        ],
        "main1": "hpPct",
        "baseline": {
          "hp": 45000,
          "resonanceBns": 240
        },
        "mainText": "체퍼,치유보너스",
        "subText": "공효/체퍼x2 · /체퍼"
      },
      {
        "id": "43311-오류",
        "label": "오류",
        "costs": [
          4,
          3,
          3,
          1,
          1
        ],
        "main4": [
          "healBns",
          "hpPct"
        ],
        "main3": null,
        "main3Options": [
          [
            "resonanceBns",
            "hpPct"
          ]
        ],
        "allowed3": [
          "hpPct",
          "resonanceBns"
        ],
        "main1": "hpPct",
        "baseline": {
          "hp": 45000,
          "resonanceBns": 230
        },
        "mainText": "체퍼,치유보너스",
        "subText": "공효/체퍼 · 공효/체퍼",
        "mainEchoId": "X78"
      }
    ],
    "sets": [
      "Rejuvent"
    ],
    "setRules": [
      [
        {
          "id": "Rejuvent",
          "count": 5
        }
      ]
    ],
    "setCount": 5,
    "setText": "찬란한 광휘[43311][43111]",
    "sourceKind": "community",
    "sourceUrl": "https://github.com/kedaygon/wuwa_yeejalky_overlay/blob/eda99e57a9ce0dae5501603fd3d3bc4f9d05f8dd/wuwa_chars.json",
    "supplementedStats": [],
    "notes": "1코스트는 체퍼 사용",
    "sourcePrimary": "45000",
    "sourceEnergy": "240 / 230[오류_사용시]"
  },
  "xiangliyao": {
    "primary": "atk",
    "weaponId": "gauntlet002",
    "variants": [
      {
        "id": "43311-권장",
        "label": "권장",
        "costs": [
          4,
          3,
          3,
          1,
          1
        ],
        "main4": [
          "critDmg"
        ],
        "main3": null,
        "main3Options": [
          [
            "electroBns",
            "atkPct"
          ],
          [
            "atkPct",
            "atkPct"
          ]
        ],
        "allowed3": [
          "electroBns",
          "atkPct"
        ],
        "main1": "atkPct",
        "baseline": {
          "atk": 2200,
          "critRate": 65,
          "critDmg": 280,
          "resonanceBns": 120
        },
        "mainText": "크피",
        "subText": "전도피증/공퍼 · 전도피증or공퍼/공퍼"
      }
    ],
    "sets": [
      "Thunder"
    ],
    "setRules": [
      [
        {
          "id": "Thunder",
          "count": 5
        }
      ]
    ],
    "setCount": 5,
    "setText": "울려퍼지는 뇌음[43311]",
    "sourceKind": "community",
    "sourceUrl": "https://github.com/kedaygon/wuwa_yeejalky_overlay/blob/eda99e57a9ce0dae5501603fd3d3bc4f9d05f8dd/wuwa_chars.json",
    "supplementedStats": [],
    "notes": "",
    "sourcePrimary": "2200",
    "sourceEnergy": "120"
  },
  "zhezhi": {
    "primary": "atk",
    "weaponId": "rectifier003",
    "variants": [
      {
        "id": "43311-권장",
        "label": "권장",
        "costs": [
          4,
          3,
          3,
          1,
          1
        ],
        "main4": [
          "critRate"
        ],
        "main3": null,
        "main3Options": [
          [
            "glacioBns",
            "atkPct"
          ],
          [
            "atkPct",
            "atkPct"
          ]
        ],
        "allowed3": [
          "glacioBns",
          "atkPct"
        ],
        "main1": "atkPct",
        "baseline": {
          "atk": 1800,
          "critRate": 70,
          "critDmg": 290,
          "resonanceBns": 130
        },
        "mainText": "크확",
        "subText": "응결피증/공퍼 · 응결피증or공퍼/공퍼"
      }
    ],
    "sets": [
      "Clouds",
      "Empyrean"
    ],
    "setRules": [
      [
        {
          "id": "Clouds",
          "count": 5
        }
      ],
      [
        {
          "id": "Empyrean",
          "count": 5
        }
      ]
    ],
    "setCount": 5,
    "setText": "떠오르는 구름[43311]\n하늘의 합주곡[43311]",
    "sourceKind": "community",
    "sourceUrl": "https://github.com/kedaygon/wuwa_yeejalky_overlay/blob/eda99e57a9ce0dae5501603fd3d3bc4f9d05f8dd/wuwa_chars.json",
    "supplementedStats": [],
    "notes": "1체인에 공명 에너지 회복이 달려있어서 1체인 이상이면 공효 요구치가 낮아짐",
    "sourcePrimary": "1800",
    "sourceEnergy": "130"
  },
  "changli": {
    "primary": "atk",
    "weaponId": "sword002",
    "variants": [
      {
        "id": "43311-권장-critRate",
        "label": "권장",
        "costs": [
          4,
          3,
          3,
          1,
          1
        ],
        "main4": [
          "critRate"
        ],
        "main3": null,
        "main3Options": [
          [
            "fusionBns",
            "atkPct"
          ],
          [
            "atkPct",
            "atkPct"
          ]
        ],
        "allowed3": [
          "fusionBns",
          "atkPct"
        ],
        "main1": "atkPct",
        "baseline": {
          "atk": 2500,
          "critRate": 70,
          "critDmg": 260,
          "resonanceBns": 120
        },
        "mainText": "크확,크피[2돌+]",
        "subText": "용융피증or공퍼[루파편성]/공퍼 · 공퍼/공퍼",
        "main4Exact": [
          "critRate"
        ],
        "mainStatAdjusted": false
      },
      {
        "id": "43311-권장-critDmg",
        "label": "권장",
        "costs": [
          4,
          3,
          3,
          1,
          1
        ],
        "main4": [
          "critDmg"
        ],
        "main3": null,
        "main3Options": [
          [
            "fusionBns",
            "atkPct"
          ],
          [
            "atkPct",
            "atkPct"
          ]
        ],
        "allowed3": [
          "fusionBns",
          "atkPct"
        ],
        "main1": "atkPct",
        "baseline": {
          "atk": 2500,
          "critRate": 48,
          "critDmg": 304,
          "resonanceBns": 120
        },
        "mainText": "크확,크피[2돌+]",
        "subText": "용융피증or공퍼[루파편성]/공퍼 · 공퍼/공퍼",
        "main4Exact": [
          "critDmg"
        ],
        "mainStatAdjusted": true
      }
    ],
    "sets": [
      "Rift"
    ],
    "setRules": [
      [
        {
          "id": "Rift",
          "count": 5
        }
      ]
    ],
    "setCount": 5,
    "setText": "솟구치는 용암[43311]",
    "sourceKind": "community",
    "sourceUrl": "https://github.com/kedaygon/wuwa_yeejalky_overlay/blob/eda99e57a9ce0dae5501603fd3d3bc4f9d05f8dd/wuwa_chars.json",
    "supplementedStats": [],
    "notes": "2체인에 이화 획득시 크리 25퍼 증가가 있어서 2체인 이상이면 4코 주옵 크리피해 고려",
    "sourcePrimary": "2500",
    "sourceEnergy": "120"
  },
  "jinhsi": {
    "primary": "atk",
    "weaponId": "broadblade003",
    "variants": [
      {
        "id": "43311-43311-critDmg",
        "label": "43311",
        "costs": [
          4,
          3,
          3,
          1,
          1
        ],
        "main4": [
          "critDmg"
        ],
        "main3": null,
        "main3Options": [
          [
            "spectroBns",
            "atkPct"
          ],
          [
            "atkPct",
            "atkPct"
          ]
        ],
        "allowed3": [
          "spectroBns",
          "atkPct"
        ],
        "main1": "atkPct",
        "baseline": {
          "atk": 2200,
          "critRate": 70,
          "critDmg": 260,
          "resonanceBns": 130
        },
        "mainText": "크확,크피",
        "subText": "회절피증/공퍼 · 회절피증or공퍼/공퍼",
        "main4Exact": [
          "critDmg"
        ],
        "mainStatAdjusted": false
      },
      {
        "id": "43311-43311-critRate",
        "label": "43311",
        "costs": [
          4,
          3,
          3,
          1,
          1
        ],
        "main4": [
          "critRate"
        ],
        "main3": null,
        "main3Options": [
          [
            "spectroBns",
            "atkPct"
          ],
          [
            "atkPct",
            "atkPct"
          ]
        ],
        "allowed3": [
          "spectroBns",
          "atkPct"
        ],
        "main1": "atkPct",
        "baseline": {
          "atk": 2200,
          "critRate": 92,
          "critDmg": 216,
          "resonanceBns": 130
        },
        "mainText": "크확,크피",
        "subText": "회절피증/공퍼 · 회절피증or공퍼/공퍼",
        "main4Exact": [
          "critRate"
        ],
        "mainStatAdjusted": true
      },
      {
        "id": "44111-44111",
        "label": "44111",
        "costs": [
          4,
          4,
          1,
          1,
          1
        ],
        "main4": [
          "critRate",
          "critDmg"
        ],
        "main3": null,
        "allowed3": [
          "atkPct"
        ],
        "main1": "atkPct",
        "baseline": {
          "atk": 2100,
          "critRate": 70,
          "critDmg": 300,
          "resonanceBns": 130
        },
        "mainText": "크확,크피",
        "subText": "/공퍼 · /공퍼x2",
        "main4Exact": [
          "critRate",
          "critDmg"
        ]
      }
    ],
    "sets": [
      "Light"
    ],
    "setRules": [
      [
        {
          "id": "Light",
          "count": 5
        }
      ]
    ],
    "setCount": 5,
    "setText": "빛나는 별[43311][44111]",
    "sourceKind": "community",
    "sourceUrl": "https://github.com/kedaygon/wuwa_yeejalky_overlay/blob/eda99e57a9ce0dae5501603fd3d3bc4f9d05f8dd/wuwa_chars.json",
    "supplementedStats": [],
    "notes": "파티원에 협동 공격 캐릭터 추천 ex) 절지, 음림, 연무",
    "sourcePrimary": "2200[43311], 2100[44111]",
    "sourceEnergy": "120~130"
  },
  "yinlin": {
    "primary": "atk",
    "weaponId": "rectifier002",
    "variants": [
      {
        "id": "43311-권장",
        "label": "권장",
        "costs": [
          4,
          3,
          3,
          1,
          1
        ],
        "main4": [
          "critDmg"
        ],
        "main3": null,
        "main3Options": [
          [
            "electroBns",
            "atkPct"
          ],
          [
            "atkPct",
            "atkPct"
          ]
        ],
        "allowed3": [
          "electroBns",
          "atkPct"
        ],
        "main1": "atkPct",
        "baseline": {
          "atk": 1850,
          "critRate": 80,
          "critDmg": 270,
          "resonanceBns": 120
        },
        "mainText": "크피",
        "subText": "전도피증/공퍼 · 전도피증or공퍼/공퍼"
      }
    ],
    "sets": [
      "Clouds",
      "Empyrean"
    ],
    "setRules": [
      [
        {
          "id": "Clouds",
          "count": 5
        }
      ],
      [
        {
          "id": "Empyrean",
          "count": 5
        }
      ]
    ],
    "setCount": 5,
    "setText": "떠오르는 구름[43311]\n하늘의 합주곡[43311]",
    "sourceKind": "community",
    "sourceUrl": "https://github.com/kedaygon/wuwa_yeejalky_overlay/blob/eda99e57a9ce0dae5501603fd3d3bc4f9d05f8dd/wuwa_chars.json",
    "supplementedStats": [],
    "notes": "2체인에 공명 에너지 회복이 달려있어서 2체인 이상이면 공효 요구치가 낮아짐",
    "sourcePrimary": "1850",
    "sourceEnergy": "120"
  },
  "jiyan": {
    "primary": "atk",
    "weaponId": "broadblade002",
    "variants": [
      {
        "id": "43311-권장",
        "label": "권장",
        "costs": [
          4,
          3,
          3,
          1,
          1
        ],
        "main4": [
          "critRate"
        ],
        "main3": null,
        "main3Options": [
          [
            "aeroBns",
            "atkPct"
          ],
          [
            "atkPct",
            "atkPct"
          ]
        ],
        "allowed3": [
          "aeroBns",
          "atkPct"
        ],
        "main1": "atkPct",
        "baseline": {
          "atk": 2250,
          "critRate": 70,
          "critDmg": 260,
          "resonanceBns": 130
        },
        "mainText": "크확",
        "subText": "기류피증/공퍼 · 기류피증or공퍼/공퍼"
      }
    ],
    "sets": [
      "Gale"
    ],
    "setRules": [
      [
        {
          "id": "Gale",
          "count": 5
        }
      ]
    ],
    "setCount": 5,
    "setText": "스쳐가는 바람[43311]",
    "sourceKind": "community",
    "sourceUrl": "https://github.com/kedaygon/wuwa_yeejalky_overlay/blob/eda99e57a9ce0dae5501603fd3d3bc4f9d05f8dd/wuwa_chars.json",
    "supplementedStats": [],
    "notes": "1체인에 공명스킬 1회 추가가 있어서 1체인 이상이면 요구 공효 수치가 낮아짐",
    "sourcePrimary": "2250",
    "sourceEnergy": "130"
  },
  "rover_havoc": {
    "primary": "atk",
    "weaponId": "sword001",
    "variants": [
      {
        "id": "43311-권장",
        "label": "권장",
        "costs": [
          4,
          3,
          3,
          1,
          1
        ],
        "main4": [
          "critDmg"
        ],
        "main3": null,
        "main3Options": [
          [
            "havocBns",
            "atkPct"
          ],
          [
            "atkPct",
            "atkPct"
          ]
        ],
        "allowed3": [
          "havocBns",
          "atkPct"
        ],
        "main1": "atkPct",
        "baseline": {
          "atk": 2000,
          "critRate": 65,
          "critDmg": 270,
          "resonanceBns": 120
        },
        "mainText": "크피",
        "subText": "인멸피증/공퍼 · 인멸피증or공퍼/공퍼"
      }
    ],
    "sets": [
      "Eclipse"
    ],
    "setRules": [
      [
        {
          "id": "Eclipse",
          "count": 5
        }
      ]
    ],
    "setCount": 5,
    "setText": "빛을 삼키는 해[43311]",
    "sourceKind": "community",
    "sourceUrl": "https://github.com/kedaygon/wuwa_yeejalky_overlay/blob/eda99e57a9ce0dae5501603fd3d3bc4f9d05f8dd/wuwa_chars.json",
    "supplementedStats": [],
    "notes": "6돌 + 상시 직검(or 패스 무기)일 경우 크피 옵션에 집중",
    "sourcePrimary": "2000",
    "sourceEnergy": "120"
  },
  "rover_spectro": {
    "primary": "atk",
    "weaponId": "sword001",
    "variants": [
      {
        "id": "43311-권장-critDmg",
        "label": "권장",
        "costs": [
          4,
          3,
          3,
          1,
          1
        ],
        "main4": [
          "critDmg"
        ],
        "main3": null,
        "main3Options": [
          [
            "spectroBns",
            "atkPct"
          ],
          [
            "atkPct",
            "atkPct"
          ]
        ],
        "allowed3": [
          "spectroBns",
          "atkPct"
        ],
        "main1": "atkPct",
        "baseline": {
          "atk": 1850,
          "critRate": 70,
          "critDmg": 250,
          "resonanceBns": 120
        },
        "mainText": "크확,크피",
        "subText": "회절피증/공퍼 · 회절피증or공퍼/공퍼",
        "main4Exact": [
          "critDmg"
        ],
        "mainStatAdjusted": false
      },
      {
        "id": "43311-권장-critRate",
        "label": "권장",
        "costs": [
          4,
          3,
          3,
          1,
          1
        ],
        "main4": [
          "critRate"
        ],
        "main3": null,
        "main3Options": [
          [
            "spectroBns",
            "atkPct"
          ],
          [
            "atkPct",
            "atkPct"
          ]
        ],
        "allowed3": [
          "spectroBns",
          "atkPct"
        ],
        "main1": "atkPct",
        "baseline": {
          "atk": 1850,
          "critRate": 92,
          "critDmg": 206,
          "resonanceBns": 120
        },
        "mainText": "크확,크피",
        "subText": "회절피증/공퍼 · 회절피증or공퍼/공퍼",
        "main4Exact": [
          "critRate"
        ],
        "mainStatAdjusted": true
      }
    ],
    "sets": [
      "Light"
    ],
    "setRules": [
      [
        {
          "id": "Light",
          "count": 5
        }
      ]
    ],
    "setCount": 5,
    "setText": "빛나는 별[43311]",
    "sourceKind": "community",
    "sourceUrl": "https://github.com/kedaygon/wuwa_yeejalky_overlay/blob/eda99e57a9ce0dae5501603fd3d3bc4f9d05f8dd/wuwa_chars.json",
    "supplementedStats": [],
    "notes": "3체인에 공효 20퍼가 달려있어서 3체인 이상이면 공효 요구치가 낮아짐",
    "sourcePrimary": "1850",
    "sourceEnergy": "120"
  },
  "verina": {
    "primary": "atk",
    "weaponId": "rectifier102",
    "variants": [
      {
        "id": "43311-권장",
        "label": "권장",
        "costs": [
          4,
          3,
          3,
          1,
          1
        ],
        "main4": [
          "healBns",
          "atkPct"
        ],
        "main3": null,
        "main3Options": [
          [
            "resonanceBns",
            "atkPct"
          ]
        ],
        "allowed3": [
          "atkPct",
          "resonanceBns"
        ],
        "main1": "atkPct",
        "baseline": {
          "atk": 1500,
          "resonanceBns": 220
        },
        "mainText": "치유보너스or공격력",
        "subText": "공효/공퍼 · 공효/공퍼"
      }
    ],
    "sets": [
      "Rejuvent"
    ],
    "setRules": [
      [
        {
          "id": "Rejuvent",
          "count": 5
        }
      ]
    ],
    "setCount": 5,
    "setText": "찬란한 광휘[43311]",
    "sourceKind": "community",
    "sourceUrl": "https://github.com/kedaygon/wuwa_yeejalky_overlay/blob/eda99e57a9ce0dae5501603fd3d3bc4f9d05f8dd/wuwa_chars.json",
    "supplementedStats": [],
    "notes": "크크 신경쓰지말고 공효만 찍어주면 됨 공격력은 달성 못해도 괜찮음, 공효가 1순위",
    "sourcePrimary": "1500~",
    "sourceEnergy": "220"
  },
  "calcharo": {
    "primary": "atk",
    "weaponId": "broadblade003",
    "variants": [
      {
        "id": "43311-권장",
        "label": "권장",
        "costs": [
          4,
          3,
          3,
          1,
          1
        ],
        "main4": [
          "critDmg"
        ],
        "main3": null,
        "main3Options": [
          [
            "electroBns",
            "atkPct"
          ],
          [
            "atkPct",
            "atkPct"
          ]
        ],
        "allowed3": [
          "electroBns",
          "atkPct"
        ],
        "main1": "atkPct",
        "baseline": {
          "atk": 2200,
          "critRate": 65,
          "critDmg": 260,
          "resonanceBns": 130
        },
        "mainText": "크피",
        "subText": "전도피증/공퍼 · 전도피증or공퍼/공퍼"
      }
    ],
    "sets": [
      "Thunder"
    ],
    "setRules": [
      [
        {
          "id": "Thunder",
          "count": 5
        }
      ]
    ],
    "setCount": 5,
    "setText": "울려퍼지는 뇌음[43311]",
    "sourceKind": "community",
    "sourceUrl": "https://github.com/kedaygon/wuwa_yeejalky_overlay/blob/eda99e57a9ce0dae5501603fd3d3bc4f9d05f8dd/wuwa_chars.json",
    "supplementedStats": [],
    "notes": "1체인에 공명 에너지 회복이 달려있어서 1체인 이상이면 공효 요구치가 낮아짐",
    "sourcePrimary": "2200",
    "sourceEnergy": "130"
  },
  "encore": {
    "primary": "atk",
    "weaponId": "rectifier002",
    "variants": [
      {
        "id": "43311-권장-critDmg",
        "label": "권장",
        "costs": [
          4,
          3,
          3,
          1,
          1
        ],
        "main4": [
          "critDmg"
        ],
        "main3": null,
        "main3Options": [
          [
            "fusionBns",
            "atkPct"
          ],
          [
            "atkPct",
            "atkPct"
          ]
        ],
        "allowed3": [
          "fusionBns",
          "atkPct"
        ],
        "main1": "atkPct",
        "baseline": {
          "atk": 1900,
          "critRate": 70,
          "critDmg": 270,
          "resonanceBns": 120
        },
        "mainText": "크확,크피",
        "subText": "용융피증/공퍼 · 용융피증or공퍼/공퍼",
        "main4Exact": [
          "critDmg"
        ],
        "mainStatAdjusted": false
      },
      {
        "id": "43311-권장-critRate",
        "label": "권장",
        "costs": [
          4,
          3,
          3,
          1,
          1
        ],
        "main4": [
          "critRate"
        ],
        "main3": null,
        "main3Options": [
          [
            "fusionBns",
            "atkPct"
          ],
          [
            "atkPct",
            "atkPct"
          ]
        ],
        "allowed3": [
          "fusionBns",
          "atkPct"
        ],
        "main1": "atkPct",
        "baseline": {
          "atk": 1900,
          "critRate": 92,
          "critDmg": 226,
          "resonanceBns": 120
        },
        "mainText": "크확,크피",
        "subText": "용융피증/공퍼 · 용융피증or공퍼/공퍼",
        "main4Exact": [
          "critRate"
        ],
        "mainStatAdjusted": true
      }
    ],
    "sets": [
      "Rift"
    ],
    "setRules": [
      [
        {
          "id": "Rift",
          "count": 5
        }
      ]
    ],
    "setCount": 5,
    "setText": "솟구치는 용암[43311]",
    "sourceKind": "community",
    "sourceUrl": "https://github.com/kedaygon/wuwa_yeejalky_overlay/blob/eda99e57a9ce0dae5501603fd3d3bc4f9d05f8dd/wuwa_chars.json",
    "supplementedStats": [],
    "notes": "2체인에 공명 에너지 회복이 달려있어서 2체인 이상이면 공효 요구치가 낮아짐",
    "sourcePrimary": "1900",
    "sourceEnergy": "120"
  },
  "jianxin": {
    "primary": "atk",
    "weaponId": "gauntlet003",
    "variants": [
      {
        "id": "43311-권장",
        "label": "권장",
        "costs": [
          4,
          3,
          3,
          1,
          1
        ],
        "main4": [
          "critRate",
          "atkPct"
        ],
        "main3": null,
        "main3Options": [
          [
            "atkPct",
            "atkPct"
          ],
          [
            "aeroBns",
            "atkPct"
          ]
        ],
        "allowed3": [
          "aeroBns",
          "atkPct"
        ],
        "main1": "atkPct",
        "baseline": {
          "atk": 2000,
          "resonanceBns": 180
        },
        "mainText": "크확or공퍼",
        "subText": "공퍼/공퍼 · 기류피증or공퍼/공퍼"
      }
    ],
    "sets": [
      "Gale",
      "Clouds"
    ],
    "setRules": [
      [
        {
          "id": "Gale",
          "count": 5
        }
      ],
      [
        {
          "id": "Clouds",
          "count": 5
        }
      ]
    ],
    "setCount": 5,
    "setText": "스쳐가는 바람[43311] / 떠오르는 구름[43311]",
    "sourceKind": "community",
    "sourceUrl": "https://github.com/kedaygon/wuwa_yeejalky_overlay/blob/eda99e57a9ce0dae5501603fd3d3bc4f9d05f8dd/wuwa_chars.json",
    "supplementUrl": "https://www.dennlog.com/ko/games/wutheringwaves/characters/Jianxin",
    "supplementedStats": [
      "atk"
    ],
    "notes": "공격력 및 크크는 높을 수록 좋음, 서포터 및 빠른 협주용일시 구름셋에 무기 악센트 채용",
    "sourcePrimary": "—",
    "sourceEnergy": "180"
  },
  "lingyang": {
    "primary": "atk",
    "weaponId": "gauntlet004",
    "variants": [
      {
        "id": "43311-권장",
        "label": "권장",
        "costs": [
          4,
          3,
          3,
          1,
          1
        ],
        "main4": [
          "critRate"
        ],
        "main3": null,
        "main3Options": [
          [
            "glacioBns",
            "atkPct"
          ],
          [
            "atkPct",
            "atkPct"
          ]
        ],
        "allowed3": [
          "glacioBns",
          "atkPct"
        ],
        "main1": "atkPct",
        "baseline": {
          "atk": 2200,
          "critRate": 65,
          "critDmg": 240,
          "resonanceBns": 120
        },
        "mainText": "크확",
        "subText": "응결피증/공퍼 · 응결피증or공퍼/공퍼"
      }
    ],
    "sets": [
      "Frost"
    ],
    "setRules": [
      [
        {
          "id": "Frost",
          "count": 5
        }
      ]
    ],
    "setCount": 5,
    "setText": "야밤의 서리[43311]",
    "sourceKind": "community",
    "sourceUrl": "https://github.com/kedaygon/wuwa_yeejalky_overlay/blob/eda99e57a9ce0dae5501603fd3d3bc4f9d05f8dd/wuwa_chars.json",
    "supplementedStats": [],
    "notes": "",
    "sourcePrimary": "2200",
    "sourceEnergy": "120"
  },
  "sanhua": {
    "primary": "atk",
    "weaponId": "sword001",
    "variants": [
      {
        "id": "43311-권장",
        "label": "권장",
        "costs": [
          4,
          3,
          3,
          1,
          1
        ],
        "main4": [
          "critRate"
        ],
        "main3": null,
        "main3Options": [
          [
            "glacioBns",
            "atkPct"
          ],
          [
            "atkPct",
            "atkPct"
          ]
        ],
        "allowed3": [
          "glacioBns",
          "atkPct"
        ],
        "main1": "atkPct",
        "baseline": {
          "atk": 1600,
          "critRate": 60,
          "critDmg": 220,
          "resonanceBns": 120
        },
        "mainText": "크확",
        "subText": "응결피증 l 공퍼/공퍼 · 응결피증 l 공퍼/공퍼"
      }
    ],
    "sets": [
      "Clouds"
    ],
    "setRules": [
      [
        {
          "id": "Clouds",
          "count": 5
        }
      ]
    ],
    "setCount": 5,
    "setText": "떠오르는 구름[43311]",
    "sourceKind": "community",
    "sourceUrl": "https://github.com/kedaygon/wuwa_yeejalky_overlay/blob/eda99e57a9ce0dae5501603fd3d3bc4f9d05f8dd/wuwa_chars.json",
    "supplementUrl": "https://www.dennlog.com/ko/games/wutheringwaves/characters/Sanhua",
    "supplementedStats": [
      "critRate",
      "critDmg"
    ],
    "notes": "5돌 미만은 행진의 서곡으로 빠른협주 가능",
    "sourcePrimary": "1600",
    "sourceEnergy": "120"
  },
  "baizhi": {
    "primary": "hp",
    "weaponId": "rectifier004",
    "variants": [
      {
        "id": "43311-권장",
        "label": "권장",
        "costs": [
          4,
          3,
          3,
          1,
          1
        ],
        "main4": [
          "healBns"
        ],
        "main3": null,
        "main3Options": [
          [
            "resonanceBns",
            "hpPct"
          ]
        ],
        "allowed3": [
          "hpPct",
          "resonanceBns"
        ],
        "main1": "hpPct",
        "baseline": {
          "hp": 30000,
          "resonanceBns": 220
        },
        "mainText": "치유보너스",
        "subText": "공효/체퍼 · 공효/체퍼"
      }
    ],
    "sets": [
      "Rejuvent",
      "Clouds"
    ],
    "setRules": [
      [
        {
          "id": "Rejuvent",
          "count": 5
        }
      ],
      [
        {
          "id": "Clouds",
          "count": 5
        }
      ]
    ],
    "setCount": 5,
    "setText": "찬란한 광휘[43311] / 떠오르는 구름[43311]",
    "sourceKind": "community",
    "sourceUrl": "https://github.com/kedaygon/wuwa_yeejalky_overlay/blob/eda99e57a9ce0dae5501603fd3d3bc4f9d05f8dd/wuwa_chars.json",
    "supplementedStats": [],
    "notes": "공효컷 최우선 높을수록 안정적, 낮으면 한사이클에 해방이 안 참",
    "sourcePrimary": "30000",
    "sourceEnergy": "220"
  },
  "chixia": {
    "primary": "atk",
    "weaponId": "pistol002",
    "variants": [
      {
        "id": "43311-권장-critRate",
        "label": "권장",
        "costs": [
          4,
          3,
          3,
          1,
          1
        ],
        "main4": [
          "critRate"
        ],
        "main3": null,
        "main3Options": [
          [
            "fusionBns",
            "atkPct"
          ],
          [
            "atkPct",
            "atkPct"
          ]
        ],
        "allowed3": [
          "fusionBns",
          "atkPct"
        ],
        "main1": "atkPct",
        "baseline": {
          "atk": 1800,
          "critRate": 65,
          "critDmg": 250,
          "resonanceBns": 145
        },
        "mainText": "크확,크피",
        "subText": "용융피증/공퍼 · 용융피증or공퍼/공퍼",
        "main4Exact": [
          "critRate"
        ],
        "mainStatAdjusted": false
      },
      {
        "id": "43311-권장-critDmg",
        "label": "권장",
        "costs": [
          4,
          3,
          3,
          1,
          1
        ],
        "main4": [
          "critDmg"
        ],
        "main3": null,
        "main3Options": [
          [
            "fusionBns",
            "atkPct"
          ],
          [
            "atkPct",
            "atkPct"
          ]
        ],
        "allowed3": [
          "fusionBns",
          "atkPct"
        ],
        "main1": "atkPct",
        "baseline": {
          "atk": 1800,
          "critRate": 43,
          "critDmg": 294,
          "resonanceBns": 145
        },
        "mainText": "크확,크피",
        "subText": "용융피증/공퍼 · 용융피증or공퍼/공퍼",
        "main4Exact": [
          "critDmg"
        ],
        "mainStatAdjusted": true
      }
    ],
    "sets": [
      "Rift"
    ],
    "setRules": [
      [
        {
          "id": "Rift",
          "count": 5
        }
      ]
    ],
    "setCount": 5,
    "setText": "솟구치는 용암[43311]",
    "sourceKind": "community",
    "sourceUrl": "https://github.com/kedaygon/wuwa_yeejalky_overlay/blob/eda99e57a9ce0dae5501603fd3d3bc4f9d05f8dd/wuwa_chars.json",
    "supplementedStats": [],
    "notes": "사이클이 조금 느림, 공효 높을수록 좋음",
    "sourcePrimary": "1800",
    "sourceEnergy": "145"
  },
  "mortefi": {
    "primary": "atk",
    "weaponId": "pistol001",
    "variants": [
      {
        "id": "43311-권장",
        "label": "권장",
        "costs": [
          4,
          3,
          3,
          1,
          1
        ],
        "main4": [
          "critRate"
        ],
        "main3": null,
        "main3Options": [
          [
            "fusionBns",
            "atkPct"
          ],
          [
            "atkPct",
            "atkPct"
          ]
        ],
        "allowed3": [
          "fusionBns",
          "atkPct"
        ],
        "main1": "atkPct",
        "baseline": {
          "atk": 1700,
          "critRate": 60,
          "critDmg": 220,
          "resonanceBns": 150
        },
        "mainText": "크확",
        "subText": "용융피증/공퍼 · 용융피증or공퍼/공퍼"
      }
    ],
    "sets": [
      "Empyrean",
      "Clouds"
    ],
    "setRules": [
      [
        {
          "id": "Empyrean",
          "count": 5
        }
      ],
      [
        {
          "id": "Clouds",
          "count": 5
        }
      ]
    ],
    "setCount": 5,
    "setText": "하늘의 합주곡[43311] / 떠오르는 구름[43311]",
    "sourceKind": "community",
    "sourceUrl": "https://github.com/kedaygon/wuwa_yeejalky_overlay/blob/eda99e57a9ce0dae5501603fd3d3bc4f9d05f8dd/wuwa_chars.json",
    "supplementUrl": "https://www.dennlog.com/ko/games/wutheringwaves/characters/Mortefi",
    "supplementedStats": [
      "critRate",
      "critDmg"
    ],
    "notes": "빠른협주 서포터로 채용시 구름셋에 악곡 사용",
    "sourcePrimary": "1700",
    "sourceEnergy": "140 / 150"
  },
  "yuanwu": {
    "primary": "def",
    "weaponId": "gauntlet001",
    "variants": [
      {
        "id": "43311-권장",
        "label": "권장",
        "costs": [
          4,
          3,
          3,
          1,
          1
        ],
        "main4": [
          "critRate"
        ],
        "main3": null,
        "main3Options": [
          [
            "resonanceBns",
            "atkPct"
          ]
        ],
        "allowed3": [
          "atkPct",
          "resonanceBns"
        ],
        "main1": "defPct",
        "baseline": {
          "def": 3000,
          "critRate": 60,
          "critDmg": 230,
          "resonanceBns": 110
        },
        "mainText": "크확",
        "subText": "공효/공퍼 · 공효/공퍼"
      }
    ],
    "sets": [
      "Clouds",
      "Empyrean",
      "Rejuvent"
    ],
    "setRules": [
      [
        {
          "id": "Clouds",
          "count": 5
        }
      ],
      [
        {
          "id": "Empyrean",
          "count": 5
        }
      ],
      [
        {
          "id": "Rejuvent",
          "count": 5
        }
      ]
    ],
    "setCount": 5,
    "setText": "떠오르는 구름[43311] / 하늘의 합주곡[43311] / 찬란한 광휘[43311]",
    "sourceKind": "community",
    "sourceUrl": "https://github.com/kedaygon/wuwa_yeejalky_overlay/blob/eda99e57a9ce0dae5501603fd3d3bc4f9d05f8dd/wuwa_chars.json",
    "supplementUrl": "https://www.dennlog.com/ko/games/wutheringwaves/characters/Yuanwu",
    "supplementedStats": [
      "critRate",
      "critDmg"
    ],
    "notes": "빌드따라 다름, 구름or합주곡일시 공효 높어서 일반 서브딜러처럼 활용\n광휘일시 광휘 발동만 시키고 넘겨도 무방",
    "sourcePrimary": "3000",
    "sourceEnergy": "110+@"
  },
  "yangyang": {
    "primary": "atk",
    "weaponId": "sword001",
    "variants": [
      {
        "id": "43311-권장",
        "label": "권장",
        "costs": [
          4,
          3,
          3,
          1,
          1
        ],
        "main4": [
          "critRate"
        ],
        "main3": null,
        "main3Options": [
          [
            "aeroBns",
            "atkPct"
          ],
          [
            "atkPct",
            "atkPct"
          ]
        ],
        "allowed3": [
          "aeroBns",
          "atkPct"
        ],
        "main1": "atkPct",
        "baseline": {
          "atk": 1800,
          "critRate": 60,
          "critDmg": 220,
          "resonanceBns": 130
        },
        "mainText": "크확",
        "subText": "기류피증/공퍼 · 기류피증or공퍼/공퍼"
      }
    ],
    "sets": [
      "Clouds",
      "Welkin"
    ],
    "setRules": [
      [
        {
          "id": "Clouds",
          "count": 5
        }
      ],
      [
        {
          "id": "Welkin",
          "count": 5
        }
      ]
    ],
    "setCount": 5,
    "setText": "떠오르는 구름[43311] / 끝없는 하늘[43311]",
    "sourceKind": "community",
    "sourceUrl": "https://github.com/kedaygon/wuwa_yeejalky_overlay/blob/eda99e57a9ce0dae5501603fd3d3bc4f9d05f8dd/wuwa_chars.json",
    "supplementUrl": "https://www.dennlog.com/ko/games/wutheringwaves/characters/Yangyang",
    "supplementedStats": [
      "critRate",
      "critDmg"
    ],
    "notes": "유일한 궁통 채워주는 서포터 겸 섭딜러",
    "sourcePrimary": "1800",
    "sourceEnergy": "130"
  },
  "aalto": {
    "primary": "atk",
    "weaponId": "pistol001",
    "variants": [
      {
        "id": "43311-권장",
        "label": "권장",
        "costs": [
          4,
          3,
          3,
          1,
          1
        ],
        "main4": [
          "critRate"
        ],
        "main3": null,
        "main3Options": [
          [
            "aeroBns",
            "atkPct"
          ],
          [
            "atkPct",
            "atkPct"
          ]
        ],
        "allowed3": [
          "aeroBns",
          "atkPct"
        ],
        "main1": "atkPct",
        "baseline": {
          "atk": 2200,
          "resonanceBns": 150
        },
        "mainText": "크확",
        "subText": "기류피증/공퍼 · 기류피증or공퍼/공퍼"
      }
    ],
    "sets": [
      "Gale",
      "Clouds"
    ],
    "setRules": [
      [
        {
          "id": "Gale",
          "count": 5
        }
      ],
      [
        {
          "id": "Clouds",
          "count": 5
        }
      ]
    ],
    "setCount": 5,
    "setText": "스쳐가는 바람[43311] / 떠오르는 구름[43311]",
    "sourceKind": "community",
    "sourceUrl": "https://github.com/kedaygon/wuwa_yeejalky_overlay/blob/eda99e57a9ce0dae5501603fd3d3bc4f9d05f8dd/wuwa_chars.json",
    "supplementUrl": "https://www.dennlog.com/ko/games/wutheringwaves/characters/Aalto",
    "supplementedStats": [
      "atk"
    ],
    "notes": "메인딜러 아닐시 구름+악곡 채용",
    "sourcePrimary": "ㅡ",
    "sourceEnergy": "150"
  },
  "taoqi": {
    "primary": "def",
    "weaponId": "broadblade103",
    "variants": [
      {
        "id": "43311-권장",
        "label": "권장",
        "costs": [
          4,
          3,
          3,
          1,
          1
        ],
        "main4": [
          "defPct"
        ],
        "main3": null,
        "main3Options": [
          [
            "defPct",
            "defPct"
          ],
          [
            "resonanceBns",
            "defPct"
          ]
        ],
        "allowed3": [
          "defPct",
          "resonanceBns"
        ],
        "main1": "defPct",
        "baseline": {
          "def": 4000,
          "resonanceBns": 150
        },
        "mainText": "방퍼",
        "subText": "방퍼 l 공효/방퍼 · 방퍼 l 공효/방퍼"
      }
    ],
    "sets": [
      "Eclipse",
      "Clouds"
    ],
    "setRules": [
      [
        {
          "id": "Eclipse",
          "count": 5
        }
      ],
      [
        {
          "id": "Clouds",
          "count": 5
        }
      ]
    ],
    "setCount": 5,
    "setText": "빛을 삼키는 해[43311] / 떠오르는 구름[43311]",
    "sourceKind": "community",
    "sourceUrl": "https://github.com/kedaygon/wuwa_yeejalky_overlay/blob/eda99e57a9ce0dae5501603fd3d3bc4f9d05f8dd/wuwa_chars.json",
    "supplementedStats": [],
    "notes": "공효가 높을 수록 궁게이지 수급에 원활, 서포터면 구름채용 어지간하면 다른 캐릭터 키우는걸 추천\n5돌 이상이면 구름+무기로 공효컷 달성",
    "sourcePrimary": "4000",
    "sourceEnergy": "150~@"
  },
  "danjin": {
    "primary": "atk",
    "weaponId": "sword002",
    "variants": [
      {
        "id": "43311-권장-critRate",
        "label": "권장",
        "costs": [
          4,
          3,
          3,
          1,
          1
        ],
        "main4": [
          "critRate"
        ],
        "main3": null,
        "main3Options": [
          [
            "havocBns",
            "atkPct"
          ],
          [
            "atkPct",
            "atkPct"
          ]
        ],
        "allowed3": [
          "havocBns",
          "atkPct"
        ],
        "main1": "atkPct",
        "baseline": {
          "atk": 1900,
          "critRate": 70,
          "critDmg": 250,
          "resonanceBns": 120
        },
        "mainText": "크확or크피",
        "subText": "인멸피증/공퍼 · 인멸피증or공퍼/공퍼",
        "main4Exact": [
          "critRate"
        ],
        "mainStatAdjusted": false
      },
      {
        "id": "43311-권장-critDmg",
        "label": "권장",
        "costs": [
          4,
          3,
          3,
          1,
          1
        ],
        "main4": [
          "critDmg"
        ],
        "main3": null,
        "main3Options": [
          [
            "havocBns",
            "atkPct"
          ],
          [
            "atkPct",
            "atkPct"
          ]
        ],
        "allowed3": [
          "havocBns",
          "atkPct"
        ],
        "main1": "atkPct",
        "baseline": {
          "atk": 1900,
          "critRate": 48,
          "critDmg": 294,
          "resonanceBns": 120
        },
        "mainText": "크확or크피",
        "subText": "인멸피증/공퍼 · 인멸피증or공퍼/공퍼",
        "main4Exact": [
          "critDmg"
        ],
        "mainStatAdjusted": true
      }
    ],
    "sets": [
      "Eclipse"
    ],
    "setRules": [
      [
        {
          "id": "Eclipse",
          "count": 5
        }
      ]
    ],
    "setCount": 5,
    "setText": "빛을 삼키는 해[43311]",
    "sourceKind": "community",
    "sourceUrl": "https://github.com/kedaygon/wuwa_yeejalky_overlay/blob/eda99e57a9ce0dae5501603fd3d3bc4f9d05f8dd/wuwa_chars.json",
    "supplementUrl": "https://www.dennlog.com/ko/games/wutheringwaves/characters/Danjin",
    "supplementedStats": [
      "critRate",
      "critDmg"
    ],
    "notes": "4코는 무기 크확크피 따라 반대로 (ex.회류면 크피)",
    "sourcePrimary": "1900",
    "sourceEnergy": "120"
  }
} satisfies Record<CharacterId, BuildTargetBaseline>;

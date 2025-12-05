import React from "react";
import { characterScoreGuide } from "../data/Characters";
import { FixedStats } from "../data/Stats";

function getCharacterStatType(id) {
  const data = characterScoreGuide[id];
  return ["atkPct", "hpPct", "defPct"].reduce((a, b) =>
    data[a] > data[b] ? a : b
  );
}

function costToIndex(cost){
  if (cost === 4) return 0;
  else if (cost === 3) return 1;
  else return 2;
}
function getEchoStats(echoData) {
  let ret = Array.from({ length: 7 }, () => ["", 0]);
  ret[0] = [
    echoData.mainStat,
    FixedStats[echoData.mainStat].ValueMain[costToIndex(echoData.cost)],
  ];
  ret[1] = [
    echoData.cost === 1 ? FixedStats.hp.id : FixedStats.atk.id,
    (() => {
      switch (echoData.cost) {
        case 4:
          return 150;
        case 3:
          return 100;
        case 1:
          return 2280;
        default:
          return 0;
      }
    })()
  ];
  ret[2] = [
    echoData.subStats[0][0],
    echoData.subStats[0][1] < 0
      ? 0
      : FixedStats[echoData.subStats[0][0]]?.ValueSub[echoData.subStats[0][1]],
  ];
  ret[3] = [
    echoData.subStats[1][0],
    echoData.subStats[1][1] < 0
      ? 0
      : FixedStats[echoData.subStats[1][0]]?.ValueSub[echoData.subStats[1][1]],
  ];
  ret[4] = [
    echoData.subStats[2][0],
    echoData.subStats[2][1] < 0
      ? 0
      : FixedStats[echoData.subStats[2][0]]?.ValueSub[echoData.subStats[2][1]],
  ];
  ret[5] = [
    echoData.subStats[3][0],
    echoData.subStats[3][1] < 0
      ? 0
      : FixedStats[echoData.subStats[3][0]]?.ValueSub[echoData.subStats[3][1]],
  ];
  ret[6] = [
    echoData.subStats[4][0],
    echoData.subStats[4][1] < 0
      ? 0
      : FixedStats[echoData.subStats[4][0]]?.ValueSub[echoData.subStats[4][1]],
  ];
  return ret;
}

export function MakeStatData(data) {
  const {
    lang,
    constellation,
    characterData,
    weaponData,
    weaponStats,
    echoList,
    echoScore,
    statId,
    finalStats,
    harmonyOption,
    userData,
  } = data;

  const statResult = statId.map((id) => {
    return [finalStats[id], finalStats[`${id}Delta`]];
  });

  const statData = {
    lang: lang,
    server: userData?.gameServer ?? "unknown",
    level: userData?.gameLevel ?? "--",
    player_name: userData?.displayName ?? "Player",
    uid: userData?.gameUid ?? "---------",
    c_id: characterData.id,
    c_name: characterData[lang],
    c_type: [
      characterData.element,
      getCharacterStatType(characterData.id),
      characterData.type,
      characterData.weapon,
    ],
    w_imgkey: weaponData.imgKey,
    w_name: weaponData[lang],
    w_stat: [weaponStats.atk, weaponStats.value[0]],
    w_type: weaponStats.statType[0],
    constel: [constellation[0], constellation[1]],
    stats: statResult,
    stat_name: statId.map((item) => FixedStats[item][lang]),
    set_option: [["Eclipse", true]],
    echo_id: echoList.map(item => item.echoId),
    echo_stat: [0, 1, 2, 3, 4].map(idx => getEchoStats(echoList[idx])),
    echo_score: echoScore,
  };

  return statData;
}
export function MakeImageData(data) {
  const {
    mainImageTrans,
    subImageTrans,
    mainImageCopyright,
    subImageCopyright,
  } = data;

  const imageData = {
    img_main_trans: mainImageTrans,
    img_sub_trans: subImageTrans,
    img_main_auther: mainImageCopyright,
    img_sub_auther: subImageCopyright,
  }

  return imageData;
}

/*
const statData = {
    lang: "kr",
    server: "Asia",
    level: 80,
    player_name: "SSeries",
    uid: 700695460,
    c_id: "camellya",
    c_name: "카멜리아",
    c_type: ["havoc", "atk", "normalBns", "sword"],
    w_imgkey: "ico003",
    w_name: "날카로운 봄",
    w_stat: [587, 24.3],
    w_type: "CritRate",
    constel: [0, 0],
    stats: [
    [15665, 5340],
    [2283, 998],
    [1309, 149],
    [136.0, 36],
    [66.8, 37.5],
    [270.0, 104.0],
    [75.0, 60.0],
    [25.9, 10.9],
    ],
    stat_name: [
    "생명력",
    "공격력",
    "방어력",
    "공명 효율",
    "크리티컬",
    "크리티컬 피해",
    "인멸 피해보너스",
    "일반공격 피해보너스",
    ],
    set_option: [["Eclipse", true]],
    echo_id: ["", "", "", "", ""],
    echo_stat: [
    [
        [FixedStats.CritDmg.id, 44.0],
        [FixedStats.CritDmg.id, 44.0],
        [FixedStats.CritDmg.id, 44.0],
        [FixedStats.CritDmg.id, 44.0],
        [FixedStats.CritDmg.id, 44.0],
        [FixedStats.CritDmg.id, 44.0],
        [FixedStats.CritDmg.id, 44.0],
    ],
    [
        [FixedStats.CritDmg.id, 44.0],
        [FixedStats.CritDmg.id, 44.0],
        [FixedStats.CritDmg.id, 44.0],
        [FixedStats.CritDmg.id, 44.0],
        [FixedStats.CritDmg.id, 44.0],
        [FixedStats.CritDmg.id, 44.0],
        [FixedStats.CritDmg.id, 44.0],
    ],
    [
        [FixedStats.CritDmg.id, 44.0],
        [FixedStats.CritDmg.id, 44.0],
        [FixedStats.CritDmg.id, 44.0],
        [FixedStats.CritDmg.id, 44.0],
        [FixedStats.CritDmg.id, 44.0],
        [FixedStats.CritDmg.id, 44.0],
        [FixedStats.CritDmg.id, 44.0],
    ],
    [
        [FixedStats.CritDmg.id, 44.0],
        [FixedStats.CritDmg.id, 44.0],
        [FixedStats.CritDmg.id, 44.0],
        [FixedStats.CritDmg.id, 44.0],
        [FixedStats.CritDmg.id, 44.0],
        [FixedStats.CritDmg.id, 44.0],
        [FixedStats.CritDmg.id, 44.0],
    ],
    [
        [FixedStats.CritDmg.id, 44.0],
        [FixedStats.CritDmg.id, 44.0],
        [FixedStats.CritDmg.id, 44.0],
        [FixedStats.CritDmg.id, 44.0],
        [FixedStats.CritDmg.id, 44.0],
        [FixedStats.CritDmg.id, 44.0],
        [FixedStats.CritDmg.id, 44.0],
    ],
    ],
    echo_score: [
    [28.8, 45.5],
    [18.6, 50.7],
    [26.4, 26.4],
    [28.8, 28.8],
    [32.4, 32.4],
    ],
}; */

export function MakeStatData({
  lang,
  characterData,
  characterStats,
  weaponData,
  weaponStats,
  userData,
  constellation,
  echoList,
  harmonyOption,
}) {
  if (!lang) return;
  if (!characterData) return;
  if (!characterStats) return;
  if (!weaponData) return;
  if (!weaponStats) return;

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
      "atk",
      characterData.type,
      characterData.weapon,
    ],
    w_imgkey: weaponData.imgKey,
    w_name: weaponData[lang],
    w_stat: [weaponStats.atk, weaponStats.value[0]],
    w_type: weaponStats.statType[0],
    constel: [constellation[0], constellation[1]],
    stats: [Array.from({ length: 8 }, () => [,])],
    stat_name: [Array.from({ length: 8 }, () => [,])],
    set_option: [["Eclipse", true]],
    echo_id: ["", "", "", "", ""],
    echo_stat: [
      Array.from({ length: 5 }, () => Array.from({ length: 7 }, () => [,])),
    ],
    echo_score: [Array.from({ length: 5 }, () => [,])],
  };
  return statData;
}
export default MakeStatData;

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

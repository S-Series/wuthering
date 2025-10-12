import {
  createContext,
  useContext,
  useState,
  useEffect,
  useMemo,
  useCallback,
} from "react";
import {
  character,
  characterStat,
  characterScoreGuide,
} from "../data/Characters.js";
import { weapon, weaponStat } from "../data/Weapons.js";
import { FixedStats } from "../data/Stats.js";
import { createEmptyEcho } from "../data/Echos.js";

const ProfileContext = createContext(null);

export function ProfileProvider({ children }) {
  const normalize = (value) =>
    value && value !== "undefined" ? value : undefined;

  //$ Edit in Outside
  const [lang, setLang] = useState(
    () => normalize(localStorage.getItem("lastLanguage")) ?? "en"
  );
  const [characterId, setCharacterId] = useState(
    () => normalize(localStorage.getItem("lastCharacter")) ?? "rover"
  );
  const [weaponId, setWeaponId] = useState(
    () => normalize(localStorage.getItem("lastWeapon")) ?? null
  );

  function getEchoData() {
    const raw = localStorage.getItem(`${characterId}EchoData`);
    const parsed = raw ? normalize(JSON.parse(raw)) : null;

    // 기본값: 빈 에코 5개 생성
    const defaultEcho = [
      createEmptyEcho(4),
      createEmptyEcho(3),
      createEmptyEcho(3),
      createEmptyEcho(1),
      createEmptyEcho(1),
    ];

    const data = parsed ?? defaultEcho;

    // $ 각 echo의 subStats 길이가 5보다 짧으면 부족한 부분을 채워줌
    const fixedData = data.map((echo) => {
      if (!Array.isArray(echo.subStats)) echo.subStats = [];
      while (echo.subStats.length < 5) {
        echo.subStats.push([FixedStats.dummy.id, 0]); // ✅ 기본값 더미 추가
      }
      return echo;
    });

    return fixedData;
  }

  const costToIndex = useCallback((cost) => {
    if (cost === 4) return 0;
    else if (cost === 3) return 1;
    else return 2;
  }, []);

  const [constellation, setConstellation] = useState(
    normalize(
      JSON.parse(localStorage.getItem(`${characterId}Constellation`))
    ) ?? [0, 0]
  );
  const [echoList, setEchoList] = useState(() => getEchoData());
  const PatchEchoID = useCallback((echoIndex, newId) => {
    setEchoList((prev) =>
      prev.map((e, i) => (i !== echoIndex ? e : { ...e, echoId: newId }))
    );
  }, []);
  const PatchEchoCost = useCallback((echoIndex, newCost) => {
    setEchoList((prev) =>
      prev.map((e, i) => (i !== echoIndex ? e : { ...e, cost: newCost }))
    );
  }, []);
  const PatchEchoHarmony = useCallback((echoIndex, newHarmony) => {
    setEchoList((prev) =>
      prev.map((e, i) => (i !== echoIndex ? e : { ...e, harmony: newHarmony }))
    );
  }, []);
  const PatchEchoMainStat = useCallback(
    (echoIndex, partial /* {id?, val?} */) => {
      setEchoList((prev) =>
        prev.map((e, i) =>
          i !== echoIndex
            ? e
            : { ...e, mainStat: partial ?? FixedStats.dummy.id }
        )
      );
    },
    []
  );
  const PatchEchoStat = useCallback(
    (echoIndex, si, patch /* [id?, val?] */) => {
      setEchoList((prev) =>
        prev.map((e, i) =>
          i !== echoIndex
            ? e
            : {
                ...e,
                subStats: e.subStats.map((p, j) =>
                  j !== si ? p : [patch?.[0] ?? p[0], patch?.[1] ?? p[1]]
                ),
              }
        )
      );
    },
    []
  );
  const PatchEcho = useCallback((echoIndex, newEcho) => {
    setEchoList((prev) => {
      const updated = [...prev];
      updated[echoIndex] = newEcho;
      return updated;
    });
  }, []);

  //$ Edit in Inside
  const [characterData, setCharacterData] = useState(null);
  const [characterStats, setCharacterStats] = useState(null);
  const [scoreTable, setScoreTable] = useState(null);
  const [weaponData, setWeaponData] = useState(null);
  const [weaponStats, setWeaponStats] = useState(null);
  const [harmonyOption, setHarmonyOption] = useState(null);

  const ZERO_STATS = useMemo(
    () => Object.fromEntries(Object.keys(FixedStats).map((k) => [k, 0])),
    []
  );

  const finalStats = useMemo(() => {
    const types = [
      `${characterData?.element ?? "Aero"}Bns`,
      `${characterData?.type ?? "normal"}Bns`,
    ];

    let stats = {
      ...ZERO_STATS,
      hpDelta: 0,
      hpPctDelta: 0,
      hpPctWeapon: 0,
      atkDelta: 0,
      atkPctDelta: 0,
      defDelta: 0,
      defPctDelta: 0,
      ResonanceBnsDelta: 0,
      CritRateDelta: 0,
      CritDmgDelta: 0,
      [`${types[0]}Delta`]: 0,
      [`${types[1]}Delta`]: 0,
      dummyDelta: 0,
    };

    //$ character
    stats.hp = Number(characterStats?.baseHp ?? 0);
    stats.hpPct = Number(characterStats?.hpPct ?? 0);
    stats.atk = Number(characterStats?.baseAtk ?? 1) - 1; // idk why, but in-game stat is 1 lower then stats
    stats.atkPct = Number(characterStats?.atkPct ?? 0);
    stats.def = Number(characterStats?.baseDef ?? 1) - 1; // this one too.
    stats.defPct = Number(characterStats?.defPct ?? 0);
    stats.ResonanceBns = Number(characterStats?.ResonanceBns ?? 100.0);
    stats.CritRate = Number(characterStats?.CritRate ?? 5.0);
    stats.CritDmg = Number(characterStats?.CritDmg ?? 150.0);
    // ReadMe: The order in the data file differs from the type sorting process
    stats[types[0]] = Number(characterStats?.typeBns[1] ?? 0.0);
    stats[types[1]] = Number(characterStats?.typeBns[0] ?? 0.0);
    //$ weapon
    stats.atk += weaponStats?.atk ?? 0;
    stats[`${weaponStats?.statType[0]}`] += Number(weaponStats?.value[0] ?? 0);
    stats[`${weaponStats?.statType[1]}`] += Number(
      weaponStats?.value[1] *  (1 + constellation[1] * 0.2)?? 0);
    //$ echos
    echoList?.forEach((echoData) => {
      stats[`${echoData.mainStat}Delta`] += parseFloat(
        FixedStats[echoData.mainStat]?.ValueMain[costToIndex(echoData.cost)]
      );
      switch (echoData.cost) {
        case 4:
          stats.atkDelta += 150.0;
          break;
        case 3:
          stats.atkDelta += 100.0;
          break;
        case 1:
          stats.hpDelta += 2280.0;
          break;
        default:
          break;
      }
      echoData.subStats.forEach(([id, val]) => {
        if (val === -1);
        else if (stats[id] !== undefined)
          stats[`${id}Delta`] += parseFloat(FixedStats[id]?.ValueSub[val] ?? 0);
      });
    });
    //$ extra stats
    const hpExtra = Math.ceil((stats.hp) * ((stats.hpPct ?? 0) / 100));
    const atkExtra = Math.ceil(stats.atk * ((stats.atkPct ?? 0) / 100));
    const defExtra = Math.ceil(stats.def * ((stats.defPct ?? 0) / 100));

    stats.hpDelta += Math.ceil((stats.hp) * ((stats.hpPctDelta ?? 0) / 100));
    stats.atkDelta += Math.ceil(stats.atk * ((stats.atkPctDelta ?? 0) / 100));
    stats.defDelta += Math.ceil(stats.def * ((stats.defPctDelta ?? 0) / 100));

    stats.hp += stats.hpDelta + hpExtra;
    stats.hp += Math.ceil(characterStats?.baseHp * stats.hpPctWeapon / 100)
    stats.atk += stats.atkDelta + atkExtra;
    stats.def += stats.defDelta + defExtra;
    stats.ResonanceBns += stats.ResonanceBnsDelta;
    stats.CritRate += stats.CritRateDelta;
    stats.CritDmg += stats.CritDmgDelta;
    stats[types[0]] += stats[`${types[0]}Delta`];
    stats[types[1]] += stats[`${types[1]}Delta`];

    console.log(stats);
    return stats;
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [
    characterId,
    characterData,
    characterStats,
    weaponStats,
    echoList,
    constellation,
  ]);

  const echoScore = useMemo(() => {
    let score = Array.from({ length: 5 }, () => [0, 0]);
    if (!scoreTable) return score;

    const scoreList = [
      scoreTable[FixedStats.hpPct.id] * 11.6,
      scoreTable[FixedStats.atkPct.id] * 11.6,
      scoreTable[FixedStats.defPct.id] * 14.7,
      scoreTable[FixedStats.CritRate.id] * 10.5,
      scoreTable[FixedStats.CritDmg.id] * 21.0,
      scoreTable[FixedStats.normalBns.id] * 11.6,
      scoreTable[FixedStats.heavyBns.id] * 11.6,
      scoreTable[FixedStats.skillBns.id] * 11.6,
      scoreTable[FixedStats.ultBns.id] * 11.6,
      scoreTable[FixedStats.ResonanceBns.id] * 12.4,
    ];

    const top5Sum = [...scoreList]
      .sort((a, b) => b - a)
      .slice(0, 5)
      .reduce((sum, val) => sum + val, 0);

    const withoutLast = scoreList.slice(0, -1);

    const top5WithoutLastSum = [...withoutLast]
      .sort((a, b) => b - a)
      .slice(0, 5)
      .reduce((sum, val) => sum + val, 0);

    const scoreMult =
      100 /
      ((top5Sum * Math.min(scoreTable.maxResCount, 5) +
        top5WithoutLastSum * Math.max(5 - scoreTable.maxResCount, 0)) /
        5);

    Object.values(echoList).map((data, idx) => {
      data.subStats.map((stats) => {
        let baseStat = 0;
        let calcScore = 0;
        let resList = Array.from(
          { length: scoreTable.maxResCount },
          () => (0, -1)
        );
        const statValue = Number(FixedStats[stats[0]]?.ValueSub?.[stats[1]]);
        if (statValue === undefined || isNaN(statValue)) return;
        switch (stats[0]) {
          case FixedStats.CritRate.id:
            score[idx][0] += statValue * 2;
            break;
          case FixedStats.CritDmg.id:
            score[idx][0] += statValue;
            break;
        }
        switch (stats[0]) {
          case FixedStats.hp.id:
            if (scoreTable[FixedStats.hpPct.id] !== 0) {
              baseStat = characterStats.baseHp;
              calcScore =
                (statValue / (baseStat / 100)) *
                scoreTable[FixedStats.hpPct.id];
            }
            break;

          case FixedStats.atk.id:
            if (scoreTable[FixedStats.atkPct.id] !== 0) {
              baseStat = characterStats.baseAtk;
              calcScore =
                (statValue / ((baseStat + weaponStats?.atk) / 100)) *
                scoreTable[FixedStats.atkPct.id];
            }
            break;

          case FixedStats.def.id:
            if (scoreTable[FixedStats.defPct.id] !== 0) {
              baseStat = characterStats.baseDef;
              calcScore =
                (statValue / (baseStat / 100)) *
                scoreTable[FixedStats.defPct.id];
            }
            break;

          //case FixedStats.ResonanceBns.id:
          //  break;
          default:
            calcScore = statValue * scoreTable[stats[0]];
            break;
        }
        score[idx][1] += calcScore * scoreMult;
      });
    });

    score = score.map(([a, b]) => [Number(a.toFixed(1)), Number(b.toFixed(1))]);
    return score;
  }, [echoList, scoreTable, characterStats, weaponStats]);

  console.log(echoList);

  const statId = useMemo(() => {
    return [
      "hp",
      "atk",
      "def",
      "ResonanceBns",
      "CritRate",
      "CritDmg",
      `${characterData?.element ?? ""}Bns`,
      `${characterData?.type ?? ""}Bns`,
    ];
  }, [characterData?.element, characterData?.type]);

  useEffect(() => {
    if (lang) localStorage.setItem("lastLanguage", lang);
  }, [lang]);

  useEffect(() => {
    if (characterId) {
      setEchoList(getEchoData());
      setScoreTable(characterScoreGuide[characterId ?? ""] ?? {});
      localStorage.setItem("lastCharacter", characterId);
    }
  }, [characterId]);

  useEffect(() => {
    localStorage.setItem("lastWeapon", weaponId ?? "");
  }, [weaponId]);

  useEffect(() => {
    if (!characterId) return;

    const data = character.find((item) => item.id === characterId);
    setCharacterData(data);

    const stat =
      characterId !== "rover"
        ? characterStat[characterId] ?? null
        : characterStat["rover"].spectro ?? null;

    setCharacterStats(stat);
    localStorage.setItem("lastCharacter", data.id);
  }, [characterId]);

  useEffect(() => {
    const data = weapon[characterData?.weapon ?? "sword"]?.find(
      (w) => w.id === weaponId
    );
    const stats = weaponStat[weaponId];
    setWeaponData(data);
    setWeaponStats(stats);
    if (data && data !== "undefined") {
      localStorage.setItem("lastWeapon", data?.id);
    }
  }, [weaponId, characterData]);

  useEffect(() => {
    if (constellation)
      localStorage.setItem(
        `${characterId}Constellation`,
        JSON.stringify(constellation)
      );
  }, [constellation]);

  useEffect(() => {
    if (echoList)
      localStorage.setItem(`${characterId}EchoData`, JSON.stringify(echoList));
  }, [echoList]);

  const value = useMemo(
    () => ({
      lang,
      setLang,
      costToIndex,
      characterId,
      setCharacterId,
      weaponId,
      setWeaponId,
      constellation,
      setConstellation,
      echoList,
      setEchoList,
      characterData,
      weaponData,
      characterStats,
      weaponStats,
      finalStats,
      statId,
      echoScore,
      PatchEchoID,
      PatchEchoCost,
      PatchEchoHarmony,
      PatchEchoStat,
      PatchEchoMainStat,
      PatchEcho,
    }),
    [
      lang,
      characterId,
      weaponId,
      constellation,
      echoList,
      characterData,
      weaponData,
      characterStats,
      weaponStats,
      finalStats,
      PatchEchoStat,
      PatchEchoMainStat,
    ]
  );

  return (
    <ProfileContext.Provider value={value}>{children}</ProfileContext.Provider>
  );
}

export function useProfile() {
  const ctx = useContext(ProfileContext);
  if (!ctx)
    throw new Error("useProfile() must be used inside <ProfileProvider>.");
  return ctx;
}

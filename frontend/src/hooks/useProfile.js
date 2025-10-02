import { createContext, useContext, useState, useEffect, useMemo, useCallback } from "react";
import { character, characterStat } from "../data/Character";
import { weapon, weaponStat } from "../data/Weapon";
import { FixedStats } from "../data/Stats.js";
import { createEmptyEcho } from "../data/Echo";

const ProfileContext = createContext(null);

export function ProfileProvider({ children }) {
  const normalize = (value) => (value && value !== "undefined" ? value : undefined);

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
    return normalize(JSON.parse(localStorage.getItem(`${characterId}EchoData`))) ?? [
    createEmptyEcho(4),
    createEmptyEcho(3),
    createEmptyEcho(3),
    createEmptyEcho(1),
    createEmptyEcho(1),
  ]};

  const costToIndex = useCallback((cost) => {
    if (cost === 4) return 0;
    else if (cost === 3) return 1;
    else return 2;
  }, [])

  const [constellation, setConstellation] = useState(
    normalize(JSON.parse(localStorage.getItem(`${characterId}Constellation`))) ?? [0, 0]
  );
  const [echoList, setEchoList] = useState(() => getEchoData());
  const PatchEchoID = useCallback((echoIndex, newId) => {
    setEchoList(prev => prev.map((e, i) =>
      i !== echoIndex ? e : { ...e, echoId: newId }
    ));
  }, []);
  const PatchEchoCost = useCallback((echoIndex, newCost) => {
    setEchoList(prev => prev.map((e, i) =>
      i !== echoIndex ? e : { ...e, cost: newCost }
    ));
  }, []);
  const PatchEchoHarmony = useCallback((echoIndex, newHarmony) => {
    setEchoList(prev => prev.map((e, i) =>
      i !== echoIndex ? e : { ...e, harmony: newHarmony }
    ));
  }, []);
  const PatchEchoMainStat = useCallback((echoIndex, partial /* {id?, val?} */) => {
    setEchoList(prev => prev.map((e, i) =>
      i !== echoIndex ? e : { ...e, mainStat: partial ?? FixedStats.dummy.id }
    ));
  }, []);
  const PatchEchoStat = useCallback((echoIndex, si, patch /* [id?, val?] */) => {
    setEchoList(prev => prev.map((e, i) =>
      i !== echoIndex ? e : { ...e, subStats: e.subStats.map((p, j) => j !== si ? p : [patch?.[0] ?? p[0], patch?.[1] ?? p[1]]) }
    ));
  }, []);

  //$ Edit in Inside
  const [characterData, setCharacterData] = useState(null);
  const [characterStats, setCharacterStats] = useState(null);

  const [weaponData, setWeaponData] = useState(null);
  const [weaponStats, setWeaponStats] = useState(null);
  
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
    stats[weaponStats?.statType[0]] += Number(weaponStats?.value[0] ?? 0);
    stats[weaponStats?.statType[1]] += Number(weaponStats?.value[1] ?? 0);
    //$ echos
    echoList?.forEach((echoData) => {
      stats[`${echoData.mainStat}Delta`] += parseFloat(
        FixedStats[echoData.mainStat]?.ValueMain[costToIndex(echoData.cost)]
      );
      console.log(echoData.cost);
      switch (echoData.cost) {
        case 4:
          console.log("Cost4 runned");
          stats.atkDelta += 150.0;
          break;
        case 3:
          console.log("Cost3 runned");
          stats.atkDelta += 100.0;
          break;
        case 1:
          console.log("Cost1 runned");
          stats.hpDelta += 2280.0;
          break;
        default: break;
      }
      echoData.subStats.forEach(([id, val]) => {
        if (stats[id] !== undefined)
          stats[`${id}Delta`] += parseFloat(FixedStats[id].ValueSub[val] ?? 0);
      })
    });
    //$ extra stats
    const hpExtra = Math.ceil(stats.hp * ((stats.hpPct ?? 0) / 100));
    const atkExtra = Math.ceil(stats.atk * ((stats.atkPct ?? 0) / 100));
    const defExtra = Math.ceil(stats.def * ((stats.defPct ?? 0) / 100));

    stats.hpDelta += Math.ceil(stats.hp * ((stats.hpPctDelta ?? 0) / 100));
    stats.atkDelta += Math.ceil(stats.atk * ((stats.atkPctDelta ?? 0) / 100));
    stats.defDelta += Math.ceil(stats.def * ((stats.defPctDelta ?? 0) / 100));

    stats.hp += stats.hpDelta + hpExtra;
    stats.atk += stats.atkDelta + atkExtra;
    stats.def += stats.defDelta + defExtra;
    stats.ResonanceBns += stats.ResonanceBnsDelta;
    stats.CritRate += stats.CritRateDelta;
    stats.CritDmg += stats.CritDmgDelta;
    stats[types[0]] += stats[`${types[0]}Delta`];
    stats[types[1]] += stats[`${types[1]}Delta`] * (1 + constellation[1] * 0.2);

    return stats;
  // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [characterId, characterData, characterStats, weaponStats, echoList, constellation]);

  const statId = useMemo(() => {
    return [
      "hp",
      "atk",
      "def",
      "ResonanceBns",
      "CritRate",
      "CritDmg",
      `${characterData?.element ?? ""}Bns`,
      `${characterData?.type ?? ""}Bns`
    ];
  }, [characterData?.element, characterData?.type]);

  useEffect(() => {
    if (lang) localStorage.setItem("lastLanguage", lang);
  }, [lang]);

  useEffect(() => {
    if (characterId) {
      setEchoList(getEchoData());
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
    if (constellation) localStorage.setItem(`${characterId}Constellation`, JSON.stringify(constellation));
  }, [constellation])

  useEffect(() => {
    if (echoList) localStorage.setItem(`${characterId}EchoData`, JSON.stringify(echoList));
  }, [echoList]);

  const value = useMemo(() => ({
    lang, setLang, costToIndex,
    characterId, setCharacterId,
    weaponId, setWeaponId,
    constellation, setConstellation,
    echoList, setEchoList,
    characterData, weaponData, characterStats, weaponStats,
    finalStats, statId,
    PatchEchoID, PatchEchoCost, PatchEchoHarmony,
    PatchEchoStat, PatchEchoMainStat,
  }), [lang, characterId, weaponId, constellation, echoList, characterData, weaponData, characterStats, weaponStats, finalStats, PatchEchoStat, PatchEchoMainStat]);

  return <ProfileContext.Provider value={value}>{children}</ProfileContext.Provider>;
}

export function useProfile() {
  const ctx = useContext(ProfileContext);
  if (!ctx) throw new Error("useProfile() must be used inside <ProfileProvider>.");
  return ctx;
}

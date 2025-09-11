import { useState, useEffect, useMemo } from "react";
import { createEmptyEcho } from "../data/Echo";
import { character, characterStat } from "../data/Character";
import { weapon, weaponStat } from "../data/Weapon";
import { FixedStats } from "../data/Stats.js";

export function useProfile() {
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

  const [constellation, setConstellation] = useState([0, 0]);
  const [echoList, setEchoList] = useState(
    Array(5)
      .fill(null)
      .map(() => createEmptyEcho())
  );

  function EditEcholist(index, newValue) {
    setEchoList((prev) => {
      const copy = [...prev];
      copy[index] = {
        ...copy[index],
        ...newValue,
      };
      return copy;
    });
  }

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
      atkDelta: 0,
      defDelta: 0,
      ResonanceBnsDelta: 0,
      CritRateDelta: 0,
      CritDmgDelta: 0,
      [`${types[0]}Delta`]: 0,
      [`${types[1]}Delta`]: 0,
      dummy: 0,
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
    stats[types[0]] = Number(characterStats?.typeBns[0] ?? 0.0);
    stats[types[1]] = Number(characterStats?.typeBns[1] ?? 0.0);
    //$ weapon
    stats.atk += weaponStats?.atk ?? 0;
    stats[weaponStats?.statType[0] ?? "dummy"] += weaponStats?.value[0] ?? 0;
    stats[weaponStats?.statType[1] ?? "dummy"] += weaponStats?.value[1] ?? 0;
    //$ echos
    for (let i = 0; i < 5; i++) {}
    //$ extra stats
    stats.hpDelta = Math.floor(stats.hp * ((stats.hpPct ?? 0) / 100));
    stats.atkDelta = Math.floor(stats.atk * ((stats.atkPct ?? 0) / 100));
    stats.defDelta = Math.floor(stats.def * ((stats.defPct ?? 0) / 100));

    stats.hp += stats.hpDelta;
    stats.atk += stats.atkDelta;
    stats.def += stats.defDelta;
    stats.ResonanceBns += stats.ResonanceBnsDelta;
    stats.CritRate += stats.CritRateDelta;
    stats.CritDmg += stats.CritDmgDelta;
    stats[types[0]] += stats[`${types[0]}Delta`];
    stats[types[1]] += stats[`${types[1]}Delta`] * (1 + constellation[1] * 0.2);

    return stats;
  }, [characterId, characterData, characterStats, weaponStats]);

useEffect(() => {
  if (lang) localStorage.setItem("lastLanguage", lang);
}, [lang]);

useEffect(() => {
  if (characterId) localStorage.setItem("lastCharacter", characterId);
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

  return {
    lang,
    setLang,
    characterId,
    setCharacterId,
    weaponId,
    setWeaponId,
    constellation,
    setConstellation,
    echoList,
    setEchoList,
    EditEcholist,
    characterData,
    weaponData,
    characterStats,
    weaponStats,
    finalStats,
  };
}

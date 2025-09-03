import { useState, useEffect, useMemo } from "react";
import { createEmptyEcho } from "../data/Echo";
import { calculateFinalStats } from "../utils/calcFinalStats.js";
import { character, characterStat } from "../data/Character";
import { weapon, weaponStat } from "../data/Weapon";
import { FixedStats } from "../data/Stats.js";

export function useProfile() {
  //$ Edit in Outside
  const [characterId, setCharacterId] = useState(null);
  const [weaponId, setWeaponId] = useState("");
  const [constellation, setConstellation] = useState([0, 0]);
  const [echoList, setEchoList] = useState(
    Array(5)
      .fill(null)
      .map(() => createEmptyEcho())
  );

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
    let stats = { ...ZERO_STATS };

    const types = [
      `${characterData?.element ?? "Aero"}Bns`,
      `${characterData?.type ?? "normal"}Bns`
    ]
    console.log(types);

    stats.hp = Number(characterStats?.baseHp ?? 0);
    stats.atk = Number((characterStats?.baseAtk ?? 0) + (weaponStats?.atk ?? 0));
    stats.def = Number(characterStats?.baseDef ?? 0);
    stats.ResonanceBns = Number(characterStats?.ResonanceBns ?? 100.0);
    stats.CritRate = Number(characterStats?.CritRate ?? 5.0);
    stats.CritDmg = Number(characterStats?.CritDmg ?? 150.0);
    stats[types[0]] = Number(characterStats?.typeBns[0] ?? 0.0);
    stats[types[1]] = Number(characterStats?.typeBns[1] ?? 0.0);

    console.log(stats);

    return stats;
  }, [characterId, characterData, characterStats, weaponStats]);

  useEffect(() => {
    const characterSaved = localStorage.getItem("lastCharacter");
    const weaponSaved = localStorage.getItem("lastWeapon");

    setCharacterId(characterSaved || "rover") 

    setWeaponId(weaponSaved && (weaponSaved !== "undefined") ? weaponSaved : null);

    console.log(characterSaved);
    console.log(weaponSaved);
  }, []);

  useEffect(() => {
    if (!characterId) return;

    const data = character.find((item) => item.id === characterId);
    setCharacterData(data);

    const stat = characterId === "rover"
      ? characterStat[characterId] ?? null
      : characterStat["rover"].spectro ?? null;

    setCharacterStats(stat);
    localStorage.setItem("lastCharacter", data.id);

    console.log(stat);
  }, [characterId]);

  useEffect(() => {
    const data = weapon[characterData?.weapon ?? "sword"]?.find((w) => w.id === weaponId);
    const stats = weaponStat[weaponId];
    setWeaponData(data);
    setWeaponStats(stats);
    console.log(data?.id);
    if (data && data !== "undefined") {
      localStorage.setItem("lastWeapon", data?.id);
    }
  }, [weaponId, characterData]);

  useEffect(() => {
    if (!characterStats || !weaponStats || !echoList) return;
    const result = calculateFinalStats({
      characterStats,
      weaponStats,
      echoList,
    });
  }, [characterStats, weaponStats, echoList]);

  return {
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
  };
}

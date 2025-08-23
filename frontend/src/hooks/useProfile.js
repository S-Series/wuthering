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

    stats.hp = 12345;

    return stats;
  }, [characterStats, weaponStats, characterId]);

  useEffect(() => {
    const saved = localStorage.getItem("lastCharacter");
    console.log(saved)
    if (saved) {
      setCharacterId(saved);
    } else {
      setCharacterId("rover");
    }
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
  }, [characterId]);

  useEffect(() => {
    if (!characterData) return;
    const data = weapon[characterData.weapon]?.find((w) => w.id === weaponId);
    const stats = weaponStat[weaponId];
    setWeaponData(data);
    setWeaponStats(stats);
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

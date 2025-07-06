import { useState, useEffect } from "react";
import { createEmptyEcho } from "../data/Echo";
import { calculateFinalStats } from "../utils/calcFinalStats.js";
import { character, characterStat } from "../data/Character";
import { weapon, weaponStat } from "../data/Weapon";

export function useProfile() {
  //$ Edit in Outside
  const [characterId, setCharacterId] = useState("rover");
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

  const [finalStats, setFinalStats] = useState(null);

  useEffect(() => {
    const data = character.find((c) => c.id === characterId);
    if (characterData && characterData.weapon !== data.weapon) {
      //$ if weapon type dismatched, reset weapon selection
      setWeaponId("");
      setWeaponData(null);
      setWeaponStats(null);
    }
    setCharacterData(data);
    setCharacterStats(characterStat[characterId] ?? null);
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
    setFinalStats(result);
  }, [characterStats, weaponStats, echoList]);

  return {
    characterId, setCharacterId,
    weaponId, setWeaponId,
    constellation, setConstellation,
    echoList, setEchoList,
    characterData, weaponData,
    characterStats, weaponStats, finalStats,
  };
}

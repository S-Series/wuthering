import { useState, useEffect, useMemo } from "react";
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

  const finalStats = useMemo(() => {
    let retHp = 0;
    let retAtk = 0;
    let retDef = 0;
    let retRes = 0;
    let retCrit = [0, 0];
    let retType = ["", ""];

    return ({
      hp: 0,
      atk: 0,
      def: 0,
      res: 0,
      critRate: 0,
      critDmg: 0,
      type: ["", ""],
      typeBns: [0, 0]
  });}, [characterData, weaponData, echoList]);

  useEffect(() => {
    const saved = localStorage.getItem("wwavesdev-character");
    if (saved) {setCharacterId(saved);}
  }, [])

  useEffect(() => {
    const data = character.find((c) => c.id === characterId);
    setCharacterData(data);
    localStorage.setItem("wwavesdev-character", data)
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
    characterId, setCharacterId,
    weaponId, setWeaponId,
    constellation, setConstellation,
    echoList, setEchoList,
    characterData, weaponData,
    characterStats, weaponStats, finalStats,
  };
}

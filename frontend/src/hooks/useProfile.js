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
    let retHp = 0,
      retAtk = 0,
      retDef = 0,
      retRes = 0,
      retCrit = [0, 0],
      retTypeBns = [0, 0];

    const characterData = character.find(
      (item) => item.id === characterId ?? "rover"
    );
    //$ [element, type]
    const typeDef = characterData
      ? [characterData.element + "Bns", characterData.type + "Bns"]
      : ["", ""];

    retHp = characterStats ?characterStats.baseHp : 0;
    retAtk = characterStats ?characterStats.baseAtk : 0;
    retDef = characterStats ?characterStats.baseDef : 0;
    retRes = characterStats ?characterStats.resonanceBns : 0;
    retCrit = characterStats
      ? [characterStats.critRate, characterStats.critDmg]
      : [5, 150];
    retTypeBns = characterStats ? characterStats.typeBns : [0, 0];

    return {
      hp: retHp,
      atk: retAtk,
      def: retDef,
      ResonanceBns: retRes,
      CritRate: retCrit[0],
      CritDmg: retCrit[1],
      type: typeDef,
      typeBns: retTypeBns,
    };
  }, [characterStats, weaponStats, echoList]);

  useEffect(() => {
    const saved = localStorage.getItem("wwavesdev-character");
    if (saved) {
      setCharacterId(saved);
    }
  }, []);

  useEffect(() => {
    const data = character.find((c) => c.id === characterId);
    setCharacterData(data);
    localStorage.setItem("wwavesdev-character", data);
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

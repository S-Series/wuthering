import type { LangType } from "@/stores/appStore";
import { harmony as hDict, type HarmonyId } from "@/datas/harmonies";
import {
  getCharacterRank,
  getEquipmentRank,
  type CharacterData,
  type CharacterStat,
  type ScoreList,
} from "@/types/character.type";
import { character as cDict } from "@/datas/characters";
import { characterStat, type CharacterId } from "@/datas/characterStats";
import { weaponDict, type WeaponId } from "@/datas/weapon";
import { weaponStat } from "@/datas/weaponStats";
import { FixedStats, type StatId } from "@/datas/stats";
import type { UserProfile } from "@/firebase/firebase";
import type { GameProfile } from "@/firebase/firebase";

export type RenderCardPayload = {
  base: {
    lang: string;
  };
  user: {
    server: string;
    name: string;
    uid: string;
    level: number;
  };
  character: {
    id: string;
    name: string;
    constell: number;
    elementType: string;
    weaponType: string;
    attackType: string;
    mainStatType: string;
  };
  weapon: {
    id: string;
    name: string;
    stats: [string, string];
    statType: string;
    imgKey: string;
  };
  stats: {
    statId: string[];
    statName: string[];
    statValue: string[];
    additionalValue: string[];
    harmony: [string, string, string][];
    score: [number, number];
  };
  namecard: {
    score: number;
    rank: string;
  };
  echoes: {
    id: string;
    harmonyId: string;
    stats: {
      statId: string;
      statValue: string;
      statColorHex: string;
    }[];
    scores: [string, string];
    rank: string;
  }[];
};

const renderEndPoint = import.meta.env.VITE_GATEWAY_URL;

const formatStatValue = (statId: StatId, value: number) => {
  const needPercent = ["pct", "bns", "crit"].some((item) =>
    statId.toLowerCase().includes(item)
  );

  return `${needPercent ? value.toFixed(1) : value}${needPercent ? "%" : ""}`;
};

export function createPayloadData(
  lang: LangType,
  userProfile: UserProfile,
  gameProfile: GameProfile,
  characterData: CharacterData,
  finalStat: CharacterStat,
  harmonySet: Partial<Record<HarmonyId, number>>,
  equipmentScore: ScoreList,
  statColors: string[][],
): RenderCardPayload {
  const cId: CharacterId = characterData.characterId;
  const cData = cDict[cId];
  const cBase = characterStat[cId];
  const cStat = finalStat;

  const wId: WeaponId = characterData?.weaponId ?? "dummy";
  const wData = weaponDict[wId];
  const wStat = weaponStat[wId];

  const base: RenderCardPayload["base"] = {
    lang: lang,
  };

  const user: RenderCardPayload["user"] = {
    server: gameProfile?.server ?? "Guest",
    name: userProfile?.nickname ?? "Guest",
    uid: gameProfile?.gameUid ?? "--- --- ---",
    level: gameProfile?.gameLevel ?? "--",
  };

  const character: RenderCardPayload["character"] = {
    id: cId,
    name: cData[lang],
    constell: characterData.constell[0],
    elementType: cData.element,
    weaponType: cData.weapon,
    attackType: cData.type,
    mainStatType: "",
  };

  const weapon: RenderCardPayload["weapon"] = {
    id: wId,
    name: wData[lang],
    stats: [wStat.atk.toString(), wStat.value[0].toFixed(1)],
    statType: wStat.statType[0],
    imgKey: wData.imgKey,
  };

  const stats: RenderCardPayload["stats"] = {
    statId: [
      FixedStats.hp.id,
      FixedStats.atk.id,
      FixedStats.def.id,
      FixedStats.resonanceBns.id,
      FixedStats.critRate.id,
      FixedStats.critDmg.id,
      FixedStats[`${cData.element}Bns`].id,
      FixedStats[`${cData.type}Bns`].id,
    ],
    statName: [
      FixedStats.hp[lang],
      FixedStats.atk[lang],
      FixedStats.def[lang],
      FixedStats.resonanceBns[lang],
      FixedStats.critRate[lang],
      FixedStats.critDmg[lang],
      FixedStats[`${cData.element}Bns`][lang],
      FixedStats[`${cData.type}Bns`][lang],
    ],
    statValue: [
      cStat.hp.toString(),
      cStat.atk.toString(),
      cStat.def.toString(),
      cStat.resonanceBns.toFixed(1) + "%",
      cStat.critRate.toFixed(1) + "%",
      cStat.critDmg.toFixed(1) + "%",
      cStat[cData.element].toFixed(1) + "%",
      cStat[cData.type].toFixed(1) + "%",
    ],
    additionalValue: [
      (cStat.hp - cBase.baseHp).toString(),
      (cStat.atk - cBase.baseAtk - wStat.atk).toString(),
      (cStat.def - cBase.baseDef).toString(),
      (cStat.resonanceBns - cBase.ResonanceBns).toFixed(1) + "%",
      (cStat.critRate - cBase.CritRate).toFixed(1) + "%",
      (cStat.critDmg - cBase.CritDmg).toFixed(1) + "%",
      (cStat[cData.element] - cBase.typeBns[0]).toFixed(1) + "%",
      (cStat[cData.type] - cBase.typeBns[1]).toFixed(1) + "%",
    ],
    harmony: Object.entries(harmonySet).map(([id, count]) => {
      const harmonyId = id as HarmonyId;

      return [harmonyId, hDict[harmonyId][lang], String(count)] as [
        string,
        string,
        string
      ];
    }),
    score: characterData.echoDataIndex.slice(0, 5).reduce<[number, number]>(
      (acc, realIndex) => {
        acc[0] += equipmentScore[realIndex][0];
        acc[1] += equipmentScore[realIndex][1];
        return acc;
      },
      [0, 0]
    ),
  };

  const namecard: RenderCardPayload["namecard"] = {
    score: stats.score[1],
    rank: getCharacterRank(stats.score[1]),
  };

  const safeStatColors = statColors.map((row) => ["#fff", "#fff", ...row]);

  const echoes: RenderCardPayload["echoes"] = characterData.echoDataIndex
    .slice(0, 5)
    .map((realIndex, idx) => {
      const echoData = characterData.echoData[realIndex];
      const scoreData = equipmentScore[realIndex];

      const costStat: {statId: StatId, statValue: number} = {
        statId: (() => echoData.cost === 1 ? FixedStats.hp.id : FixedStats.atk.id)(),
        statValue: (() => {
          switch(echoData.cost){
            case 4: return 150;
            case 3: return 100;
            case 1: return 2280;
            default: return 0;
          }
        })()
      }

      const statList = [echoData.mainOption, costStat, ...echoData.subOptions].map(
        (stat, innerIdx) => ({
          statId: stat.statId,
          statValue: formatStatValue(stat?.statId ?? "dummy", stat?.statValue ?? 0),
          statColorHex: safeStatColors?.[idx]?.[innerIdx] ?? "#555",
        })
      );

      return {
        id: echoData.echoId ?? "",
        harmonyId: echoData.setId ?? "",
        stats: statList,
        scores: [scoreData[0].toFixed(1), scoreData[1].toFixed(1)] as [
          string,
          string
        ],
        rank: getEquipmentRank(scoreData[1]),
      };
    });

  return {
    base,
    user,
    character,
    weapon,
    stats,
    namecard,
    echoes,
  };
}

export async function requestRenderCard(payload: RenderCardPayload) {
  const response = await fetch(`http://localhost:8080/render/card`, {
  // const response = await fetch(`${renderEndPoint}/api/render/card`, {
    method: "POST",
    headers: {
      "Content-Type": "application/json",
    },
    body: JSON.stringify(payload),
  });

  if (!response.ok) {
    throw new Error(`Render request failed: ${response.status}`);
  }

  return response.blob();
}

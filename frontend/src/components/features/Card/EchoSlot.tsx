import type { EchoRuntime } from "@/runtime/echo.runtime";

import "./EchoSlot.css"
import { useCharacter } from "@/stores/characterDataStore";
import { getEquipmentRank } from "@/types/character.type";
import { characterScoreSheet } from "@/datas/characterScoreSheet";
import { FixedStats, type StatId } from "@/datas/stats";
import { useMemo } from "react";

interface StatSlotProps {
  index: number;
}

const PERCENT_STAT_KEYS = ["crit", "Pct", "Bns"];
function MakeStatSlot({ StatId = "", StatValue = 0, color = "#666" }
  : { StatId: string; StatValue: number | string; color: string}) {
  return (
    <div className="echo-stat-slot">
      <img alt="stat icon" src={`/ico/stats/${StatId}.webp`}
        onError={(e) => {
          e.currentTarget.onerror = null;
          e.currentTarget.src = "/default.webp"
        }} />
      <span className="num-font" style={{color:`${color}`}}>
        {StatValue === -1 ? "- - -" : StatValue}
        {PERCENT_STAT_KEYS.some(key => StatId.includes(key)) ? "%" : ""}
      </span>
    </div>
  );
}

function StatToColor({StatId, StatValue, scoreValue} 
  : {StatId?: StatId; StatValue: number; scoreValue: number; }) {
  if (!StatId || !StatValue) return "#555";
  if (StatId === "dummy") return "#555";
  if (!(scoreValue > 0)) return "#555"
  const StatMin: number = FixedStats[StatId].ValueSub[0] ?? -1;
  const StatMax: number = FixedStats[StatId].ValueSub[FixedStats[StatId].ValueSub.length - 1] ?? -1;

  if (StatMax === -1 || StatMin === -1) return "#555";

  const baseValue = 255;
  const grayValue = scoreValue > 1 ? 0 : scoreValue > 0 ? 75 : 150;

  const ratio: number = 1 - ((StatValue - StatMin) / (StatMax - StatValue)) / scoreValue;
  const safeRatio =  Math.max(0, Math.min(1, ratio));

  return `rgb(${baseValue - grayValue}, ${baseValue - grayValue}, ${baseValue * safeRatio - (grayValue * 1.1)})`
}

export default function EchoSlot({index = 0 }: StatSlotProps) {

  const BASE_URL = import.meta.env.VITE_IMAGE_BASE;
  const { characterId, characterData, equipmentScore } = useCharacter();
  const Echodata = useMemo<EchoRuntime>(() => { return characterData.echoData[index] }, [index, characterData])

  const STAT_TEXT_COLOR = useMemo(() => {
    const scoreMap = characterScoreSheet[characterId];

    return [
      StatToColor({ StatId: Echodata.subOptions[0].statId, StatValue: Echodata.subOptions[0].statValue, scoreValue: (scoreMap[Echodata.subOptions[0].statId] ?? 0) }),
      StatToColor({ StatId: Echodata.subOptions[1].statId, StatValue: Echodata.subOptions[1].statValue, scoreValue: (scoreMap[Echodata.subOptions[1].statId] ?? 0) }),
      StatToColor({ StatId: Echodata.subOptions[2].statId, StatValue: Echodata.subOptions[2].statValue, scoreValue: (scoreMap[Echodata.subOptions[2].statId] ?? 0) }),
      StatToColor({ StatId: Echodata.subOptions[3].statId, StatValue: Echodata.subOptions[3].statValue, scoreValue: (scoreMap[Echodata.subOptions[3].statId] ?? 0) }),
      StatToColor({ StatId: Echodata.subOptions[4].statId, StatValue: Echodata.subOptions[4].statValue, scoreValue: (scoreMap[Echodata.subOptions[4].statId] ?? 0) })
    ]
  }, [index, characterId, characterData])

  return (
    <div className={`echo-slot-body ${index < 0 ? "select" : ""}`}>
      <div className="echo-image-slot">
        <img className="echo-image" alt="echo icon"
          src={`${BASE_URL}/ico/echos/${Echodata?.echoId}.webp`}
          onError={(e) => {
            const img = e.currentTarget;
            img.onerror = null;
            img.src = "default.webp"
          }} />
        <img className="harmony-image" alt="echo icon"
          src={`/ico/harmony/${Echodata?.setId}.png`}
          onError={(e) => {
            const img = e.currentTarget;
            img.onerror = null;
            img.src = "default.webp"
          }} />
        <div className="divider echo" />
      </div>

      <div className="stat-container main">
        <MakeStatSlot
          StatId={Echodata?.mainOption.statId ?? "dummy"}
          StatValue={(Echodata?.mainOption?.statValue ?? 0).toFixed(1)}
          color="#fff"/>

        <MakeStatSlot
          StatId={Echodata?.cost === 1 ? "hp" : "atk"}
          StatValue={(() => {
            switch (Echodata?.cost) {
              case 4: return 150;
              case 3: return 100;
              case 1: return 2280;
              default: return -1;
            }
          })()}
          color="#ccc"/>
      </div>

      <div className="divider stat" />

      <div className="stat-container sub">
        {(() => {
          return [0, 1, 2, 3, 4].map((idx) => {
            const statId: StatId = Echodata?.subOptions?.[idx]?.statId ?? "dummy";
            const statValue = Echodata?.subOptions?.[idx]?.statValue || 0;
            return <MakeStatSlot
              key={`echo-stat-container-${idx}`}
              StatId={statId}
              StatValue={statValue.toFixed(1)}
              color={STAT_TEXT_COLOR[idx]} />
          })
        })()}
      </div>

      <div className="divider stat" />

      <div className="score-container">
        <img alt="rank icon" src={`/ico/rank/${getEquipmentRank(equipmentScore?.[Math.abs(index)][1] ?? 0)}.png`} />
        <div className="slot">
          <span className="en-font">Cv.</span>
          <span className="en-font"> <em className="num-font">{equipmentScore[Math.abs(index)][0].toFixed(1)}</em>pt</span>
        </div>
        <div className="slot">
          <span className="en-font">Av.</span>
          <span className="en-font"> <em className="num-font">{equipmentScore[Math.abs(index)][1].toFixed(1)}</em>pt</span>
        </div>
      </div>
    </div>
  )
}
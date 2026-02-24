import type { EchoRuntime } from "@/runtime/echo.runtime";

import "./EchoSlot.css"
import { useCharacter } from "@/stores/characterDataStore";
import { getEquipmentRank } from "@/types/character.type";

interface StatSlotProps {
  index: number;
  Echodata?: EchoRuntime;
}

const PERCENT_STAT_KEYS = ["crit", "Pct", "Bns"];
function MakeStatSlot({ StatId = "", StatValue = -1, }
  : { StatId?: string; StatValue?: number | string; }) {
  return (
    <div className="echo-stat-slot">
      <img alt="stat icon" src={`/ico/stats/${StatId}.webp`}
        onError={(e) => {
          e.currentTarget.onerror = null;
          e.currentTarget.src = "/default.webp"
        }} />
      <span className="num-font">
        {StatValue === -1 ? "- - -" : StatValue}
        {PERCENT_STAT_KEYS.some(key => StatId.includes(key)) ? "%" : ""}
      </span>
    </div>
  );
}

export default function EchoSlot({index = 0, Echodata }: StatSlotProps) {

  const BASE_URL = import.meta.env.VITE_IMAGE_BASE;
  const { equipmentScore } = useCharacter();
  console.log(index);

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
          StatId={Echodata?.mainOption.statId}
          StatValue={(Echodata?.mainOption?.statValue ?? 0).toFixed(1)} />

        <MakeStatSlot
          StatId={Echodata?.cost === 1 ? "hp" : "atk"}
          StatValue={(() => {
            switch (Echodata?.cost) {
              case 4: return 150;
              case 3: return 100;
              case 1: return 2280;
              default: return -1;
            }
          })()} />
      </div>

      <div className="divider stat" />

      <div className="stat-container sub">
        {[0, 1, 2, 3, 4].map((idx) => {
          return <MakeStatSlot
            StatId={Echodata?.subOptions[idx].statId}
            StatValue={(Echodata?.subOptions[idx].statValue || 0).toFixed(1)} />
        })}
      </div>

      <div className="divider stat" />

      <div className="score-container">
        <img alt="rank icon" src={`/ico/rank/${getEquipmentRank(equipmentScore[Math.abs(index)][1])}.png`} />
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
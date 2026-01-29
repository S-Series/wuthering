import { useAppStore } from "@/hooks/appStore";
import type { Character } from "@/datas/characters";
import type { CharacterRank } from "@/types/character.type";

import "./CharacterSlot.css"

interface CharaterSlotProps {
  id: string;
  prop: Character & { score: number; rank: CharacterRank };
  isGrid: boolean;
}

export default function CharacterSlot({ id, isGrid, prop }: CharaterSlotProps) {

  const BASE_URL = import.meta.env.VITE_IMAGE_BASE;
  console.log(BASE_URL);
  const { lang } = useAppStore();

  return (
    isGrid ? (
      <a className={`character-slot ${prop.isElite ? "elite" : ""}`}
        href={`/card?character=${id}`}>

        <div className="character-image-slot">
          <img className={`character-image ${prop.rank}`} alt="character image" 
            src={`${BASE_URL}/character/${id.includes("rover") ? "rover" : id}/stand.png`} 
            />
          <div className={`card-bg ${prop.rank === "Empty" ? "empty" : prop.element}`} />
          <div className="overlay" />
          {prop.rank === "Empty" ? null :
            <img alt="rank icon" className="rank-icon" src={`/ico/rank/${prop.rank}.png`} />
          }
        </div>

        <div className="character-info-slot">
          <span className={`name ${lang}-font`}>{prop[lang].charAt(0).toUpperCase() + prop[lang].slice(1)}</span>
          <img alt="" className="bigger" src={`${BASE_URL}/ico/element/${prop.element}.png`} />
          {/*
          <img alt="" src={`${BASE_URL}/ico/weapon_type/${prop.weapon}.webp`} />
          <img alt="" src={`${BASE_URL}/ico/stats/${prop.type}Bns.webp`} />
          */}
        </div>

      </a>
    ) : (
      <div className="character-slot">

        <div className="character-image-slot">
          <img alt="character image" className="character-image" src={`${BASE_URL}/character/${id}/stand.png`} />
          <div className="rank-slot">
            <img alt="rack icon" className="rank-icon" src={`/ico/rank/1.png`} />
          </div>
        </div>

        <div className="character-info-slot">
          <span className="name">{prop[lang].charAt(0).toUpperCase() + prop[lang].slice(1)}</span>
          <img alt="" className="bigger" src={`${BASE_URL}/ico/element/${prop.element}.png`} />
          <img alt="" src={`${BASE_URL}/ico/weapon_type/${prop.weapon}.webp`} />
          <img alt="" src={`${BASE_URL}/ico/stats/${prop.type}Bns.webp`} />
        </div>

      </div>
    )
  )
}
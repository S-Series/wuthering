import { useAppStore } from "@/stores/appStore";
import type { Character } from "@/datas/characters";
import type { CharacterRank } from "@/types/character.type";
import { locale } from "@/locales/locale";

import "./CharacterSlot.css"

interface CharaterSlotProps {
  prop: Character & { score: number; rank: CharacterRank };
  isGrid: boolean;
  isFavorite?: boolean;
  onToggleFavorite?: () => void;
}

export default function CharacterSlot({ isGrid, prop, isFavorite = false, onToggleFavorite }: CharaterSlotProps) {

  const BASE_URL = import.meta.env.VITE_IMAGE_BASE;
  const { lang } = useAppStore();
  const id = prop.id;
  const name = prop[lang].charAt(0).toUpperCase() + prop[lang].slice(1);
  const favoriteText = locale(lang).characters;

  return (
    isGrid ? (
      <div className={`character-slot ${prop.isElite ? "elite" : ""}`}>
      <a className="character-slot__link"
        aria-label={name}
        data-info-kind="character" data-info-id={id}
        href={`/card/${id}`}>

        <div className="character-image-slot">
          <img className={`character-image ${prop.rank}`} alt="character image" 
            src={`${BASE_URL}/character/${id.includes("rover") ? "rover" : id}/stand.png?ver=2`} 
            loading="lazy"
            decoding="async"
          />
          <div className={`card-bg ${prop.rank === "Empty" ? "empty" : prop.element}`} />
          <div className="overlay" />
          {prop.rank === "Empty" ? null :
            <img alt="rank icon" className="rank-icon" src={`/ico/rank/${prop.rank}.png`} />
          }
        </div>

        <div className="character-info-slot">
          <span className={`name ${lang}-font`}>{name}</span>
          <img alt="" className="bigger" src={`${BASE_URL}/ico/element/${prop.element}.png`} />
        </div>

      </a>
      {onToggleFavorite && (
        <button
          type="button"
          className="character-favorite"
          aria-label={`${name} · ${isFavorite ? favoriteText.removeFavorite : favoriteText.addFavorite}`}
          aria-pressed={isFavorite}
          data-tooltip-description={favoriteText.favoritesStorageHint}
          onClick={onToggleFavorite}
        >
          <svg viewBox="0 0 24 24" aria-hidden="true" focusable="false">
            <path d="m12 2.5 2.94 5.96 6.58.96-4.76 4.64 1.12 6.55L12 17.52l-5.88 3.09 1.12-6.55L2.48 9.42l6.58-.96Z" />
          </svg>
        </button>
      )}
      </div>
    ) : (
      <div className="character-slot" data-info-kind="character" data-info-id={id}>

        <div className="character-image-slot">
          <img
            alt="character image"
            className="character-image"
            src={`${BASE_URL}/character/${id}/stand.png`}
            loading="lazy"
            decoding="async"
          />
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

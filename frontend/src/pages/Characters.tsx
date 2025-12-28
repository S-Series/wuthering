import { useMemo, useEffect, useState } from "react"

import { character } from "@/datas/characters"
import type { WeaponType, ElementType } from "@/datas/characters";
import CharacterSlot from "@/components/features/Characters/CharacterSlot";

import "@/pages/_Page.css"
import "@/pages/Characters.css"

type OrderByOption = 
  | "version"
  | "version_reverse"
  | "score"
  | "score_reverse"
;

export default function Characters() {

  const [orderBy, setOrderBy] = useState<OrderByOption>("version");
  const [weaponFilter, setWeaponFilter] = useState<WeaponType | null>(null);
  const [elementFilter, setElementFilter] = useState<ElementType | null>(null);

  const [isDisplayGrid, setIsDisplayGrid] = useState(true);

  const CHARACTER_LIST = Object.entries(character);

  const filteredCharacters = useMemo(() => {
    return CHARACTER_LIST
      .filter(([, item]) =>
        !weaponFilter || item.weapon === weaponFilter
      )
      .filter(([, item]) =>
        !elementFilter || item.element === elementFilter
      )
      .sort(([, a], [, b]) => {
        switch (orderBy) {
          case "version":
            return b.version - a.version;

          case "version_reverse":
            return a.version - b.version;

          case "score":
            return 0;

          case "score_reverse":
            return 0;

          default: throw new Error(`Unexpected Value: [orderBy : {${orderBy}}]`);
        }
      });
  }, [weaponFilter, elementFilter, orderBy]);

  return (
    <div id="page-slot">
      <div className="page-header">
        <button className={`header-button ${isDisplayGrid ? "active" : ""}`}
          onClick={() => setIsDisplayGrid(true)}>
          <img className="button-icon"
            alt="list-icon"
            src="/default.webp" />
        </button>
        <button className={`header-button ${isDisplayGrid ? "" : "active"}`}
          onClick={() => setIsDisplayGrid(false)}>
          <img className="button-icon"
            alt="grid-icon"
            src="/default.webp" />
        </button>
        <div className="search-bar">
          <img alt="search-icon"
            src="/default.webp" />
          <input placeholder="공명자 검색">
          </input>
        </div>
      </div>
      <div className="slot-container">
        {
          filteredCharacters.map(([key, item]) => {
            return <CharacterSlot isGrid={isDisplayGrid}
              key={key}
              id={key}
              prop={item} />
          })
        }
      </div>
    </div>
  )
}
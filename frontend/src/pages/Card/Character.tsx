import { useMemo, useState } from "react";
import { useNavigate } from "react-router-dom";

import { useAppStore } from "@/stores/appStore";
import { useCharacter } from "@/stores/characterDataStore";

import {
  character,
  characterList,
  ElementTypes,
  WeaponTypes,
} from "@/datas/characters";
import { characterGuideData } from "@/datas/characters.guide";
import { weapon, type WeaponId } from "@/datas/weapon";
import { weaponStat } from "@/datas/weaponStats";
import { patchConstell, setWeaponId } from "@/runtime/characterData.helpers";
import { locale } from "@/locales/locale";

import "./Character.css";

const BASE_URL = import.meta.env.VITE_IMAGE_BASE;

function BreakthroughButtons({
  count,
  label,
  prefix,
  start = 0,
  value,
  onChange,
}: {
  count: number;
  label: string;
  prefix: string;
  start?: number;
  value: number;
  onChange: (value: number) => void;
}) {
  return (
    <div className="card-character-select__breakthrough-group">
      <span>{label}</span>
      <div className="card-character-select__breakthrough-buttons">
        {Array.from({ length: count - start + 1 }, (_, index) => {
          const optionValue = start + index;

          return (
          <button
            key={`${prefix}-${optionValue}`}
            type="button"
            className={value === optionValue ? "active" : ""}
            onClick={() => onChange(optionValue)}
          >
            {prefix}
            {optionValue}
          </button>
          );
        })}
      </div>
    </div>
  );
}

export default function CardCharacterSection() {
  const { lang, imgVer } = useAppStore();
  const {
    characterId,
    setCharacterId,
    characterData,
    patchCharacterData,
  } = useCharacter();
  const navigate = useNavigate();

  const localeText = locale(lang).card;
  const [weaponFilter, setWeaponFilter] = useState(
    WeaponTypes.map(() => false)
  );
  const [elementFilter, setElementFilter] = useState(
    ElementTypes.map(() => false)
  );

  const selectedCharacter =
    character[characterId] ?? character.rover_spectro;

  const filteredCharacters = useMemo(() => {
    return characterList.filter((item) => {
      const weaponIndex = WeaponTypes.indexOf(item.weapon);
      const elementIndex = ElementTypes.indexOf(item.element);
      const hasWeaponFilter = weaponFilter.some(Boolean);
      const hasElementFilter = elementFilter.some(Boolean);

      return (
        (!hasWeaponFilter || weaponFilter[weaponIndex]) &&
        (!hasElementFilter || elementFilter[elementIndex])
      );
    });
  }, [elementFilter, weaponFilter]);

  const recommendedWeaponIds = useMemo(
    () => characterGuideData[selectedCharacter.id]?.guideWeapons ?? [],
    [selectedCharacter.id]
  );

  const availableWeapons = useMemo(() => {
    const recommendationOrder = new Map(
      recommendedWeaponIds.map((weaponId, index) => [weaponId, index])
    );

    return Object.values(weapon[selectedCharacter.weapon])
      .map((item, index) => ({
        item,
        index,
        recommendationIndex:
          recommendationOrder.get(item.id) ?? Number.POSITIVE_INFINITY,
      }))
      .sort(
        (a, b) =>
          a.recommendationIndex - b.recommendationIndex ||
          a.index - b.index
      )
      .map(({ item }) => item);
  }, [recommendedWeaponIds, selectedCharacter.weapon]);

  return (
    <div className="card-character-select">
      <section className="card-character-select__panel character">
        <header className="card-character-select__header">
          <span className={`${lang}-font`}>{localeText.cMenu}</span>
          <strong className={`${lang}-font`}>
            {selectedCharacter[lang]}
          </strong>
        </header>

        <div className="card-character-select__filters">
          <div className="card-character-select__filter-row weapon">
            {WeaponTypes.map((weaponType, index) => (
              <button
                key={weaponType}
                type="button"
                className={weaponFilter[index] ? "active" : ""}
                title={weaponType}
                onClick={() =>
                  setWeaponFilter((current) =>
                    current.map((value, currentIndex) =>
                      currentIndex === index ? !value : value
                    )
                  )
                }
              >
                <img
                  alt=""
                  src={`${BASE_URL}/ico/weapon_type/${weaponType}.webp`}
                />
              </button>
            ))}
          </div>

          <div className="card-character-select__filter-row element">
            {ElementTypes.map((element, index) => (
              <button
                key={element}
                type="button"
                className={elementFilter[index] ? "active" : ""}
                title={element}
                onClick={() =>
                  setElementFilter((current) =>
                    current.map((value, currentIndex) =>
                      currentIndex === index ? !value : value
                    )
                  )
                }
              >
                <img
                  alt=""
                  src={`${BASE_URL}/ico/element/${element}.png`}
                />
              </button>
            ))}
          </div>
        </div>

        <div className="card-character-select__breakthrough">
          <BreakthroughButtons
            count={6}
            label="캐릭터 돌파"
            prefix="C"
            value={characterData.constell[0]}
            onChange={(value) =>
              patchCharacterData(patchConstell(characterData, true, value))
            }
          />
        </div>

        <div className="card-character-select__character-list">
          {filteredCharacters.map((item) => {
            const assetId = item.id.includes("rover") ? "rover" : item.id;

            return (
              <button
                key={item.id}
                type="button"
                className={`card-character-select__character ${item.element} ${
                  item.id === selectedCharacter.id ? "selected" : ""
                }`}
                onClick={() => {
                  setCharacterId(item.id);
                  navigate(`/card/${item.id}`);
                }}
              >
                <img
                  alt=""
                  src={`${BASE_URL}/character/${assetId}/ico.webp?v=${imgVer}`}
                  onError={(event) => {
                    event.currentTarget.onerror = null;
                    event.currentTarget.src = "/default.webp";
                  }}
                />
                <span className={`${lang}-font`}>{item[lang]}</span>
              </button>
            );
          })}
        </div>
      </section>

      <section className="card-character-select__panel weapon">
        <header className="card-character-select__header">
          <span className={`${lang}-font`}>{localeText.wMenu}</span>
          <img
            alt=""
            src={`${BASE_URL}/ico/weapon_type/${selectedCharacter.weapon}.webp`}
          />
        </header>

        <div className="card-character-select__breakthrough">
          <BreakthroughButtons
            count={5}
            label="무기 돌파"
            prefix="R"
            start={1}
            value={Math.max(1, characterData.constell[1])}
            onChange={(value) =>
              patchCharacterData(patchConstell(characterData, false, value))
            }
          />
        </div>

        <div className="card-character-select__weapon-list">
          {availableWeapons.map((item) => {
            const weaponId = item.id as WeaponId;
            const rarity =
              Number(weaponId.match(/\d+$/)?.[0] ?? 0) < 100 ? 5 : 4;
            const stats = weaponStat[weaponId];
            const isRecommended = recommendedWeaponIds.includes(weaponId);

            return (
              <button
                key={weaponId}
                type="button"
                className={`card-character-select__weapon rarity-${rarity} ${
                  isRecommended ? "recommended" : ""
                } ${
                  weaponId === characterData.weaponId ? "selected" : ""
                }`}
                onClick={() => {
                  if (!stats) return;
                  patchCharacterData(setWeaponId(characterData, weaponId));
                }}
              >
                <img
                  alt=""
                  src={`${BASE_URL}/weapon/${selectedCharacter.weapon}/${item.imgKey}.png?v=${imgVer}`}
                  onError={(event) => {
                    event.currentTarget.onerror = null;
                    event.currentTarget.src = "/default.webp";
                  }}
                />
                <span className="card-character-select__weapon-info">
                  <small className="en-font">{rarity} STAR</small>
                  <strong className={`${lang}-font`}>{item[lang]}</strong>
                  {stats && (
                    <span className="num-font">
                      ATK {stats.atk}
                    </span>
                  )}
                </span>
              </button>
            );
          })}
        </div>
      </section>
    </div>
  );
}

import {
  useMemo,
  useState,
  type Dispatch,
  type SetStateAction,
} from "react"

import { loadSummaryStore } from "@/summaryData/storage";

import {
  characterList,
  ElementTypes,
  WeaponTypes,
  type ElementType,
  type WeaponType,
} from "@/datas/characters"
import CharacterSlot from "@/components/features/Characters/CharacterSlot";

import "@/pages/_Page.css"
import "@/pages/Characters.css"
import { getCharacterRank } from "@/types/character.type";
import { locale } from "@/locales/locale";
import { useAppStore } from "@/stores/appStore";

type OrderByOption = "score" | "version";
type SortDirection = "asc" | "desc";
const BASE_URL = import.meta.env.VITE_IMAGE_BASE;

export default function Characters() {
  const { lang } = useAppStore();
  const localeText = locale(lang).characters;

  const [orderBy, setOrderBy] = useState<OrderByOption>("version");
  const [sortDirections, setSortDirections] = useState<
    Record<OrderByOption, SortDirection>
  >({
    score: "asc",
    version: "desc",
  });
  const [configuredOnly, setConfiguredOnly] = useState(false);
  const [searchQuery, setSearchQuery] = useState("");
  const [weaponFilters, setWeaponFilters] = useState<WeaponType[]>([]);
  const [elementFilters, setElementFilters] = useState<ElementType[]>([]);

  const summaryStore = useMemo(() => loadSummaryStore(), []);

  const toggleFilter = <T extends string>(
    value: T,
    setFilters: Dispatch<SetStateAction<T[]>>,
  ) => {
    setFilters((current) =>
      current.includes(value)
        ? current.filter((item) => item !== value)
        : [...current, value]
    );
  };

  const selectSort = (option: OrderByOption) => {
    if (orderBy !== option) {
      setOrderBy(option);
      return;
    }

    setSortDirections((current) => ({
      ...current,
      [option]: current[option] === "asc" ? "desc" : "asc",
    }));
  };

  const toggleSettingFilter = () => {
    setConfiguredOnly((current) => !current);
  };

  const filteredCharacters = useMemo(() => {
    const normalizedQuery = searchQuery.trim().toLocaleLowerCase();

    return characterList
      .map((item) => {
        const score = summaryStore.data[item.id]?.score ?? 0;

        return {
          ...item,
          score,
          rank: getCharacterRank(score),
        };
      })
      .filter((item) => {
        const matchesSearch =
          !normalizedQuery ||
          [item.id.replaceAll("_", " "), item.kr, item.en, item.jp, item.zh]
            .some((name) => name.toLocaleLowerCase().includes(normalizedQuery));

        return (
          matchesSearch &&
          (!configuredOnly || item.score > 0) &&
          (weaponFilters.length === 0 || weaponFilters.includes(item.weapon)) &&
          (elementFilters.length === 0 || elementFilters.includes(item.element))
        );
      })
      .sort((a, b) => {
        if (orderBy === "score") {
          const scoreDifference =
            sortDirections.score === "asc"
              ? a.score - b.score
              : b.score - a.score;

          return scoreDifference || b.version - a.version;
        }

        const versionDifference =
          sortDirections.version === "asc"
            ? a.version - b.version
            : b.version - a.version;

        return versionDifference || b.score - a.score;
      });
  }, [
    configuredOnly,
    elementFilters,
    orderBy,
    searchQuery,
    sortDirections,
    summaryStore,
    weaponFilters,
  ]);

  return (
    <div id="page-slot" className="characters-page">
      <div className="characters-toolbar">
        <div className="characters-sort" role="group">
          <button
            type="button"
            className={orderBy === "score" ? "active" : ""}
            aria-pressed={orderBy === "score"}
            onClick={() => selectSort("score")}
          >
            <span>{localeText.sortScore}</span>
            <span className="characters-sort-arrow" aria-hidden="true">
              {sortDirections.score === "asc" ? "↑" : "↓"}
            </span>
          </button>
          <button
            type="button"
            className={orderBy === "version" ? "active" : ""}
            aria-pressed={orderBy === "version"}
            onClick={() => selectSort("version")}
          >
            <span>{localeText.sortRelease}</span>
            <span className="characters-sort-arrow" aria-hidden="true">
              {sortDirections.version === "asc" ? "↑" : "↓"}
            </span>
          </button>
          <button
            type="button"
            className="characters-setting-toggle"
            aria-pressed={configuredOnly}
            onClick={toggleSettingFilter}
          >
            {localeText.configured}
          </button>
        </div>

        <div className="characters-filter-group weapon">
          <span>{localeText.filterWeapon}:</span>
          <div className="characters-filter-options">
            {WeaponTypes.map((weaponType) => {
              const isActive = weaponFilters.includes(weaponType);

              return (
                <button
                  key={weaponType}
                  type="button"
                  className={isActive ? "active" : ""}
                  aria-label={`${localeText.filterWeapon}: ${weaponType}`}
                  aria-pressed={isActive}
                  title={weaponType}
                  onClick={() => toggleFilter(weaponType, setWeaponFilters)}
                >
                  <img
                    alt=""
                    src={`${BASE_URL}/ico/weapon_type/${weaponType}.webp`}
                  />
                </button>
              );
            })}
          </div>
        </div>

        <div className="characters-filter-group element">
          <span>{localeText.filterElement}:</span>
          <div className="characters-filter-options">
            {ElementTypes.map((elementType) => {
              const isActive = elementFilters.includes(elementType);

              return (
                <button
                  key={elementType}
                  type="button"
                  className={isActive ? "active" : ""}
                  aria-label={`${localeText.filterElement}: ${elementType}`}
                  aria-pressed={isActive}
                  title={elementType}
                  onClick={() => toggleFilter(elementType, setElementFilters)}
                >
                  <img
                    alt=""
                    src={`${BASE_URL}/ico/element/${elementType}.png`}
                  />
                </button>
              );
            })}
          </div>
        </div>

        <label className="characters-search">
          <input
            type="search"
            value={searchQuery}
            placeholder={localeText.search}
            aria-label={localeText.search}
            onChange={(event) => setSearchQuery(event.target.value)}
          />
        </label>
      </div>

      <div className="characters-toolbar secondary">
        <div className="characters-filter-group weapon secondary">
          <span>{localeText.filterWeapon}:</span>
          <div className="characters-filter-options">
            {WeaponTypes.map((weaponType) => {
              const isActive = weaponFilters.includes(weaponType);

              return (
                <button
                  key={weaponType}
                  type="button"
                  className={isActive ? "active" : ""}
                  aria-label={`${localeText.filterWeapon}: ${weaponType}`}
                  aria-pressed={isActive}
                  title={weaponType}
                  onClick={() => toggleFilter(weaponType, setWeaponFilters)}
                >
                  <img
                    alt=""
                    src={`${BASE_URL}/ico/weapon_type/${weaponType}.webp`}
                  />
                </button>
              );
            })}
          </div>
        </div>

        <div className="characters-filter-group element secondary">
          <span>{localeText.filterElement}:</span>
          <div className="characters-filter-options">
            {ElementTypes.map((elementType) => {
              const isActive = elementFilters.includes(elementType);

              return (
                <button
                  key={elementType}
                  type="button"
                  className={isActive ? "active" : ""}
                  aria-label={`${localeText.filterElement}: ${elementType}`}
                  aria-pressed={isActive}
                  title={elementType}
                  onClick={() => toggleFilter(elementType, setElementFilters)}
                >
                  <img
                    alt=""
                    src={`${BASE_URL}/ico/element/${elementType}.png`}
                  />
                </button>
              );
            })}
          </div>
        </div>
      </div>

      <div className="characters-list">
        {filteredCharacters.map((item) => (
          <CharacterSlot
            isGrid
            key={item.id}
            prop={item}
          />
        ))}

        {filteredCharacters.length === 0 && (
          <p className="characters-empty">{localeText.noResults}</p>
        )}
      </div>
    </div>
  )
}

import { useEffect, useMemo, useRef, useState } from "react";
import { useSearchParams } from "react-router-dom";

import { useAppStore } from "@/hooks/appStore";
import { useUserStore } from "@/hooks/userStore";

import ImagePicker from "@/components/ImagePicker";
import StatSlot from "@/components/features/Card/StatSlot";
import EchoSlot from "@/components/features/Card/EchoSlot";
import EchoSelect from "@/components/features/Card/EchoSelect";


import { character, WeaponTypes as WeaponLists, ElementTypes as ElementLists } from "@/datas/characters"
import type { Character} from "@/datas/characters"
import { characterStat, type CharacterId } from "@/datas/characterStats";
import { weapon, type Weapon } from "@/datas/weapon";
import { weaponStat } from "@/datas/weaponStats";
import { harmony } from "@/datas/echos";
import { ATTACK_TYPE_STAT_MAP, ELEMENT_STAT_MAP, FixedStats, type StatId } from "@/datas/stats";

import type { WeaponData } from "@/runtime/character.runtime";
import { type EchoRuntime } from "@/runtime/echo.runtime";

import "@/pages/Card.css"
import "@/pages/Card.contents.main.css"

export default function Card() {

  const { lang } = useAppStore();
  const {
    selectedCharacter,
    setSelectedCharacter,
    setWeapon,
    //setEcho,
    setConstell,
    getFinalStat
  } = useUserStore();

  const BASE_URL = import.meta.env.VITE_IMAGE_BASE;
  const SCOREBOARD_URL = "https://docs.google.com/spreadsheets/d/169EqXJatZIMqL0MPbHF6Eg9DgLFcaxjE6hG03gYZ-_U/edit?gid=1750559029#gid=1750559029";
  const UI_BUTTON_POS = [
    { x: 85.5, y: 62.8 },
    { x: 73.89, y: 72.1 },
    { x: 60, y: 79.5 },
    { x: 45, y: 85 },
    { x: 29.3, y: 88.3 },
    { x: 13, y: 88.9 },
  ]
  const [searchParams] = useSearchParams();
  const paramData = searchParams.get("character") ?? "empty";

  const [cardSection, setCardSection] = useState(-1);
  const [echoSection, setEchoSection] = useState(0);
  const [weaponFilter, setWeaponFilter] = useState([false, false, false, false, false])
  const [elementFilter, setElementFilter] = useState([false, false, false, false, false, false])

  const echoSlotRef = useRef<HTMLDivElement | null>(null);

  //* == Character ================================================//
  const CHARACTER_LIST = Object.entries(character) as [CharacterId, Character][];
  const FILTERED_CHARACTER = useMemo(() => {
    let result = CHARACTER_LIST;

    const hasElementFilter = elementFilter.some(Boolean);
    if (hasElementFilter) {
      result = result.filter(([_, character]) => {
        const idx = ElementLists.indexOf(character.element);
        if (idx === -1) return false;
        return elementFilter[idx];
      });
    }

    const hasWeaponFilter = weaponFilter.some(Boolean);
    if (hasWeaponFilter) {
      result = result.filter(([_, character]) => {
        const idx = WeaponLists.indexOf(character.weapon);
        if (idx === -1) return false;
        return weaponFilter[idx];
      });
    }

    return result as [CharacterId, Character][];
  }, [CHARACTER_LIST, elementFilter, weaponFilter]);

  const characterData = useMemo<Character>(() => {
    const data = CHARACTER_LIST.find(([key]) => key === selectedCharacter.characterId)?.[1] || character["rover_spectro"]
    return data;
  }, [selectedCharacter.characterId])

  const STAT_IDS = useMemo(() => {
    return [
      FixedStats.hp.id,
      FixedStats.atk.id,
      FixedStats.def.id,
      FixedStats.ResonanceBns.id,
      FixedStats.CritRate.id,
      FixedStats.CritDmg.id,
      ELEMENT_STAT_MAP[characterData.element] || FixedStats.dummy.id,
      ATTACK_TYPE_STAT_MAP[characterData.type] || FixedStats.dummy.id,
    ]
  }, [characterData.element, characterData.type])

  //* == Weapon ================================================//
  const FILTERED_WEAPON = useMemo<Weapon[]>(() => {
    return Object.values(weapon[characterData.weapon]);
  }, [characterData]);

  const weaponData = useMemo<WeaponData | null>(() => {
    return selectedCharacter.weaponData;
  }, [selectedCharacter.weaponData])

  //* == Echoes ================================================//
  const echoData = useMemo(() => {
    return [
      null as EchoRuntime | null,
      null as EchoRuntime | null,
      null as EchoRuntime | null,
      null as EchoRuntime | null,
      null as EchoRuntime | null
    ]
  }, [selectedCharacter.echoes])

  //* == Image ================================================//
  const characterImage = useUserStore((s) => s.characterImage);
  const namecardImage = useUserStore((s) => s.namecardImage);

  const setImageSrc = useUserStore((s) => s.setImageSrc);
  // const resetImage = useUserStore((s) => s.resetImage);

  //* == Image Loading ================================================//
  type LoadingStatus = "loading" | "loaded" | "error";
  const [imageLoad, setImageLoad] = useState({
    character: "loading" as LoadingStatus,
    characterPreview: "loading" as LoadingStatus,
    weapon: "loading" as LoadingStatus,
    weaponPreview: "loading" as LoadingStatus,
    echoes: Array<LoadingStatus>(5).fill("loading"),
    echoPreviews: Array<LoadingStatus>(5).fill("loading"),
  })

  useEffect(() => {
    setImageLoad(v => ({ ...v, character: "loading", characterPreview: "loading" }))
  }, [characterData]);

  useEffect(() => {
    setImageLoad(v => ({ ...v, weapon: "loading", weaponPreview: "loading" }))
  }, [weaponData]);

  //* == Init Datas ================================================//

  function isCharacterId(value: string): value is CharacterId {
    return value in characterStat;
  }

  useEffect(() => {
    const fromList =
      CHARACTER_LIST.find(([key]) => key === paramData)?.[0];

    const fromStorage = localStorage.getItem("selectedCharacterId");

    if (fromList) {
      setSelectedCharacter(fromList);
      return;
    }

    if (fromStorage && isCharacterId(fromStorage)) {
      setSelectedCharacter(fromStorage);
      return;
    }

    setSelectedCharacter("rover_spectro");
  }, [])

  const FINAL_STATS = useMemo(() => {
    return getFinalStat();
  }, [characterData, weaponData, echoData]);

  const FINAL_STATS_MAP = useMemo<Partial<Record<StatId, number>>>(() => {
    return {
      //* base stats
      [FixedStats.hp.id]: FINAL_STATS?.hp || 0,
      [FixedStats.atk.id]: FINAL_STATS?.atk || 0,
      [FixedStats.def.id]: FINAL_STATS?.def || 0,
      [FixedStats.ResonanceBns.id]: FINAL_STATS?.resBns || 0,
      [FixedStats.CritRate.id]: FINAL_STATS?.critRate || 0,
      [FixedStats.CritDmg.id]: FINAL_STATS?.critDmg || 0,

      //* element type stats
      [FixedStats.AeroBns.id]: FINAL_STATS?.elementBns.aero || 0,
      [FixedStats.FusionBns.id]: FINAL_STATS?.elementBns.fusion || 0,
      [FixedStats.GlacioBns.id]: FINAL_STATS?.elementBns.glacio || 0,
      [FixedStats.ElectroBns.id]: FINAL_STATS?.elementBns.electro || 0,
      [FixedStats.HavocBns.id]: FINAL_STATS?.elementBns.havoc || 0,
      [FixedStats.SpectroBns.id]: FINAL_STATS?.elementBns.spectro || 0,

      //* attack type stats
      [FixedStats.basicBns.id]: FINAL_STATS?.attackBns.basic || 0,
      [FixedStats.heavyBns.id]: FINAL_STATS?.attackBns.heavy || 0,
      [FixedStats.skillBns.id]: FINAL_STATS?.attackBns.skill || 0,
      [FixedStats.liberationBns.id]: FINAL_STATS?.attackBns.liberation || 0,
      [FixedStats.healBns.id]: FINAL_STATS?.attackBns.heal || 0,
    }
  }, [FINAL_STATS]);

  //* == return data ================================================//
  return (
    <div id="card-page-slot">
      <div className="card-section left">
        <div className="card-header">
          {/* filter buttons */}
          {/*
          <div className="header-slot">
            <div className="item-slot filter">
              <div style={{display: "flex", gap: "min(0.5vw, 1rem)"}}>
                {WeaponLists.map((item, idx) => {
                  return (
                    <button className={
                      `card-page-button filter ${weaponFilter[idx] ? "active" : ""}`
                    }
                      onClick={() => {
                        setWeaponFilter((prev) =>
                          prev.map((v, i) => (i === idx ? !v : v)))
                      }}>
                      <img alt="weapon icon"
                        src={`${BASE_URL}/ico/weapon_type/${item}.webp`} />
                    </button>
                  )
                })}
                <div style={{ width: "4px" }} />
              </div>

              <div style={{display: "flex", gap: "min(0.5vw, 1rem)"}}>
                {ElementLists.map((item, idx) => {
                  return (
                    <button className={
                      `card-page-button filter ${elementFilter[idx] ? "active" : ""}`
                    }
                      onClick={() => {
                        setElementFilter((prev) =>
                          prev.map((v, i) => (i === idx ? !v : v)))
                      }}>
                      <img alt="filter icon"
                        src={`${BASE_URL}/ico/element/${item}.png`} />
                    </button>
                  )
                })}
                <div style={{ width: "4px" }} />
                <button className="card-page-button"
                  onClick={() => {
                    setWeaponFilter([false, false, false, false, false]);
                    setElementFilter([false, false, false, false, false, false]);
                  }}><span className="en-font">Reset</span></button>
              </div>
            </div>

            <div className="item-slot">
              asdf
            </div>
          </div>
          */}

          {/* Select Field */}
          {/*
          <div className="header-slot">
            <div className="item-slot">
              <Select
                options={[
                  { value: 1, label: "Cost 1" },
                  { value: 2, label: "Cost 2" },
                ]}
              />

              <div style={{ width: "4px" }} />

              <Select
                options={[
                  { value: 1, label: "Cost 1" },
                  { value: 2, label: "Cost 2" },
                ]}
              />
            </div>
          </div>
          */}
        </div>

        <div className="card-contents">
          <div className="card-contents-slot header">
            <div className="item-slot">
              <button className="card-page-button content top">
                <span>ⓘ&nbsp;&nbsp;Help</span>
              </button>
              <button className="card-page-button content top">
                <span>Request Generate</span>
              </button>
              <button className="card-page-button content top">
                <span>Download Image</span>
              </button>
            </div>

            <div className="item-slot">
              <button className="card-page-button content top">
                <span>Reset Plate Image</span>
              </button>
              <button className="card-page-button content top">
                <span>Idle</span>
              </button>
            </div>
          </div>

          {/* == //$ Main Content */}
          <div className="card-contents-slot main">
            <div className="main-item-slot character">
              <div className="card-character-slot">
                <ImagePicker
                  src={characterImage.src}
                  defaultSrc={
                    `${BASE_URL}/character/${characterData.en.includes("rover")
                      ? "rover"
                      : characterData.en}/stand.png`
                  }
                  onChangeSrc={(src) =>
                    setImageSrc("characterImage", src)
                  }
                />

                <div className="constell-overlay">
                  <img className="" src={`/ui/CharacterC${selectedCharacter.constell[0]}.png`} />
                  {UI_BUTTON_POS.map((item, idx) => {
                    return (
                      <button className={`constell-button ${selectedCharacter.constell[0] > idx ? "active" : ""}`}
                        style={{ left: `${item.x}%`, top: `${item.y}%`, }}
                        onClick={() => {
                          setConstell(
                            selectedCharacter.constell[0] === idx + 1 ? 0 : idx + 1,
                            selectedCharacter.constell[1])
                        }}>
                        <img className="constell-image" src={
                          `${BASE_URL}/character/${characterData.en.includes("rover")
                            ? "rover"
                            : characterData.en}/C${idx + 1}.png`
                        } />
                      </button>
                    )
                  })}
                </div>

                <span className="account-info region en-font">{`Asia`}</span>
                <span className="account-info player-name en-font">{`Lv.-- Guest Player`}</span>
                <span className="account-info player-uid en-font">{`UID. - - -  - - -  - - -`}</span>
                <span className={`character-name ${lang}-font`}>
                  {characterData[lang]?.charAt(0).toUpperCase() + characterData[lang]?.slice(1)}
                </span>

                <img className="character-icon element"
                  alt="element icon"
                  src={`/ico/element/${characterData.element}.png`} />
                <img className="character-icon stat-type"
                  alt="stat type icon"
                  src={`/ico/stats/atk.webp`} />
                <img className="character-icon attack-type"
                  alt="attack type icon"
                  src={`/ico/stats/${characterData.type}Bns.webp`} />
                <img className="character-icon weapon-type"
                  alt="weapon type icon"
                  src={`/ico/weapon_type/${characterData.weapon}.webp`} />
              </div>
            </div>

            <div className="main-item-slot weapon">
              <div className="weapon-info-img">
                <img alt="weapon icon" src={
                  `${BASE_URL}/weapon/${characterData.weapon}/${weaponData?.imgKey}.png`}
                  onError={(e) => {
                    e.currentTarget.dataset.fallback = "true";
                    e.currentTarget.src = "/default.webp";
                  }} />
              </div>

              <div className="weapon-info-slot">
                <span className="weapon-name">
                  {`${weaponData?.[lang] || "- - - - - - - - - -"}`}
                </span>

                <img className="weapon-stat-icon main" alt="stat icon"
                  src={`/ico/stats/atk.webp`} />
                <span className="weapon-stat num-font main">{`${weaponData?.atk || "- - -"}`}</span>

                <img className="weapon-stat-icon sub" alt="stat icon"
                  src={`/ico/stats/${weaponData?.statType[0]}.webp`}
                  onError={(e) => {
                    e.currentTarget.dataset.fallback = "true";
                    e.currentTarget.src = "/default.webp";
                  }} />
                <span className="weapon-stat num-font sub">
                  {`${weaponData?.value[0] || "- - -"}`}<em>%</em>
                </span>
              </div>
            </div>

            <div className="main-item-slot stats">
              {STAT_IDS.map((item: StatId) => {
                return (
                  <StatSlot statId={item} statValue={FINAL_STATS_MAP[item] ?? 0} plusValue={123} />
                )
              })}

              <div className="harmony-slot">
                <div className="container">
                  <img src={`/ico/harmony/${harmony.Clouds.id}.webp`} />
                  <span className={`${lang}-font`}>
                    {harmony.Clouds[lang]} <em className="num-font">{"[5]"}</em>
                  </span>
                </div>

                <div className="container">
                  <img src={`/ico/harmony/${harmony.Revelation.id}.webp`} />
                  <span className={`${lang}-font`}>
                    {harmony.Revelation[lang]} <em className="num-font">{"[5]"}</em>
                  </span>
                </div>
              </div>

              <div className="score-slot">
                <span className="en-font">
                  Av. <em className="num-font">{`${123.4}`}</em>pt
                </span>
                <span className="en-font">
                  Cv. <em className="num-font">{`${123.4}`}</em>pt
                </span>
              </div>
            </div>

            <div className="main-item-slot description">
              <span className="en-font kuro">Unofficial Fan Project: All assets © Kuro Games </span>
              <span className="en-font powered">Powered by. SSeries </span>
              <span className="en-font link">
                <em><img className="link-image" src="/link.png" />WuWa.dev</em> © 2025
              </span>
            </div>

            <div className="main-item-slot namecard">
              <div className="namecard-score">
                <img alt="rank icon" src="/ico/rank/SSS.png" />
                <span className="en-font">
                  Av. <em className="num-font">{123.4}</em>pt
                </span>
              </div>

              <div className="namecard-image">
                <ImagePicker src={namecardImage.src}
                  defaultSrc={
                    `${BASE_URL}/character/${characterData.en.includes("rover")
                      ? "rover"
                      : characterData.en}/stand.png`
                  }
                  onChangeSrc={(src) =>
                    setImageSrc("namecardImage", src)
                  } />
              </div>
            </div>

            <div className="main-item-slot echos">
              <EchoSlot />
              <EchoSlot />
              <EchoSlot />
              <EchoSlot />
              <EchoSlot />
            </div>
          </div>
          {/* == //$ Main Content End */}

          <div className="card-contents-slot footer">
            <div className="item-slot">
              <button className="card-page-button content bottom">
                <span>Reset Character Image</span>
              </button>
            </div>

            <div className="item-slot">
              <button className="card-page-button content bottom"
                onClick={() => window.open(SCOREBOARD_URL, "_blank")}>
                <span>§Echo Scoreboard ↗</span>
              </button>
            </div>
          </div>
        </div>
      </div>

      <div className="card-section right">
        {/* == Character ============ */}
        <button className={`en-font ${cardSection === 0 ? "active" : ""}`}
          onClick={() => { setCardSection((p) => { return (p === 0 ? -1 : 0) }) }}>Character</button>

        <button className={`card-preview character ${cardSection === 0 ? "" : "active"}`}
          onClick={() => { setCardSection((p) => { return (p === 0 ? -1 : 0) }) }}>

          {imageLoad.character !== "loaded" && (
            <img alt="loading"
              src={`${BASE_URL}/character/${characterData.en}/ico.webp`} />
          )}

          <img alt="character"
            src={`${BASE_URL}/character/${characterData.en}/ico.webp`}
            style={{ display: imageLoad.character === "loaded" ? "block" : "none" }}
            onLoad={() => setImageLoad(v => ({ ...v, character: "loaded" }))}
            onError={() => setImageLoad(v => ({ ...v, character: "error" }))}
          />

          <span className={`${lang}-font`}>{characterData[lang]}</span>
        </button>

        <div className={`card-slot ${cardSection === 0 ? "active" : ""}`}>
          <div className="filter-slot">
            {WeaponLists.map((item, idx) => {
              return (
                <button className={
                  `filter-item ${weaponFilter[idx] ? "active" : ""}`
                }
                  onClick={() => {
                    setWeaponFilter((prev) =>
                      prev.map((v, i) => (i === idx ? !v : v)))
                  }}>
                  <img alt="filter icon"
                    src={`${BASE_URL}/ico/weapon_type/${item}.webp`} />
                </button>
              )
            })}
          </div>
          <div className="filter-slot">
            {ElementLists.map((item, idx) => {
              return (
                <button className={
                  `filter-item ${elementFilter[idx] ? "active" : ""}`
                }
                  onClick={() => {
                    setElementFilter((prev) =>
                      prev.map((v, i) => (i === idx ? !v : v)))
                  }}>
                  <img alt="filter icon"
                    src={`${BASE_URL}/ico/element/${item}.png`} />
                </button>
              )
            })}
          </div>
          {FILTERED_CHARACTER.map((item) => {
            return (
              <div className={`card-item ${item[1].element}
                ${item[0] === characterData.en ? "selected" : ""}`}
                onClick={() => {
                  console.log("asdf:", item);
                  setSelectedCharacter(item[0])
                  setCardSection(-1)
                }}>
                <img alt="character icon" src={`${BASE_URL}/character/${item[0].includes("rover")
                  ? "rover"
                  : item[0]}/ico.webp`} />
                <span className={`${lang}-font`}>{item[1][lang]}</span>
              </div>
            )
          })}
        </div>

        {/* == Weapon ============ */}
        <button className={`en-font ${cardSection === 1 ? "active" : ""}`}
          onClick={() => { setCardSection((p) => { return (p === 1 ? -1 : 1) }) }}>Weapon</button>

        <button className={`card-preview weapon ${cardSection === 1 ? "" : "active"}`}
          onClick={() => { setCardSection((p) => { return (p === 1 ? -1 : 1) }) }}>

          <img src={`${BASE_URL}/weapon/${characterData.weapon}/${weaponData?.imgKey}.png`} />

          <span className={`${lang}-font`}>{weaponData?.[lang]}</span>
        </button>

        <div className={`card-slot ${cardSection === 1 ? "active" : ""}`}>
          {FILTERED_WEAPON.map((item) => {
            return (
              <div className={`card-item weapon
                ${item.id.includes("00") ? "spectro" : "havoc"}
                ${item.id === weaponData?.id ? "selected" : ""}`}
                onClick={() => {
                  const stat = weaponStat[item.id];
                  if (!stat) return;

                  setWeapon({ ...item, ...stat });
                  setCardSection(-1);
                }}>
                <img alt="weapon icon" src={`${BASE_URL}/weapon/${characterData.weapon}/${item.imgKey}.png`} />
                <div style={{ display: "flex", flexDirection: "column" }}>
                  <span className={`${lang}-font`}>{item.id.includes("00") ? "★★★★★" : "★★★★"}</span>
                  <span className={`${lang}-font`}>{item[lang]}</span>
                </div>
              </div>
            )
          })}
        </div>

        {/* == Echos ============ */}
        <button className={`en-font ${cardSection === 2 ? "active" : ""}`}
          onClick={() => { setCardSection((p) => { return (p === 2 ? -1 : 2) }) }}>Echos</button>

        <button className={`card-preview echo ${cardSection === 2 ? "" : "active"}`}
          onClick={() => { setCardSection((p) => { return (p === 2 ? -1 : 2) }) }}>
          <img src={`${BASE_URL}/character/${characterData.en}/ico.webp`} />
          <img src={`${BASE_URL}/character/${characterData.en}/ico.webp`} />
          <img src={`${BASE_URL}/character/${characterData.en}/ico.webp`} />
          <img src={`${BASE_URL}/character/${characterData.en}/ico.webp`} />
          <img src={`${BASE_URL}/character/${characterData.en}/ico.webp`} />
        </button>

        <div className={`card-slot echo ${cardSection === 2 ? "active" : ""}`}>
          <div className="filter-slot">
            {[0, 1, 2, 3, 4].map((idx) => {
              return (
                <button className={`filter-item ${echoSection === idx
                  ? "active" : ""}`} onClick={() => { setEchoSection(idx) }}>
                  {idx + 1}
                </button>
              )
            })}
          </div>

          <div className="echo-slot" ref={echoSlotRef}>
            <EchoSelect/>
          </div>
        </div>
      </div>
    </div>
  )
}
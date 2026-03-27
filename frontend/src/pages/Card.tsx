import { useEffect, useMemo, useRef, useState } from "react";
import { useNavigate, useParams, useSearchParams } from "react-router-dom";

import { useAppStore } from "@/stores/appStore";
import { useImgStore } from "@/stores/imgStore";
import { useOverlay } from "@/contexts/PopupContext";
import { useCharacter } from "@/stores/characterDataStore";

import ImagePicker from "@/components/ImagePicker";
import StatSlot from "@/components/features/Card/StatSlot";
import EchoSlot from "@/components/features/Card/EchoSlot";
import OcrPlayground from "@/components/features/Card/OcrSlot";

import { character, WeaponTypes as WeaponLists, ElementTypes as ElementLists } from "@/datas/characters"
import { type Character } from "@/datas/characters"
import { type CharacterId } from "@/datas/characterStats";
import { weapon, weaponDict, type Weapon } from "@/datas/weapon";
import { weaponStat } from "@/datas/weaponStats";
import { harmony, type HarmonyId } from "@/datas/harmonies";
import { ATTACK_TYPE_STAT_MAP, ELEMENT_STAT_MAP, FixedStats, type StatId } from "@/datas/stats";

import { getCharacterRank } from "@/types/character.type";
import { type WeaponData } from "@/runtime/character.runtime";
import { patchConstell, setWeaponId } from "@/runtime/characterData.helpers";

import { locale } from "@/locales/locale";

import "@/pages/Card.css"
import "@/pages/Card.contents.main.css"
import EchoDragSelect from "@/components/features/Card/EchoDragSelect";
import { createPayloadData, getRenderCardStatus, requestRenderCard } from "@/api/render.api";
import { useAuthStore } from "@/stores/authStore";
import Select, { type StylesConfig } from "react-select";
import { useStyleStore, type SelectOption } from "@/stores/styleStore";
import { useRenderStore } from "@/stores/renderStore";

export default function Card() {

  const { lang, imgVer } = useAppStore();
  const { characterId, setCharacterId, patchCharacterData, characterData, characterBaseStat, characterFinalStat, equipmentScore, harmonySet, statColors } = useCharacter();
  const { baseSelectStyles } = useStyleStore();
  const { openOverlay } = useOverlay();
  const { user, gameProfile } = useAuthStore();
  const {renderedBlob, setRenderedImage} = useRenderStore();

  const navigate = useNavigate();
  const localeText = locale(lang).card;

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
  const { characterId: paramCharacterId } = useParams<{ characterId?: string }>();
  const queryCharacterId = searchParams.get("character") ?? "empty";


  const [cardSection, setCardSection] = useState(2);
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

  const selectedCharacterData = useMemo<Character>(() => {
    const data = CHARACTER_LIST.find(
      ([key]) => key === characterId)?.[1] || character["rover_spectro"]
    return data;
  }, [characterId])

  const STAT_IDS = useMemo(() => {
    return [
      FixedStats.hp.id,
      FixedStats.atk.id,
      FixedStats.def.id,
      FixedStats.resonanceBns.id,
      FixedStats.critRate.id,
      FixedStats.critDmg.id,
      ELEMENT_STAT_MAP[selectedCharacterData.element] || FixedStats.dummy.id,
      ATTACK_TYPE_STAT_MAP[selectedCharacterData.type] || FixedStats.dummy.id,
    ]
  }, [selectedCharacterData.element, selectedCharacterData.type])

  const scores = useMemo(() => {
    return [
      equipmentScore[characterData.echoDataIndex[0]][0] +
      equipmentScore[characterData.echoDataIndex[1]][0] +
      equipmentScore[characterData.echoDataIndex[2]][0] +
      equipmentScore[characterData.echoDataIndex[3]][0] +
      equipmentScore[characterData.echoDataIndex[4]][0],
      equipmentScore[characterData.echoDataIndex[0]][1] +
      equipmentScore[characterData.echoDataIndex[1]][1] +
      equipmentScore[characterData.echoDataIndex[2]][1] +
      equipmentScore[characterData.echoDataIndex[3]][1] +
      equipmentScore[characterData.echoDataIndex[4]][1],
    ]
  }, [equipmentScore])

  //* == Weapon ================================================//
  const FILTERED_WEAPON = useMemo<Weapon[]>(() => {
    return Object.values(weapon[selectedCharacterData.weapon]);
  }, [selectedCharacterData]);

  const weaponData = useMemo<WeaponData | null>(() => {
    const id = characterData.weaponId;
    if (!id) return null;
    const base = weaponDict[id];
    const stat = weaponStat[id];
    if (!base || !stat) return null;

    return { ...base, ...stat }
  }, [characterData.weaponId])

  const weaponConstellOption: SelectOption[] = [
    { value: "1", label: "✦" },
    { value: "2", label: "✦✦" },
    { value: "3", label: "✦✦✦" },
    { value: "4", label: "✦✦✦✦" },
    { value: "5", label: "✦✦✦✦✦" },
  ]

  //* == Image ================================================//
  const characterImage = useImgStore((s) => s.characterImage);
  const namecardImage = useImgStore((s) => s.namecardImage);

  const setImageSrc = useImgStore((s) => s.setImageSrc);
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
  }, [selectedCharacterData]);

  useEffect(() => {
    setImageLoad(v => ({ ...v, weapon: "loading", weaponPreview: "loading" }))
  }, [weaponData]);

  //* == Init Datas ================================================//

  function isCharacterId(value: string): value is CharacterId {
    return Object.prototype.hasOwnProperty.call(character, value);
  }

  useEffect(() => {
    const fromParam =
      CHARACTER_LIST.find(([key]) => key === paramCharacterId)?.[0];

    const fromQuery =
      CHARACTER_LIST.find(([key]) => key === queryCharacterId)?.[0];

    const fromStorage = localStorage.getItem("selectedCharacterId");

    if (fromParam) {
      setCharacterId(fromParam);
      return;
    }

    if (fromQuery) {
      setCharacterId(fromQuery);
      navigate("/card", { replace: true });
      return;
    }

    if (fromStorage && isCharacterId(fromStorage)) {
      setCharacterId(fromStorage);
      return;
    }

    setCharacterId("rover_spectro");
  }, [])

  const BASE_STATS_MAP = useMemo<Partial<Record<StatId, number>>>(() => {
    return {
      //* base stats
      [FixedStats.hp.id]: characterBaseStat?.hp || 0,
      [FixedStats.atk.id]: (characterBaseStat?.atk || 0) + (weaponData?.atk || 0),
      [FixedStats.def.id]: characterBaseStat?.def || 0,
      [FixedStats.resonanceBns.id]: characterBaseStat?.resonanceBns || 0,
      [FixedStats.critRate.id]: characterBaseStat?.critRate || 0,
      [FixedStats.critDmg.id]: characterBaseStat?.critDmg || 0,

      //* element type stats
      [FixedStats.aeroBns.id]: characterBaseStat?.aero || 0,
      [FixedStats.fusionBns.id]: characterBaseStat?.fusion || 0,
      [FixedStats.glacioBns.id]: characterBaseStat?.glacio || 0,
      [FixedStats.electroBns.id]: characterBaseStat?.electro || 0,
      [FixedStats.havocBns.id]: characterBaseStat?.havoc || 0,
      [FixedStats.spectroBns.id]: characterBaseStat?.spectro || 0,

      //* attack type stats
      [FixedStats.basicBns.id]: characterBaseStat?.basic || 0,
      [FixedStats.heavyBns.id]: characterBaseStat?.heavy || 0,
      [FixedStats.skillBns.id]: characterBaseStat?.skill || 0,
      [FixedStats.liberationBns.id]: characterBaseStat?.liberation || 0,
      [FixedStats.healBns.id]: characterBaseStat?.heal || 0,
    }
  }, [characterBaseStat]);

  const FINAL_STATS_MAP = useMemo<Partial<Record<StatId, number>>>(() => {
    return {
      //* base stats
      [FixedStats.hp.id]: characterFinalStat?.hp || 0,
      [FixedStats.atk.id]: characterFinalStat?.atk || 0,
      [FixedStats.def.id]: characterFinalStat?.def || 0,
      [FixedStats.resonanceBns.id]: characterFinalStat?.resonanceBns || 0,
      [FixedStats.critRate.id]: characterFinalStat?.critRate || 0,
      [FixedStats.critDmg.id]: characterFinalStat?.critDmg || 0,

      //* element type stats
      [FixedStats.aeroBns.id]: characterFinalStat?.aero || 0,
      [FixedStats.fusionBns.id]: characterFinalStat?.fusion || 0,
      [FixedStats.glacioBns.id]: characterFinalStat?.glacio || 0,
      [FixedStats.electroBns.id]: characterFinalStat?.electro || 0,
      [FixedStats.havocBns.id]: characterFinalStat?.havoc || 0,
      [FixedStats.spectroBns.id]: characterFinalStat?.spectro || 0,

      //* attack type stats
      [FixedStats.basicBns.id]: characterFinalStat?.basic || 0,
      [FixedStats.heavyBns.id]: characterFinalStat?.heavy || 0,
      [FixedStats.skillBns.id]: characterFinalStat?.skill || 0,
      [FixedStats.liberationBns.id]: characterFinalStat?.liberation || 0,
      [FixedStats.healBns.id]: characterFinalStat?.heal || 0,
    }
  }, [characterFinalStat]);

  const dropStyle: StylesConfig<any, false> = {
    ...baseSelectStyles,
    menu: (base, state) => {
      const common = baseSelectStyles.menu
        ? baseSelectStyles.menu(base, state)
        : base;

      return {
        ...common,
        right: 0,
        minWidth: "100%",
        width: "max-content",
        maxWidth: "200%",
        textAlign: "center",
      };
    },
  }

  const refreshRenderStatus = async () => {
    try {
      const data = await getRenderCardStatus();
      setRenderStatus(data.status);
      setRetryAfterSec(data.retryAfterSec);
    } catch (e) {
      console.error(e);
    }
  };

  const handlePreview = async () => {
    if (!user) {
      alert("Need to login")
    }

    const testing = (user && gameProfile && characterFinalStat) ? createPayloadData(
      lang, user, gameProfile, characterData, characterFinalStat, harmonySet, equipmentScore, statColors
    ) : null;

    if (!testing) return;

    try {
      const blob = await requestRenderCard(testing);
      setRenderedImage(blob);
      alert("Complete!")
    } catch (e) {
      console.error(e);
    } finally {
      await refreshRenderStatus();
    }
  };

  type RenderStatus = "ready" | "lock" | "cooldown";
  const [renderStatus, setRenderStatus] = useState<RenderStatus>("ready");
  const [retryAfterSec, setRetryAfterSec] = useState(0);

  useEffect(() => {
    const loadStatus = async () => {
      try {
        const data = await getRenderCardStatus();
        setRenderStatus(data.status);
        setRetryAfterSec(data.retryAfterSec);
      } catch (e) {
        console.error(e);
      }
    };

    loadStatus();
  }, []);

  useEffect(() => {
    const timer = setInterval(() => {
      setRetryAfterSec((prev) => {
        if (prev <= 1) {
          setRenderStatus((current) =>
            current === "lock" || current === "cooldown" ? "ready" : current
          );
          return 0;
        }
        return prev - 1;
      });
    }, 1000);

    return () => clearInterval(timer);
  }, []);

  const formatRemain = (sec: number) => {
    const m = Math.floor(sec / 60);
    const s = sec % 60;
    return `${m}:${String(s).padStart(2, "0")}`;
  };

  const renderedImageUrl = useRenderStore((state) => state.renderedImageUrl);
  const hydrateRenderedImage = useRenderStore((state) => state.hydrateRenderedImage);

  useEffect(() => {
    hydrateRenderedImage();
  }, [hydrateRenderedImage]);


  //* == return data ================================================//
  return (
    <div id="card-page-slot">
      <div className="card-section left">
        <div className="card-contents">
          <div className="card-contents-slot header">
            <div className="item-slot">
              <button disabled={true} className="card-page-button content top">
                <span>{localeText.help}</span>
              </button>
              <button className="card-page-button content top"
                disabled={renderStatus !== "ready" || retryAfterSec > 0} 
                onClick={handlePreview}
                onMouseOver={() => console.log(renderStatus)}>
                <span>{localeText.request} {formatRemain(retryAfterSec)}</span>
              </button>
              <button className="card-page-button content top"
                disabled={!renderedImageUrl}
                onClick={() => openOverlay(
                  <div style={{ display: "flex", flexDirection: "column", width: "100%", height: "100%", alignItems: "center" }}>
                    <img src={renderedImageUrl ?? ""} style={{ width: "100%", height: "auto", border: "1px solid #fff", filter: "drop-shadow(0 2px 4px #000)" }} />
                    <button style={{ marginTop: "2rem", height: "2rem", width: "fit-content",minWidth: "8rem", color: "#fff", fontSize: "min(1vw, 1rem)" }}
                      onClick={() => {
                        if (!renderedImageUrl) return;
                        const a = document.createElement("a");
                        a.href = renderedImageUrl;
                        a.download = `${characterId}.png`;
                        document.body.appendChild(a);
                        a.click();
                        a.remove();
                      }}>
                      {localeText.download}
                    </button>
                  </div>
                ,{title:`${localeText.download}`})}>
                <span>{localeText.download}</span>
              </button>
            </div>

            <div className="item-slot">
              <button className="card-page-button content top">
                <span>{localeText.plate1}</span>
              </button>
              <button className="card-page-button content top">
                <span>{localeText.plate2}</span>
              </button>
            </div>
          </div>

          {/* == //$ Main Content */}
          <div className="card-contents-slot main">
            <div className="main-item-slot character">
              <div className="card-character-slot">
                <ImagePicker src={characterImage.src}
                  defaultSrc={
                    `${BASE_URL}/character/${characterId?.includes("rover")
                      ? `rover?v=${imgVer}`
                      : characterId}/stand.png?v=${imgVer}`
                  }
                  onChangeSrc={(src) =>
                    setImageSrc("characterImage", src)
                  } />

                <div className="constell-overlay">
                  <img className="" src={`/ui/CharacterC${characterData.constell[0]}.png`} />
                  {UI_BUTTON_POS.map((item, idx) => {
                    return (
                      <button key={`character-constell-button${idx}`}
                        className={`constell-button ${characterData.constell[0] > idx ? "active" : ""}`}
                        style={{ left: `${item.x}%`, top: `${item.y}%`, }}
                        onClick={() => {
                          patchCharacterData(patchConstell(
                            characterData, true,
                            characterData.constell[0] === idx + 1 ? 0 : idx + 1))
                        }}>
                        <img className="constell-image" src={
                          `${BASE_URL}/character/${characterId?.includes("rover")
                            ? "rover"
                            : characterId}/C${idx + 1}.png`
                        } />
                      </button>
                    )
                  })}
                </div>

                <span className="account-info region en-font">{`Asia Server`}</span>
                <span className="account-info player-name en-font">{`Lv.-- Guest Player`}</span>
                <span className="account-info player-uid en-font">{`UID. - - -  - - -  - - -`}</span>
                <span className={`character-name ${lang}-font`}>
                  {selectedCharacterData[lang]?.charAt(0).toUpperCase() + selectedCharacterData[lang]?.slice(1)}
                </span>

                <img className="character-icon element"
                  alt="element icon"
                  src={`/ico/element/${selectedCharacterData.element}.png`} />
                <img className="character-icon stat-type"
                  alt="stat type icon"
                  src={`/ico/stats/atk.webp`} />
                <img className="character-icon attack-type"
                  alt="attack type icon"
                  src={`/ico/stats/${selectedCharacterData.type}Bns.webp`} />
                <img className="character-icon weapon-type"
                  alt="weapon type icon"
                  src={`/ico/weapon_type/${selectedCharacterData.weapon}.webp`} />
              </div>
            </div>

            <div className="main-item-slot weapon">
              <div className="weapon-info-img">
                <img alt="weapon icon" src={
                  `${BASE_URL}/weapon/${selectedCharacterData.weapon}/${weaponData?.imgKey}.png?v=${imgVer}`}
                  onError={(e) => {
                    e.currentTarget.dataset.fallback = "true";
                    e.currentTarget.src = "/default.webp";
                  }} />
              </div>

              <div className="weapon-constell-select en-font">
                <Select
                  isSearchable={false}
                  styles={dropStyle}
                  options={weaponConstellOption}
                  value={weaponConstellOption.find((item) => item.value === characterData.constell[1].toString())}
                  menuShouldScrollIntoView={false}
                  menuPortalTarget={document.body}
                  onChange={(opt) => {
                    const value = Number(opt.value);
                    patchCharacterData(patchConstell(characterData, false, value))
                  }}
                />
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
                  {`${weaponData?.value[0].toFixed(1) || "- - -"}`}<em>%</em>
                </span>
              </div>
            </div>

            <div className="main-item-slot stats">
              {STAT_IDS.map((item: StatId) => {
                return (
                  <StatSlot
                    key={`character-stat-slot-${item}`}
                    statId={item}
                    statValue={FINAL_STATS_MAP?.[item] ?? 0}
                    plusValue={(FINAL_STATS_MAP?.[item] ?? 0) - (BASE_STATS_MAP?.[item] ?? 0)}
                  />
                )
              })}

              <div className="harmony-slot">
                {Object.entries(harmonySet).map(([id, number]) => {
                  const harmonyId = id as HarmonyId;
                  return (
                    <div className="container" key={harmonyId}>
                      <img src={`/ico/harmony/${harmonyId}.png`} />
                      <span className={`${lang}-font`}>
                        {harmony[harmonyId][lang]} <em className="num-font">[{number}]</em>
                      </span>
                    </div>
                  );
                })}
              </div>

              <div className="score-slot">
                <span className="en-font">
                  Cv. <em className="num-font">{scores[0].toFixed(1)}</em>pt
                </span>
                <span className="en-font">
                  Av. <em className="num-font">{scores[1].toFixed(1)}</em>pt
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
                <img alt="rank icon" src={`/ico/rank/${getCharacterRank(scores[1])}.png`} />
                <span className="en-font">
                  Av. <em className="num-font">{scores[1].toFixed(1)}</em>pt
                </span>
              </div>

              <div className="namecard-image">
                <ImagePicker src={namecardImage.src}
                  defaultSrc={
                    `${BASE_URL}/character/${characterId.includes("rover")
                      ? "rover"
                      : characterId}/art.png`
                  }
                  onChangeSrc={(src) =>
                    setImageSrc("namecardImage", src)
                  } />
              </div>
            </div>

            <div className="main-item-slot echos">
              {[0, 1, 2, 3, 4].map((idx) => {
                return <EchoSlot
                  key={`echos-slot-${idx}`}
                  index={characterData.echoDataIndex[idx]} />
              })}
            </div>
          </div>
          {/* == //$ Main Content End */}

          <div className="card-contents-slot footer">
            <div className="item-slot">
              <button className="card-page-button content bottom">
                <span>{localeText.image1}</span>
              </button>
            </div>

            <div className="item-slot">
              <button className="card-page-button content bottom"
                onClick={() => window.open(SCOREBOARD_URL, "_blank")}>
                <span>{localeText.scoreboard}</span>
              </button>
            </div>
          </div>
        </div>
      </div>

      <div className="card-section right">
        <div className="card-section-wrapper">
          <button className={`${lang}-font ${cardSection === 0 ? "active" : ""}`}
            onClick={() => { setCardSection((p) => { return (p === 0 ? -1 : 0) }) }}>{localeText.cMenu}</button>

          <button className={`card-preview character ${cardSection === 0 ? "" : "active"}`}
            onClick={() => { setCardSection((p) => { return (p === 0 ? -1 : 0) }) }}>

            {imageLoad.character !== "loaded" && (
              <img alt="loading"
                src={`${BASE_URL}/character/${characterId}/ico.webp`} />
            )}

            <img alt="character"
              src={`${BASE_URL}/character/${selectedCharacterData.en}/ico.webp`}
              style={{ display: imageLoad.character === "loaded" ? "block" : "none" }}
              onLoad={() => setImageLoad(v => ({ ...v, character: "loaded" }))}
              onError={(e) => {
                e.currentTarget.onerror = null;
                e.currentTarget.src = "/default.webp"
                setImageLoad(v => ({ ...v, character: "error" }));
              }}
            />

            <span className={`${lang}-font`}>{selectedCharacterData[lang]}</span>
          </button>

          <div className={`card-slot ${cardSection === 0 ? "active" : ""}`}>
            <div className="filter-slot">
              {WeaponLists.map((item, idx) => {
                return (
                  <button key={`${item}-${idx}`}
                    className={`filter-item ${weaponFilter[idx] ? "active" : ""}`}
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
                  <button key={`${item}-${idx}`}
                    className={`filter-item ${elementFilter[idx] ? "active" : ""}`}
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
                <div key={`character-filter-${item}`}
                  className={`card-item ${item[1].element}
                ${item[0] === selectedCharacterData.en ? "selected" : ""}`}
                  onClick={() => {
                    setCharacterId(item[0])
                    setCardSection(-1)
                    navigate(`/card/${item[0]}`);
                  }}>
                  <img alt="character icon" src={`${BASE_URL}/character/${item[0].includes("rover")
                    ? "rover"
                    : item[0]}/ico.webp`} />
                  <span className={`${lang}-font`}>{item[1][lang]}</span>
                </div>
              )
            })}
          </div>
        </div>

        <div className="card-section-wrapper">
          {/* == Weapon ============ */}
          <button className={`${lang}-font ${cardSection === 1 ? "active" : ""}`}
            onClick={() => { setCardSection((p) => { return (p === 1 ? -1 : 1) }) }}>{localeText.wMenu}</button>

          <button className={`card-preview weapon ${cardSection === 1 ? "" : "active"}`}
            onClick={() => { setCardSection((p) => { return (p === 1 ? -1 : 1) }) }}>

            <img src={`${BASE_URL}/weapon/${selectedCharacterData.weapon}/${weaponData?.imgKey}.png`} />

            <span className={`${lang}-font`}>{weaponData?.[lang]}</span>
          </button>

          <div className={`card-slot ${cardSection === 1 ? "active" : ""}`}>
            {FILTERED_WEAPON.map((item, idx) => {
              return (
                <div key={`weapon-filter-slot-${item}-${idx}`}
                  className={`card-item weapon ${item.id.includes("00") ? "spectro" : "havoc"} ${item.id === weaponData?.id ? "selected" : ""}`}
                  onClick={() => {
                    const stat = weaponStat[item.id];
                    if (!stat) return;

                    patchCharacterData(setWeaponId(characterData, item.id));
                    setCardSection(-1);
                  }}>
                  <img alt="weapon icon" src={`${BASE_URL}/weapon/${selectedCharacterData.weapon}/${item.imgKey}.png`} />
                  <div style={{ display: "flex", flexDirection: "column" }}>
                    <span className={`${lang}-font`}>{item.id.includes("00") ? "★★★★★" : "★★★★"}</span>
                    <span className={`${lang}-font`}>{item[lang]}</span>
                  </div>
                </div>
              )
            })}
          </div>
        </div>

        <div className="card-section-wrapper">
          {/* == Echos ============ */}
          <button className={`${lang}-font ${cardSection === 2 ? "active" : ""}`}
            onClick={() => { setCardSection((p) => { return (p === 2 ? -1 : 2) }) }}>{localeText.eMenu}</button>

          <button className={`card-preview echo ${cardSection === 2 ? "" : "active"}`}
            onClick={() => { setCardSection((p) => { return (p === 2 ? -1 : 2) }) }}>
            {
              [0, 1, 2, 3, 4].map((item) => {
                return (
                  <img key={`echo-slot-${item}`}
                    src={`${BASE_URL}/ico/echos/${characterData.echoData[item].echoId}.webp`}
                    onError={(e) => {
                      e.currentTarget.onerror = null;
                      e.currentTarget.src = "/default.webp"
                    }} />
                )
              })
            }
          </button>

          <div className={`card-slot echo ${cardSection === 2 ? "active" : ""}`}>
            <div className="echo-slot" ref={echoSlotRef}>
              <button onClick={() => openOverlay(<OcrPlayground />)}>
                {locale(lang).card.oMenu}
              </button>
            </div>

            <div className="drag-slot">
              <EchoDragSelect num={-999} />
            </div>
          </div>
        </div>
      </div>
    </div>
  )
}
// basic
import "./ProfileCard.css";
import { useRef, useState, useEffect, useLayoutEffect, useMemo } from "react";
import Select, { components } from "react-select";
import { motion, AnimatePresence } from "framer-motion";
// data
import { character, characterStat } from "../data/Character";
import { weapon, weaponStat } from "../data/Weapon";
import { FixedStats } from "../data/Stats";
import { profileData, userdata } from "../data/userData";
import { echoDict, harmony } from "../data/Echo";
// hooks
import { useProfile } from "../hooks/useProfile";
import { useStyleHelper } from "../hooks/useStyleHelpers";
// utils
import ImageDrag from "../utils/ImageDrag";
// others
import StatSlot from "./CardComp/StatSlot";
import EchoSlot from "./CardComp/EchoSlot";
import EchoStatDrop from "./EchoStatDrop";

function ProfileCard() {
  //#region Refs
  const ProfileCardSlotRef = useRef(null);
  const WeaponNameTextRef = useRef(null);
  //#endregion

  //#region Variables
  const apiUrl = process.env.REACT_APP_API_URL;

  const [initKey, setInitKey] = useState(true);
  const [lang, setLang] = useState("en");
  const [sizeValue, setSizeValue] = useState(1.0);
  const [slotSize, setSlotSize] = useState({ width: 0, height: 0 });

  const [reloadKey, setReloadKey] = useState(0);

  const [filterWeapon, setFilterWeapon] = useState(null);
  const [filterElement, setFilterElement] = useState(null);

  const [selectedEchoIdx, setSelectedEchoIdx] = useState(0);
  const echoSlotBorderPos = useMemo(() => {
    return {
      w: 148 + 10,
      h: 620 + 10,
      x: 1320 + 163 * selectedEchoIdx - 5 - 2,
      y: 300 - 5 - 2
    };
  }, [selectedEchoIdx])

  

  const C_ConstellationList = [
    { value: 0, label: "C0" },
    { value: 1, label: "C1" },
    { value: 2, label: "C2" },
    { value: 3, label: "C3" },
    { value: 4, label: "C4" },
    { value: 5, label: "C5" },
    { value: 6, label: "C6" },
  ];
  const W_ConstellationList = [
    { value: 0, label: "C0" },
    { value: 1, label: "C1" },
    { value: 2, label: "C2" },
    { value: 3, label: "C3" },
    { value: 4, label: "C4" },
    { value: 5, label: "C5" },
  ];
  const W_ConstellationOption = W_ConstellationList.map((item) => ({
    value: item.value,
    label: item.label,
  }));

  const {
    characterId,
    setCharacterId,
    weaponId,
    setWeaponId,
    constellation,
    setConstellation,
    echoList,
    setEchoList,
    characterData,
    weaponData,
    characterStats,
    weaponStats,
    finalStats,
  } = useProfile();

  const statId = useMemo(() => {
    return ["hp", "atk", "def", "ResonanceBns", "CritRate", "CritDmg", 
      `${characterData?.element ?? ""}Bns`,
      `${characterData?.type ?? ""}Bns`,
    ];
  }, [finalStats]);
  //#endregion

  //#region Functions
  const getStringInfo = (lang) => {
    const strings = {
      kr: [
        "캐릭터 선택",
        "무기 선택",
        "* 캐릭터 및 무기 Lv90 기준",
        "* 모든 조건부 스텟은 적용되지 않습니다",
        "프로필 배경 이미지",
      ],
      jp: [
        "キャラ選択",
        "武器選択",
        "* キャラと武器はLv90基準",
        "* 条件付きステータスは適用されません",
        "プロフィール背景画像",
      ],
      zh: [
        "角色选择",
        "武器选择",
        "* 角色和武器以90级为基准",
        "* 所有条件属性不会被应用",
        "档案背景图像",
      ],
      en: [
        "Select Character",
        "Select Weapon",
        "* Based on Lv90 character and weapon",
        "* Conditional stats are not applied",
        "Profile Background Image",
      ],
    };
    return strings[lang] || strings["en"];
  };
  const { setSlotStyle } = useStyleHelper(sizeValue);
  function capitalizeFirst(str) {
    if (!str) return "";
    return str[0].toUpperCase() + str.slice(1).toLowerCase();
  }
  //#endregion

  //#region Initialize
  //$ OnLoad
  useEffect(() => {
    setLang(localStorage.getItem("lang"));

    function handleResize() {
      const w = ProfileCardSlotRef.current.offsetWidth;
      const h = ProfileCardSlotRef.current.offsetHeight;
      setSlotSize({ width: w, height: h });
      setSizeValue(w / 2140);
    }

    setReloadKey((prev) => prev + 1);

    window.addEventListener("resize", handleResize);
    return () => window.removeEventListener("resize", handleResize);
  }, []);
  //$ After Render
  useLayoutEffect(() => {
    const width = Math.max(
      Math.min(ProfileCardSlotRef.current.offsetWidth, 1070),
      856
    );
    const height = ProfileCardSlotRef.current.offsetHeight;

    setSlotSize({ width, height });
    setSizeValue(width / 2140);
  }, []);
  //#endregion

  //#region OnChange Action
  //#endregion

  //#region React Select Options
  const weaponTypes = [
    { kr: null, en: null, jp: null, zh: null },
    { kr: "직검", en: "sword", jp: "", zh: "" },
    { kr: "대검", en: "broadblade", jp: "", zh: "" },
    { kr: "권총", en: "pistol", jp: "", zh: "" },
    { kr: "권갑", en: "gauntlet", jp: "", zh: "" },
    { kr: "증폭기", en: "rectifier", jp: "", zh: "" },
  ];
  const [weaponFilter, setWeaponFilter] = useState(null);
  const weaponTypeOptions = useMemo(() => {
    return weaponTypes.map((e) => ({
      value: e.en,
      label: (
        <div
          style={{
            display: "flex",
            alignItems: "center",
            gap: `${10 * sizeValue}px`,
          }}
        >
          <img
            alt=""
            src={`${apiUrl}/static/ico/weapon_type/${e.en}.webp`}
            style={{
              width: `${75 * sizeValue}px`,
              height: `${75 * sizeValue}px`,
            }}
            onError={(e) => {
              e.currentTarget.onerror = null;
              e.currentTarget.src = "/default.webp";
            }}
          />
          <span
            className={`${lang}Font`}
            style={{ fontSize: `${32 * sizeValue}px` }}
          >
            {e[lang ?? "en"] ?? "All"}
          </span>
        </div>
      ),
    }));
  }, [lang, reloadKey]);

  const elements = [
    { en: null, kr: null, jp: null, zh: null },
    { kr: "기류", en: "Aero", jp: "", zh: "" },
    { kr: "융용", en: "Fusion", jp: "", zh: "" },
    { kr: "전도", en: "Electro", jp: "", zh: "" },
    { kr: "응결", en: "Glacio", jp: "", zh: "" },
    { kr: "회절", en: "Spectro", jp: "", zh: "" },
    { kr: "인멸", en: "Havoc", jp: "", zh: "" },
  ];
  const [elementFilter, setElementFilter] = useState(null);
  const elementOptions = useMemo(() => {
    return elements.map((e) => ({
      value: e.en,
      label: (
        <div
          style={{
            display: "flex",
            alignItems: "center",
            gap: `${10 * sizeValue}px`,
          }}
        >
          <img
            alt=""
            src={`${apiUrl}/static/ico/element/${e?.en?.toLowerCase()}.png`}
            style={{
              width: `${75 * sizeValue}px`,
              height: `${75 * sizeValue}px`,
            }}
            onError={(e) => {
              e.currentTarget.onerror = null;
              e.currentTarget.src = "/default.webp";
            }}
          />
          <span
            className={`${lang}Font`}
            style={{ fontSize: `${32 * sizeValue}px` }}
          >
            {e[lang ?? "en"] ?? "All"}
          </span>
        </div>
      ),
    }));
  }, [lang, reloadKey]);

  const characterOptions = useMemo(() => {
    const filtered_W = weaponFilter
      ? character.filter((item) => item.weapon === weaponFilter)
      : character;

    const filtered_WE = elementFilter
      ? filtered_W.filter((item) => item.element === elementFilter)
      : filtered_W;

    return filtered_WE.map((item) => ({
      value: item.id,
      label: (
        <div
          style={{
            display: "flex",
            alignItems: "center",
            gap: `${10 * sizeValue}px`,
          }}
        >
          <img
            alt=""
            src={`${apiUrl}/static/character/${item?.id}/ico.webp`}
            style={{
              width: `${75 * sizeValue}px`,
              height: `${75 * sizeValue}px`,
              transform: `translateX(-${10 * sizeValue}px)`,
            }}
            onError={(e) => {
              e.currentTarget.onerror = null;
              e.currentTarget.src = "/default.webp";
            }}
          />
          <span
            className={`${lang}Font`}
            style={{ fontSize: `${32 * sizeValue}px` }}
          >
            {item[lang === "en" ? "id" : lang] ?? "error"}
          </span>
        </div>
      ),
    }));
  }, [elementFilter, lang, sizeValue, weaponFilter]);
  const weaponOptions = useMemo(() => {
    const filtered = characterData ? weapon[characterData.weapon] : [];

    return filtered.map((item) => ({
      value: item.id,
      label: (
        <div
          style={{
            display: "flex",
            alignItems: "center",
            gap: `${10 * sizeValue}px`,
          }}
        >
          <img
            alt=""
            src={`${apiUrl}/static/weapon/${characterData.weapon}/${item?.imgKey}.png`}
            style={{
              width: `${75 * sizeValue}px`,
              height: `${75 * sizeValue}px`,
              transform: `translateX(-${10 * sizeValue}px)`,
            }}
            onError={(e) => {
              e.currentTarget.onerror = null;
              e.currentTarget.src = "/default.webp";
            }}
          />
          <span
            className={`${lang}Font`}
            style={{ fontSize: `${32 * sizeValue}px` }}
          >
            {item[lang === "en" ? "id" : lang] ?? "error"}
          </span>
        </div>
      ),
    }));
  // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [characterData, lang, sizeValue]);
  //#endregion

  return (
    <div className="profile-portrait">
      <div className="profile-select-slot">
        <Select
          className="weapon-select-dropdown"
          menuPlacement="auto"
          options={weaponTypeOptions}
          placeholder="W-Filter"
          styles={{
            control: (base, state) => ({
              ...base,
              width: `${300 * sizeValue}px`,
              height: `${100 * sizeValue}px`,
              backgroundColor: "#cccccc",
            }),
            menu: (base) => ({
              ...base,
              zIndex: 9999,
              backgroundColor: "#666666",
            }),
            option: (base) => ({
              ...base,
              transform: `translateX(-${10 * sizeValue}px)`,
              color: "#ffffff",
              backgroundColor: "#666666",
            }),
          }}
          onChange={(item) => {
            setWeaponFilter(item.value);
          }}
        />
        <div className="empty-select-dropdown" />
        <Select
          className="element-select-dropdown"
          menuPlacement="auto"
          options={elementOptions}
          placeholder="E-Filter"
          styles={{
            control: (base, state) => ({
              ...base,
              width: `${300 * sizeValue}px`,
              height: `${100 * sizeValue}px`,
              backgroundColor: "#cccccc",
            }),
            menu: (base) => ({
              ...base,
              zIndex: 9999,
              backgroundColor: "#666666",
            }),
            option: (base) => ({
              ...base,
              transform: `translateX(-${10 * sizeValue}px)`,
              color: "#ffffff",
              backgroundColor: "#666666",
            }),
          }}
          onChange={(item) => {
            setElementFilter(item.value);
          }}
        />
        <div className="empty-select-dropdown" />
        <Select
          className="character-select-dropdown"
          menuPlacement="auto"
          options={characterOptions}
          placeholder="Character Option"
          styles={{
            control: (base, state) => ({
              ...base,
              width: `${400 * sizeValue}px`,
              height: `${100 * sizeValue}px`,
            }),
            menu: (base) => ({
              ...base,
              zIndex: 9999,
            }),
            option: (base) => ({
              ...base,
            }),
          }}
          onChange={(item) => {
            setCharacterId(item.value);
          }}
        />
        <div className="empty-select-dropdown" />
        <Select
          className="weapon-select-dropdown"
          menuPlacement="auto"
          options={weaponOptions}
          placeholder="Weapon Option"
          styles={{
            control: (base, state) => ({
              ...base,
              width: `${400 * sizeValue}px`,
              height: `${100 * sizeValue}px`,
            }),
            menu: (base) => ({
              ...base,
              zIndex: 9999,
            }),
            option: (base) => ({
              ...base,
            }),
          }}
          onChange={(item) => {
            setWeaponId(item.value);
          }}
        />
      </div>
      <div
        className="profile-card-slot"
        ref={ProfileCardSlotRef}
        style={{ backgroundImage: `url("/asdf2.jpg")` }}>
        {/* //$ Character Image */}
        <div
          className="profile-card-character-view profile-slot"
          style={{
            ...setSlotStyle({ w: 650, h: 800, x: 20, y: 20 }),
            boxShadow: "5px 5px 0px rgba(0,0,0,1)",
            borderTopLeftRadius: `calc(40px * ${sizeValue})`,
            overflow: "hidden",
          }}>
          <ImageDrag
            path={
              characterId
                ? `${apiUrl}/static/character/${characterId}/stand.png`
                : ""
            }
            sizeValue={sizeValue}
          />
        </div>
        {/* //$ Character Info */}
        <div
          className="profile-card-character-info"
          style={{
            ...setSlotStyle({ w: 650, h: 120, x: 20, y: 820 }),
          }}>
          {/* //$ Left */}
          <span
            className={`profile-card-text ${lang}Font`}
            style={{
              bottom: `calc(70px * ${sizeValue})`,
              left: `calc(15px * ${sizeValue})`,
              color: "#ffffff",
              fontSize: `calc(24px * ${sizeValue})`,
            }}>
            Asia
          </span>
          <span
            className={`profile-card-text ${lang}Font`}
            style={{
              bottom: `calc(40px * ${sizeValue})`,
              left: `calc(15px * ${sizeValue})`,
              color: "#ffffff",
              fontSize: `calc(24px * ${sizeValue})`,
            }}>
            Lv.79 SSeries
          </span>
          <span
            className={`profile-card-text ${lang}Font`}
            style={{
              bottom: `calc(10px * ${sizeValue})`,
              left: `calc(15px * ${sizeValue})`,
              color: "#ffffff",
              fontSize: `calc(24px * ${sizeValue})`,
            }}>
            uid. 812 345 678
          </span>
          {/* Right */}
          <img
            alt=""
            className="profile-card-icon"
            src={`${apiUrl}/static/ico/element/${characterData?.element?.toLowerCase()}.png`}
            style={setSlotStyle({ w: 50, h: 50, x: 470, y: 10 })}
            onError={(e) => {
              e.currentTarget.onerror = null;
              e.currentTarget.src = "/default.webp";
            }}
          />
          <img
            alt=""
            className="profile-card-icon"
            src={`${apiUrl}/static/ico/stats/atk.webp`}
            style={setSlotStyle({ w: 40, h: 40, x: 520, y: 15 })}
            onError={(e) => {
              e.currentTarget.onerror = null;
              e.currentTarget.src = "/default.webp";
            }}
          />
          <img
            alt=""
            className="profile-card-icon"
            src={`${apiUrl}/static/ico/stats/${characterData?.type}Bns.webp`}
            style={setSlotStyle({ w: 40, h: 40, x: 565, y: 15 })}
            onError={(e) => {
              e.currentTarget.onerror = null;
              e.currentTarget.src = "/default.webp";
            }}
          />
          <img
            alt=""
            className="profile-card-icon"
            src={`${apiUrl}/static/ico/weapon_type/${characterData?.weapon}.webp`}
            style={setSlotStyle({ w: 40, h: 40, x: 610, y: 15 })}
            onError={(e) => {
              e.currentTarget.onerror = null;
              e.currentTarget.src = "/default.webp";
            }}
          />
          <span
            className={`profile-card-text ${lang}Font`}
            style={{
              bottom: `calc(10px * ${sizeValue})`,
              right: "0px",
              color: "#ffffff",
              fontSize: `calc(46px * ${sizeValue})`,
            }}>
            {lang === "en"
              ? capitalizeFirst(characterData?.id) ?? ""
              : characterData?.[lang] ?? ""}
          </span>
        </div>
        {/* //$ Weapon Icon */}
        <div
          style={{
            ...setSlotStyle({ w: 140, h: 140, x: 710, y: 20 }),
            backgroundColor: "#969696",
            border: `calc(5px * ${sizeValue}) solid #323232`,
            zIndex: 250,
          }}>
          <img
            alt=""
            className="profile-card-icon"
            src={
              characterData && weaponData
                ? `${apiUrl}/static/weapon/${characterData.weapon}/${weaponData.imgKey}.png`
                : null
            }
          />
          <Select
            options={W_ConstellationOption}
            onChange={(item) => {
              profileData.constellation = item.value;
              setInitKey((prev) => !prev);
            }}
            styles={{
              control: (base) => ({
                ...base,
                ...setSlotStyle({ w: 150, h: 40, x: 30, y: -57.5 }),
                transform: `scale(${sizeValue})`,
              }),
              option: (base) => ({
                ...base,
                width: `${130 * sizeValue}px`,
                fontSize: `${20 * sizeValue}px`,
              }),
              valueContainer: (base) => ({
                ...base,
                width: `${130 * sizeValue}px`,
                height: "100%",
                fontSize: `${36 * sizeValue}px`,
              }),
              input: (base) => ({
                ...base,
                fontSize: `${20 * sizeValue}px`,
              }),
              singleValue: (base) => ({
                ...base,
                fontSize: `${36 * sizeValue}px`,
              }),
              indicatorsContainer: (base) => ({
                ...base,
                padding: 0,
                width: `${30 * sizeValue}px`,
                height: `100%`,
              }),
              dropdownIndicator: (base) => ({
                ...base,
                padding: 0,
                fontSize: `${30 * sizeValue}px`,
                svg: {
                  width: `${30 * sizeValue}px`,
                  height: `${30 * sizeValue}px`,
                },
              }),
            }}
          />
        </div>
        {/* //$ Weapon Info */}
        <div
          className="profile-card-weapon profile-slot"
          style={{
            ...setSlotStyle({ w: 600, h: 140, x: 700, y: 70 }),
          }}>
          {/* //$ Weapon Name */}
          <span
            className={`profile-card-text ${lang}Font`}
            style={{
              color: "#ffffff",
              ref: { WeaponNameTextRef },
              fontSize: `calc(44px * ${sizeValue})`,
              alignContent: "center",
              top: `${5 * sizeValue}px`,
              left: `${175 * sizeValue}px`,
              width: `${420 * sizeValue}px`,
              height: `${60 * sizeValue}px`,
            }}>
              {console.log(lang)}
              {console.log(weaponId)}
            {characterData && weaponId
              ? weapon[characterData.weapon].find(
                (item) => item.id === weaponId)?.[lang == "en" ? "id" : lang] ?? ""
              : "error"}
          </span>
          {/* //$ Weapon Sub Stat */}
          <img
            alt=""
            className="profile-card-icon"
            src={`${apiUrl}/static/ico/stats/atk.webp`}
            style={{
              ...setSlotStyle({ w: 55, h: 55, x: 175, y: 75 }),
            }}
          />
          <span
            className={`profile-card-text ${lang}Font`}
            style={{
              color: "#ffffff",
              ref: { WeaponNameTextRef },
              fontSize: `calc(40px * ${sizeValue})`,
              textAlign: "right",
              alignContent: "center",
              ...setSlotStyle({ w: 170, h: 60, x: 165, y: 75 }),
            }}>
            {weaponStats?.atk ?? ""}
          </span>
          {/* //$ Weapon Main Stat */}
          <img
            alt=""
            className="profile-card-icon"
            src={`${apiUrl}/static/ico/stats/${weaponStats?.statType[0]}.webp`}
            style={{
              ...setSlotStyle({ w: 55, h: 55, x: 385, y: 75 }),
            }}
            onError={(e) => {
              e.currentTarget.onerror = null;
              e.currentTarget.src = "/default.webp";
            }}
          />
          <span
            className={`profile-card-text ${lang}Font`}
            style={{
              color: "#ffffff",
              ref: { WeaponNameTextRef },
              fontSize: `calc(40px * ${sizeValue})`,
              textAlign: "right",
              alignContent: "center",
              ...setSlotStyle({ w: 195, h: 60, x: 380, y: 75 }),
            }}>
            {weaponStats?.value?.[0].toFixed(1) ?? ""}%
          </span>
        </div>
        {/* //$ Character Stats */}
        <div
          className="profile-card-stats profile-slot"
          style={{
            ...setSlotStyle({ w: 600, h: 710, x: 700, y: 210 }),
            backgroundColor: "#00000033",
          }}>
          {statId.map((item, idx) => (
            <StatSlot
              key={idx}
              styles={[
                setSlotStyle({ w: 570, h: 50, x: 15, y: 15 + idx * 70 }),
                setSlotStyle({ w: 422.5, h: 50, x: 65, y: 2.5 }),
                setSlotStyle({ w: 80, h: 35, x: 482.5, y: 16 }),
              ]}
              imgPath={`${apiUrl}/static/ico/stats/${statId[idx]}.webp`}
              textValue={[
                FixedStats[statId[idx]]?.[lang] ?? "",
                `${
                  typeof finalStats?.[statId[idx] ?? ""] === "number"
                    ? finalStats[statId[idx]].toFixed(idx > 2 ? 1 : 0)
                    : finalStats?.[statId[idx] ?? ""]
                }${idx > 2 ? "%" : ""}`,
                `${finalStats?.[`${statId[idx]}Delta` ?? ""]}${
                  idx > 2 ? "%" : ""
                }`,
              ]}
              fontSize={[`${30 * sizeValue}px`, `${17.5 * sizeValue}px`]}
            />
          ))}
          {/* //$ Character Harmony */}
          <div
            className=""
            style={{
              ...setSlotStyle({ w: 570, h: 45, x: 15, y: 575 }),
              display: "flex",
              gap: `${10 * sizeValue}px`,
              flexDirection: "row",
              alignContent: "center",
              justifyContent: "center",
            }}>
            {profileData.harmony === null ? null : (
              <div
                style={{
                  display: "flex",
                  width: "fit-content",
                  height: "100%",
                  padding: "0px 0.75%",
                  backgroundColor: "#ffffff33",
                }}>
                <img
                  alt=""
                  src={`${apiUrl}/static/ico/harmony/${profileData.harmony}.webp`}
                  style={{
                    display: "flex",
                    width: `${37.5 * sizeValue}px`,
                    height: `${37.5 * sizeValue}px`,
                    padding: `${(7.5 / 2) * sizeValue}px`,
                  }}
                />
                <div style={{ width: `${10 * sizeValue}px` }} />
                <span
                  style={{
                    display: "flex",
                    width: "fit-content",
                    height: `${45 * sizeValue}px`,
                    alignItems: "center",
                    justifyContent: "center",
                    fontSize: `${28 * sizeValue}px`,
                    transform: `translateY(-${3 * sizeValue}px)`,
                    color: "#ffffff",
                    textAlign: "center",
                    whiteSpace: "nowrap",
                  }}>
                  {`${harmony[profileData.harmony]?.[lang]}`}
                </span>
                <div style={{ width: `${10 * sizeValue}px` }} />
              </div>
            )}
          </div>
          {/* //$ Character Score */}
          <div
            style={{
              display: "flex",
              flexDirection: "row",
              ...setSlotStyle({ w: 600, h: 50, y: 635 }),
            }}>
            {profileData.statScore.map((item, idx) => (
              <div className="stat-score-slot" key={idx}>
                <span
                  className="stat-score-text title"
                  style={{ fontSize: `${42 * sizeValue}px` }}>
                  {idx === 0 ? "AV." : "CV."}
                </span>
                <span
                  className="stat-score-text value"
                  style={{ fontSize: `${36 * sizeValue}px` }}>
                  12
                  {profileData.statScore[idx]}
                  .3pt
                </span>
              </div>
            ))}
          </div>
        </div>
        <div
          className="profile-card-total-info profile-slot"
          style={{
            ...setSlotStyle({ w: 800, h: 215, x: 1320, y: 70 }),
          }}>
          <img
            alt=""
            src={`/default.webp`}
            style={{
              ...setSlotStyle({ w: 230, h: 140, x: 10, y: 10 }),
              objectFit: "contain",
              objectPosition: "center",
              backgroundColor: "#00000066",
            }}
          />
          <span
            style={{
              ...setSlotStyle({ w: 230, h: 50, x: 10, y: 155 }),
              color: "#fff",
              textAlign: "center",
              fontSize: `${36 * sizeValue}px`,
            }}>
            Av. 567.8pt
          </span>
          <div
            style={{
              position: "relative",
              alignContent: "center",
              justifyContent: "center",
              overflow: "hidden",
              ...setSlotStyle({ w: 540, h: 195, x: 250, y: 10 }),
              backgroundColor: "#00000033",
            }}>
            <ImageDrag path={""} sizeValue={sizeValue} />
          </div>
        </div>
        <span
          style={{
            display: "flex",
            ...setSlotStyle({ w: 800, h: 50, x: 1320, y: 20 }),
            color: "#ffffff",
            fontSize: `${30 * sizeValue}px`,
            alignContent: "flex-end",
            justifyContent: "flex-end",
          }}>
          wwaves.dev/profile
        </span>
        {profileData.echoData.map((item, idx) => (
          <div
            key={idx}
            className="profile-card-echo-slot profile-slot"
            style={{
              ...setSlotStyle({ w: 148, h: 620, x: 1320 + 163 * idx, y: 300 }),
            }}>
            <EchoSlot
              echoData={profileData.echoData[idx]}
              sizeValue={sizeValue}
            />
          </div>
        ))}
        <div className=""
        style={{
          ...setSlotStyle(echoSlotBorderPos),
          border: "1px solid #ffffff",
          backgroundColor: "#ffffff33"
        }}/>
      </div>
      <div className="profile-ocr-slot">
        <div
          className="ocr-select-slot"
          style={{
            ...setSlotStyle({ w: 550, h: 816, x: 20, y: 20 }),
            backgroundColor: "#00000033",
          }}>
          <span
            className="ocr-text title"
            style={{
              ...setSlotStyle({ w: 500, h: 70, x: 0, y: 16 }),
              fontSize: `${56 * sizeValue}px`,
              alignContent: "center",
              textAlign: "center",
            }}>
            Echo Data
          </span>
          {echoList.map((item, idx) => {
            return (
              <div
                className="ocr-select"
                key={idx}
                style={{
                  ...setSlotStyle({
                    w: 550,
                    h: 120,
                    x: 0,
                    y: 100 + idx * 150,
                  }),
                  backgroundColor: "#00000033",
                }}>
                <div
                  className="ocr-react-select-slot"
                  style={{
                    ...setSlotStyle({ w: 300, h: 80, x: 15, y: 20 }),
                  }}>
                  <Select
                    className="ocr-cost-select"
                    options={[
                      { value: 4, label: "4Cost" },
                      { value: 3, label: "3Cost" },
                      { value: 1, label: "1Cost" },
                    ]}
                    defaultValue={{
                      value: idx === 0 ? 4 : idx < 3 ? 3 : 1,
                      label: `${idx === 0 ? 4 : idx < 3 ? 3 : 1}Cost`,
                    }}
                    styles={{
                      container: (base) => ({
                        ...base,
                        height: "100%",
                      }),
                      control: (base) => ({
                        ...base,
                        height: "100%",
                        minHeight: "unset",
                      }),
                      valueContainer: (base) => ({
                        ...base,
                        height: "100%",
                      }),
                      input: (base) => ({
                        ...base,
                        margin: 0,
                        padding: 0,
                      }),
                      indicatorsContainer: (base) => ({
                        ...base,
                        height: "100%",
                      }),
                    }}
                  />
                </div>
                <button
                  className="ocr-react-select-btn"
                  style={{
                    ...setSlotStyle({ w: 180, h: 80, x: 350, y: 20 }),
                    backgroundColor: `${
                      idx === selectedEchoIdx ? "#99ccff" : "#fff"
                    }`,
                  }}
                  onClick={() => {
                    setSelectedEchoIdx(idx);
                  }}>
                  {" "}
                  Select{" "}
                </button>
              </div>
            );
          })}
        </div>

        <AnimatePresence mode="wait">
          {echoList.map((echoData, idx) =>
            selectedEchoIdx === idx ? (
              <motion.div
                key={idx}
                initial={{ opacity: 0, scale: 0.95 }}
                animate={{ opacity: 1, scale: 1 }}
                exit={{ opacity: 0, scale: 0.95 }}
                transition={{ duration: 0.2 }}
                style={{
                  position: "absolute",
                  width: "100%",
                  height: "100%",
                  pointerEvents: "none",
                }}>
                <div
                  className="ocr-input-slot ocr"
                  style={{
                    ...setSlotStyle({ w: 900, h: 816, x: 590, y: 20 }),
                    backgroundColor: "#00000033",
                  }}>
                  <div
                    style={{
                      ...setSlotStyle({ w: 850 - 2, h: 616 - 2, x: 25, y: 25 }),
                      backgroundColor: "#00000033",
                      border: "1px dashed #fff",
                    }}>
                    <ImageDrag inputable={true} sizeValue={sizeValue} />
                  </div>
                </div>
                <div
                  className="ocr-input-slot dropdown"
                  style={{
                    ...setSlotStyle({ w: 600, h: 816, x: 1510, y: 20 }),
                    backgroundColor: "#00000033",
                  }}>
                  <div
                    style={{
                      ...setSlotStyle({ w: 600 - 2, h: 816 - 2, y: 0 }),
                      backgroundColor: "#00000033",
                    }}>
                    <EchoStatDrop
                      index = {idx}
                      sizeValue = {sizeValue}
                    />
                  </div>
                </div>
              </motion.div>
            ) : null
          )}
        </AnimatePresence>
      </div>
    </div>
  );
  return { setSlotStyle };
}
export default ProfileCard;


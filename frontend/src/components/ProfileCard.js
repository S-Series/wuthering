// basic
import "./ProfileCard.css";
import { useRef, useState, useEffect, useLayoutEffect, useMemo } from "react";
import Select, { components } from "react-select";
// data
import { character, characterStat } from "../data/Character";
import { weapon, weaponStat } from "../data/Weapon";
import { FixedStats } from "../data/Stats";
import { profileData, userdata } from "../data/userData";
import { echoDict, harmony } from "../data/Echo";
// hooks
import { useProfile } from "../hooks/useProfile";
// utils
import ImageDrag from "../utils/ImageDrag";
// others
import StatSlot from "./CardComp/StatSlot";
import EchoSlot from "./CardComp/EchoSlot";

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

  const [filterWeapon, setFilterWeapon] = useState(null);
  const [filterElement, setFilterElement] = useState(null);

  const statId = [
    FixedStats.hp.id,
    FixedStats.atk.id,
    FixedStats.def.id,
    FixedStats.ResonanceBns.id,
    FixedStats.CritRate.id,
    FixedStats.CritDmg.id,
    FixedStats.normalBns,
    FixedStats.HavocBns,
  ];

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
  const setSlotStyle = ({ w = null, h = null, x = 0, y = 0 }) => {
    return {
      position: "absolute",
      width: `${w === null ? "100%" : `calc(${w}px * ${sizeValue})`}`,
      height: `${h === null ? "100%" : `calc(${h}px * ${sizeValue})`}`,
      top: `calc(${y}px * ${sizeValue})`,
      left: `calc(${x}px * ${sizeValue})`,
    };
  };
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
    {kr: null, en: null, jp: null, zh: null},
    {kr: "직검", en: "sword", jp: "", zh: ""},
    {kr: "대검", en: "broadblade", jp: "", zh: ""},
    {kr: "권총", en: "pistol", jp: "", zh: ""},
    {kr: "권갑", en: "gauntlet", jp: "", zh: ""},
    {kr: "증폭기", en: "rectifier", jp: "", zh: ""},
  ];
  const [weaponFilter, setWeaponFilter] = useState(null);
  const weaponOptions = useMemo(() => {
    const list = weaponFilter
      ? weaponTypes.filter((e) => e.en === weaponFilter)
      : weaponTypes;

    return list.map((e) => ({
      value: e.en,
      label: (
        <div
          style={{
            display: "flex",
            alignItems: "center",
            gap: `${10 * sizeValue}px`,
          }}>
          <img
            src={`${apiUrl}/static/ico/weapon_type/${e.en}.webp`}
            style={{
              width: `${75 * sizeValue}px`,
              height: `${75 * sizeValue}px`,
            }}
            onError={(e) => {
              e.currentTarget.onerror = null;
            }}
          />
          <span style={{ fontSize: `${32 * sizeValue}px` }}>
            {e[lang] ?? "All"}
          </span>
        </div>
      )
    }))
  })

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
    const list = elementFilter
      ? elements.filter((e) => e.en === elementFilter)
      : elements;

    return list.map((e) => ({
      value: e.en,
      label: (
        <div
          style={{
            display: "flex",
            alignItems: "center",
            gap: `${10 * sizeValue}px`,
          }}>
          <img
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
          <span style={{ fontSize: `${32 * sizeValue}px` }}>
            {e[lang] ?? "All"}
          </span>
        </div>
      )
    }));
  }, [elementFilter, lang])

  function getCharacterOptions() {
    const filterList =
      filterWeapon === null
        ? character
        : character[filterWeapon].filter(
            (c) => filterElement === null || c.element === filterElement
          );

    return filterList.map((c) => ({
      label: (
        <div
          style={{
            display: "flex",
            alignItems: "center",
            gap: `${10 * sizeValue}px`,
          }}>
          <img
            src={`${apiUrl}/static/character/${c.id}/ico.webp`}
            style={{
              width: `${50 * sizeValue}px`,
              height: `${50 * sizeValue}px`,
            }}
          />
          <span style={{ fontSize: `${24 * sizeValue}px` }}>
            {c[lang === "en" || lang === null ? "id" : lang]}
          </span>
        </div>
      ),
      value: c.id,
      weapon: c.weapon,
      type: c.type,
      element: c.element,
    }));
  }
  function getWeaponOptionsByType(type) {
    const list = weapon[type] || [];

    return list.map((item) => ({
      value: item.id,
      label: (
        <div style={{ display: "flex", alignItems: "center", gap: 8 }}>
          <img
            src={`${apiUrl}/static/weapon/${type}/${item.imgKey}.png`}
            alt={item.kr}
            style={{
              width: `${60 * sizeValue}px`,
              height: `${60 * sizeValue}px`,
            }}
          />
          <span>{item.kr}</span>
        </div>
      ),
      id: item.id,
      en: item.id,
      kr: item.kr,
      jp: item.jp,
      zh: item.zh,
      imgKey: item.imgKey,
    }));
  }
  //#endregion

  return (
    <div className="profile-portrait">
      <div className="profile-select-slot">
        <Select
          className="weapon-select-dropdown"
          menuPlacement="auto"
          options={weaponOptions}
          placeholder="W-Filter"
          styles={{
            control: (base, state) => ({
              ...base,
              width: `${300 * sizeValue}px`,
              height: `${100 * sizeValue}px`,
              backgroundColor: "#cccccc"
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
          onChange={(item) => {}}
        />
        <div className="empty-select-dropdown" />
        <Select
          className="element-select-dropdown"
          menuPlacement="auto"
          options={ elementOptions}
          placeholder="E-Filter"
          styles={{
            control: (base, state) => ({
              ...base,
              width: `${300 * sizeValue}px`,
              height: `${100 * sizeValue}px`,
              backgroundColor: "#cccccc"
            }),
            menu: (base) => ({
              ...base,
              zIndex: 9999,
              backgroundColor: "#666666"
            }),
            option: (base) => ({
              ...base,
              transform: `translateX(-${10 * sizeValue}px)`,
              color: "#ffffff",
              backgroundColor: "#666666"
            }),
          }}
          onChange={(item) => {}}
        />
        <div className="empty-select-dropdown" />
        <Select
          className="character-select-dropdown"
          menuPlacement="auto"
          options={getCharacterOptions()}
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
          options={
            characterData ? getWeaponOptionsByType(characterData.weapon) : []
          }
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
          {/* //$ Right */}
          <img
            className="profile-card-icon"
            src={`${apiUrl}/static/ico/element/${characterData?.element?.toLowerCase()}.png`}
            style={setSlotStyle({ w: 50, h: 50, x: 470, y: 10 })}
            onError={(e) => {
              e.currentTarget.onerror = null;
              e.currentTarget.src = "/default.webp";
            }}
          />
          <img
            className="profile-card-icon"
            src={`${apiUrl}/static/ico/stats/atk.webp`}
            style={setSlotStyle({ w: 40, h: 40, x: 520, y: 15 })}
            onError={(e) => {
              e.currentTarget.onerror = null;
              e.currentTarget.src = "/default.webp";
            }}
          />
          <img
            className="profile-card-icon"
            src={`${apiUrl}/static/ico/stats/${characterData?.type}Bns.webp`}
            style={setSlotStyle({ w: 40, h: 40, x: 565, y: 15 })}
            onError={(e) => {
              e.currentTarget.onerror = null;
              e.currentTarget.src = "/default.webp";
            }}
          />
          <img
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
            className="profile-card-icon"
            src={
              characterData && weaponData
                ? `${apiUrl}/static/weapon/${characterData.weapon}/${weaponData.imgKey}.png`
                : ""
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
            {characterData && weaponId
              ? weapon[characterData.weapon].find((w) => w.id === weaponId)?.[
                  lang ?? "en"
                ] ?? ""
              : ""}
          </span>
          {/* //$ Weapon Sub Stat */}
          <img
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
              fontSize: `calc(36px * ${sizeValue})`,
              textAlign: "right",
              alignContent: "center",
              ...setSlotStyle({ w: 170, h: 60, x: 175, y: 75 }),
            }}>
            {weaponStats?.atk ?? ""}
          </span>
          {/* //$ Weapon Main Stat */}
          <img
            className="profile-card-icon"
            src={`${apiUrl}/static/ico/stats/CritRate.webp`}
            style={{
              ...setSlotStyle({ w: 55, h: 55, x: 385, y: 75 }),
            }}
          />
          <span
            className={`profile-card-text ${lang}Font`}
            style={{
              color: "#ffffff",
              ref: { WeaponNameTextRef },
              fontSize: `calc(36px * ${sizeValue})`,
              textAlign: "right",
              alignContent: "center",
              ...setSlotStyle({ w: 195, h: 60, x: 375, y: 75 }),
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
                setSlotStyle({ w: 430, h: 50, x: 65, y: 0 }),
              ]}
              imgPath={`${apiUrl}/static/ico/stats/${statId[idx]}.webp`}
              textValue={[
                `${FixedStats[statId[idx]]?.[lang]}`,
                finalStats?.[statId[idx] ?? ""],
              ]}
              fontSize={`${32 * sizeValue}px`}
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
      </div>
    </div>
  );
}
export default ProfileCard;

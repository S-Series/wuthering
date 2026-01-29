// basic
import "./ProfileCard.css";
import {
  useRef,
  useState,
  useEffect,
  useLayoutEffect,
  useMemo,
} from "react";
import Select, { components } from "react-select";
import { motion, AnimatePresence, color } from "framer-motion";
// data
import { character, characterStat } from "../data/Characters";
import { weapon, weaponStat } from "../data/Weapons";
import { profileData, userdata } from "../data/userData";
import { echoDict, harmony } from "../data/Echos";
// hooks
import { useUserData } from "../hooks/useUserData";
import { useProfile } from "../hooks/useProfile";
import { useStyleHelper } from "../hooks/useStyleHelpers";
import { useFirebase } from "../hooks/useFirebase";
// utils
import ImageDrag from "../utils/ImageDrag";
import { MakeStatData, MakeImageData } from "../hooks/MakeData";
// others
import StatSlot from "./CardComp/StatSlot";
import EchoSlot from "./CardComp/EchoSlot";
import EchoStatDrop from "./EchoStatDrop";
import OcrRequest from "../utils/OcrRequest";

function ProfileCard() {
  //#region Refs
  const ProfileCardSlotRef = useRef(null);
  const WeaponNameTextRef = useRef(null);

  const CopyrightInputfield = [
    useRef(null),
    useRef(null),
    useRef(null),
    useRef(null),
  ];
  //#endregion

  //#region Variables
  const { userData } = useUserData();
  const { currentUser } = useFirebase();
  const assetApiUrl = process.env.REACT_APP_ASSET_API_URL;
  const scoreSheetUrl = "https://docs.google.com/spreadsheets/d/169EqXJatZIMqL0MPbHF6Eg9DgLFcaxjE6hG03gYZ-_U/edit?gid=1750559029#gid=1750559029";

  const UI_COLOR = [
    "#333366ff",
    "#0b0b44ff",
    "#0b0b44ff",
    "#666699ff",
    "#0b0b88ff",
  ];
  const BUTTON_POS = [
    { w: 85, h: 80, x: 576.25, y: 524 },
    { w: 70, h: 90, x: 501.25, y: 598.25 },
    { w: 70, h: 100, x: 410, y: 657.5 },
    { w: 70, h: 110, x: 313.75, y: 701.25 },
    { w: 70, h: 115, x: 210, y: 725.25 },
    { w: 70, h: 115, x: 103.75, y: 732.5 },
  ];
  const UI_TEXT = {
    kr: [
      "ⓘ 도움말",
      "이미지 생성 요청",
      "이미지 다운로드",
      "명함 이미지 초기화",
      "캐릭터 이미지 초기화",
      "모든 에코 데이터 초기화",
      "에코 점수표",
    ],
    en: [
      "ⓘ Help",
      "Request Image Generation",
      "Download Image",
      "Reset Profile Image",
      "Reset Character Image",
      "Reset All Echo Data",
      "Echo Scoreboard",
    ],
    jp: [
      "ⓘ ヘルプ",
      "画像生成をリクエスト",
      "画像をダウンロード",
      "名刺画像をリセット",
      "キャラクター画像をリセット",
      "すべてのエコーデータをリセット",
      "エコースコア表",
    ],
    zh: [
      "ⓘ 帮助",
      "请求生成图片",
      "下载图片",
      "功能即将上线",
      "重置名片图片",
      "重置角色图片",
      "重置所有回响数据",
      "回响得分表",
    ],
  };

  const {
    lang,
    constellation,
    setConstellation,
    //$ Image Data
    mainImage,
    subImage,
    mainImageTrans,
    subImageTrans,
    mainImageCopyright,
    subImageCopyright,
    imageCopyrightText,
    PatchImageCopyright,
    //$ character
    characterId,
    setCharacterId,
    characterData,
    characterStats,
    //$ weapon
    weaponId,
    setWeaponId,
    weaponData,
    weaponStats,
    //$ echo
    echoList,
    echoScore,
    PatchEchoCost,
    //$ others
    statId,
    finalStats,
    harmonyOption,
  } = useProfile();

  const [sizeValue, setSizeValue] = useState(1.0);

  const [selectedEchoIdx, setSelectedEchoIdx] = useState(0);
  const echoSlotBorderPos = useMemo(() => {
    return {
      w: 148 + 10,
      h: 620 + 10,
      x: 1320 + 163 * selectedEchoIdx - 5 - 2,
      y: 300 - 5 - 2,
    };
  }, [selectedEchoIdx]);

  const W_ConstellationList = [
    { value: 0, label: "C1" },
    { value: 1, label: "C2" },
    { value: 2, label: "C3" },
    { value: 3, label: "C4" },
    { value: 4, label: "C5" },
  ];
  const W_ConstellationOption = W_ConstellationList.map((item) => ({
    value: item.value,
    label: (
      <span
        className={`${lang}Font`}
        style={{
          fontSize: `${24 * sizeValue}px`,
          alignSelf: "flex-end",
          color: "#fff",
        }}>
        {item.label}
      </span>
    ),
  }));
  //#endregion

  //#region Functions
  const getStringInfo = (lang, idx) => {
    const strings = {
      kr: [
        "무기 분류",
        "화음",
        "* 모든 조건부 능력치는 적용되지 않습니다",
        "* 캐릭터와 무기 90레벨, 모든 노드 개방 기준",
      ],
      jp: [
        "武器分類",
        "ハーモニー",
        "* すべての条件付きステータスは適用されません",
        "* キャラクターと武器はLv90、全ノード解放基準",
      ],
      zh: [
        "武器分类",
        "合鳴",
        "* 所有条件属性不适用",
        "* 基于角色与武器90级，所有节点解锁",
      ],
      en: [
        "Equipment",
        "Sonata",
        "* All conditional stats are not applied",
        "* Based on Lv90 character and weapon, all nodes unlocked",
      ],
    };
    return strings[lang][idx] || strings["en"][idx];
  };
  const { setSlotStyle } = useStyleHelper(sizeValue);
  function capitalizeFirst(str) {
    if (!str) return "";
    return str[0].toUpperCase() + str.slice(1).toLowerCase();
  }

  const handleResize = () => {
    const w = ProfileCardSlotRef.current.offsetWidth;
    setSizeValue(w / 2140);
  };
  //#endregion

  //#region Initialize
  //$ OnLoad
  useEffect(() => {
    function handleResize() {
      const w = ProfileCardSlotRef.current.offsetWidth;
      const h = ProfileCardSlotRef.current.offsetHeight;
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
    setSizeValue(width / 2140);
  }, []);
  //#endregion

  //#region OnChange Action
  //#endregion

  //#region React Select Options
  const WEAPON_TYPES = [
    { value: "sword", kr: "직검", en: "sword", jp: "", zh: "" },
    { value: "broadblade", kr: "대검", en: "broadblade", jp: "", zh: "" },
    { value: "pistol", kr: "권총", en: "pistol", jp: "", zh: "" },
    { value: "gauntlet", kr: "권갑", en: "gauntlet", jp: "", zh: "" },
    { value: "rectifier", kr: "증폭기", en: "rectifier", jp: "", zh: "" },
  ];
  const [weaponFilter, setWeaponFilter] = useState([]);

  const ELEMENT_TYPES = [
    { value: "aero", kr: "기류", en: "Aero", jp: "", zh: "" },
    { value: "fusion", kr: "융용", en: "Fusion", jp: "", zh: "" },
    { value: "electro", kr: "전도", en: "Electro", jp: "", zh: "" },
    { value: "glacio", kr: "응결", en: "Glacio", jp: "", zh: "" },
    { value: "spectro", kr: "회절", en: "Spectro", jp: "", zh: "" },
    { value: "havoc", kr: "인멸", en: "Havoc", jp: "", zh: "" },
  ];
  const [elementFilter, setElementFilter] = useState([]);

  const CHARACTER_ALL = Object.values(character).map((item) => ({
    value: item.id,
    weapon: item.weapon,
    element: item.element?.toLowerCase(),
    label: (
      <div
        style={{
          display: "flex",
          alignItems: "center",
          justifyContent: "flex-start",
          gap: `${25 * sizeValue}px`,
        }}>
        <img
          alt=""
          src={`${assetApiUrl}/character/${item.id}/ico.webp`}
          style={{
            width: `${75 * sizeValue}px`,
            height: `${75 * sizeValue}px`,
            alignSelf: "center",
          }}
        />
        <span
          className={`${lang}Font`}
          style={{ fontSize: `${32 * sizeValue}px`, color: "#fff" }}>
          {`${item[lang === "en" ? "id" : lang ?? "Character"] || { Set }}`}
        </span>
      </div>
    ),
  }));
  const characterOption = useMemo(() => {
    const temp =
      !weaponFilter || weaponFilter.length === 0
        ? CHARACTER_ALL
        : CHARACTER_ALL.filter((item) => weaponFilter.includes(item.weapon));

    return !elementFilter || elementFilter.length === 0
      ? temp
      : temp.filter((item) => elementFilter.includes(item.element));
  }, [sizeValue, weaponFilter, elementFilter]);

  const weaponOption = useMemo(() => {
    return Object.values(weapon[characterData?.weapon || "sword"]).map(
      (item) => ({
        value: item.id,
        label: (
          <div
            style={{
              display: "flex",
              alignItems: "center",
              gap: `${15 * sizeValue}px`,
            }}>
            <img
              alt=""
              src={`${assetApiUrl}/weapon/${characterData?.weapon}/${item.imgKey}.png`}
              style={{
                width: `${75 * sizeValue}px`,
                height: `${75 * sizeValue}px`,
                overflow: "visible",
              }}
            />
            <span
              className={`${lang}Font`}
              style={{ fontSize: `${32 * sizeValue}px`, color: "#fff" }}>
              {`${item[lang === "en" ? "id" : lang ?? "Character"] || { Set }}`}
            </span>
          </div>
        ),
      })
    );
  }, [sizeValue, characterData]);

  const namecardOption = useMemo(() => {
    return Array.from({ length: 52 }, (_, idx) => ({
      value: `${assetApiUrl}/namecard/T_Card${idx + 1}.png`,
      label: (
        <div
          style={{
            display: "flex",
            alignItems: "center",
            gap: `${15 * sizeValue}px`,
          }}>
          <img
            alt=""
            src={`${assetApiUrl}/namecard/T_Card${idx + 1}.png`}
            style={{
              width: `${230 * sizeValue}px`,
              height: `${102 * sizeValue}px`,
              overflow: "visible",
            }}
          />
          <span
            className={`${lang}Font`}
            style={{
              display: "flex",
              width: "auto",
              whiteSpace: "nowrap",
              justifySelf: "flex-end",
              textAlign: "right",
            }}>{`Namecard ${idx + 1}`}</span>
        </div>
      ),
    }));
  }, [sizeValue])

  //#endregion

  const [namecardInputable, setNamecardInputable] = useState(false);
  const [generatedImage, setGeneratedImage] = useState("./asdf2.jpg");

  return (
    <div key={lang} className="profile-portrait">
      {/*
       */}
      <button
        onClick={async () => {
          try {
            const imageFile = mainImage;
            const subFile = subImage;

            const dataA = {
              lang,
              constellation,
              characterData,
              weaponData,
              weaponStats,
              echoList,
              echoScore,
              statId,
              finalStats,
              harmonyOption,
              userData,
            };
            const dataB = {
              mainImageTrans,
              subImageTrans,
              mainImageCopyright,
              subImageCopyright,
            };
            const statData = MakeStatData(dataA);
            const imageData = MakeImageData(dataB);
            console.log(statData);
            console.log(imageData);

            const formData = new FormData();
            if (imageFile) formData.append("image_character", imageFile);
            if (subFile) formData.append("image_sub", subFile);
            formData.append("stat_data", JSON.stringify(statData));
            formData.append("image_data", JSON.stringify(imageData));

            const response = await fetch(
              "http://127.0.0.1:8000/generate_card",
              {
                method: "POST",
                body: formData,
              }
            );

            const blob = await response.blob();
            const imageUrl = URL.createObjectURL(blob);
            setGeneratedImage(imageUrl);
          } catch (error) {
            console.error("❌ 요청 실패:", error);
          }
        }}
      >
        test
      </button>
      <img src={generatedImage} />
      {/*
       */}
      <div className="profile-filter-slot">
        {Object.values(WEAPON_TYPES).map((item, idx) => (
          <button
            style={{
              ...setSlotStyle({ w: 70, h: 70, x: 50 + 90 * idx, y: 50 }),
              background: weaponFilter.includes(item.value)
                ? `linear-gradient(330deg, ${UI_COLOR[3]} 0%, ${UI_COLOR[4]} 100%)`
                : `linear-gradient(330deg, ${UI_COLOR[0]} 0%, ${UI_COLOR[1]} 100%)`,
              opacity: weaponFilter.includes(item.value) ? 1 : 0.25,
            }}
            onClick={() => {
              setWeaponFilter((prev) => {
                return prev.includes(item.value)
                  ? prev.filter((v) => v !== item.value)
                  : [...prev, item.value];
              });
            }}
          >
            <img
              alt=""
              style={{
                ...setSlotStyle({ w: 63, h: 63, x: 0, y: 0 }),
                filter: `drop-shadow(0 0px ${15 * sizeValue}px #ffffffcc)`,
              }}
              src={`${assetApiUrl}/ico/weapon_type/${item.value}.webp`}
            />
          </button>
        ))}
        {Object.values(ELEMENT_TYPES).map((item, idx) => (
          <button
            style={{
              ...setSlotStyle({ w: 70, h: 70, x: 500 + 90 * idx, y: 50 }),
              background: elementFilter.includes(item.value)
                ? `linear-gradient(330deg, ${UI_COLOR[3]} 0%, ${UI_COLOR[4]} 100%)`
                : `linear-gradient(330deg, ${UI_COLOR[0]} 0%, ${UI_COLOR[1]} 100%)`,
              opacity: elementFilter.includes(item.value) ? 1 : 0.25,
            }}
            onClick={() => {
              setElementFilter((prev) => {
                return prev.includes(item.value)
                  ? prev.filter((v) => v !== item.value)
                  : [...prev, item.value];
              });
            }}
          >
            <img
              alt=""
              style={{
                ...setSlotStyle({ w: 63, h: 63, x: 0, y: 0 }),
                filter: `drop-shadow(0 0px ${15 * sizeValue}px #ffffffcc)`,
              }}
              src={`${assetApiUrl}/ico/element/${item.value}.png`}
            />
          </button>
        ))}
        <button
          style={{
            ...setSlotStyle({ w: 160, h: 70, x: 1040, y: 50 }),
            background: `linear-gradient(330deg, ${UI_COLOR[0]} 0%, ${UI_COLOR[1]} 100%)`,
          }}
          onClick={() => {
            setWeaponFilter([]);
            setElementFilter([]);
          }}
        >
          <span
            className={`${lang}Font`}
            style={{
              fontWeight: "100",
              fontSize: `${30 * sizeValue}px`,
              color: "#fff",
            }}
          >
            Reset
          </span>
        </button>
      </div>
      <div className="profile-select-slot">
        <div className="empty-select-dropdown" />
        <div>
          <Select
            className="character-select-dropdown"
            menuPlacement="auto"
            options={characterOption}
            placeholder={
              <div
                style={{
                  display: "flex",
                  alignItems: "center",
                  gap: `${25 * sizeValue}px`,
                }}
              >
                <img
                  alt=""
                  src={`${assetApiUrl}/character/${characterData?.id}/ico.webp`}
                  style={{
                    width: `${75 * sizeValue}px`,
                    height: `${75 * sizeValue}px`,
                    overflow: "visible",
                  }}
                />
                <span
                  className={`${lang}Font`}
                  style={{ fontSize: `${32 * sizeValue}px` }}
                >
                  {`${
                    characterData?.[
                      lang === "en" ? "id" : lang ?? "Character"
                    ] || { Set }
                  }`}
                </span>
              </div>
            }
            styles={{
              control: (base, state) => ({
                ...base,
                width: `${450 * sizeValue}px`,
                height: `${100 * sizeValue}px`,
                overflow: "visible",
                background: `linear-gradient(330deg, ${UI_COLOR[0]} 0%, ${UI_COLOR[1]} 100%)`,
              }),
              menu: (base) => ({
                ...base,
                zIndex: 9999,
              }),
              option: (base) => ({
                ...base,
                height: `${100 * sizeValue}px`,
                background: `linear-gradient(330deg, ${UI_COLOR[0]} 0%, ${UI_COLOR[1]} 100%)`,
              }),
              menuList: (prev) => ({
                ...prev,
                backgroundColor: UI_COLOR[2],
                borderRadius: "4px",
              }),
              valueContainer: (base) => ({
                ...base,
                height: "100%",
              }),
              singleValue: (base) => ({
                ...base,
                overflow: "visible",
                display: "flex",
                alignItems: "center",
                gap: 8,
              }),
            }}
            onChange={(item) => {
              setCharacterId(item.value);
            }}
          />
        </div>
        <div className="empty-select-dropdown" />
        <div>
          <Select
            className="weapon-select-dropdown"
            menuPlacement="auto"
            options={weaponOption}
            placeholder={
              <div
                style={{
                  display: "flex",
                  alignItems: "center",
                  gap: `${20 * sizeValue}px`,
                }}
              >
                <img
                  alt=""
                  src={
                    `
                    ${assetApiUrl}/weapon/${characterData?.weapon}/${weaponData?.imgKey}.png` ||
                    "default.webp"
                  }
                  style={{
                    width: `${75 * sizeValue}px`,
                    height: `${75 * sizeValue}px`,
                    overflow: "visible",
                  }}
                />
                <span
                  className={`${lang}Font`}
                  style={{
                    fontSize: `${28 * sizeValue}px`,
                    whiteSpace: "pre-wrap",
                  }}
                >
                  {characterData && weaponId
                    ? weapon[characterData.weapon].find(
                        (item) => item.id === weaponId
                      )?.[lang === "en" ? "id" : lang] ?? ""
                    : "error"}
                </span>
              </div>
            }
            styles={{
              control: (base, state) => ({
                ...base,
                width: `${550 * sizeValue}px`,
                height: `${100 * sizeValue}px`,
                background: `linear-gradient(330deg, ${UI_COLOR[0]} 0%, ${UI_COLOR[1]} 100%)`,
              }),
              menu: (base) => ({
                ...base,
                zIndex: 9999,
              }),
              menuList: (prev) => ({
                ...prev,
                backgroundColor: UI_COLOR[2],
                borderRadius: "4px",
              }),
              option: (base) => ({
                ...base,
                background: `linear-gradient(330deg, ${UI_COLOR[0]} 0%, ${UI_COLOR[1]} 100%)`,
              }),
              valueContainer: (base) => ({
                ...base,
                height: "100%",
                textOverflow: "clip",
              }),
              singleValue: (base) => ({
                ...base,
                overflow: "visible",
                display: "flex",
                alignItems: "center",
                textOverflow: "ellipsis",
              }),
            }}
            onChange={(item) => {
              setWeaponId(item.value);
            }}
          />
        </div>
        <div className="empty-select-dropdown" />
        <div>
          <Select
            options={namecardOption}
            styles={{
              control: (base, state) => ({
                ...base,
                width: `${350 * sizeValue}px`,
                height: `${100 * sizeValue}px`,
                overflow: "visible",
                background: `linear-gradient(330deg, ${UI_COLOR[0]} 0%, ${UI_COLOR[1]} 100%)`,
              }),
              menu: (base) => ({
                ...base,
                zIndex: 9999,
              }),
              option: (base) => ({
                ...base,
                height: `${135 * sizeValue}px`,
                background: `linear-gradient(330deg, ${UI_COLOR[0]} 0%, ${UI_COLOR[1]} 100%)`,
              }),
              menuList: (prev) => ({
                ...prev,
                backgroundColor: UI_COLOR[2],
                borderRadius: "4px",
                width: "fit-content",
                minWidth: "100%",
                maxWidth: "200%",
                color: "#fff",
              }),
              valueContainer: (base) => ({
                ...base,
                height: "100%",
                color: "#fff",
              }),
              singleValue: (base) => ({
                ...base,
                overflow: "visible",
                display: "flex",
                alignItems: "center",
                gap: 8,
                color: "#fff",
              }),
            }}
          />
        </div>
      </div>
      {/* //$ Card Top Info Field */}
      <div className="profile-data-slot">
        <button className="profile-image-request-button top" disabled={true}>
          <span className={`${lang}Font`}>{UI_TEXT[lang][0] ?? "error"}</span>
        </button>
        <button className="profile-image-request-button top" disabled={true}>
          <span className={`${lang}Font`}>{UI_TEXT[lang][1] ?? "error"}</span>
        </button>
        <button className="profile-image-request-button top" disabled={true}>
          <span className={`${lang}Font`}>{UI_TEXT[lang][2] ?? "error"}</span>
        </button>
        <button
          className="profile-image-request-button top end"
          onClick={() => {
            CopyrightInputfield[0].current.value = "Kuro Games";
            PatchImageCopyright(false, false, "Kuro Games");
            CopyrightInputfield[1].current.value = "2024";
            PatchImageCopyright(false, true, "2024");
          }}
        >
          <span className={`${lang}Font`}>{UI_TEXT[lang][3] ?? "error"}</span>
        </button>
        <div
          className="profile-image-request-slot top end"
          style={{ marginLeft: `${25 * sizeValue}px` }}
        >
          <span className="enFont">&nbsp; © &nbsp;</span>
          <input
            className="white-square-input"
            ref={CopyrightInputfield[0]}
            style={{
              display: "flex",
              width: `${350 * sizeValue}px`,
              height: `${50 * sizeValue}px`,
            }}
            defaultValue="Kuro Games"
            onChange={(e) => {
              console.log(typeof e.target.value, e.target.value);
              PatchImageCopyright(false, false, e.target.value);
            }}
          />
          &nbsp;&nbsp;
          <input
            className="white-square-input"
            ref={CopyrightInputfield[1]}
            type="number"
            inputMode="numeric"
            pattern="[0-9]*"
            style={{
              display: "flex",
              width: `${125 * sizeValue}px`,
              height: `${50 * sizeValue}px`,
            }}
            defaultValue="2024"
            onChange={(e) => {
              PatchImageCopyright(false, true, e.target.value);
            }}
          />
          &nbsp;&nbsp;
        </div>
      </div>
      {/* //$ Profile Card */}
      <div
        className="profile-card-slot"
        ref={ProfileCardSlotRef}
        style={{ backgroundImage: `url("/asdf2.jpg")` }}
      >
        <div className={`${lang}Font profile-alert-text`}>
          <span
            style={{
              ...setSlotStyle({ w: 1100 - 25, h: 80, x: 1000, y: -180 }),
              fontSize: `${28 * sizeValue}px`,
            }}
          >
            {`${getStringInfo(lang, 2)}\n${getStringInfo(lang, 3)}`}
          </span>
        </div>
        {/* //$ Character Image */}
        <div
          className="profile-card-character-view profile-slot"
          style={{
            ...setSlotStyle({ w: 650 - 2, h: 800 - 2, x: 20, y: 20 }),
            border: "1px solid #666666",
            boxShadow: "5px 5px 0px rgba(0,0,0,1)",
            borderTopLeftRadius: `calc(40px * ${sizeValue})`,
            overflow: "hidden",
            backgroundPosition: "center center",
          }}
        >
          <img
            alt=""
            src={`${assetApiUrl}/character/${characterId}/art.png`}
            style={{
              position: "absolute",
              top: "50%",
              left: "50%",
              transform: "translate(-50%, -50%)",
              height: "104%",
              width: "auto",
              filter: "brightness(0.75)",
            }}
          />
          <ImageDrag
            isMain={true}
            inputable={true}
            path={
              characterId
                ? `${assetApiUrl}/character/${characterId}/stand.png`
                : ""
            }
            sizeValue={sizeValue}
            onClick={handleResize}
          />
        </div>
        {/* //$ Character Constellation */}
        <div className="profile-card-character-constellation profile-slot">
          <img
            alt=""
            src={`./ui/CharacterC${constellation[0]}.png`}
            style={{
              ...setSlotStyle({ w: 650, h: 800, x: 20, y: 20 }),
            }}
          />
          <button
            style={{
              ...setSlotStyle({ w: 100, h: 30, x: 560, y: 35 }),
              pointerEvents: "auto",
              display: "flex",
              alignItems: "center",
              justifyContent: "center",
              visibility: constellation[0] !== 0 ? "visible" : "hidden",
            }}
            onClick={() => setConstellation((prev) => [0, prev[1]])}
          >
            <span
              className={`enFont`}
              style={{
                fontSize: `${20 * sizeValue}px`,
                whiteSpace: "nowrap",
              }}
            >
              Reset C0
            </span>
          </button>
          {BUTTON_POS.map((item, idx) => (
            <div>
              <button
                className="constel-btn"
                style={{
                  ...setSlotStyle(item),
                  opacity: 0,
                  backgroundColor: "#ffffff01",
                  pointerEvents: "auto",
                  transform: "translate(-50%, -50%)",
                }}
                onClick={() => setConstellation((prev) => [idx + 1, prev[1]])}
              />
              <img
                alt=""
                src={`${assetApiUrl}/character/${characterId}/C${idx + 1}.png`}
                style={
                  idx + 1 > constellation[0]
                    ? {
                        ...setSlotStyle({ ...item, w: 30, h: 30 }),
                        opacity: 0.5,
                        transform: "translate(-50%, -50%)",
                      }
                    : {
                        ...setSlotStyle({ ...item, w: 45, h: 45 }),
                        opacity: 1,
                        transform: "translate(-50%, -50%)",
                      }
                }
              />
            </div>
          ))}
        </div>
        {/* //$ Character Info */}
        <div
          className="profile-card-character-info"
          style={{
            ...setSlotStyle({ w: 650, h: 120, x: 20, y: 820 }),
          }}
        >
          {/* //$ Left */}
          <span
            className={`profile-card-text enFont`}
            style={{
              bottom: `calc(70px * ${sizeValue})`,
              left: `calc(15px * ${sizeValue})`,
              color: "#ffffff",
              fontSize: `calc(24px * ${sizeValue})`,
            }}
          >
            {userData?.gameServer ?? "Guest Server"}
          </span>
          <span
            className={`profile-card-text enFont`}
            style={{
              bottom: `calc(40px * ${sizeValue})`,
              left: `calc(15px * ${sizeValue})`,
              color: "#ffffff",
              fontSize: `calc(24px * ${sizeValue})`,
            }}
          >
            {`Lv.${userData?.gameLevel ?? "--"} ${currentUser?.displayName}`}
          </span>
          <span
            className={`profile-card-text enFont`}
            style={{
              color: "#ffffff",
              bottom: `calc(10px * ${sizeValue})`,
              left: `calc(15px * ${sizeValue})`,
              fontSize: `calc(24px * ${sizeValue})`,
            }}
          >
            {`Uid. ${userData?.gameUid ?? "--- --- ---"}`}
          </span>
          {/* //$ Right */}
          <img
            alt=""
            className="profile-card-icon"
            src={`${assetApiUrl}/ico/element/${characterData?.element?.toLowerCase()}.png`}
            style={setSlotStyle({ w: 50, h: 50, x: 470, y: 10 })}
            onError={(e) => {
              e.currentTarget.onerror = null;
              e.currentTarget.src = "/default.webp";
            }}
          />
          <img
            alt=""
            className="profile-card-icon"
            src={`${assetApiUrl}/ico/stats/atk.webp`}
            style={setSlotStyle({ w: 40, h: 40, x: 520, y: 15 })}
            onError={(e) => {
              e.currentTarget.onerror = null;
              e.currentTarget.src = "/default.webp";
            }}
          />
          <img
            alt=""
            className="profile-card-icon"
            src={`${assetApiUrl}/ico/stats/${characterData?.type}Bns.webp`}
            style={setSlotStyle({ w: 40, h: 40, x: 565, y: 15 })}
            onError={(e) => {
              e.currentTarget.onerror = null;
              e.currentTarget.src = "/default.webp";
            }}
          />
          <img
            alt=""
            className="profile-card-icon"
            src={`${assetApiUrl}/ico/weapon_type/${characterData?.weapon}.webp`}
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
            }}
          >
            {lang === "en"
              ? capitalizeFirst(characterData?.id) ?? ""
              : characterData?.[lang] ?? ""}
          </span>
          <span
            className="profile-card-text enFont"
            style={{
              ...setSlotStyle({ w: 645, h: 20, x: 0, y: -23 }),
              textAlign: "end",
              color: "#ffffff99",
              fontSize: `calc(18px * ${sizeValue})`,
            }}
          >
            {imageCopyrightText[0]}
          </span>
        </div>
        {/* //$ Weapon Icon */}
        <div
          style={{
            ...setSlotStyle({ w: 140, h: 140, x: 710, y: 20 }),
            background: `linear-gradient(210deg, ${UI_COLOR[0]} 0%, ${UI_COLOR[1]} 100%)`,
            border: `calc(5px * ${sizeValue}) solid #323232`,
            zIndex: 250,
          }}
        >
          <img
            alt=""
            className="profile-card-icon"
            src={
              characterData && weaponData
                ? `${assetApiUrl}/weapon/${characterData.weapon}/${weaponData.imgKey}.png`
                : null
            }
          />
          <Select
            options={W_ConstellationOption}
            onChange={(item) => {
              setConstellation((prev) => [prev[0], item.value]);
            }}
            value={{
              value: 0,
              label: (
                <span
                  className={`${lang}Font`}
                  style={{
                    fontSize: `${24 * sizeValue}px`,
                    alignSelf: "flex-end",
                    justifySelf: "center",
                    color: "#fff",
                  }}
                >
                  C{constellation[1] + 1}
                </span>
              ),
            }}
            styles={{
              container: (b) => ({
                ...b,
                width: `calc(130px * ${sizeValue})`,
                top: "0%",
                left: "50%",
                transform: "translate(-50%, 15%)",
              }),
              control: (b, s) => ({
                ...b,
                minHeight: 10,
                height: `${36 * sizeValue}px`,
                border: "none",
                borderRadius: 0,
                background: `linear-gradient(330deg, ${UI_COLOR[0]} 0%, ${UI_COLOR[1]} 100%)`,
              }),
              valueContainer: (b) => ({
                ...b,
                padding: 0,
                paddingLeft: `${10 * sizeValue}px`,
                transform: "translate(0%, -6%)",
              }),
              input: (b) => ({
                ...b,
                margin: 0,
                padding: 0,
              }),
              indicatorsContainer: (b) => ({
                ...b,
                height: `${36 * sizeValue}px`,
                aspectRatio: "1/1",
              }),
              dropdownIndicator: (b) => ({
                ...b,
                padding: 0,
              }),
              clearIndicator: (b) => ({
                ...b,
                padding: 2,
              }),
              menu: (b) => ({
                ...b,
                marginTop: 4,
                width: "max-content",
                minWidth: "100%",
              }),
              menuList: (b) => ({
                ...b,
                paddingTop: 0,
                paddingBottom: 0,
                maxHeight: 240,
              }),
              option: (b, s) => ({
                ...b,
                fontSize: 12,
                minHeight: 24,
                padding: "4px 8px",
                background: `linear-gradient(330deg, ${UI_COLOR[0]} 0%, ${UI_COLOR[1]} 100%)`,
              }),
              singleValue: (b) => ({ ...b, fontSize: 12 }),
              placeholder: (b) => ({ ...b, fontSize: 12 }),
            }}
          />
        </div>
        {/* //$ Weapon Info */}
        <div
          className="profile-card-weapon profile-slot"
          style={{
            ...setSlotStyle({ w: 600, h: 140, x: 700, y: 70 }),
          }}
        >
          {/* //$ Weapon Name */}
          <span
            className={`profile-card-text ${lang}Font`}
            style={{
              color: "#ffffff",
              ref: { WeaponNameTextRef },
              fontSize: `${36 * sizeValue}px`,
              alignContent: "center",
              top: `${10 * sizeValue}px`,
              left: `${175 * sizeValue}px`,
              width: `${420 * sizeValue}px`,
              height: `${60 * sizeValue}px`,
            }}
          >
            {characterData && weaponId
              ? weapon[characterData.weapon].find(
                  (item) => item.id === weaponId
                )?.[lang === "en" ? "id" : lang] ?? ""
              : "error"}
          </span>
          {/* //$ Weapon Sub Stat */}
          <img
            alt=""
            className="profile-card-icon"
            src={`${assetApiUrl}/ico/stats/atk.webp`}
            style={{
              ...setSlotStyle({ w: 50, h: 50, x: 170, y: 78 }),
            }}
          />
          <span
            className={`profile-card-text numFont`}
            style={{
              color: "#ffffff",
              ref: { WeaponNameTextRef },
              fontSize: `${46 * sizeValue}px`,
              textAlign: "right",
              alignContent: "center",
              ...setSlotStyle({ w: 170, h: 60, x: 165, y: 75 }),
            }}
          >
            {weaponStats?.atk ?? ""}
          </span>
          {/* //$ Weapon Main Stat */}
          <img
            alt=""
            className="profile-card-icon"
            src={`${assetApiUrl}/ico/stats/${weaponStats?.statType[0]}.webp`}
            style={{
              ...setSlotStyle({ w: 53, h: 53, x: 375, y: 77 }),
            }}
            onError={(e) => {
              e.currentTarget.onerror = null;
              e.currentTarget.src = "/default.webp";
            }}
          />
          <span
            className={`profile-card-text numFont`}
            style={{
              color: "#ffffff",
              ref: { WeaponNameTextRef },
              fontSize: `${46 * sizeValue}px`,
              textAlign: "right",
              alignContent: "center",
              ...setSlotStyle({ w: 195, h: 60, x: 380, y: 75 }),
            }}
          >
            {weaponStats?.value?.[0].toFixed(1) ?? ""}%
          </span>
        </div>
        {/* //$ Character Stats */}
        <div
          className="profile-card-stats profile-slot"
          style={{
            ...setSlotStyle({ w: 600, h: 710, x: 700, y: 210 }),
            backgroundColor: "#00000033",
          }}
        >
          {statId.map((item, idx) => (
            <StatSlot
              key={idx}
              styles={[
                setSlotStyle({ w: 570, h: 45, x: 15, y: 20 + idx * 70 }),
                setSlotStyle({ w: 435, h: 45, x: 60, y: 0 }),
                setSlotStyle({ w: 70, h: 40, x: 495, y: 10 }),
              ]}
              imgPath={`${assetApiUrl}/ico/stats/${item}.webp`}
              statId={statId[idx]}
              fontSize={[`${30 * sizeValue}px`, `${18 * sizeValue}px`]}
            />
          ))}
          {/* //$ Character Harmony */}
          <div
            className=""
            style={{
              ...setSlotStyle({ w: 570 - 4, h: 45, x: 15 + 2, y: 580 }),
              display: "flex",
              gap: `${10 * sizeValue}px`,
              flexDirection: "row",
              alignContent: "center",
              justifyContent: "center",
              //backgroundColor: "#ff000033",
            }}
          >
            {profileData.harmony === null ? null : (
              <div
                style={{
                  display: "flex",
                  gap: `${20 * sizeValue}px`,
                }}
              >
                <div
                  style={{
                    display: "flex",
                    width: "fit-content",
                    maxWidth: `${275 * sizeValue - 4}px`,
                    height: "100%",
                    padding: `0 ${2 * sizeValue}px`,
                    backgroundColor: "#ffffff33",
                  }}
                >
                  <div style={{ width: `${2 * sizeValue}px` }} />
                  <img
                    alt=""
                    src={`${assetApiUrl}/ico/harmony/${profileData.harmony}.webp`}
                    style={{
                      display: "flex",
                      alignSelf: "center",
                      justifySelf: "center",
                      width: `${35 * sizeValue}px`,
                      height: `${35 * sizeValue}px`,
                      padding: `${5 * sizeValue}px`,
                    }}
                  />
                  <div style={{ width: `${8 * sizeValue}px` }} />
                  <span
                    className={`${lang}Font`}
                    style={{
                      display: "flex",
                      width: "fit-content",
                      height: `${45 * sizeValue}px`,
                      alignItems: "center",
                      justifyContent: "flex-end",
                      fontSize: `${28 * sizeValue}px`,
                      color: "#ffffff",
                      overflow: "hidden",
                      whiteSpace: "nowrap",
                      textOverflow: "ellipsis",
                    }}
                  >
                    {`${harmony[profileData.harmony]?.[lang]} [5]`}
                  </span>
                  <div style={{ width: `${10 * sizeValue}px` }} />
                </div>
                <div
                  style={{
                    display: "flex",
                    width: "fit-content",
                    maxWidth: `${275 * sizeValue}px`,
                    height: "100%",
                    padding: `0 ${2 * sizeValue}px`,
                    backgroundColor: "#ffffff33",
                  }}
                >
                  <div style={{ width: `${2 * sizeValue}px` }} />
                  <img
                    alt=""
                    src={`${assetApiUrl}/ico/harmony/${profileData.harmony}.webp`}
                    style={{
                      display: "flex",
                      alignSelf: "center",
                      justifySelf: "center",
                      width: `${35 * sizeValue}px`,
                      height: `${35 * sizeValue}px`,
                      padding: `${5 * sizeValue}px`,
                    }}
                  />
                  <div style={{ width: `${8 * sizeValue}px` }} />
                  <span
                    className={`${lang}Font`}
                    style={{
                      display: "flex",
                      width: "fit-content",
                      height: `${45 * sizeValue}px`,
                      alignItems: "center",
                      justifyContent: "flex-end",
                      fontSize: `${28 * sizeValue}px`,
                      color: "#ffffff",
                      overflow: "hidden",
                      whiteSpace: "nowrap",
                      textOverflow: "ellipsis",
                    }}
                  >
                    {`${harmony[profileData.harmony]?.[lang]} [5]`}
                  </span>
                  <div style={{ width: `${10 * sizeValue}px` }} />
                </div>
              </div>
            )}
          </div>
          {/* //$ Character Score */}
          <div
            style={{
              ...setSlotStyle({ w: 540, h: 50, x: 30, y: 645 }),
              display: "flex",
              flexDirection: "row",
            }}
          >
            {[0, 1].map((item) => (
              <div className="stat-score-slot" key={item}>
                <span
                  className="stat-score-text title numFont"
                  style={{ fontSize: `${36 * sizeValue}px` }}
                >
                  {item === 0 ? "Cv." : "Av."}
                </span>
                <span
                  className="stat-score-text value numFont"
                  style={{ fontSize: `${36 * sizeValue}px` }}
                >
                  {echoScore
                    .reduce((acc, cur) => acc + cur[item], 0)
                    .toFixed(1)}
                  pt
                </span>
              </div>
            ))}
          </div>
        </div>
        <div
          className="profile-card-total-info profile-slot"
          style={{
            ...setSlotStyle({ w: 800, h: 215, x: 1320, y: 70 }),
          }}
        >
          <img
            alt=""
            src={`/ico/rank/${Math.min(
              4,
              Math.max(
                0,
                Math.floor(
                  (echoScore.reduce((acc, cur) => acc + cur[1], 0).toFixed(1) -
                    150) /
                    50
                ) + 1
              )
            )}.png`}
            style={{
              ...setSlotStyle({ w: 262, h: 156, x: -16, y: 12 }),
              objectFit: "contain",
              objectPosition: "center",
            }}
          />
          <img
            alt=""
            src="/link.png"
            style={{
              ...setSlotStyle({ w: 20, h: 20, x: 570, y: -31 }),
            }}
          />
          <div
            style={{
              ...setSlotStyle({ w: 120, h: 2, x: 594, y: -10 }),
              backgroundColor: "#ffffff66",
            }}
          />
          <span
            className="enFont"
            style={{
              ...setSlotStyle({ w: 230, h: 50, x: 0, y: 165 }),
              display: "flex",
              alignItems: "center",
              justifyContent: "center",
              color: "#fff",
              textAlign: "center",
              fontSize: `${36 * sizeValue}px`,
            }}
          >
            {`Av. ${echoScore
              .reduce((acc, cur) => acc + cur[1], 0)
              .toFixed(1)}pt`}
          </span>
          <div
            style={{
              position: "relative",
              alignContent: "center",
              justifyContent: "center",
              overflow: "hidden",
              ...setSlotStyle({ w: 560, h: 195, x: 230, y: 10 }),
              backgroundColor: "#00000033",
            }}
          >
            <ImageDrag
              isMain={false}
              inputable={true}
              sizeValue={sizeValue}
              onClick={handleResize}
            />
          </div>
          <span
            className={`profile-card-text enFont`}
            style={{
              ...setSlotStyle({ w: 540 - 3, h: 20, x: 250, y: 185 }),
              textAlign: "end",
              color: "#ffffff99",
              fontSize: `calc(15px * ${sizeValue})`,
            }}
          >
            {imageCopyrightText[1]}
          </span>
        </div>
        <span
          className="enFont"
          style={{
            ...setSlotStyle({ w: 800, h: 50, x: 1325, y: 25 }),
            display: "flex",
            color: "#ffffff99",
            fontSize: `${25 * sizeValue}px`,
            alignItems: "center",
            justifyContent: "flex-start",
          }}
        >
          Unofficial Fan Project: All assets © Kuro Games
        </span>
        <span
          className="enFont"
          style={{
            ...setSlotStyle({ w: 800, h: 50, x: 1320, y: -4 }),
            display: "flex",
            color: "#ffffff99",
            fontSize: `${19.8 * sizeValue}px`,
            alignItems: "center",
            justifyContent: "flex-end",
          }}
        >
          powered by. SSeries
        </span>
        <span
          className="enFont"
          style={{
            ...setSlotStyle({ w: 800, h: 50, x: 1320, y: 25 }),
            display: "flex",
            color: "#ffffff99",
            fontSize: `${25 * sizeValue}px`,
            alignItems: "center",
            justifyContent: "flex-end",
          }}
        >
          WuWa.dev © 2025
        </span>
        {echoList.map((item, idx) => (
          <div
            key={idx}
            className="profile-card-echo-slot profile-slot"
            style={{
              ...setSlotStyle({ w: 148, h: 620, x: 1320 + 163 * idx, y: 300 }),
            }}
          >
            <EchoSlot index={idx} sizeValue={sizeValue} />
          </div>
        ))}
        <div
          className=""
          style={{
            ...setSlotStyle(echoSlotBorderPos),
            border: "1px solid #ffffff",
            backgroundColor: "#ffffff33",
          }}
        />
      </div>
      {/* //$ Card Bottom Info Field */}
      <div className="profile-data-slot">
        <button className="profile-image-request-button bottom">
          <span className={`${lang}Font`}>{UI_TEXT[lang][4] ?? "error"}</span>
        </button>
        <div className="profile-image-request-slot bottom">
          <span className="enFont">&nbsp; © &nbsp;</span>
          <input
            className="white-square-input"
            ref={CopyrightInputfield[2]}
            style={{
              display: "flex",
              width: `${350 * sizeValue}px`,
              height: `${50 * sizeValue}px`,
            }}
            defaultValue="Kuro Games"
            onChange={(e) => {
              PatchImageCopyright(true, false, e.target.value);
            }}
          />
          &nbsp;&nbsp;
          <input
            className="white-square-input"
            ref={CopyrightInputfield[3]}
            type="number"
            inputMode="numeric"
            pattern="[0-9]*"
            style={{
              display: "flex",
              width: `${125 * sizeValue}px`,
              height: `${50 * sizeValue}px`,
            }}
            defaultValue="2024"
            onChange={(e) => {
              PatchImageCopyright(true, true, e.target.value);
            }}
          />
          &nbsp;&nbsp;
        </div>
        <button className="profile-image-request-button bottom end">
          <span className={`${lang}Font`}>{UI_TEXT[lang][5] ?? "error"}</span>
        </button>
        <button
          className="profile-image-request-button bottom end"
          style={{ marginLeft: `${25 * sizeValue}px` }}
          onClick={() => window.open(scoreSheetUrl, "_blank")}
        >
          <span className={`${lang}Font`}>{UI_TEXT[lang][6] ?? "error"}</span>
        </button>
      </div>
      {/* //$ OCR Slot */}
      <div className="profile-ocr-slot">
        <div
          className="ocr-select-slot"
          style={{
            ...setSlotStyle({ w: 550, h: 816, x: 20, y: 20 }),
            backgroundColor: "#00000033",
          }}
        >
          <span
            className="ocr-text title"
            style={{
              ...setSlotStyle({ w: 500, h: 70, x: 0, y: 16 }),
              fontSize: `${56 * sizeValue}px`,
              alignContent: "center",
              textAlign: "center",
            }}
          >
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
                }}
              >
                <div
                  className="ocr-react-select-slot"
                  style={{
                    ...setSlotStyle({ w: 300, h: 80, x: 15, y: 20 }),
                  }}
                >
                  <Select
                    className="ocr-cost-select"
                    value={{
                      value: echoList[idx].cost,
                      label: `${echoList[idx].cost}Cost`,
                    }}
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
                    onChange={(item) => {
                      PatchEchoCost(idx, item.value);
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
                  }}
                >
                  <span className={`${lang}Font`}>Select</span>
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
                }}
              >
                <div
                  className="ocr-input-slot ocr"
                  style={{
                    ...setSlotStyle({ w: 900, h: 816, x: 590, y: 20 }),
                    backgroundColor: "#00000033",
                  }}
                >
                  <div
                    style={{
                      ...setSlotStyle({ w: 900, h: 816, x: 0, y: 0 }),
                      backgroundColor: "#00000033",
                      pointerEvents: "auto",
                    }}
                  >
                    <OcrRequest
                      sizeValue={sizeValue}
                      index={idx}
                      isDebug={true}
                    />
                  </div>
                </div>
                <div
                  className="ocr-input-slot dropdown"
                  style={{
                    ...setSlotStyle({ w: 600, h: 816, x: 1510, y: 20 }),
                    backgroundColor: "#00000033",
                  }}
                >
                  <div
                    style={{
                      ...setSlotStyle({ w: 600 - 2, h: 816 - 2, y: 0 }),
                      backgroundColor: "#00000033",
                    }}
                  >
                    <EchoStatDrop index={idx} sizeValue={sizeValue} />
                  </div>
                </div>
              </motion.div>
            ) : null
          )}
        </AnimatePresence>
      </div>
      <div style={{ height: `${1500 * sizeValue}px` }} />
    </div>
  );
}
export default ProfileCard;

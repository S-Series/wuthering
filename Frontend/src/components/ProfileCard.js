import "./ProfileCard.css";

import { useState, useEffect } from "react";
import Select from "react-select";

import OCRGrid from "./OcrGrid";
import CharacterStat from "./CharacterStat";
import FittedText from "./FittedText";

import { character as characterList } from "../Datas/Character";
import {
  weapon as weaponList,
  weaponStat as weaponStats,
} from "../Datas/Weapon";

function ProfileCard() {
  const [selectedCharacter, setSelectedCharacter] = useState(null);
  const [selectedWeapon, setWeapon] = useState(null);
  const [selectedWeaponC, setWeaponC] = useState(null);
  const [selectedWeaponStat, setWeaponStat] = useState(null);
  const lang = localStorage.getItem("lang") || "kr";

  const getStringInfo = (lang) => {
    const strings = {
      kr: [
        "캐릭터 선택",
        "무기 선택",
        "* 모든 조건부 스텟은 적용되지 않습니다",
      ],
      jp: ["キャラ選択", "武器選択", "* 条件付きステータスは適用されません"],
      zh: ["角色选择", "武器选择", "* 所有条件属性不会被应用"],
      en: [
        "Select Character",
        "Select Weapon",
        "* Conditional stats are not applied",
      ],
    };
    return strings[lang] || strings["en"];
  };

  // 문자열 label + 이미지 경로 저장
  const characterOptions = characterList.map((c) => ({
    value: c.id,
    label: lang === "en" ? c.id : c[lang] || c.id,
    img: `/character/${c.id}/ico.webp`,
  }));
  const weaponOptions = (weaponList[selectedCharacter?.weapon] || []).map(
    (w) => ({
      value: w.id,
      label: lang === "en" ? w.id : w[lang] || w.id,
      img: `/weapon/${selectedCharacter?.weapon}/${w.imgKey}.png`,
    })
  );
  const weaponOptionsC = ["C1", "C2", "C3", "C4", "C5"].map((c) => ({
    value: c,
    label: c,
  }));
  const customStyles = {
    control: (base, state) => ({
      ...base,
      display: "flex",
      height: "100%",
      width: "100%",
      fontSize: "1rem",
      borderColor: state.isFocused ? "#2684FF" : "gray",
      boxShadow: state.isFocused ? "0 0 0 1px #2684FF" : "none",
    }),
    menu: (base) => ({ ...base, zIndex: 1000 }),
    option: (base, state) => ({
      ...base,
      backgroundColor: state.isFocused ? "#f0f0f0" : "white",
      color: "black",
      padding: "10px 12px",
    }),
    dropdownIndicator: (base) => ({ ...base, padding: "4px" }),
    indicatorSeparator: () => ({ display: "none" }),
  };

  return (
    <div className="profile-portrait">
      {/* Character, Weapon Select */}
      <div className="profile-dropdown-grid">
        <Select
          className="dropdown"
          options={characterOptions}
          styles={customStyles}
          getOptionLabel={(e) => (
            <div style={{ display: "flex", alignItems: "center" }}>
              <img
                src={e.img}
                alt=""
                style={{ width: "25px", height: "25px", marginRight: "8px" }}
              />
              {e.label}
            </div>
          )}
          onChange={(opt) => {
            setSelectedCharacter(characterList.find((c) => c.id === opt.value));
            setWeapon(null);
          }}
          placeholder={getStringInfo(lang)[0]}
          isSearchable={false}
        />
        <Select
          className="dropdown"
          options={weaponOptions}
          styles={customStyles}
          getOptionLabel={(e) => (
            <div style={{ display: "flex", alignItems: "center" }}>
              <img
                src={e.img}
                alt=""
                style={{ width: "25px", height: "25px", marginRight: "8px" }}
              />
              {e.label}
            </div>
          )}
          onChange={(opt) => {
            const selected = weaponList[selectedCharacter?.weapon].find(
              (w) => w.id === opt.value
            );
            setWeapon(selected);
            setWeaponStat(weaponStats.find((s) => s.id === selected.id));
          }}
          placeholder={getStringInfo(lang)[1]}
          isSearchable={false}
          isDisabled={!selectedCharacter}
        />
        <Select
          className="dropdown"
          options={weaponOptionsC}
          styles={customStyles}
          getOptionLabel={(e) => (
            <div style={{ display: "flex", alignItems: "center" }}>
              {e.label}
            </div>
          )}
          onChange={(opt) => setWeaponC(opt.value)}
        />
      </div>
      <span className="profile-stat-info">{getStringInfo(lang)[2]}</span>
      {/* Profile Card */}
      <div className="profile-card">
        {/* Character image */}
        <img
          className="profile-card-img"
          src={
            selectedCharacter?.id
              ? `./character/${selectedCharacter.id}/stand.png`
              : "./character/rover/stand.png"
          }
          alt="char"
        />
        {/* Character image */}
        <div className="profile-card-stats">
          {/* Weapon Stats */}
          <div className="profile-stats-weapon">
            <img
              className="profile-weapon-img"
              src={`/weapon/${selectedCharacter?.weapon}/${selectedWeapon?.imgKey}.png`}
              alt="weapon"
            />
            <div className="profile-weapon">
              <FittedText className="profile-weapon-name">
                {lang === "en"
                  ? selectedWeapon?.id || "NaN"
                  : selectedWeapon?.[lang] || "NaN"}
              </FittedText>
              <div className="profile-weapon-stats-container">
                <img
                  className="profile-stat-icon"
                  src="./gem.webp"
                  alt="stat"
                />
                <span className="profile-weapon-stats">{}&nbsp;&nbsp;</span>
                <img
                  className="profile-stat-icon"
                  src="./gem.webp"
                  alt="stat"
                />
                <span className="profile-weapon-stats">{}%</span>
              </div>
            </div>
          </div>
          {/* Final Stats */}
          <div className="profile-stat-grid">
            {/*{Array.from({ length: 8 }).map((_, i) => (
              <CharacterStat key={i} />
            ))}*/}
            <CharacterStat id={"hp"} value={54321} />
            <CharacterStat id={"atk"} value={1234} />
            <CharacterStat id={"def"} value={543} />
            <CharacterStat id={"ResonanceBns"} value={"123.4%"} />
            <CharacterStat id={"CritRate"} value={"78.9%"} />
            <CharacterStat id={"CritDmg"} value={"234.5%"} />
            <CharacterStat id={selectedCharacter?.element + "Bns"} value={"34.5%"} />
            <CharacterStat id={selectedCharacter?.type + "Bns"} value={"34.5%"} />
          </div>
          {/* Final Stats Score */}
          <div className="profile-stats-score-grid">
            <div className="profile-stats-score-slot"></div>
            <div className="profile-stats-score-slot"></div>
            <div className="profile-stats-score-slot"></div>
          </div>
        </div>
        {/* Equipment */}
        <div className="profile-card-equipment-grid" />
      </div>

      <OCRGrid />
    </div>
  );
}

export default ProfileCard;

import "./ProfileCard.css";

import React, { useState, useEffect } from "react";
import Select from "react-select";
import useFitText from "use-fit-text";

import OCRGrid from "./OcrGrid";
import EquipSlot from "./EquipSlot";
import CharacterStat from "./CharacterStat";

import { character as characterList, characterStat } from "../Datas/Character";
import { weapon as weaponList, weaponStat as weaponStats } from "../Datas/Weapon";
import { echoSet } from "../Datas/Echo";

function ProfileCard() {
  const [selectedCharacter, setSelectedCharacter] = useState(null);
  const [selectedCharacterC, setSelectedCharacterC] = useState(null);
  const [characterStatObj, setCharacterStat] = useState(null);

  const [selectedWeapon, setWeapon] = useState(null);
  const [selectedWeaponC, setWeaponC] = useState(null);
  const [selectedWeaponStat, setWeaponStat] = useState(null);

  const [equipmentSetIds, setEquipmentSetIds] = useState([]);

  const lang = localStorage.getItem("lang") || "kr";
  const { fontSize, ref } = useFitText();

  const getStringInfo = (lang) => {
    const strings = {
      kr: [
        "캐릭터 선택",
        "무기 선택",
        "* 캐릭터 및 무기 Lv90 기준",
        "* 모든 조건부 스텟은 적용되지 않습니다",
      ],
      jp: [
        "キャラ選択",
        "武器選択",
        "* キャラと武器はLv90基準",
        "* 条件付きステータスは適用されません",
      ],
      zh: [
        "角色选择",
        "武器选择",
        "* 角色和武器以90级为基准",
        "* 所有条件属性不会被应用",
      ],
      en: [
        "Select Character",
        "Select Weapon",
        "* Based on Lv90 character and weapon",
        "* Conditional stats are not applied",
      ],
    };
    return strings[lang] || strings["en"];
  };

  const characterOptions = characterList.map((c) => ({
    value: c.id,
    label: lang === "en" ? c.id : c[lang] || c.id,
    img: `/character/${c.id}/ico.webp`,
  }));
  const weaponOptions = (weaponList[selectedCharacter?.weapon] || []).map((w) => ({
    value: w.id,
    label: lang === "en" ? w.id : w[lang] || w.id,
    img: `/weapon/${selectedCharacter?.weapon}/${w.imgKey}.png`,
  }));
  const characterOptionsC = ["C0", "C1", "C2", "C3", "C4", "C5", "C6"].map((c) => ({
    value: c,
    label: c,
  }));
  const weaponOptionsC = ["W0", "W1", "W2", "W3", "W4", "W5"].map((w) => ({
    value: w,
    label: w,
  }));

  const customMainStyles = {
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
  const customSubStyles = { ...customMainStyles };

  return (
    <div className="profile-portrait">
      <div className="profile-dropdown-grid">
        <Select
          className="dropdown"
          options={characterOptions}
          styles={customMainStyles}
          getOptionLabel={(e) => (
            <div style={{ display: "flex", alignItems: "center" }}>
              <img src={e.img} alt="" style={{ width: "25px", height: "25px", marginRight: "8px" }} />
              {e.label}
            </div>
          )}
          onChange={(opt) => {
            const char = characterList.find((c) => c.id === opt.value);
            setSelectedCharacter(char);
            setCharacterStat(characterStat[opt.value]);
            setWeapon(null);
          }}
          placeholder={getStringInfo(lang)[0]}
          isSearchable={false}
        />
        <Select
          className="dropdown"
          options={weaponOptions}
          styles={customMainStyles}
          getOptionLabel={(e) => (
            <div style={{ display: "flex", alignItems: "center" }}>
              <img src={e.img} alt="" style={{ width: "25px", height: "25px", marginRight: "8px" }} />
              {e.label}
            </div>
          )}
          onChange={(opt) => {
            const selected = weaponList[selectedCharacter?.weapon].find((w) => w.id === opt.value);
            setWeapon(selected);
            setWeaponStat(weaponStats[selected.id]);
          }}
          placeholder={getStringInfo(lang)[1]}
          isSearchable={false}
          isDisabled={!selectedCharacter}
        />
        <Select
          className="dropdown sub"
          options={characterOptionsC}
          styles={customSubStyles}
          onChange={(opt) => setSelectedCharacterC(opt.value)}
          placeholder="C_"
        />
        <Select
          className="dropdown sub"
          options={weaponOptionsC}
          styles={customSubStyles}
          onChange={(opt) => setWeaponC(opt.value)}
          placeholder="W_"
        />
      </div>
      <span className="profile-stat-info">{getStringInfo(lang)[2]}</span>
      <span className="profile-stat-info">{getStringInfo(lang)[3]}</span>

      <div className="profile-card">
        <img
          className="profile-card-img"
          src={
            selectedCharacter?.id
              ? `./character/${selectedCharacter.id}/stand.png`
              : "./character/rover/stand.png"
          }
          alt="char"
        />

        <div className="profile-card-stats">
          <div className="profile-stats-weapon">
            <img
              className="profile-weapon-img"
              src={`/weapon/${selectedCharacter?.weapon}/${selectedWeapon?.imgKey}.png`}
              onError={(e) => (e.currentTarget.src = "/default.webp")}
            />
            <div className="profile-weapon">
              <span className="profile-weapon-name">
                &nbsp;{lang === "en" ? selectedWeapon?.id || "" : selectedWeapon?.[lang] || ""}
              </span>
              <div className="profile-weapon-stats-container">
                <img 
                  className="profile-stat-icon" 
                  src="/ico/stats/atk.webp" 
                  onError={(e) => (e.currentTarget.src = "/default.webp")} 
                />
                <span className="profile-weapon-stats">
                  {selectedWeaponStat?.atk}&nbsp;&nbsp;
                </span>
                <img 
                  className="profile-stat-icon" 
                  src={`/ico/stats/${selectedWeaponStat?.statType[0]}.webp`} 
                  onError={(e) => (e.currentTarget.src = "/default.webp")}
                />
                <span className="profile-weapon-stats">
                  {selectedWeaponStat?.value[0]?.toFixed(1)}
                  {[
                    "Pct",
                    "Bns",
                    "crit"
                  ].some((s) => selectedWeaponStat?.statType[0]?.includes(s)) ? "%" : ""}
                </span>
              </div>
            </div>
          </div>

          <div className="profile-stat-grid">
            <CharacterStat id={"hp"} value={characterStatObj?.baseHp || 0} />
            <CharacterStat id={"atk"} value={characterStatObj?.baseAtk || 0} />
            <CharacterStat id={"def"} value={characterStatObj?.baseDef || 0} />
            <CharacterStat id={"ResonanceBns"} value={`${characterStatObj?.resonanceBns?.toFixed(1) || 0}%`} />
            <CharacterStat id={"CritRate"} value={`${characterStatObj?.critRate?.toFixed(1) || 0}%`} />
            <CharacterStat id={"CritDmg"} value={`${characterStatObj?.critDmg?.toFixed(1) || 0}%`} />
            <CharacterStat id={selectedCharacter?.element + "Bns"} value={`${characterStatObj?.typeBns?.[1]?.toFixed(1) || 0}%`} />
            <CharacterStat id={selectedCharacter?.type + "Bns"} value={`${characterStatObj?.typeBns?.[0]?.toFixed(1) || 0}%`} />
          </div>

          <div className="profile-stats-score-grid">
            <div className="profile-stats-score-slot">
              {equipmentSetIds.map((setName, index) => (
                <div key={index} className="profile-stats-set-slot">
                  <img className="profile-stats-set-icon" src="/default.webp" />
                  <div
                    ref={ref}
                    style={{
                      fontSize,
                      maxFontSize: "0.7rem",
                      width: "100%",
                      height: "100%",
                      whiteSpace: "nowrap",
                      overflow: "hidden",
                      textAlign: "right",
                      textOverflow: "ellipsis",
                      display: "flex",
                      alignItems: "center",
                      justifyContent: "center",
                    }}>
                    {setName}
                  </div>
                </div>
              ))}
            </div>
            <div className="profile-stats-score-slot score">
              <span className="profile-stats-score-label">CV</span>
              <span className="profile-stats-score-label score">123.4pt</span>
              <span className="profile-stats-score-label">AV</span>
              <span className="profile-stats-score-label score">123.4pt</span>
            </div>
          </div>
        </div>

        <div className="profile-card-equipment-grid">
          <EquipSlot />
          <div className="profile-card-equipment-divider" />
          <EquipSlot />
          <EquipSlot />
          <EquipSlot />
          <EquipSlot />
        </div>
      </div>

      <OCRGrid />
    </div>
  );
}

export default ProfileCard;

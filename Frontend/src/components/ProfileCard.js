import "./ProfileCard.css";
import Select from "react-select";
import { useState } from "react";
import OCRGrid from "./OcrGrid";
import CharacterStat from "./CharacterStat";
import { character as characterList } from "../Datas/Character";
import { weapon as weaponList } from "../Datas/Weapon";

function ProfileCard() {
  const [selectedCharacter, setSelectedCharacter] = useState(null);
  const [weapon, setWeapon] = useState(null);
  const lang = localStorage.getItem("lang") || "kr";

  const characterOptions = characterList.map((c) => ({
    value: c.id,
    label: (
      <div style={{ display: "flex", alignItems: "center" }}>
        <img
          src={`/character/${c.id}/ico.webp`}
          alt=""
          style={{ width: "25%", height: "25%", marginRight: "10%" }}
        />
        {lang === "en" ? c.id : c[lang] || c.id}
      </div>
    ),
  }));

  const weaponOptions = (weaponList[selectedCharacter?.weapon] || []).map(
    (w) => ({
      value: w.id,
      label: (
        <div style={{ display: "flex", alignItems: "center" }}>
          <img
            src={`/weapon/${selectedCharacter?.weapon}/${w.imgKey}.png`}
            alt=""
            style={{ width: "25%", height: "25%", marginRight: "10%" }}
          />
          {lang === "en" ? w.id : w[lang] || w.id}
        </div>
      ),
    })
  );

  const customStyles = {
    control: (base, state) => ({
      ...base,
      display: "flex",
      height: "100%",
      width: "100%",
      fontSize: "1rem",
      borderColor: state.isFocused ? "#2684FF" : "gray",
      boxShadow: state.isFocused ? "0 0 0 1px #2684FF" : "none",
      "&:hover": {
        borderColor: "#2684FF",
      },
    }),
    menu: (base) => ({
      ...base,
      zIndex: 1000,
    }),
    option: (base, state) => ({
      ...base,
      backgroundColor: state.isFocused ? "#f0f0f0" : "white",
      color: "black",
      padding: "10px 12px",
    }),
    dropdownIndicator: (base) => ({
      ...base,
      padding: "4px",
    }),
    indicatorSeparator: () => ({
      display: "none",
    }),
  };

  return (
    <div className="profile-portrait">
      <div className="profile-dropdown-grid">
        <Select
          className="dropdown"
          options={characterOptions}
          styles={customStyles}
          onChange={(opt) => {
            setSelectedCharacter(characterList.find((c) => c.id === opt.value));
            setWeapon(null);
          }}
          placeholder="캐릭터 선택"
          isSearchable={false}
        />

        <Select
          className="dropdown"
          options={weaponOptions}
          styles={customStyles}
          onChange={(opt) => setWeapon(opt?.value || null)}
          placeholder="무기 선택"
          isSearchable={false}
          isDisabled={!selectedCharacter}
        />
      </div>

      <div className="profile-card">
        <img
          className="profile-card-img"
          src="./character/shorekeeper/stand.png"></img>
        <div className="profile-card-stats">
          <div className="profile-stats-weapon">
            <img
              className="profile-weapon-img"
              src="./weapon/StraightSword/ico001.png"
            />
            <div className="profile-weapon">
              <span className="profile-weapon-name">
                寛恕のタ・エイス・ヘアウトン
              </span>
              <div className="profile-weapon-stats-container">
                <img className="profile-stat-icon" src="./gem.webp" />
                <span className="profile-weapon-stats">576</span>
                <img className="profile-stat-icon" src="./gem.webp" />
                <span className="profile-weapon-stats">47.8%</span>
              </div>
            </div>
          </div>
          <div className="profile-stat-grid">
            <CharacterStat />
            <CharacterStat />
            <CharacterStat />
            <CharacterStat />
            <CharacterStat />
            <CharacterStat />
            <CharacterStat />
            <CharacterStat />
          </div>
        </div>
        <div className="profile-card-equipment-grid"></div>
      </div>

      <OCRGrid />
    </div>
  );
}

export default ProfileCard;

import "./ProfileCard.css";

import React, { useRef, useState, useEffect } from "react";
import Select from "react-select";
import useFitText from "use-fit-text";
import { ChromePicker } from "react-color";

import EquipSlot from "./EquipSlot";
import CharacterStat from "./CharacterStat";
import ProfileStats from "./ProfileStats";

import { character as characterList, characterStat } from "../Datas/Character";
import { echoData } from "../Datas/Echo";
import {
  weapon as weaponList,
  weaponStat as weaponStats,
} from "../Datas/Weapon";

function ProfileCard() {
  const boxPickerRef = useRef(null);
  const textPickerRef = useRef(null);
  const [color, setColor] = useState({
    boxColor: "#ffffff66",
    textColor: "#000000ff",
  });
  const [showPicker, setShowPicker] = useState({ box: false, text: false });

  const [selectedCharacter, setSelectedCharacter] = useState(null);
  const [selectedCharacterC, setSelectedCharacterC] = useState(null);
  const [characterStatObj, setCharacterStat] = useState(null);

  const [selectedWeapon, setWeapon] = useState(null);
  const [selectedWeaponC, setWeaponC] = useState(null);
  const [selectedWeaponStat, setWeaponStat] = useState(null);

  const [equipmentSetIds, setEquipmentSetIds] = useState(["Frost", "Frosty"]);

  const [fitKeyW, setFitKeyW] = useState(0);

  const boxRef = useRef(null);
  const fileInputRef = useRef(null);
  const profileRef = useRef(null);
  const [imageURL, setImageURL] = useState(null);

  const lang = localStorage.getItem("lang") || "kr";

  const { fontSize: fontSizeW, ref: refWeapon } = useFitText({});

  const wrapperRef = useRef(null);
  const [pos, setPos] = useState({ x: 0, y: 0 });
  const [scale, setScale] = useState(1);
  const [imageSize, setImageSize] = useState({ width: 0, height: 0 });
  const [dragging, setDragging] = useState(false);
  const offset = useRef({ x: 0, y: 0 });

  useEffect(() => {
  let mouseDownInside = false;

  const handleMouseDown = (e) => {
    mouseDownInside =
      boxPickerRef.current?.contains(e.target) ||
      textPickerRef.current?.contains(e.target);
  };

  const handleClickOrEsc = (e) => {
    if (e.type === "keydown" && e.key === "Escape") {
      setShowPicker({ box: false, text: false });
      return;
    }

    if (!mouseDownInside) {
      setShowPicker({ box: false, text: false });
    }
  };

  document.addEventListener("mousedown", handleMouseDown, true);
  document.addEventListener("click", handleClickOrEsc, true);
  document.addEventListener("keydown", handleClickOrEsc);

  return () => {
    document.removeEventListener("mousedown", handleMouseDown, true);
    document.removeEventListener("click", handleClickOrEsc, true);
    document.removeEventListener("keydown", handleClickOrEsc);
  };
  }, []); //$ color picker close
  
  useEffect(() => {
    const handlePaste = (e) => {
      const item = [...e.clipboardData.items].find((i) =>
        i.type.includes("image")
      );
      if (item) {
        const file = item.getAsFile();
        const url = URL.createObjectURL(file);
        setImageURL(url);
        const img = new Image();
        img.onload = () => {
          setImageSize({ width: img.naturalWidth, height: img.naturalHeight });
        };
        scale = Math.max(
          profileRef.current.offsetWidth / imageSize.width,
          profileRef.current.offsetHeight / imageSize.height,
          0.1
        );
      }
    };

    const box = boxRef.current;
    if (box) box.addEventListener("paste", handlePaste);
    return () => {
      if (box) box.removeEventListener("paste", handlePaste);
    };
  }, []);

  useEffect(() => {
    const handleMove = (e) => {
      if (!dragging) return;
      setPos({
        x: Math.min(
          Math.max(
            e.clientX - offset.current.x,
            (imageSize.width * scale - profileRef.current.offsetWidth) / -2
          ),
          (imageSize.width * scale - profileRef.current.offsetWidth) / +2
        ),
        y: Math.min(
          Math.max(
            e.clientY - offset.current.y,
            (imageSize.height * scale - profileRef.current.offsetHeight) / -2
          ),
          (imageSize.height * scale - profileRef.current.offsetHeight) / +2
        ),
      });
    };
    const handleUp = () => {
      setDragging(false);
    };

    document.addEventListener("mousemove", handleMove);
    document.addEventListener("mouseup", handleUp);

    return () => {
      document.removeEventListener("mousemove", handleMove);
      document.removeEventListener("mouseup", handleUp);
    };
  }, [dragging]); //$ drag pos change

  useEffect(() => {
    if (!profileRef.current || !imageSize.width || !imageSize.height) return;

    setPos({
      x: Math.min(
        Math.max(
          pos.x,
          (imageSize.width * scale - profileRef.current.offsetWidth) / -2
        ),
        (imageSize.width * scale - profileRef.current.offsetWidth) / +2
      ),
      y: Math.min(
        Math.max(
          pos.y,
          (imageSize.height * scale - profileRef.current.offsetHeight) / -2
        ),
        (imageSize.height * scale - profileRef.current.offsetHeight) / +2
      ),
    });
  }, [scale, imageSize]);

  useEffect(() => {
    const el = boxRef.current;
    if (!el || !imageSize.width || !imageSize.height) return;

    const handleWheel = (e) => {
      e.preventDefault();
      const delta = e.deltaY < 0 ? 0.1 : -0.1;

      const minScale = Math.max(
        profileRef.current.offsetWidth / imageSize.width,
        profileRef.current.offsetHeight / imageSize.height,
        0.1
      );

      setScale((prev) => Math.min(Math.max(prev + delta, minScale), 3));
    };

    el.addEventListener("wheel", handleWheel, { passive: false });
    return () => el.removeEventListener("wheel", handleWheel);
  }, [imageSize]); //$ wheel zoom change

  const handleDoubleClick = () => {
    fileInputRef.current?.click();
  };
  const handleImageSelect = (e) => {
    const file = e.target.files[0];
    if (file) {
      const url = URL.createObjectURL(file);
      setImageURL(url);
    }
  };
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

  const handleMouseDown = (e) => {
    e.preventDefault();
    setDragging(true);
    offset.current = {
      x: e.clientX - pos.x,
      y: e.clientY - pos.y,
    };
  }; //$ Drag Start

  function toHex(c) {
    const toHex = (val) => Math.round(val).toString(16).padStart(2, "0");
    const alpha = toHex(c.a * 255);
    return `#${toHex(c.r)}${toHex(c.g)}${toHex(c.b)}${alpha}`;
  }

  const characterOptions = characterList.map((c) => ({
    value: c.id,
    label: lang === "en" ? c.id : c[lang] || c.id,
    img: `https://wuthering-v1in.onrender.com/static/character/${c.id}/ico.webp`,
  }));
  const weaponOptions = (weaponList[selectedCharacter?.weapon] || []).map(
    (w) => ({
      value: w.id,
      label: lang === "en" ? w.id : w[lang] || w.id,
      img: `https://wuthering-v1in.onrender.com/static/weapon/${selectedCharacter?.weapon}/${w.imgKey}.png`,
    })
  );

  const characterOptionsC = ["C0", "C1", "C2", "C3", "C4", "C5", "C6"].map(
    (c) => ({
      value: c,
      label: c,
    })
  );
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
      fontSize: ".75rem",
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
              <img
                src={e.img}
                alt=""
                style={{ width: "25px", height: "25px", marginRight: "8px" }}
              />
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
            setWeaponStat(weaponStats[selected.id]);
            setFitKeyW((prev) => prev + 1);
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

        <div className="profile-color-container">
          <div className="profile-color-picker">
            <button
              className="profile-color-picker-button"
              onClick={() => setShowPicker((p) => ({ ...p, box: !p.box }))}
              style={{ backgroundColor: color.boxColor }}
            />
            {showPicker.box && (
              <div
                className="color-picker-overlay"
                ref={boxPickerRef}
                onDragStart={(e) => e.preventDefault()}
                draggable={false}>
                <ChromePicker
                  color={color.boxColor}
                  onDragStart={(e) => e.preventDefault()}
                  draggable={false}
                  onChange={(updated) =>
                    setColor((prev) => ({
                      ...prev,
                      boxColor: toHex(updated.rgb),
                    }))
                  }
                />
              </div>
            )}

            <button
              className="profile-color-picker-button"
              onClick={() => setShowPicker((p) => ({ ...p, text: !p.text }))}
              style={{ backgroundColor: color.textColor }}
            />
            {showPicker.text && (
              <div
                className="color-picker-overlay"
                ref={textPickerRef}
                onDragStart={(e) => e.preventDefault()}
                draggable={false}>
                <ChromePicker
                  color={color.textColor}
                  onDragStart={(e) => e.preventDefault()}
                  draggable={false}
                  onChange={(updated) =>
                    setColor((prev) => ({
                      ...prev,
                      textColor: toHex(updated.rgb),
                    }))
                  }
                />
              </div>
            )}
          </div>
        </div>
      </div>

      <span className="profile-stat-info">{getStringInfo(lang)[2]}</span>
      <span className="profile-stat-info">{getStringInfo(lang)[3]}</span>

      <div className="profile-card" ref={profileRef}>
        {imageURL ? (
          <img
            src={imageURL}
            onLoad={(e) =>
              setImageSize({
                width: e.target.naturalWidth,
                height: e.target.naturalHeight,
              })
            }
            style={{
              position: "absolute",
              transformOrigin: "center",
              transform: `translate(${pos.x}px, ${pos.y}px) scale(${scale})`,
              zIndex: 0,
            }}
          />
        ) : (
          <img
            src={"/bg.jpg"}
            style={{
              position: "absolute",
              top: 0,
              left: 0,
              width: "100%",
              height: "100%",
              objectFit: "cover",
            }}
          />
        )}
        <img
          className="profile-card-img"
          src={
            selectedCharacter?.id
              ? `https://wuthering-v1in.onrender.com/static/character/${selectedCharacter.id}/stand.png`
              : "https://wuthering-v1in.onrender.com/static/character/rover/stand.png"
          }
          style={{ backgroundColor: color.boxColor }}
          alt="char"
        />

        <div
          className="profile-card-stats"
          style={{ backgroundColor: color.boxColor }}>
          {/* 무기 */}
          <div className="profile-stats-weapon">
            <img
              className="profile-weapon-img"
              src={`https://wuthering-v1in.onrender.com/static/weapon/${selectedCharacter?.weapon}/${selectedWeapon?.imgKey}.png`}
              onError={(e) => (e.currentTarget.src = "/default.webp")}
              style={{ backgroundColor: color.boxColor }}
            />
            <div
              className="profile-weapon"
              style={{ backgroundColor: color.boxColor }}>
              <div
                key={fitKeyW}
                ref={refWeapon}
                style={{
                  fontSize: fontSizeW,
                  width: "100%",
                  height: "100%",
                  minWidth: 0,
                  whiteSpace: "nowrap",
                  overflow: "hidden",
                  textAlign: "right",
                  textOverflow: "ellipsis",
                  display: "flex",
                  alignItems: "center",
                  justifyContent: "flex-start",
                  color: color.textColor,
                  WebkitFontSmoothing: "antialiased",
                  MozOsxFontSmoothing: "grayscale",
                  textRendering: "optimizeLegibility",
                }}>
                &nbsp;
                {lang === "en"
                  ? selectedWeapon?.id || ""
                  : selectedWeapon?.[lang] || ""}
              </div>
              <div className="profile-weapon-stats-container">
                <img
                  className="profile-stat-icon"
                  src="/ico/stats/atk.webp"
                  onError={(e) => (e.currentTarget.src = "/default.webp")}
                />
                <span className="profile-weapon-stats">
                  {selectedWeaponStat?.atk}&nbsp;&nbsp;&nbsp;&nbsp;
                </span>
                <img
                  className="profile-stat-icon"
                  src={`https://wuthering-v1in.onrender.com/static/ico/stats/${selectedWeaponStat?.statType[0]}.webp`}
                  onError={(e) => (e.currentTarget.src = "/default.webp")}
                />
                <span className="profile-weapon-stats">
                  {selectedWeaponStat?.value[0]?.toFixed(1)}
                  {["Pct", "Bns", "Crit"].some((s) =>
                    selectedWeaponStat?.statType[0]?.includes(s)
                  )
                    ? "%"
                    : ""}
                  &nbsp;&nbsp;
                </span>
              </div>
            </div>
          </div>

          {/* 캐릭터 스탯 */}
          <div className="profile-stat-grid">
            <CharacterStat
              id="hp"
              value={characterStatObj?.baseHp || 0}
              color={color.textColor}
            />
            <CharacterStat
              id="atk"
              value={characterStatObj?.baseAtk || 0}
              color={color.textColor}
            />
            <CharacterStat
              id="def"
              value={characterStatObj?.baseDef || 0}
              color={color.textColor}
            />
            <CharacterStat
              id="ResonanceBns"
              value={`${characterStatObj?.resonanceBns?.toFixed(1) || 0}%`}
              color={color.textColor}
            />
            <CharacterStat
              id="CritRate"
              value={`${characterStatObj?.critRate?.toFixed(1) || 0}%`}
              color={color.textColor}
            />
            <CharacterStat
              id="CritDmg"
              value={`${characterStatObj?.critDmg?.toFixed(1) || 0}%`}
              color={color.textColor}
            />
            <CharacterStat
              id={selectedCharacter?.element + "Bns"}
              value={`${characterStatObj?.typeBns?.[1]?.toFixed(1) || 0}%`}
              color={color.textColor}
            />
            <CharacterStat
              id={selectedCharacter?.type + "Bns"}
              value={`${characterStatObj?.typeBns?.[0]?.toFixed(1) || 0}%`}
              color={color.textColor}
            />
          </div>

          {/* 세트 이름 */}
          <div className="profile-stats-score-grid">
            <div className="profile-stats-score-slot">
              {equipmentSetIds.map((setName, index) => (
                <div key={index} className="profile-stats-set-slot">
                  <img
                    className="profile-stats-set-icon"
                    src={`https://wuthering-v1in.onrender.com/static/ico/echo/${setName}.webp`}
                    onError={(e) => (e.currentTarget.src = "/default.webp")}
                  />
                  <div className="profile-stats-set-label">
                    {echoData?.[setName]?.[lang] || setName}
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

        <div
          className="profile-card-equipment-grid"
          style={{ backgroundColor: color.boxColor }}>
          <EquipSlot color={color.textColor} />
          <div className="profile-card-equipment-divider" />
          <EquipSlot color={color.textColor} />
          <EquipSlot color={color.textColor} />
          <EquipSlot color={color.textColor} />
          <EquipSlot color={color.textColor} />
        </div>
      </div>
      <div
        className="profile-card-image-input"
        tabIndex={0}
        ref={boxRef}
        contentEditable={false}
        onDoubleClick={handleDoubleClick}>
        {imageURL ? (
          <img
            src={imageURL}
            onLoad={(e) =>
              setImageSize({
                width: e.target.naturalWidth,
                height: e.target.naturalHeight,
              })
            }
            alt={"editable" & "pasted"}
            draggable={false}
            onMouseDown={handleMouseDown}
            className={"profile-draggable-img" & "profile-preview-img"}
            style={{
              transform: `translate(${pos.x}px, ${pos.y}px) scale(${scale})`,
              transformOrigin: "center",
              position: "absolute",
              userSelect: "none",
              maxWidth: "none",
              cursor: dragging ? "grabbing" : "grab",
            }}
          />
        ) : (
          <span className="profile-draggable-text">
            {getStringInfo(lang)[4]}
          </span>
        )}
        <input
          type="file"
          accept="image/png, image/jpeg"
          ref={fileInputRef}
          onChange={handleImageSelect}
          style={{ display: "none" }}
        />
      </div>
      <ProfileStats />
    </div>
  );
}

export default ProfileCard;

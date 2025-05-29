import "./ProfileCard.css";
import { useRef, useState, useEffect, useLayoutEffect } from "react";

import { profileData, userdata } from "../Datas/userData";
import ImageDrag from "../func/ImageDrag";

function ProfileCard() {
  //#region Refs
  const ProfileCardSlot = useRef(null);
  //#endregion
  
  //#region Variables
  const apiKey = process.env.REACT_APP_API_KEY;
  const apiUrl = process.env.REACT_APP_API_URL;

  const [lang, setLang] = useState("en");
  const [sizeValue, setSizeValue] = useState(1.0);
  const [slotSize, setSlotSize] = useState({ width: 0, height: 0 });
  //#endregion

  //#region Events
  window.onresize = () => {
    setSlotSize({
      width: ProfileCardSlot.current.offsetWidth,
      height: ProfileCardSlot.current.offsetHeight,
    });
    console.log(slotSize); // 여기서는 제대로 사이즈가 잡힘

    setSizeValue(slotSize.width / 2140);
  };
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
  const setSlotStyle = ({ w, h, x, y }) => {
    return {
      width: `calc(${w}px * ${sizeValue})`,
      height: `calc(${h}px * ${sizeValue})`,
      top: `calc(${y}px * ${sizeValue})`,
      left: `calc(${x}px * ${sizeValue})`,
      position: "absolute",
    };
  };
  //#endregion

  //#region Initialize
  //$ OnLoad
  useEffect(() => {
    setLang(localStorage.getItem("lang"));
  }, []);
  //$ After Render
  useLayoutEffect(() => {
    const width = ProfileCardSlot.current.offsetWidth;
    const height = ProfileCardSlot.current.offsetHeight;

    setSlotSize({ width, height });
    setSizeValue(width / 2140);
  }, []);
  //#endregion

  return (
    <div className="profile-portrait">
      <div className="profile-card-slot" 
        ref={ProfileCardSlot}
        style={{backgroundImage: `url("/asdf2.jpg")`,}}
        >
        {/* //$ Weapon Info */}
        <div className="profile-card-character-view profile-slot"
          style={{
            ...setSlotStyle({ w: 650, h: 800, x: 20, y: 20 }),
            boxShadow: "5px 5px 0px rgba(0,0,0,1)",
            borderTopLeftRadius: `calc(40px * ${sizeValue})`,
            overflow: "hidden",
          }}>
          <ImageDrag />
        </div>
        {/* //$ Weapon Info */}
        <div className="profile-card-character-info"
          style={{
            ...setSlotStyle({ w: 650, h: 120, x: 20, y:820 })
          }}>
          <span className={`profile-card-text ${lang}Font`}
            style={{
              bottom: `calc(70px * ${sizeValue})`,
              left: `calc(10px * ${sizeValue})`,
              color: "#ffffff",
              fontSize: `calc(24px * ${sizeValue})`,
            }}>
            Asia
          </span>
          <span className={`profile-card-text ${lang}Font`}
            style={{
              bottom: `calc(40px * ${sizeValue})`,
              left: `calc(15px * ${sizeValue})`,
              color: "#ffffff",
              fontSize: `calc(24px * ${sizeValue})`,
            }}>
            Lv.79 SSeries
          </span>
          <span className={`profile-card-text ${lang}Font`}
            style={{
              bottom: `calc(10px * ${sizeValue})`,
              left: `calc(15px * ${sizeValue})`,
              color: "#ffffff",
              fontSize: `calc(24px * ${sizeValue})`,
            }}>
            uid. 812 345 678
          </span>
          <span className={`profile-card-text ${lang}Font`}
            style={{
              bottom: `calc(10px * ${sizeValue})`,
              right: "0px",
              color: "#ffffff",
              fontSize: `calc(48px * ${sizeValue})`,
            }}>
            Camellya
          </span>
        </div>
        {/* //$ Weapon Icon */}
        <div style={{
          ...setSlotStyle({w: 140, h: 140, x: 710, y: 20}),
          backgroundColor: "#969696",
          border: `calc(5px * ${sizeValue}) solid #323232`,
          zIndex: 250
        }}>
          <img className="profile-card-icon"
            src={`/weapon/straight_sword/ico003.png`}/>
        </div>
        {/* //$ Weapon Info */}
        <div className="profile-card-weapon profile-slot"
          style={{
            ...setSlotStyle({w: 600, h: 140, x: 700, y: 70}),
          }}></div>
        <div className="profile-card-stats profile-slot"></div>
        <div className="profile-card-total-info profile-slot"></div>
        <div className="profile-card-echo-slot profile-slot"></div>
      </div>
    </div>
  );
}

export default ProfileCard;

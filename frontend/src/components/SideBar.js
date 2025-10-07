import "./SideBar.css";
import { useRef, useState, useEffect } from "react";
import { useNavigate } from "react-router-dom";

function SideBar() {
  const navigate = useNavigate();
  const [lang, setLang] = useState("en");
  const routes = ["/", "/character", "/weapon", "/echos"];

  const getStringInfo = (lang) => {
    const strings = {
      kr: ["프로필", "캐릭터", "무기", "에코"],
      en: ["Profile", "Character", "Weapon", "Echos"],
      jp: ["プロフィール", "キャラクター", "武器", "エコー"],
      zh: ["档案", "角色", "武器", "回声"],
    };
    return strings[lang] || strings["en"];
  };

  useEffect(() => {
    const savedLang = localStorage.getItem("lang");
    if (savedLang) setLang(savedLang);
  }, []);

  return (
    <div className="sidebar">
      {routes.map((path, i) => (
        <div className="side-button-slot">
          <button className="side-button" onClick={() => navigate(path)}>
            <span className="side-text">{getStringInfo(lang)[i]}</span>
          </button>
          <div className="sidebar-divider" />
        </div>
      ))}
    </div>
  );
}

export default SideBar;

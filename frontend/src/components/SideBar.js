import "./SideBar.css";
import { useRef, useState, useEffect } from "react";
import { useNavigate } from "react-router-dom";

function SideBar() {
  const navigate = useNavigate();
  const [lang, setLang] = useState("en");
  const routes = ["/", "/profile", "/character", "/weapon", "/echos"];

  const getStringInfo = (lang) => {
    const strings = {
      kr: ["홈", "프로필", "캐릭터", "무기", "에코"],
      en: ["Home", "Profile", "Character", "Weapon", "Echos"],
      jp: ["ホーム", "プロフィール", "キャラクター", "武器", "エコー"],
      zh: ["主页", "档案", "角色", "武器", "回声"],
    };
    return strings[lang] || strings["en"];
  };

  useEffect(() => {
    const savedLang = localStorage.getItem("lang");
    if (savedLang) setLang(savedLang);
  }, []);

  return (
    <nav className="sidebar">
    {routes.map((path, i) => (
      <div className="side-button-slot" key={path}>
        <button className="side-button" onClick={() => navigate(path)}>
          <span className="side-text">{getStringInfo(lang)[i]}</span>
        </button>
        <div className="sidebar-divider" />
      </div>
    ))}
  </nav>
  );
}

export default SideBar;

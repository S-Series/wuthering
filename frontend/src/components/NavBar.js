import "./NavBar.css";
import Select from "react-select";
import { useNavigate } from "react-router-dom";
import { useState, useEffect } from "react";

function NavBar() {
  const backend = "https://wuthering-v1in.onrender.com/static";
  const navigate = useNavigate();
  const [language, setLanguage] = useState("kr");

  useEffect(() => {
    const saved = localStorage.getItem("lang");
    if (saved) setLanguage(saved);
  }, []);

  const getStringInfo = (lang) => {
  const strings = {
    kr: [
      "띵조 DEV",
      "* 모든 기능은 개발 중입니다",
      "* 오류나 제안은 inweag80@gmail.com 으로 보내주세요",
      "도움말",
      "SSeries",
      "커피 후원"
    ],
    jp: [
      "ウェザウェ DEV",
      "* すべての機能は開発中です",
      "* 不具合や提案があれば inweag80@gmail.com までご連絡ください",
      "ヘルプ",
      "SSeries",
      "Ko-Fi"
    ],
    zh: [
      "名潮 DEV",
      "* 所有功能仍在开发中",
      "* 如有任何问题或建议，请联系 inweag80@gmail.com",
      "帮助",
      "SSeries",
      "Ko-Fi"
    ],
    en: [
      "WuWa DEV",
      "* All features are currently under development",
      "* Found a bug or have feedback? Email inweag80@gmail.com",
      "Help",
      "SSeries",
      "Ko-Fi"
    ],
  };
  return strings[lang] || strings["en"];
};

  const languageOptions = [
    { value: "kr", label: "한국어" },
    { value: "en", label: "English" },
    { value: "jp", label: "日本語" },
    { value: "zh", label: "中文" },
  ];
  const selectedOption = languageOptions.find((opt) => opt.value === language);

  const customLangSelectStyles = {
    control: (base, state) => ({
      ...base,
      minWidth: 120,
      width: "auto",
      fontSize: "0.9rem",
      padding: "0 4px",
    }),
    singleValue: (base) => ({
      ...base,
      whiteSpace: "nowrap",
      overflow: "visible",
      textOverflow: "clip", // 'ellipsis'를 없앰
    }),
    menu: (base) => ({
      ...base,
      zIndex: 999,
    }),
  };

  return (
    <nav className="navbar">
      <div className="nav-left">
        <button className="home-button" onClick={() => navigate("/")}>
          <img src={`${backend}/default.webp`} className="main-icon"></img>
          {getStringInfo(language)[0]}
        </button>
        <div className="nav-left text-box">
          <span className="nav-left text">{getStringInfo(language)[1]}</span>
          <span className="nav-left text">{getStringInfo(language)[2]}</span>
        </div>
      </div>
      <div className="nav-right">
        <Select
          className="lang-select"
          value={selectedOption}
          onChange={(selected) => {
            const value = selected.value;
            setLanguage(value);
            localStorage.setItem("lang", value);
            window.location.reload();
          }}
          options={languageOptions}
          styles={customLangSelectStyles}
          isSearchable={false}
        />
        <button className="nav-button" onClick={() => navigate()}>
          <img src={`${backend}/info.png`} className="icon"></img>
          <span className="nav-text">{getStringInfo(language)[3]}</span>
        </button>
        <button
          className="nav-button"
          onClick={() =>
            window.open("https://github.com/S-Series/wuthering", "_blank")
          }>
          <img src={`${backend}/github.png`} className="icon"></img>
          <span className="nav-text">{getStringInfo(language)[4]}</span>
        </button>
        <button
          className="nav-button"
          onClick={() => window.open("https://ko-fi.com/sseries", "_blank")}>
          <img src={`${backend}/kofi.png`} className="icon"></img>
          <span className="nav-text">{getStringInfo(language)[5]}</span>
        </button>
      </div>
    </nav>
  );
}

export default NavBar;

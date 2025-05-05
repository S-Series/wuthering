import "./NavBar.css";
import Select from "react-select";
import { useNavigate } from "react-router-dom";
import { useState, useEffect } from "react";

function NavBar() {
  const navigate = useNavigate();
  const [language, setLanguage] = useState("kr");

  useEffect(() => {
    const saved = localStorage.getItem("lang");
    if (saved) setLanguage(saved);
  }, []);

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
          <img src="./gem.webp" alt="Home" className="main-icon"></img>
          띵조 DEV
        </button>
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
          <img src="./info.png" className="icon"></img>
          <span className="nav-text">Help</span>
        </button>
        <button
          className="nav-button"
          onClick={() =>
            window.open("https://github.com/S-Series/wuthering", "_blank")
          }>
          <img src="./github.png" className="icon"></img>
          <span className="nav-text">SSeries</span>
        </button>
        <button
          className="nav-button"
          onClick={() => window.open("https://ko-fi.com/sseries", "_blank")}>
          <img src="./kofi.png" className="icon"></img>
          <span className="nav-text">Ko-Fi</span>
        </button>
      </div>
    </nav>
  );
}

export default NavBar;

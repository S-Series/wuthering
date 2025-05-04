import "./NavBar.css";
import { useNavigate } from "react-router-dom";
import { useState, useEffect } from "react";

function NavBar() {
  const navigate = useNavigate();
  const [language, setLanguage] = useState("kr");

  useEffect(() => {
    const saved = localStorage.getItem("lang");
    if (saved) setLanguage(saved);
  }, []);

  const handleLanguageChange = (e) => {
    const value = e.target.value;
    setLanguage(value);
    localStorage.setItem("lang", value);
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
        <select
          className="lang-select"
          value={language}
          onChange={handleLanguageChange}>
          <option value="kr">한국어</option>
          <option value="en">English</option>
          <option value="jp">日本語</option>
          <option value="ch">中文</option>
        </select>
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

import "./SideBar.css";
import { useRef, useState, useEffect } from "react";
import { useNavigate } from "react-router-dom";
import { useProfile } from "../hooks/useProfile";
import { time } from "framer-motion";

function SideBar() {
  const navigate = useNavigate();
  const { lang } = useProfile();
  const ROUTES = ["/", "/character", "/weapon", "/echos"];
  const ROUTES_AVAILABLE = [true, false, false, false];

  const getStringInfo = (lang) => {
    const strings = {
      kr: ["프로필", "캐릭터", "무기", "에코"],
      en: ["Profile", "Character", "Weapon", "Echos"],
      jp: ["プロフィール", "キャラクター", "武器", "エコー"],
      zh: ["档案", "角色", "武器", "回声"],
    };
    return strings[lang] || strings["en"];
  };

  return (
    <div className="sidebar">
      {ROUTES.map((path, i) => (
        <div className="side-button-slot">
          <button
            className="side-button"
            disabled={!ROUTES_AVAILABLE[i]}
            onClick={() => navigate(path)}>
            <span className={`side-text ${lang}Font`}>
              {getStringInfo(lang)[i]}
            </span>
          </button>
          <div className="sidebar-divider" />
        </div>
      ))}
      <div className="sidebar-footer">
        <img
          className="sidebar-footer-image"
          src={`/gifs/${String(Math.floor(Math.random() * 19) + 1).padStart(
            2,
            "0"
          )}.gif`}
        />
        <button
          disabled={true}
          className="sidebar-footer-button"
          style={{
            width: "100%",
            maxHeight: "35px",
            aspectRatio: "2.5 / 1",
          }}>
          <span className={`${lang}Font`}>멤버쉽 관리</span>
        </button>
        <div className="sidebar-footer-empty" />
        <button
          disabled={true}
          className="sidebar-footer-button"
          style={{
            width: "100%",
            maxHeight: "35px",
            aspectRatio: "2.5 / 1",
            whiteSpace: "nowrap",
          }}>
          <span className={`${lang}Font`}>클라우드 동기화</span>
        </button>
        <div className="sidebar-footer-empty" />
      </div>
    </div>
  );
}

export default SideBar;

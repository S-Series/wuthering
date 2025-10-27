import "./SideBar.css";
import { useState, useEffect } from "react";
import { useNavigate } from "react-router-dom";
import { useProfile } from "../hooks/useProfile";
import { motion, AnimatePresence } from "framer-motion";

function SideBar() {
  const navigate = useNavigate();
  const { lang } = useProfile();

  const ROUTES = ["/", "/character", "/weapon", "/echos"];
  const ROUTES_AVAILABLE = [true, false, false, false];

  const [gifPath, setGifPath] = useState("");
  const [gifKey, setGifKey] = useState(0); // key 변경으로 AnimatePresence 작동

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
    const updateGif = () => {
      const newGif = `/gifs/${String(
        Math.floor(Math.random() * 19) + 1
      ).padStart(2, "0")}.gif`;
      setGifPath(newGif);
      setGifKey((prev) => prev + 1);
    };

    updateGif();
    const interval = setInterval(updateGif, 5000);
    return () => clearInterval(interval);
  }, []);

  return (
    <div className="sidebar">
      {ROUTES.map((path, i) => (
        <div key={i} className="side-button-slot">
          <button
            className="side-button"
            disabled={!ROUTES_AVAILABLE[i]}
            onClick={() => navigate(path)}
          >
            <span className={`side-text ${lang}Font`}>
              {getStringInfo(lang)[i]}
            </span>
          </button>
          <div className="sidebar-divider" />
        </div>
      ))}

      <div
        className="sidebar-footer"
        style={{ position: "relative", overflow: "hidden" }}
      >
        <div
          style={{
            position: "relative",
            width: "90%",
            aspectRatio: "1 / 0.9",
            overflow: "hidden",
            flexShrink: 0,
          }}
        >
          <AnimatePresence mode="wait">
            <motion.img
              key={gifKey}
              src={gifPath}
              alt="gif"
              className="sidebar-footer-image"
              initial={{ x: "100%", opacity: 0 }}
              animate={{ x: "0%", opacity: 1 }}
              exit={{ x: "-100%", opacity: 0 }}
              transition={{
                duration: 0.6,
                ease: "easeInOut",
              }}
              style={{
                position: "absolute",
                width: "100%",
                height: "100%",
                objectFit: "cover",
              }}
            />
          </AnimatePresence>
        </div>
        <button
          disabled={true}
          className="sidebar-footer-button"
          style={{
            width: "100%",
            maxHeight: "35px",
            aspectRatio: "2.5 / 1",
          }}
        >
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
          }}
        >
          <span className={`${lang}Font`}>클라우드 동기화</span>
        </button>

        <div className="sidebar-footer-empty" />
      </div>
    </div>
  );
}

export default SideBar;

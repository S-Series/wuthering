import { useEffect, useState } from "react";
import type { ReactNode } from "react";
import Select, { type StylesConfig } from "react-select";

import { locale } from "@/locales/locale";

import { useAppStore, type LangType } from "@/stores/appStore";
import { useAuthStore } from "@/stores/authStore";
import "@/components/_Layout/Navbar.css"

type LangOption = { value: LangType; label: ReactNode };

function LangLabel({ v, src, text }: { v: string; src: string; text: string; }) {
  return (
    <div style={{ display: "flex", alignItems: "center", gap: 6, filter: "drop-shadow(0px 0px 4px #444)" }}>
      <img src={src} style={{ width: "20%", minWidth: "1.25rem"}} />
      <span className={`${v}-font`} style={{ fontSize: "max(min(1.3vw, 1.3rem), 0.75rem)" }}>{text}</span>
    </div>
  );
}

const LANG_OPTION: LangOption[] = [
  { value: "kr", label: <LangLabel v="kr" src="/flag-kr.png" text="한국어" /> },
  { value: "en", label: <LangLabel v="en" src="/flag-en.png" text="English" /> },
  { value: "jp", label: <LangLabel v="jp" src="/flag-jp.png" text="日本語" /> },
  { value: "zh", label: <LangLabel v="zh" src="/flag-zh.png" text="中文" /> },
];

export default function Navbar() {

  const { lang, setLang, theme, toggleTheme } = useAppStore();
  const { user } = useAuthStore();
  const [isActive, setIsActive] = useState(false);

  const localeText = locale(lang).navbar;
  const cardLocaleText = locale(lang).card;

  const profileName = user ? user.nickname : localeText.login;

  const profileImage = user?.imageUrl ?? "/default.webp";
  const themeLabel = theme === "dark" ? "Light" : "Dark";
  const themeIcon = theme === "dark" ? "☀" : "☾";

  useEffect(() => {
    document.body.classList.toggle("navbar-sidebar-active", isActive);

    return () => {
      document.body.classList.remove("navbar-sidebar-active");
    };
  }, [isActive]);

  const langSelectStyles: StylesConfig<LangOption, false> = {
    control: (base) => ({
      ...base,
      width: "max(min(11.5vw, 11.5rem), 7.5rem)",
      minHeight: "2.5rem",
      borderColor: "var(--nav-border-muted)",
      borderRadius: 0,
      backgroundColor: "var(--nav-control-bg)",
      boxShadow: "none",
      cursor: "pointer",
      ":hover": {
        borderColor: "var(--nav-accent)",
      },
    }),
    singleValue: (base) => ({
      ...base,
      color: "var(--nav-text)",
    }),
    menu: (base) => ({
      ...base,
      overflow: "hidden",
      border: "1px solid var(--nav-border)",
      borderRadius: 0,
      backgroundColor: "var(--nav-panel-bg)",
      zIndex: 1010,
    }),
    menuList: (base) => ({
      ...base,
      padding: 0,
    }),
    option: (base, state) => ({
      ...base,
      color: "var(--nav-text)",
      backgroundColor: state.isSelected
        ? "var(--nav-accent-bg)"
        : state.isFocused
          ? "var(--nav-hover-bg)"
          : "var(--nav-panel-bg)",
      cursor: "pointer",
    }),
    dropdownIndicator: (base) => ({
      ...base,
      color: "var(--nav-muted-text)",
      padding: "0 min(1vw, 1rem)"
    }),
    indicatorSeparator: () => ({
      display: "none",
    }),
  };

  const sidebarLangSelectStyles: StylesConfig<LangOption, false> = {
    ...langSelectStyles,
    control: (base) => ({
      ...base,
      width: "100%",
      minHeight: "2.25rem",
      borderColor: "var(--nav-border-muted)",
      borderRadius: 0,
      backgroundColor: "var(--nav-control-bg)",
      boxShadow: "none",
    }),
    menu: (base) => ({
      ...base,
      zIndex: 1010,
    }),
  };

  return (
    <>
      <div id="navbar-body">
        <div className="item-slot">
          <button
            className="sidebar-toggle-btn"
            type="button"
            aria-label="sidebar menu"
            aria-expanded={isActive}
            onClick={() => setIsActive((prev) => !prev)}
          >
            <img className="navbar-icon"
              alt=""
              src="/menu.svg" />
          </button>
          
          <a href="/" className="title">
            <img className="navbar-icon title"
              alt="title"
              src="/default.webp" />
            <p className={`${lang}-font title`}>{localeText.title}</p>
          </a>
        </div>

        <div className="item-slot">
          <Select className="lang-select"
            styles={langSelectStyles}
            value={LANG_OPTION.find((item) => item.value === lang)}
            options={LANG_OPTION}
            onChange={(opt) => {
              if (opt) setLang(opt.value);
            }} />
          <button
            className="navbar-theme-toggle"
            type="button"
            aria-label={`Switch to ${themeLabel} mode`}
            title={`${themeLabel} mode`}
            onClick={toggleTheme}
          >
            <span aria-hidden="true">{themeIcon}</span>
            <p className="en-font">{themeLabel}</p>
          </button>
          <a href="/characters">
            <img className="navbar-icon"
              alt="characters"
              src="/ico/character.png" />
            <p className={`${lang}-font`}>{localeText.characters}</p>
          </a>
          <a href="/card">
            <img className="navbar-icon"
              alt="generator"
              src="/ico/card.png" />
            <p className={`${lang}-font`}>{localeText.generator}</p>
          </a>
          <a href="/board">
            <img className="navbar-icon"
              alt="board"
              src="/ico/board.svg" />
            <p className={`${lang}-font`}>{localeText.board}</p>
          </a>
          <a href="/profile">
            <img className="navbar-icon"
              alt="profile"
              src={profileImage} />
            <p className={`${lang}-font`}>{profileName}</p>
          </a>
        </div>
      </div>

      <div id="navbar-sidebar" className={`${isActive ? "active" : "idle"}`}>
        <div className="sidebar-head-slot">
          <span>{localeText.menu}</span>
          <button
            className="sidebar-close-btn"
            type="button"
            aria-label="close sidebar"
            onClick={() => setIsActive(false)}
          />
        </div>

        <a href="/" className="sidebar-title-slot" onClick={() => setIsActive(false)}>
          <img className="navbar-icon"
            alt="title"
            src="/default.webp" />
          <p className={`${lang}-font`}>{localeText.title}</p>
        </a>

        <div className="sidebar-select-slot">
          <Select className="lang-select"
            styles={sidebarLangSelectStyles}
            value={LANG_OPTION.find((item) => item.value === lang)}
            options={LANG_OPTION}
            onChange={(opt) => {
              if (opt) setLang(opt.value);
            }} />
        </div>

        <nav className="sidebar-link-slot">
          <button
            type="button"
            className="sidebar-theme-toggle-slot"
            onClick={toggleTheme}
          >
            <span aria-hidden="true" className="navbar-theme-icon">{themeIcon}</span>
            <p className="en-font">{themeLabel} mode</p>
          </button>
          <a
            href="/characters"
            onClick={() => setIsActive(false)}
          >
            <img className="navbar-icon"
              alt="characters"
              src="/ico/character.png" />
            <p className={`${lang}-font`}>{localeText.characters}</p>
          </a>
          <a
            href="/card"
            onClick={() => setIsActive(false)}
          >
            <img className="navbar-icon"
              alt="generator"
              src="/ico/card.png" />
            <p className={`${lang}-font`}>{localeText.generator}</p>
          </a>
          <a
            href="/board"
            onClick={() => setIsActive(false)}
          >
            <img className="navbar-icon"
              alt="board"
              src="/ico/board.svg" />
            <p className={`${lang}-font`}>{localeText.board}</p>
          </a>
        </nav>

        <div className="sidebar-bottom-slot">
          <a
            href="/profile"
            className="sidebar-profile-slot"
            onClick={() => setIsActive(false)}
          >
            <img className="navbar-icon"
              alt="profile"
              src={profileImage} />
            <p className={`${lang}-font`}>{profileName}</p>
          </a>

          <button
            type="button"
            className="sidebar-cloud-sync-slot"
            onClick={() => {
              setIsActive(false);
              window.dispatchEvent(new CustomEvent("wuthering:open-cloud-sync"));
            }}
          >
            <img
              className="navbar-icon"
              alt=""
              src="/ico/harmony/Clouds.png"
            />
            <p className={`${lang}-font`}>{cardLocaleText.cloudSync}</p>
          </button>

          <div className="sidebar-social-slot">
            <a href="https://ko-fi.com/sseries" target="_blank" rel="noreferrer">
              <img className="navbar-icon"
                alt="Ko-fi"
                src="/kofi.png" />
            </a>
            <a href="https://github.com/S-Series" target="_blank" rel="noreferrer">
              <img className="navbar-icon"
                alt="GitHub"
                src="/github.png" />
            </a>
            <a href="https://sseries.dev" target="_blank" rel="noreferrer">
              <img className="navbar-icon"
                alt="SSeries"
                src="/sseries.png" />
            </a>
          </div>
        </div>
      </div>
    </>
  )
}

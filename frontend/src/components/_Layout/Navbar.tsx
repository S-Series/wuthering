import { useEffect, useState } from "react";
import Select from "react-select";

import { locale } from "@/locales/locale";

import { useAppStore, type LangType } from "@/stores/appStore";
import { useAuthStore } from "@/stores/authStore";
import "@/components/_Layout/Navbar.css"

export default function Navbar() {

  const { lang, setLang } = useAppStore();
  const { user, isLoading } = useAuthStore();
  const [isActive, setIsActive] = useState(false);

  const localeText = locale(lang).navbar;

  function LangLabel({ v, src, text }: { v: string; src: string; text: string; }) {
    return (
      <div style={{ display: "flex", alignItems: "center", gap: 6, filter: "drop-shadow(0px 0px 4px #444)" }}>
        <img src={src} style={{ width: "20%", minWidth: "1.25rem"}} />
        <span className={`${v}-font`} style={{ fontSize: "max(min(1.3vw, 1.3rem), 0.75rem)" }}>{text}</span>
      </div>
    );
  }

  const LANG_OPTION: {value: LangType, label: React.ReactNode}[] = [
    { value: "kr", label: <LangLabel v="kr" src="/flag-kr.png" text="한국어" /> },
    { value: "en", label: <LangLabel v="en" src="/flag-en.png" text="English" /> },
    { value: "jp", label: <LangLabel v="jp" src="/flag-jp.png" text="日本語" /> },
    { value: "zh", label: <LangLabel v="zh" src="/flag-zh.png" text="中文" /> },
  ];

  const profileName = isLoading
    ? ""
    : user
      ? user.nickname
      : "로그인";

  const profileImage = isLoading
    ? "/default.webp"
    : user?.imageUrl ?? "/default.webp";

  useEffect(() => {console.log(user)}, [user]);

  return (
    <>
      <div id="navbar-body">
        <div className="item-slot">
          <a href="/" className="title">
            <img className="navbar-icon title"
              alt="title"
              src="/default.webp" />
            <p className={`${lang}-font title`}>{localeText.title}</p>
          </a>
        </div>
        <div className="item-slot">
          <Select className="lang-select"
            styles={{
              control: (base) => ({
                ...base,
                width:"max(min(11.5vw, 11.5rem), 7.5rem)",
                backgroundColor: "transparent",
              }),
              singleValue: (base) => ({
                ...base,
                color: "#fff",
              }),
              option: (base) => ({
                ...base,
                backgroundColor: "#eee",
              }),
              dropdownIndicator: (base) => ({
                ...base,
                padding: "0 min(1vw, 1rem)"
              })
            }}
            value={LANG_OPTION.find((item) => item.value === lang)}
            options={LANG_OPTION}
            onChange={(opt) => {
              if (opt) setLang(opt.value);
            }} />
          <a href="/characters">
            <img className="navbar-icon"
              alt="title"
              src="/default.webp" />
            <p className={`${lang}-font`}>{localeText.characters}</p>
          </a>
          <a href="/card">
            <img className="navbar-icon"
              alt="title"
              src="/default.webp" />
            <p className={`${lang}-font`}>{localeText.generator}</p>
          </a>
          <a href="/profile">
            <img className="navbar-icon"
              alt="title"
              src={profileImage} />
            <p className={`${lang}-font`}>{profileName}</p>
          </a>
          <button onClick={() => setIsActive((prev) => !prev)}>
            <img className="navbar-icon"
              alt="title"
              src="/menu.svg" />
          </button>
        </div>
      </div>

      <div id="navbar-sidebar" className={`${isActive ? "active" : "idle"}`}>
        <a href="/profile">
          <img className="navbar-icon"
              alt="profile"
              src={profileImage} />
            <p className={`${lang}-font`}>{profileName}</p>
        </a>
        <a href="/characters">
          <img className="navbar-icon"
            alt="characters"
            src="/default.webp" />
          <p className={`${lang}-font`}>캐릭터 목록</p>
        </a>
        <a href="/card">
          <img className="navbar-icon"
            alt="generator"
            src="/default.webp" />
          <p className={`${lang}-font`}>스펙카드 생성기</p>
        </a>
      </div>
    </>
  )
}
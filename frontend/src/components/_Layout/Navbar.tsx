import { useState } from "react";
import Select from "react-select";
import type { SingleValue } from "react-select";

import { useAppStore } from "@/hooks/appStore";
import "@/components/_Layout/Navbar.css"

interface LangOption {
    value: "kr" | "en" | "jp" | "zh";
    label: string;
}

export default function Navbar() {

    const { lang, setLang } = useAppStore();
    const [isActive, setIsActive] = useState(false);

    return (
        <>
            <div id="navbar-body">
                <div className="item-slot">
                    <a href="/" className="title">
                        <img className="navbar-icon title"
                            alt="title"
                            src="/default.webp" />
                        <p className={`${lang}-font title`}>띵조 DEV</p>
                    </a>
                </div>
                <div className="item-slot">
                    <Select className="lang-select"
                        options={[
                            { value: "kr", label: "한국어" },
                            { value: "en", label: "English" },
                            { value: "jp", label: "日本語" },
                            { value: "zh", label: "中國語" },
                        ]}
                        onChange={(e: SingleValue<LangOption>) => {
                            if (e) setLang(e.value);
                        }} />
                    <a href="/characters">
                        <img className="navbar-icon"
                            alt="title"
                            src="/default.webp" />
                        <p className={`${lang}-font`}>캐릭터 목록</p>
                    </a>
                    <a href="/card">
                        <img className="navbar-icon"
                            alt="title"
                            src="/default.webp" />
                        <p className={`${lang}-font`}>스펙카드 생성기</p>
                    </a>
                    <a href="#">
                        <img className="navbar-icon"
                            alt="title"
                            src="/default.webp" />
                        <p className={`${lang}-font`}>로그인</p>
                    </a>
                    <button onClick={() => setIsActive((prev) => !prev)}>
                        <img className="navbar-icon"
                            alt="title"
                            src="/menu.svg" />
                    </button>
                </div>

            </div>
            <div id="navbar-sidebar" className={`${isActive ? "active" : "idle"}`}>
                <a href="#">
                    <img className="navbar-icon"
                        alt="title"
                        src="/default.webp" />
                    <p className={`${lang}-font`}>로그인</p>
                </a>
                <a href="#">
                    <img className="navbar-icon"
                        alt="title"
                        src="/default.webp" />
                    <p className={`${lang}-font`}>캐릭터 목록</p>
                </a>
                <a href="#">
                    <img className="navbar-icon"
                        alt="title"
                        src="/default.webp" />
                    <p className={`${lang}-font`}>스펙카드 생성기</p>
                </a>
            </div>
        </>
    )
}
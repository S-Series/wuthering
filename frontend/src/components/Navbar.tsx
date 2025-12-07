import { useAppStore } from "@/hooks/appStore";
import Select from "react-select";
import type { SingleValue } from "react-select";
import "./Navbar.css";

interface LangOption {
    value: "kr" | "en" | "jp";
    label: string;
}

export default function Navbar() {

    const { lang, setLang } = useAppStore();

    return (
        <div id="navbar-body">
            <div className="item-slot">
                <a href="#" className="title">
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
                    ]}
                    onChange={(e: SingleValue<LangOption>) => {
                        if (e) setLang(e.value);
                    }} />
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
                <a href="#">
                    <img className="navbar-icon"
                        alt="title"
                        src="/default.webp" />
                    <p className={`${lang}-font`}>로그인</p>
                </a>
                <button>
                    <img className="navbar-icon"
                        alt="title"
                        src="/menu.svg" />
                </button>
            </div>
        </div>
    )
}
import "@/components/_Layout/Footer.css"
import { Link } from "react-router-dom";
import { useAppStore } from "@/stores/appStore";

const FOOTER_LINKS = {
    kr: ["서비스 소개", "사용법", "점수 계산 기준", "개인정보처리방침", "이용약관"],
    en: ["About", "Guide", "Scoring", "Privacy Policy", "Terms"],
    jp: ["サービス紹介", "使い方", "スコア基準", "プライバシーポリシー", "利用規約"],
    zh: ["关于", "使用指南", "评分标准", "隐私政策", "使用条款"],
};
const FOOTER_PATHS = ["/about", "/guide", "/guide/scoring", "/privacy", "/terms"];

const FOOTER_TEXT = `Contact: SSeries000923@gmail.com\nWuthering Waves and all related assets are © Kuro Games.\nThis website is an unofficial fan project and is not affiliated with Kuro Games.`

export default function Footer() {
    const { lang } = useAppStore();

    return (
        <div id="footer-body">
            <div className="footer-information">
                <nav className={`footer-links ${lang}-font`} aria-label={lang === "kr" ? "서비스 안내 및 정책" : "Information and policies"}>
                    {FOOTER_PATHS.map((path, index) => <Link key={path} to={path}>{FOOTER_LINKS[lang][index]}</Link>)}
                </nav>
                <div className="item-slot en-font footer-disclaimer">{FOOTER_TEXT}</div>
            </div>
            <div className="item-slot footer-social">
                <a target="_blank" rel="noopener noreferrer" href="https://ko-fi.com/sseries">
                    <img className="footer-icon"
                        alt="Ko-fi"
                        src="/kofi.png" />
                </a>
                <a target="_blank" rel="noopener noreferrer" href="https://github.com/S-Series">
                    <img className="footer-icon"
                        alt="GitHub"
                        src="/github.png" />
                </a>
                <a target="_blank" rel="noopener noreferrer" href="https://sseries.dev">
                    <img className="footer-icon"
                        alt="SSeries"
                        src="/sseries.png" />
                </a>
            </div>
        </div>
    )
}

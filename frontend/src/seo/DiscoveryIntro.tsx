import { Link } from "react-router-dom";
import type { LangType } from "@/stores/appStore";
import "./discovery.css";

const copy = {
  kr: {
    home: "명조 캐릭터 스펙 확인과 에코 세팅 공유",
    description: "WuWa DEV(띵조 DEV)는 명조: 워더링 웨이브의 캐릭터·무기·에코 세팅을 정리하는 비공식 팬 도구입니다. 최종 스탯과 에코 점수를 확인하고, 내 세팅을 스펙카드 이미지로 만들어 공유하세요.",
    card: "명조 스펙카드 생성기", start: "스펙카드 만들기", guide: "사용법·에코 OCR", scoring: "CV·TV 점수 계산 기준",
    steps: "캐릭터와 무기 선택 → 에코 직접 입력 또는 OCR → 스탯 확인 → 이미지 생성·다운로드",
  },
  en: {
    home: "Wuthering Waves character stats and Echo builds",
    description: "WuWa DEV is an unofficial fan tool for character, weapon and Echo builds. Check final stats and Echo scores, then create a spec card image to share your build.",
    card: "Wuthering Waves spec card generator", start: "Create a spec card", guide: "Guide & Echo OCR (Korean)", scoring: "CV & TV scoring (Korean)",
    steps: "Choose a character and weapon → Enter Echoes or use OCR → Check stats → Generate and download",
  },
  jp: {
    home: "鳴潮のステータス確認と音骸ビルド共有",
    description: "WuWa DEVはキャラクター・武器・音骸の設定をまとめる非公式ファンツールです。最終ステータスと音骸スコアを確認し、カード画像を作成して共有できます。",
    card: "鳴潮スペックカード生成", start: "カードを作成", guide: "使い方・音骸OCR（韓国語）", scoring: "CV・TVの計算基準（韓国語）",
    steps: "キャラクターと武器を選択 → 音骸を手入力・OCR → ステータス確認 → 画像生成・保存",
  },
  zh: {
    home: "鸣潮角色属性查询与声骸配装分享",
    description: "WuWa DEV是整理角色、武器与声骸配装的非官方粉丝工具。查看最终属性与声骸评分，生成属性卡图片并分享配装。",
    card: "鸣潮属性卡生成器", start: "制作属性卡", guide: "使用方法与声骸OCR（韩语）", scoring: "CV与TV评分标准（韩语）",
    steps: "选择角色和武器 → 手动或OCR输入声骸 → 确认属性 → 生成并下载图片",
  },
};

export function HomeIntro({ lang = "kr" }: { lang?: LangType }) {
  const text = copy[lang];
  return <section className={`discovery-intro ${lang}-font`}>
    <h1>{text.home}</h1>
    <p>{text.description}</p>
    <nav aria-label={text.card} className="discovery-links">
      <Link className="discovery-primary" to="/card">{text.start}</Link>
      <Link to="/guide">{text.guide}</Link>
      <Link to="/guide/scoring">{text.scoring}</Link>
    </nav>
  </section>;
}

export function CardIntro({ lang = "kr" }: { lang?: LangType }) {
  const text = copy[lang];
  return <section className={`discovery-intro discovery-compact ${lang}-font`}>
    <h1>{text.card}</h1>
    <p>{text.steps}</p>
    <nav aria-label={text.guide} className="discovery-links">
      <Link to="/guide">{text.guide}</Link>
      <Link to="/guide#card-example">{lang === "kr" ? "스펙카드 구성 예시" : text.start}</Link>
      <Link to="/guide/scoring">{text.scoring}</Link>
    </nav>
  </section>;
}

import { character } from "@/datas/characters";

export const SITE_ORIGIN = "https://wuwa.dev";

export type PageMetadata = {
  title: string;
  description: string;
  canonical?: string;
  noindex?: boolean;
};

// Shared by the build-time HTML and client navigation.
export const publicPages: Record<string, PageMetadata> = {
  "/": {
    title: "명조 스펙카드·에코 세팅 | WuWa DEV",
    description: "명조 캐릭터 스펙과 에코 세팅을 확인하고 공유하세요. WuWa DEV(띵조 DEV)는 에코 OCR 입력, CV·TV 점수 계산과 스펙카드 이미지 생성을 지원합니다.",
  },
  "/card": {
    title: "명조 스펙카드 만들기·생성기 | WuWa DEV",
    description: "캐릭터·무기·에코를 설정해 명조 스펙카드를 만드세요. 스크린샷 OCR로 에코 정보를 입력하고, 최종 스탯과 CV·TV 점수를 확인해 이미지로 저장할 수 있습니다.",
  },
  "/guide": {
    title: "명조 스펙카드 사용법·에코 OCR 안내 | WuWa DEV",
    description: "명조 스펙카드 생성기의 캐릭터·무기 설정, 에코 OCR 입력, 인식 오류 해결과 이미지 다운로드 방법을 단계별로 확인하세요.",
  },
  "/guide/scoring": {
    title: "명조 에코 점수 계산·CV·TV 기준 | WuWa DEV",
    description: "명조 에코 CV 계산식과 캐릭터별 TV(AV) 평가 기준을 알아보세요. 치명타 확률 보정, 공명 효율 감점과 전체 세팅 점수가 달라지는 이유를 예시로 설명합니다.",
  },
  "/about": { title: "명조 스펙·에코 세팅 도구 소개 | WuWa DEV", description: "명조 캐릭터 스펙 확인, 에코 세팅과 스펙카드 이미지 공유를 돕는 비공식 팬 도구 WuWa DEV(띵조 DEV)를 소개합니다." },
  "/privacy": { title: "개인정보처리방침 | WuWa DEV", description: "WuWa DEV(띵조 DEV)의 개인정보 처리, OCR 이미지 전송, 브라우저 저장과 계정 데이터 관리 안내입니다." },
  "/terms": { title: "이용약관 | WuWa DEV", description: "WuWa DEV(띵조 DEV)의 스펙카드 생성기 및 커뮤니티 이용약관입니다." },
};

export const notFoundMetadata: PageMetadata = {
  title: "페이지를 찾을 수 없습니다 | WuWa DEV",
  description: "요청한 페이지가 없습니다. 홈이나 명조 스펙카드 생성기로 이동하세요.",
  noindex: true,
};

export function getPageMetadata(pathname: string): PageMetadata {
  const path = pathname.replace(/\/+$/, "") || "/";
  if (publicPages[path]) return { ...publicPages[path], canonical: path };
  // Character-specific editor URLs are aliases, not separate build guides.
  if (/^\/card\/[^/]+$/.test(path)) return Object.hasOwn(character, path.slice(6))
    ? { ...publicPages["/card"], canonical: "/card" } : notFoundMetadata;
  const applicationPages: Record<string, string> = {
    "/characters": "캐릭터 목록", "/profile": "프로필", "/board": "게시판",
    "/debug": "디버그", "/dev": "개발 도구", "/test": "OCR 테스트",
  };
  const section = Object.keys(applicationPages).find(key => path === key
    || (key === "/board" && /^\/board\/[^/]+(?:\/edit)?$/.test(path))
    || (key === "/dev" && /^\/dev\/(?:ocr|analystic|test)$/.test(path)));
  if (section) {
    const noindex = !["/characters", "/board"].includes(section) || path === "/board/write" || /^\/board\/[^/]+\/edit$/.test(path);
    return { title: `${applicationPages[section]} | WuWa DEV`, description: "WuWa DEV의 캐릭터 세팅 및 서비스 도구입니다.", noindex, canonical: noindex ? undefined : path };
  }
  return notFoundMetadata;
}

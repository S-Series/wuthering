import type { LocaleSchema } from "./locale.schema";

export const kr = {
  common: {
    open: "열기",
    close: "닫기",
    select: "선택",
  },
  navbar: {
    title: "띵조 DEV",
    characters: "캐릭터 목록",
    generator: "스펙카드 생성기",
    login: "로그인",
  },
  home: {
    title1: "공지사항",
    title2: "인게임 정보",
    title3: "캐릭터 진열장",
    video1: "버전 트레일러",
    video2: "캐릭터 트레일러",
    video3: "공명자 전투모션",
    click: "클릭하여 영상 재생",
  },
  card: {
    help: "ⓘ 도움말",
    request: "이미지 파일 생성",
    download: "이미지 파일 다운로드",
    plate1: "명함 이미지 초기화",
    plate2: "명함 출처 초기화",
    image1: "캐릭터 이미지 초기화",
    image2: "캐릭터 출처 초기화",
    scoreboard: "§에코 점수표 ↗",
    cMenu: "캐릭터 선택",
    wMenu: "무기 선택",
    eMenu: "에코 선택",
    oMenu: "에코 데이터 관리",
  },
  ocr: {
    status: "요청 상태",
    request: "OCR 요청",
    loading: "OCR 로딩중...",
    result: "OCR 결과",
    description1: "클릭해서 시작",
    description2: `클릭해서 이미지파일을 선택\n혹은\n"Ctrl+V"로 이미지 붙여넣기`,
    description3: `낮잠자는 서버를 깨우고 있습니다...\n첫 요청은 20~30초 정도 걸릴 수 있습니다\n사용자님의 인내에 감사드립니다 :)`,
    healthCheck: `OCR서버 상태 확인중`,
    healthFalse: `OCR서버와 연결에 실패했습니다.\n문제가 지속될경우 관리자에게 연락 바랍니다`,
  }
} satisfies LocaleSchema;

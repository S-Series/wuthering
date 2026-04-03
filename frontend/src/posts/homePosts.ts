import type { LangType } from "@/stores/appStore";

export type LocaleText = Record<LangType, string>;

export type HomePost = {
  id: number;
  pinned?: boolean;
  type: "update" | "notice" | "event";
  date: string;
  title: LocaleText;
  data: LocaleText;
};

const SERVICE_NAME: LocaleText = {
  kr: "띵데브",
  en: "WuWa DEV",
  jp: "",
  zh: "",
};

export const HOME_POSTS: HomePost[] = [
  {
    id: 3,
    pinned: false,
    type: "notice",
    date: "2026-04-02 19:09:35",
    title: {
      kr: `Ver 0.9 || ${SERVICE_NAME.kr} 업데이트 내역`,
      en: ``,
      jp: ``,
      zh: ``,
    },
    data: {
      kr: `§ 이제 스텟카드 이미지를 생성/다운로드 할 수 있습니다.
§ 일부 잘못된 옵션들의 수치를 수정하였습니다.
§ OCR 서버 안정화를 진행하였습니다.
§ 에코 관리에서, 옵션이 제대로 적용되지 않던 오류를 수정했습니다.
§ 이제 에코 선택에서 에코명으로 검색할 수 있습니다.`,
      en: ``,
      jp: ``,
      zh: ``,
    },
  },
  {
    id: 2,
    pinned: false,
    type: "notice",
    date: "2026-03-14 16:15:55",
    title: {
      kr: `V0.8 || ${SERVICE_NAME.kr} 업데이트 내역`,
      en: ``,
      jp: ``,
      zh: ``,
    },
    data: {
      kr: `§ 이제 홈 화면의 공식 유튜브영상을 재생할 수 있습니다.
§ 일부 점수계산에서 오류를 수정하였습니다.
§ 로그인/회원가입 기능이 활성화 되었습니다.`,
      en: ``,
      jp: ``,
      zh: ``,
    },
  },
  {
    id: 1,
    pinned: false,
    type: "notice",
    date: "2026-03-13 17:56:28",
    title: {
      kr: `${SERVICE_NAME.kr} 정식 오픈까지 얼마 남지 않았습니다!`,
      en: `We're Getting Close to the Official Launch of ${SERVICE_NAME.en}!`,
      jp: `${SERVICE_NAME.jp} 正式オープンまであとわずかです！`,
      zh: `${SERVICE_NAME.zh} 即将正式上线！`,
    },
    data: {
      kr: `${SERVICE_NAME.kr}를 찾아주신 여러분께 진심으로 감사드립니다.

현재 로그인 및 회원가입 기능, 이미지 생성 기능을 구현 중이며
일부 UI/UX 최적화 작업도 함께 진행되고 있습니다.

정식 오픈이 얼마 남지 않았습니다.
빠른 시일내에 다시 찾아뵙도록 노력하겠습니다.`,

      en: `Thank you very much for visiting ${SERVICE_NAME.en}.

We are currently implementing the login/signup system,
the image generation feature, and making several UI/UX improvements.

The official launch is just around the corner.
We look forward to welcoming you again very soon.`,

      jp: `${SERVICE_NAME.jp}をご利用いただき、誠にありがとうございます。

現在、ログイン・会員登録機能や画像生成機能の実装、
および一部UI/UXの最適化作業を進めております。

正式オープンまであとわずかです。
もう少しだけお待ちいただけますと幸いです。`,

      zh: `感谢您访问 ${SERVICE_NAME.zh}。

目前我们正在开发登录/注册功能、图片生成功能，
同时也在进行部分 UI/UX 的优化。

正式上线已经近在眼前。
请再稍作等待，我们会尽快与大家见面。`,
    },
  },
];

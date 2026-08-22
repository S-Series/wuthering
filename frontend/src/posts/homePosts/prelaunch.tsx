import type { HomePost } from "./types";
import { SERVICE_NAME } from "./serviceName";

export const HOME_POST_PRELAUNCH: HomePost = {
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
};

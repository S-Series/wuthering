import type { HomePost } from "./types";
import { SERVICE_NAME } from "./serviceName";

export const HOME_POST_0_8: HomePost = {
  id: 2,
  pinned: false,
  type: "notice",
  date: "2026-03-14 16:15:55",
  title: {
    kr: <span>{`Ver 0.8 || ${SERVICE_NAME.kr} 업데이트 내역`}</span>,
    en: <span>{`Ver 0.8 || ${SERVICE_NAME.en} Update Notes`}</span>,
    jp: <span>{`Ver 0.8 || ${SERVICE_NAME.jp} アップデート内容`}</span>,
    zh: <span>{`Ver 0.8 || ${SERVICE_NAME.zh} 更新内容`}</span>,
  },
  data: {
    kr: `§ 이제 홈 화면의 공식 유튜브영상을 재생할 수 있습니다.
§ 일부 점수계산에서 오류를 수정하였습니다.
§ 로그인/회원가입 기능이 활성화 되었습니다.`,
    en: `§ You can now play the official YouTube video on the home screen.
§ Fixed some errors in score calculation.
§ Login and sign-up features have been enabled.`,
    jp: `§ ホーム画面で公式YouTube動画を再生できるようになりました。
§ 一部のスコア計算の不具合を修正しました。
§ ログイン / 会員登録機能が有効になりました。`,
    zh: `§ 现在可以在首页播放官方 YouTube 视频了。
§ 修复了部分分数计算错误。
§ 登录 / 注册功能现已启用。`,
  },
};

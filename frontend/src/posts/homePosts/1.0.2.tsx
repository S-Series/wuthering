import type { HomePost } from "./types";
import { SERVICE_NAME } from "./serviceName";
import { ReleaseNote, ReleaseSection } from "./ReleaseNote";

export const HOME_POST_1_0_2: HomePost = {
  id: 9,
  pinned: false,
  type: "notice",
  date: "2026-08-08 16:56:51",
  title: {
    kr: <span>{`Ver 1.0.2 || ${SERVICE_NAME.kr} 버그 수정 안내`}</span>,
    en: <span>{`Ver 1.0.2 || ${SERVICE_NAME.en} Bug Fixes`}</span>,
    jp: <span>Ver 1.0.2 || 不具合修正のお知らせ</span>,
    zh: <span>Ver 1.0.2 || 问题修复公告</span>,
  },
  data: {
    kr: <ReleaseNote version="Ver 1.0.2" summary="로그인 흐름과 하모니 세트 계산 안정화">
      <ReleaseSection title="로그인 및 회원가입">
        <p>· 비밀번호 보안 규칙을 만족하지 못했을 때 필요한 조건이 표시되도록 수정했습니다.</p>
        <p>· 이메일/비밀번호 및 Google 인증 실패 시 화면에서 원인을 확인할 수 있도록 오류 안내를 보완했습니다.</p>
        <p>· Google 계정으로 회원가입 기능과 회원가입 화면의 다국어 문구를 추가했습니다.</p>
      </ReleaseSection>

      <ReleaseSection title="하모니 세트 효과">
        <p>· 하모니 5세트 발동 시 2세트 효과가 최종 스탯에 함께 적용되지 않던 문제를 수정했습니다.</p>
        <p>· 이제 현재 장착 개수로 발동한 모든 하위 세트 효과가 단계별로 누적됩니다.</p>
      </ReleaseSection>
    </ReleaseNote>,

    en: <ReleaseNote version="Ver 1.0.2" summary="More reliable authentication and Harmony Set calculations">
      <ReleaseSection title="Login and Sign-up">
        <p>· Password requirements are now shown when a password does not meet the security policy.</p>
        <p>· Error guidance has been improved for email/password and Google authentication failures.</p>
        <p>· Sign up with Google and localized sign-up text have been added.</p>
      </ReleaseSection>

      <ReleaseSection title="Harmony Set Effects">
        <p>· Fixed an issue where a 5-piece Harmony effect did not include its 2-piece effect in final stats.</p>
        <p>· All lower set tiers activated by the equipped piece count now stack correctly.</p>
      </ReleaseSection>
    </ReleaseNote>,

    jp: <ReleaseNote version="Ver 1.0.2" summary="ログイン処理とハーモニーセット計算を安定化">
      <ReleaseSection title="ログイン・新規登録">
        <p>· パスワードがセキュリティ要件を満たしていない場合、必要な条件を表示するよう修正しました。</p>
        <p>· メールアドレス/パスワードおよびGoogle認証に失敗した際のエラー案内を改善しました。</p>
        <p>· Googleでの新規登録と、新規登録画面の多言語表示を追加しました。</p>
      </ReleaseSection>

      <ReleaseSection title="ハーモニーセット効果">
        <p>· 5セット効果の発動時に、2セット効果が最終ステータスへ反映されない不具合を修正しました。</p>
        <p>· 装備数によって発動する下位のセット効果も、段階ごとに正しく累積されます。</p>
      </ReleaseSection>
    </ReleaseNote>,

    zh: <ReleaseNote version="Ver 1.0.2" summary="提升登录流程与声骸套装计算的稳定性">
      <ReleaseSection title="登录与注册">
        <p>· 密码不符合安全规则时，现在会显示所需条件。</p>
        <p>· 完善了邮箱/密码及Google身份验证失败时的错误提示。</p>
        <p>· 新增使用Google账号注册，并为注册页面补充了多语言文本。</p>
      </ReleaseSection>

      <ReleaseSection title="声骸套装效果">
        <p>· 修复了触发5件套效果时，2件套效果未计入最终属性的问题。</p>
        <p>· 现在会按照装备数量，正确叠加所有已触发的低阶套装效果。</p>
      </ReleaseSection>
    </ReleaseNote>,
  },
};

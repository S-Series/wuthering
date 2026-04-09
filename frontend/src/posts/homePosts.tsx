import type { LangType } from "@/stores/appStore";

export type LocaleText = Record<LangType, React.ReactNode>;

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
    id: 4,
    pinned: false,
    type: "notice",
    date: "2026-04-09 15:40:36",
    title: {
      kr: <span>{`Ver 0.9.1 || ${SERVICE_NAME.kr} 업데이트 내역`}</span>,
      en: <span>{`Ver 0.9.1 || ${SERVICE_NAME.en} Update Notes`}</span>,
      jp: <span>{`Ver 0.9.1 || ${SERVICE_NAME.jp} アップデート内容`}</span>,
      zh: <span>{`Ver 0.9.1 || ${SERVICE_NAME.zh} 更新内容`}</span>,
    },
    data: {
      kr: <div className="home-post-detail-slot">
        <span className="subtitle">§ 기능 개선</span>
        <p>· 점수 시스템을 개선하였습니다.</p>
        <p>· 이제 캐릭터 점수는 <em>실제 DPS</em>를 어느정도 반영합니다.</p>
        <p>· 캐릭터별로 <em>공효 요구치</em> 및 <em>에코 주옵션</em> 관련 보정이 들어갑니다.</p>
      </div>,

      en: <div className="home-post-detail-slot">
        <span className="subtitle">§ Feature Improvements</span>
        <p>· The scoring system has been improved.</p>
        <p>· Character scores now reflect <em>actual DPS</em> to some extent.</p>
        <p>· Adjustments are now applied based on each character’s <em>required ER</em> and <em>Echo main stats</em>.</p>
      </div>,

      jp: <div className="home-post-detail-slot">
        <span className="subtitle">§ 機能改善</span>
        <p>・スコアシステムを改善しました。</p>
        <p>・キャラクタースコアが、ある程度 <em>実際のDPS</em> を反映するようになりました。</p>
        <p>・キャラクターごとに <em>必要共鳴効率</em> と <em>エコーのメインステータス</em> に関する補正が適用されます。</p>
      </div>,

      zh: <div className="home-post-detail-slot">
        <span className="subtitle">§ 功能优化</span>
        <p>· 评分系统已优化。</p>
        <p>· 角色评分现在会在一定程度上反映 <em>实际DPS</em>。</p>
        <p>· 现已根据不同角色的 <em>共鸣效率需求</em> 与 <em>声骸主词条</em> 进行修正。</p>
      </div>,
    },
  },
  {
    id: 3,
    pinned: false,
    type: "notice",
    date: "2026-04-05 16:27:25",
    title: {
      kr: <span>{`Ver 0.9 || ${SERVICE_NAME.kr} 업데이트 내역`}</span>,
      en: <span>{`Ver 0.9 || ${SERVICE_NAME.en} Update Notes`}</span>,
      jp: <span>{`Ver 0.9 || ${SERVICE_NAME.jp} アップデート内容`}</span>,
      zh: <span>{`Ver 0.9 || ${SERVICE_NAME.zh} 更新内容`}</span>,
    },
    data: {
      kr: <div className="home-post-detail-slot">
        <span className="subtitle start">§ 버그 수정</span>
        <p>· 일부 잘못된 옵션들의 수치를 수정하였습니다.</p>
        <p>· 일부 캐릭터에 유효옵션이 잘못 적용되던 문제를 해결했습니다.</p>
        <p>· 에코 관리에서, 옵션이 제대로 적용되지 않던 오류를 수정했습니다.</p>

        <span className="subtitle">§ 기능 개선</span>
        <p>· OCR 서버 안정화를 진행하였습니다.</p>
        <p>· 이제 스텟카드 <em>이미지를 생성 및 다운로드</em> 할 수 있습니다.</p>
        <p>· 이제 에코 선택에서 에코명으로 검색할 수 있습니다.</p>
        <p>· 이제 캐릭터 부옵션 점수가 실제 DPS를 약간 반영합니다.</p>

        <span className="subtitle">§ 그 외 변경내역</span>
        <p>· 홈화면 공지사항이 더욱 이뻐졌습니다 <em>지금 보시는 것 처럼요!</em></p>
        <p>· 에코 데이터 관리슬롯의 ui가 변경되었습니다.</p>
        <p>· 부하 및 비용문제로 인해 이미지 생성 쿨다운이 증가했습니다.</p>

        <span className="subtitle">§ 업데이트 예정 목록</span>
        <p>· 멤버쉽 및 캐릭터 세팅 클라우드 서비스 제공 예정</p>
        <p>· 공명 효율관련 점수 로직 최적화 예정</p>
        <p>· 캐릭터별 에코세트, 장비, 주옵션 추천순 정렬</p>
        <p>· 캐릭터별 스텟 요구치 표기 예정 (이잘키 참고 예정)</p>
        <p>· 캐릭터 목록에서 검색 및 필터기능 추가</p>
      </div>,

      en: <div className="home-post-detail-slot">
        <span className="subtitle start">§ Bug Fixes</span>
        <p>· Corrected some incorrect option values.</p>
        <p>· Fixed an issue where valid options were applied incorrectly to some characters.</p>
        <p>· Fixed an error where options were not being applied properly in Echo management.</p>

        <span className="subtitle">§ Improvements</span>
        <p>· Improved OCR server stability.</p>
        <p>· You can now <em>generate and download</em> stat card images.</p>
        <p>· You can now search by Echo name in the Echo selection menu.</p>
        <p>· Character substat scores now slightly reflect actual DPS.</p>

        <span className="subtitle">§ Other Changes</span>
        <p>· The home screen notices look much better now <em>just like what you're seeing right now!</em></p>
        <p>· The UI of the Echo data management slot has been updated.</p>
        <p>· Due to load and cost issues, the image generation cooldown has been increased.</p>

        <span className="subtitle">§ Planned Updates</span>
        <p>· Membership and cloud service for character settings</p>
        <p>· Score logic optimization for Resonance efficiency</p>
        <p>· Sorting recommendations for Echo sets, weapons, and main stats by character</p>
        <p>· Character stat requirement display planned</p>
        <p>· Search and filter functions will be added to the character list</p>
      </div>,

      jp: <div className="home-post-detail-slot">
        <span className="subtitle start">§ バグ修正</span>
        <p>· 一部の誤っていたオプション数値を修正しました。</p>
        <p>· 一部キャラクターに有効オプションが正しく適用されていなかった問題を修正しました。</p>
        <p>· エコー管理でオプションが正常に適用されなかった不具合を修正しました。</p>

        <span className="subtitle">§ 機能改善</span>
        <p>· OCRサーバーの安定化を行いました。</p>
        <p>· ステータスカード画像の<em>生成とダウンロード</em>ができるようになりました。</p>
        <p>· エコー選択でエコー名検索ができるようになりました。</p>
        <p>· キャラクターのサブオプションスコアが実際のDPSを少し反映するようになりました。</p>

        <span className="subtitle">§ その他の変更点</span>
        <p>· ホーム画面のお知らせ表示がさらに見やすくなりました <em>今見えているこんな感じです！</em></p>
        <p>· エコーデータ管理スロットのUIを変更しました。</p>
        <p>· 負荷とコストの都合により、画像生成のクールダウンが長くなりました。</p>

        <span className="subtitle">§ 今後のアップデート予定</span>
        <p>· メンバーシップおよびキャラクター設定のクラウドサービス対応予定</p>
        <p>· 共鳴効率関連のスコアロジック最適化予定</p>
        <p>· キャラクター別のエコーセット、装備、メインオプションおすすめ順ソート</p>
        <p>· キャラクター別の必要ステータス表示予定</p>
        <p>· キャラクター一覧に検索・フィルター機能追加予定</p>
      </div>,

      zh: <div className="home-post-detail-slot">
        <span className="subtitle start">§ 错误修复</span>
        <p>· 修正了部分错误的词条数值。</p>
        <p>· 修复了部分角色的有效词条被错误应用的问题。</p>
        <p>· 修复了在声骸管理中词条无法正常生效的问题。</p>

        <span className="subtitle">§ 功能改进</span>
        <p>· 提升了 OCR 服务器的稳定性。</p>
        <p>· 现在可以<em>生成并下载</em>属性卡图片了。</p>
        <p>· 现在可以在声骸选择中通过声骸名称进行搜索。</p>
        <p>· 现在角色副词条评分会稍微反映实际 DPS。</p>

        <span className="subtitle">§ 其他变更</span>
        <p>· 首页公告现在更好看了 <em>就像你现在看到的一样！</em></p>
        <p>· 声骸数据管理槽位的 UI 已更新。</p>
        <p>· 由于负载与成本问题，图片生成功能的冷却时间增加了。</p>

        <span className="subtitle">§ 计划更新内容</span>
        <p>· 计划提供会员功能及角色配置云服务</p>
        <p>· 计划优化与共鸣效率相关的评分逻辑</p>
        <p>· 按角色推荐排序声骸套装、装备与主词条</p>
        <p>· 计划显示各角色所需属性</p>
        <p>· 角色列表将增加搜索与筛选功能</p>
      </div>
    },
  },
  {
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

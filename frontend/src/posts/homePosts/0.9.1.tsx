import type { HomePost } from "./types";
import { SERVICE_NAME } from "./serviceName";

export const HOME_POST_0_9_1: HomePost = {
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
};

import type { HomePost } from "./types";
import { SERVICE_NAME } from "./serviceName";

export const HOME_POST_0_9_2: HomePost = {
  id: 5,
  pinned: false,
  type: "notice",
  date: "2026-04-14 15:32:54",
  title: {
    kr: <span>{`Ver 0.9.2 || ${SERVICE_NAME.kr} 업데이트 내역`}</span>,
    en: <span>{`Ver 0.9.2 || ${SERVICE_NAME.en} Update Notes`}</span>,
    jp: <span>{`Ver 0.9.2 || ${SERVICE_NAME.jp} アップデート内容`}</span>,
    zh: <span>{`Ver 0.9.2 || ${SERVICE_NAME.zh} 更新内容`}</span>,
  },
  data: {
    kr: <div className="home-post-detail-slot">
      <span className="subtitle">§ 버그 수정</span>
      <p>· 캐릭터 돌파시, 공명효율 요구치가 낮아지는게</p>
      <p className="indent">점수에 별도로 적용되지 않던 오류를 수정하였습니다.</p>
    </div>,

    en: <div className="home-post-detail-slot">
      <span className="subtitle">§ Bug Fix</span>
      <p>· Fixed an issue where, upon character breakthrough, the lowered</p>
      <p className="indent">Resonance Efficiency requirement was not separately reflected in the score.</p>
    </div>,

    jp: <div className="home-post-detail-slot">
      <span className="subtitle">§ 不具合修正</span>
      <p>· キャラクター突破時に、共鳴効率の必要値が下がることが</p>
      <p className="indent">スコアに個別で反映されていなかった不具合を修正しました。</p>
    </div>,

    zh: <div className="home-post-detail-slot">
      <span className="subtitle">§ 问题修复</span>
      <p>· 修复了角色突破时，共鸣效率需求降低的效果</p>
      <p className="indent">没有单独反映到评分中的问题。</p>
    </div>,
  },
};

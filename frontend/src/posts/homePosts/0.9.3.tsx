import type { HomePost } from "./types";
import { SERVICE_NAME } from "./serviceName";

export const HOME_POST_0_9_3: HomePost = {
  id: 6,
  pinned: false,
  type: "notice",
  date: "2026-06-15 00:12:30",
  title: {
    kr: <span>{`Ver 0.9.3 || ${SERVICE_NAME.kr} 업데이트 내역`}</span>,
    en: <span>{`Ver 0.9.3 || ${SERVICE_NAME.en} Update Notes`}</span>,
    jp: <span>{`Ver 0.9.3 || ${SERVICE_NAME.jp} アップデート内容`}</span>,
    zh: <span>{`Ver 0.9.3 || ${SERVICE_NAME.zh} 更新内容`}</span>,
  },
  data: {
    kr: <div className="home-post-detail-slot">
      <span className="subtitle">§ 기능추가</span>
      <p>· 스펙카드 생성 페이지 하단에, 육성 가이드가 추가되었습니다</p>
      <p className="indent">아직 데이터가 정리중이기에, 잘못된 데이터가 있을 수 있습니다.</p>
      <p className="indent">이 점, 유의하시고 사용자분들의 너그러운 양해 바랍니다.</p>
      <br/>
      <span className="subtitle">§ 데이터 추가</span>
      <p>· 3.4버전의 루시, 레베카, 루실라 등 데이터가 추가되었습니다.</p>
      <br/>
      <span className="subtitle">§ 기타 변경사항</span>
      <p>· 디자인 및 배치를 전반적으로 수정하고 있습니다.</p>
      <p className="indent">조금 더 세련되고 깔끔하게 바꾸고자 하고 있습니다.</p>
      <p className="indent">피드백은 언제든지 메일을 통해 알려주시기 바랍니다.</p>
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

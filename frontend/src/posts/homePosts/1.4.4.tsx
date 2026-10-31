import type { HomePost } from "./types";
import { ReleaseNote, ReleaseSection } from "./ReleaseNote";

export const HOME_POST_1_4_4: HomePost = {
  id: 17,
  pinned: false,
  type: "notice",
  date: "2026-10-31 00:00:00",
  title: {
    kr: <span>Ver 1.4.4 || 크리티컬 관련 점수 오류 수정</span>,
    en: <span>Ver 1.4.4 || Critical Rate Scoring Clarification</span>,
    jp: <span>Ver 1.4.4 || クリティカル率の採点説明を修正</span>,
    zh: <span>Ver 1.4.4 || 暴击率评分说明修正</span>,
  },
  data: {
    kr: <ReleaseNote version="Ver 1.4.4" summary="크리티컬 부옵 수치를 먼저 환산한 뒤 점수를 계산하는 과정을 명확히 했습니다">
      <ReleaseSection title="크리티컬 점수 환산 안내 수정">
        <p>· 크리티컬 보정이 완성된 점수 전체에 적용되는 것으로 오해할 수 있던 설명을 수정했습니다. 유효한 부옵 크리티컬 수치를 먼저 환산하고, 그 값에 크리티컬 배점과 전체 보정을 적용합니다.</p>
        <p>· 예를 들어 크리티컬 100%까지 필요한 부옵이 30%라면 환산 계수는 52.5 ÷ 30 = 1.75입니다. 부옵 크리티컬 6%는 점수 계산에서 10.5%로 환산됩니다.</p>
        <p>· 이번 환산 순서 정리는 기존 선형 계산식과 같은 점수를 산출합니다.</p>
      </ReleaseSection>
      <ReleaseSection title="환산 과정 확인">
        <p>· SCORE 도움말에서 유효 부옵 수치, 환산 계수와 점수용 환산값을 확인할 수 있습니다.</p>
        <p>· 100%를 넘기는 부옵 크리티컬은 제외하며, 실제 스탯과 CV는 원래 수치로 표시합니다. 쌍크리 보너스는 유지됩니다.</p>
      </ReleaseSection>
      <ReleaseSection title="저장된 점수 갱신">
        <p>· 이번 공지 버전을 처음 적용할 때 모든 캐릭터의 저장된 점수를 한 번 재계산합니다.</p>
      </ReleaseSection>
    </ReleaseNote>,
    en: <ReleaseNote version="Ver 1.4.4" summary="Clarified how useful Crit Rate substats are converted before scoring">
      <ReleaseSection title="Critical Rate Scoring Explanation">
        <p>· Corrected wording that could suggest the conversion factor multiplies an entire completed score. Useful Crit Rate substats are converted first, then scored using the Crit Rate weight and whole-score multiplier.</p>
        <p>· If 30% substat Crit Rate is needed to reach 100%, the conversion factor is 52.5 ÷ 30 = 1.75. A 6% Crit Rate substat is therefore scored as 10.5%.</p>
        <p>· This ordering clarification produces the same scores as the existing linear formula.</p>
      </ReleaseSection>
      <ReleaseSection title="View the Conversion">
        <p>· SCORE help now shows useful substats, the value conversion factor, and the converted value used for scoring.</p>
        <p>· Substat Crit Rate exceeding 100% is excluded. Actual stats and CV display the original values, and paired-crit bonuses are retained.</p>
      </ReleaseSection>
      <ReleaseSection title="Saved Score Refresh">
        <p>· All saved character scores are recalculated once when this notice version is first applied.</p>
      </ReleaseSection>
    </ReleaseNote>,
    jp: <ReleaseNote version="Ver 1.4.4" summary="有効なクリティカル率サブステータスを換算してから採点する流れを明確にしました">
      <ReleaseSection title="クリティカル率の採点説明を修正">
        <p>· 換算係数が完成済みスコア全体に掛かると誤解される可能性のある説明を修正しました。有効なサブステータスの数値を先に換算し、その値にクリティカル率の配点と全体補正を適用します。</p>
        <p>· 100%までに必要なサブステータスが30%なら、換算係数は52.5 ÷ 30 = 1.75です。6%のクリティカル率は採点時に10.5%として扱います。</p>
        <p>· 今回の換算順序の整理によるスコアは、従来の線形計算式と同じです。</p>
      </ReleaseSection>
      <ReleaseSection title="換算過程を確認">
        <p>· SCOREのヘルプで有効サブステータス、換算係数、採点用の換算値を確認できます。</p>
        <p>· 100%を超える分のクリティカル率サブステータスは除外します。実際のステータスとCVは元の数値で表示し、クリティカル率とダメージのペア加点も維持します。</p>
      </ReleaseSection>
      <ReleaseSection title="保存済みスコアの更新">
        <p>· このお知らせのバージョンを初めて適用する際、全キャラクターの保存済みスコアを一度再計算します。</p>
      </ReleaseSection>
    </ReleaseNote>,
    zh: <ReleaseNote version="Ver 1.4.4" summary="明确先换算有效暴击率副词条数值、再计算评分的流程">
      <ReleaseSection title="暴击率评分说明修正">
        <p>· 修正了可能让人误以为换算系数直接乘以已完成总评分的说明。先换算有效暴击率副词条数值，再对换算值应用暴击率权重与整体系数。</p>
        <p>· 如果达到100%暴击率所需的副词条为30%，换算系数为52.5 ÷ 30 = 1.75。因此，6%暴击率副词条在评分时按10.5%计算。</p>
        <p>· 本次换算顺序整理与原有线性公式得出的评分相同。</p>
      </ReleaseSection>
      <ReleaseSection title="查看换算过程">
        <p>· SCORE帮助中可查看有效副词条、数值换算系数与评分用换算值。</p>
        <p>· 暴击率超过100%的副词条部分不计分。实际属性与CV仍显示原始数值，并保留双暴加分。</p>
      </ReleaseSection>
      <ReleaseSection title="已保存评分更新">
        <p>· 首次应用本公告版本时，将重新计算所有角色已保存的评分一次。</p>
      </ReleaseSection>
    </ReleaseNote>,
  },
};

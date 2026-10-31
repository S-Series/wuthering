import type { HomePost } from "./types";
import { ReleaseNote, ReleaseSection } from "./ReleaseNote";

export const HOME_POST_1_4_5: HomePost = {
  id: 18,
  pinned: false,
  type: "notice",
  date: "2026-10-31 00:00:00",
  title: {
    kr: <span>Ver 1.4.5 || 추천 장비 기본값 및 크리티컬 환산 상한 적용</span>,
    en: <span>Ver 1.4.5 || Recommended Loadout Defaults and Crit Rate Conversion Cap</span>,
    jp: <span>Ver 1.4.5 || 推奨装備の初期設定と会心率の換算上限</span>,
    zh: <span>Ver 1.4.5 || 推荐装备默认配置与暴击率换算上限</span>,
  },
  data: {
    kr: <ReleaseNote version="Ver 1.4.5" summary="추천 무기와 세트 조건을 SCORE에 반영하고 크리티컬 환산 합계 상한을 적용했습니다">
      <ReleaseSection title="추천 무기 기본 장착">
        <p>· 모든 캐릭터의 기본 무기를 추천 무기 1순위로 설정했습니다. 저장된 무기가 없거나 장착할 수 없는 무기인 경우에도 같은 기본값을 적용합니다.</p>
        <p>· 기존에 선택한 정상적인 무기와 돌파·재련 설정은 유지합니다. 저장 데이터가 없는 캐릭터도 기본 무기로 점수를 재계산합니다.</p>
      </ReleaseSection>
      <ReleaseSection title="추천 세트 조건부 효과 반영">
        <p>· SCORE 계산에는 실제 장착 세트와 관계없이 추천 1순위 세트의 조건부 효과가 발동한 것으로 가정합니다. 효과 정보는 encore.moe를 참고했습니다.</p>
        <p>· 특정 공격에만 적용되는 크리티컬도 SCORE에서는 순수 크리티컬 스탯으로 반영합니다. 실제 스탯에 이미 포함된 효과는 중복 가산하지 않습니다.</p>
        <p>· SCORE 도움말에서 세트 이름, 조건부 수치와 출처를 확인할 수 있습니다. 카드의 실제 스탯 표시와 이잘키 비교 기준은 그대로 유지합니다.</p>
      </ReleaseSection>
      <ReleaseSection title="크리티컬 환산 합계 상한">
        <p>· 유효 크리티컬 부옵 수치를 먼저 환산하되, 장착한 5부위의 점수용 환산 합계는 최대 52.5%로 제한합니다.</p>
        <p>· 환산 계수가 1.75이면 부옵 합계 25%는 43.75%, 30% 이상은 최대 52.5%까지만 채점합니다. 크리티컬 100% 초과분은 무효로 처리하고 쌍크리 보너스는 유지합니다.</p>
        <p>· 이번 공지를 처음 적용할 때 모든 캐릭터의 저장된 점수를 한 번 재계산합니다.</p>
      </ReleaseSection>
    </ReleaseNote>,
    en: <ReleaseNote version="Ver 1.4.5" summary="Added recommended weapon defaults, conditional set assumptions for SCORE, and a converted Crit Rate cap">
      <ReleaseSection title="Default Recommended Weapons">
        <p>· Every character now defaults to their first recommended weapon, including when a saved weapon is missing or incompatible.</p>
        <p>· Valid existing weapons, Resonance Chains, and refinement settings are preserved. Characters without saved data also use the default weapon when recalculating scores.</p>
      </ReleaseSection>
      <ReleaseSection title="Conditional Set Effects for SCORE">
        <p>· SCORE always assumes the first recommended set's conditional effects are active, regardless of equipped sets. Set information is based on encore.moe.</p>
        <p>· Attack-specific Crit Rate is treated as plain Crit Rate for scoring. Effects already included in actual stats are not added twice.</p>
        <p>· SCORE help shows the set name, conditional values, and source. Displayed actual stats and Yeejalky comparison rules are unchanged.</p>
      </ReleaseSection>
      <ReleaseSection title="Converted Crit Rate Cap">
        <p>· Useful Crit Rate substats are converted before scoring, with the equipped five-piece converted total capped at 52.5%.</p>
        <p>· With a factor of 1.75, a 25% substat total scores as 43.75%; totals of 30% or more score at most 52.5%. Crit Rate above 100% is ineffective, and paired-crit bonuses are retained.</p>
        <p>· All saved character scores are recalculated once when this notice is first applied.</p>
      </ReleaseSection>
    </ReleaseNote>,
    jp: <ReleaseNote version="Ver 1.4.5" summary="推奨武器の初期設定、SCORE用セット効果の仮定、会心率の換算上限を適用しました">
      <ReleaseSection title="推奨武器を初期装備に設定">
        <p>· 全キャラクターの初期武器を推奨1位の武器に設定しました。保存済み武器がない場合や装備できない場合にも適用します。</p>
        <p>· 既存の有効な武器、共鳴チェーン、ランク設定は維持します。保存データのないキャラクターも初期武器でスコアを再計算します。</p>
      </ReleaseSection>
      <ReleaseSection title="SCORE用の条件付きセット効果">
        <p>· SCOREでは実際の装備セットに関係なく、推奨1位セットの条件付き効果が発動したと仮定します。セット情報はencore.moeを参照しました。</p>
        <p>· 特定の攻撃だけに適用される会心率も、採点時には通常の会心率として扱います。実際のステータスに含まれる効果は重複加算しません。</p>
        <p>· SCOREのヘルプでセット名、条件付き数値、出典を確認できます。実際のステータス表示と育成目標の比較基準は維持します。</p>
      </ReleaseSection>
      <ReleaseSection title="会心率の換算合計上限">
        <p>· 有効な会心率サブステータスを先に換算し、装備5部位の採点用換算合計を最大52.5%に制限します。</p>
        <p>· 換算係数1.75の場合、合計25%は43.75%、30%以上は最大52.5%として採点します。会心率100%超過分は無効となり、会心ペア加点は維持します。</p>
        <p>· このお知らせを初めて適用する際、全キャラクターの保存済みスコアを一度再計算します。</p>
      </ReleaseSection>
    </ReleaseNote>,
    zh: <ReleaseNote version="Ver 1.4.5" summary="应用推荐武器默认配置、SCORE套装条件效果及暴击率换算上限">
      <ReleaseSection title="默认装备首选推荐武器">
        <p>· 所有角色默认装备首选推荐武器。已保存武器缺失或不兼容时，也会应用此默认配置。</p>
        <p>· 保留已有的有效武器、共鸣链与谐振设置。没有保存数据的角色也会使用默认武器重新计算评分。</p>
      </ReleaseSection>
      <ReleaseSection title="SCORE套装条件效果">
        <p>· 无论实际装备何种套装，SCORE均假定首选推荐套装的条件效果已触发。套装信息参考encore.moe。</p>
        <p>· 仅适用于特定攻击的暴击率，在评分时也按普通暴击率属性计入。实际属性中已包含的效果不会重复加算。</p>
        <p>· SCORE帮助中可查看套装名称、条件数值与来源。实际属性显示与培养目标比较规则保持不变。</p>
      </ReleaseSection>
      <ReleaseSection title="暴击率换算总和上限">
        <p>· 先换算有效暴击率副词条数值，再将已装备5部位的评分用换算总和限制为最高52.5%。</p>
        <p>· 换算系数为1.75时，副词条合计25%按43.75%评分，30%及以上最多按52.5%评分。暴击率超过100%的部分无效，双暴加分保留。</p>
        <p>· 首次应用本公告时，将重新计算所有角色已保存的评分一次。</p>
      </ReleaseSection>
    </ReleaseNote>,
  },
};

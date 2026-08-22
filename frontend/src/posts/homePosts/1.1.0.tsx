import type { HomePost } from "./types";
import { SERVICE_NAME } from "./serviceName";
import { ReleaseNote, ReleaseSection } from "./ReleaseNote";

export const HOME_POST_1_1_0: HomePost = {
  id: 10,
  pinned: false,
  type: "notice",
  date: "2026-08-22 00:00:00",
  title: {
    kr: <span>{`Ver 1.1.0 || ${SERVICE_NAME.kr} 공명 체인 업데이트`}</span>,
    en: <span>{`Ver 1.1.0 || ${SERVICE_NAME.en} Resonance Chain Update`}</span>,
    jp: <span>Ver 1.1.0 || 共鳴チェーンアップデート</span>,
    zh: <span>Ver 1.1.0 || 共鸣链更新</span>,
  },
  data: {
    kr: <ReleaseNote version="Ver 1.1.0" summary="돌파 효과까지 계산하는 더 정확한 스펙카드">
      <ReleaseSection title="공명 체인 스탯 계산">
        <p>· 선택한 캐릭터의 C1부터 C6까지 해금된 스탯 효과가 단계별로 누적되어 최종 스탯에 반영됩니다.</p>
        <p>· 공격력, HP, 방어력, 크리티컬, 크리티컬 피해, 공명 효율, 치유 보너스와 속성 피해 증가를 지원합니다.</p>
        <p>· 최대 스택이 명시된 조건부 효과와 본인에게도 적용되는 파티 효과는 표기된 최대 수치로 계산됩니다.</p>
      </ReleaseSection>

      <ReleaseSection title="효과 적용 기준 정리">
        <p>· 특정 공격이나 특정 스킬에만 적용되는 치명타 효과는 일반 캐릭터 스탯에 합산하지 않습니다.</p>
        <p>· 특정 피해의 치명타율·치명타 피해를 고정하는 효과도 기본 스탯을 덮어쓰지 않도록 제외했습니다.</p>
        <p>· 공격 속도, 수치가 확인되지 않은 효과와 일반 스탯으로 환산할 수 없는 효과는 설명 데이터로만 관리합니다.</p>
      </ReleaseSection>

      <ReleaseSection title="카드 및 콘텐츠 개선">
        <p>· 캐릭터 돌파 단계를 변경하면 카드의 최종 스탯이 즉시 다시 계산됩니다.</p>
        <p>· 무기 돌파 단계를 R1부터 R5까지로 정리하고, 선택 단계에 맞춰 무기 옵션 수치가 반영되도록 보완했습니다.</p>
        <p>· 청초를 포함한 최신 3.6 캐릭터·추천 정보와 관련 콘텐츠 데이터를 추가했습니다.</p>
      </ReleaseSection>

      <ReleaseSection title="버그 수정 및 안정화">
        <p>· 에이메스 등 특정 공격 전용 치명타 효과가 전체 스탯으로 잘못 계산되던 문제를 수정했습니다.</p>
        <p>· 하모니 5세트 적용 시 2세트 효과가 함께 누적되며, 로그인·회원가입 오류 안내도 안정화했습니다.</p>
        <p>· 라이트 모드, 오버레이와 반응형 카드 레이아웃의 가독성 문제를 추가로 정리했습니다.</p>
      </ReleaseSection>
    </ReleaseNote>,

    en: <ReleaseNote version="Ver 1.1.0" summary="More accurate stat cards with Resonance Chain bonuses">
      <ReleaseSection title="Resonance Chain Stats">
        <p>· Stat bonuses unlocked from C1 through the selected C6 stage now accumulate in final stats.</p>
        <p>· Supported bonuses include ATK, HP, DEF, Critical Rate, Critical Damage, Energy Regen, Healing Bonus, and attribute damage.</p>
        <p>· Conditional effects with stated stack limits and party effects that also apply to the character use their documented maximum values.</p>
      </ReleaseSection>

      <ReleaseSection title="Effect Calculation Rules">
        <p>· Critical bonuses limited to a specific attack or skill are no longer added to general character stats.</p>
        <p>· Effects that fix Critical Rate or Critical Damage for specific damage no longer overwrite base stats.</p>
        <p>· Attack Speed, unconfirmed values, and effects that cannot map to a general stat remain available as reference data only.</p>
      </ReleaseSection>

      <ReleaseSection title="Card and Content Improvements">
        <p>· Final card stats are recalculated immediately when the selected Resonance Chain stage changes.</p>
        <p>· Weapon Ranks are now consistently shown from R1 to R5, with option values calculated from the selected Rank.</p>
        <p>· Qingxiao and the latest Version 3.6 character, recommendation, and related content data have been added.</p>
      </ReleaseSection>

      <ReleaseSection title="Fixes and Stability">
        <p>· Fixed specific-attack critical effects, including Aemeath's, being incorrectly counted as global stats.</p>
        <p>· Harmony 5-piece effects now include their 2-piece effects, and login and sign-up error guidance remains stabilized.</p>
        <p>· Additional readability fixes were applied to Light mode, overlays, and responsive card layouts.</p>
      </ReleaseSection>
    </ReleaseNote>,

    jp: <ReleaseNote version="Ver 1.1.0" summary="共鳴チェーン効果まで反映する、より正確なステータスカード">
      <ReleaseSection title="共鳴チェーンのステータス計算">
        <p>· 選択したC1からC6までに解放されるステータス効果が、段階ごとに最終ステータスへ累積されます。</p>
        <p>· 攻撃力、HP、防御力、クリティカル率、クリティカルダメージ、共鳴効率、回復効果、属性ダメージに対応しました。</p>
        <p>· 最大スタックが明記された条件付き効果と、自身にも適用されるパーティ効果は記載上の最大値で計算されます。</p>
      </ReleaseSection>

      <ReleaseSection title="効果の適用基準">
        <p>· 特定の攻撃やスキルだけに適用されるクリティカル効果は、通常のキャラクターステータスへ加算しません。</p>
        <p>· 特定ダメージのクリティカル率・ダメージを固定する効果も、基本ステータスを上書きしないよう除外しました。</p>
        <p>· 攻撃速度、数値未確認の効果、通常ステータスへ換算できない効果は参照データとしてのみ管理します。</p>
      </ReleaseSection>

      <ReleaseSection title="カード・コンテンツ改善">
        <p>· 共鳴チェーンの段階を変更すると、カードの最終ステータスが即時に再計算されます。</p>
        <p>· 武器ランクをR1からR5に統一し、選択したランクに応じて武器オプションの数値を反映するよう改善しました。</p>
        <p>· 青梟を含むVer.3.6の最新キャラクター、おすすめ情報、関連コンテンツデータを追加しました。</p>
      </ReleaseSection>

      <ReleaseSection title="不具合修正・安定化">
        <p>· エイメスなどの特定攻撃専用クリティカル効果が、全体ステータスとして計算される問題を修正しました。</p>
        <p>· ハーモニー5セット効果に2セット効果が累積され、ログイン・新規登録時のエラー案内も安定化しました。</p>
        <p>· ライトモード、オーバーレイ、レスポンシブカードレイアウトの視認性をさらに改善しました。</p>
      </ReleaseSection>
    </ReleaseNote>,

    zh: <ReleaseNote version="Ver 1.1.0" summary="将共鸣链效果纳入计算，属性卡更加准确">
      <ReleaseSection title="共鸣链属性计算">
        <p>· 从C1到所选C6阶段解锁的属性效果，现在会逐级累计到最终属性中。</p>
        <p>· 支持攻击力、生命值、防御力、暴击率、暴击伤害、共鸣效率、治疗加成与属性伤害加成。</p>
        <p>· 标明最大层数的条件效果，以及同样作用于自身的队伍效果，会按照说明中的最大数值计算。</p>
      </ReleaseSection>

      <ReleaseSection title="效果应用规则">
        <p>· 仅作用于特定攻击或技能的暴击效果，不再计入角色通用属性。</p>
        <p>· 将特定伤害的暴击率或暴击伤害固定为指定值的效果，也不会再覆盖基础属性。</p>
        <p>· 攻击速度、数值尚未确认以及无法换算为通用属性的效果，仅保留为说明数据。</p>
      </ReleaseSection>

      <ReleaseSection title="属性卡与内容优化">
        <p>· 更改角色共鸣链阶段后，属性卡会立即重新计算最终属性。</p>
        <p>· 武器精炼阶段统一为R1至R5，并会根据当前选择正确计算武器词条数值。</p>
        <p>· 新增青枭以及3.6版本最新角色、推荐信息和相关内容数据。</p>
      </ReleaseSection>

      <ReleaseSection title="问题修复与稳定性">
        <p>· 修复了艾梅斯等角色的特定攻击暴击效果被错误计入全局属性的问题。</p>
        <p>· 和鸣5件套现在会同时累计2件套效果，并继续优化登录与注册时的错误提示。</p>
        <p>· 进一步改善了浅色模式、弹窗以及响应式属性卡布局的可读性。</p>
      </ReleaseSection>
    </ReleaseNote>,
  },
};

import type { HomePost } from "./types";
import { ReleaseNote, ReleaseSection } from "./ReleaseNote";

export const HOME_POST_1_4_3: HomePost = {
  id: 16,
  pinned: false,
  type: "notice",
  date: "2026-10-30 00:00:00",
  title: {
    kr: <span>Ver 1.4.3 || 캐릭터 SCORE 배점 조정</span>,
    en: <span>Ver 1.4.3 || Character SCORE Weight Updates</span>,
    jp: <span>Ver 1.4.3 || キャラクターSCORE配点の調整</span>,
    zh: <span>Ver 1.4.3 || 角色SCORE权重调整</span>,
  },
  data: {
    kr: <ReleaseNote version="Ver 1.4.3" summary="캐릭터의 피해 판정과 회전별 피해 비중을 반영해 SCORE 배점을 조정했습니다">
      <ReleaseSection title="피해 보너스 배점 조정">
        <p>· 데니아: 공명 스킬 피해 0, 공명 해방 피해 1.5.</p>
        <p>· 절지: 일반 공격 피해 1.4, 공명 스킬 피해 0.1, 공명 해방 피해 0.</p>
        <p>· 산화: 일반 공격 피해 0, 강공격 피해 0.4, 공명 스킬 피해 0.6, 공명 해방 피해 0.5.</p>
        <p>· 인멸 방랑자: 일반 공격 피해 0.55, 강공격 피해 0.05, 공명 스킬 피해 0.4, 공명 해방 피해 0.5.</p>
        <p>· 능양: 일반 공격 피해 0.75, 강공격 피해 0.05, 공명 스킬 피해 0.6, 공명 해방 피해 0.1.</p>
      </ReleaseSection>
      <ReleaseSection title="수수 조건부 배점 정리">
        <p>· 수수의 6돌 전용 배점을 제거했습니다. 돌파 단계와 관계없이 기본 배점을 사용합니다.</p>
      </ReleaseSection>
      <ReleaseSection title="저장된 점수 자동 갱신">
        <p>· 이번 공지 버전을 처음 적용할 때 모든 캐릭터의 저장된 점수를 한 번 재계산합니다.</p>
        <p>· 배점 변경으로 같은 장비에서도 SCORE와 에코 랭크가 달라질 수 있습니다.</p>
      </ReleaseSection>
    </ReleaseNote>,
    en: <ReleaseNote version="Ver 1.4.3" summary="Updated SCORE weights to reflect character damage classifications and rotation damage shares">
      <ReleaseSection title="Damage Bonus Weight Updates">
        <p>· Denia: Resonance Skill DMG 0; Resonance Liberation DMG 1.5.</p>
        <p>· Zhezhi: Basic Attack DMG 1.4; Resonance Skill DMG 0.1; Resonance Liberation DMG 0.</p>
        <p>· Sanhua: Basic Attack DMG 0; Heavy Attack DMG 0.4; Resonance Skill DMG 0.6; Resonance Liberation DMG 0.5.</p>
        <p>· Rover (Havoc): Basic Attack DMG 0.55; Heavy Attack DMG 0.05; Resonance Skill DMG 0.4; Resonance Liberation DMG 0.5.</p>
        <p>· Lingyang: Basic Attack DMG 0.75; Heavy Attack DMG 0.05; Resonance Skill DMG 0.6; Resonance Liberation DMG 0.1.</p>
      </ReleaseSection>
      <ReleaseSection title="Suisui Conditional Weights">
        <p>· Removed Suisui's S6-specific weights. All Resonance Chain levels now use the base weights.</p>
      </ReleaseSection>
      <ReleaseSection title="Automatic Saved Score Refresh">
        <p>· All saved character scores are recalculated once when this notice version is first applied.</p>
        <p>· SCORE values and Echo ranks may change with the same equipment because of the updated weights.</p>
      </ReleaseSection>
    </ReleaseNote>,
    jp: <ReleaseNote version="Ver 1.4.3" summary="ダメージ判定とローテーションごとのダメージ比率に合わせてSCORE配点を調整しました">
      <ReleaseSection title="ダメージボーナス配点の調整">
        <p>· Denia：共鳴スキルダメージ0、共鳴解放ダメージ1.5。</p>
        <p>· 折枝：通常攻撃ダメージ1.4、共鳴スキルダメージ0.1、共鳴解放ダメージ0。</p>
        <p>· 散華：通常攻撃ダメージ0、重撃ダメージ0.4、共鳴スキルダメージ0.6、共鳴解放ダメージ0.5。</p>
        <p>· 漂泊者（消滅）：通常攻撃ダメージ0.55、重撃ダメージ0.05、共鳴スキルダメージ0.4、共鳴解放ダメージ0.5。</p>
        <p>· 凌陽：通常攻撃ダメージ0.75、重撃ダメージ0.05、共鳴スキルダメージ0.6、共鳴解放ダメージ0.1。</p>
      </ReleaseSection>
      <ReleaseSection title="Suisuiの条件付き配点">
        <p>· Suisuiの6凸専用配点を削除しました。共鳴チェーンの段階にかかわらず基本配点を使用します。</p>
      </ReleaseSection>
      <ReleaseSection title="保存済みスコアの自動更新">
        <p>· このお知らせのバージョンを初めて適用する際、全キャラクターの保存済みスコアを一度再計算します。</p>
        <p>· 配点変更により、同じ装備でもSCOREや音骸ランクが変わる場合があります。</p>
      </ReleaseSection>
    </ReleaseNote>,
    zh: <ReleaseNote version="Ver 1.4.3" summary="根据角色伤害判定与循环中的伤害占比调整SCORE权重">
      <ReleaseSection title="伤害加成权重调整">
        <p>· Denia：共鸣技能伤害0，共鸣解放伤害1.5。</p>
        <p>· 折枝：普攻伤害1.4，共鸣技能伤害0.1，共鸣解放伤害0。</p>
        <p>· 散华：普攻伤害0，重击伤害0.4，共鸣技能伤害0.6，共鸣解放伤害0.5。</p>
        <p>· 漂泊者（湮灭）：普攻伤害0.55，重击伤害0.05，共鸣技能伤害0.4，共鸣解放伤害0.5。</p>
        <p>· 凌阳：普攻伤害0.75，重击伤害0.05，共鸣技能伤害0.6，共鸣解放伤害0.1。</p>
      </ReleaseSection>
      <ReleaseSection title="Suisui条件权重整理">
        <p>· 移除Suisui的六链专用权重。所有共鸣链阶段均使用基础权重。</p>
      </ReleaseSection>
      <ReleaseSection title="已保存评分自动更新">
        <p>· 首次应用本公告版本时，将重新计算所有角色已保存的评分一次。</p>
        <p>· 权重调整后，即使装备相同，SCORE与声骸评级也可能发生变化。</p>
      </ReleaseSection>
    </ReleaseNote>,
  },
};

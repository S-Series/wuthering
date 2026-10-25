import { useState } from 'react';
import { character } from '@/datas/characters';
import { FixedStats, type StatId } from '@/datas/stats';
import { harmony } from '@/datas/harmonies';
import { weaponDict } from '@/datas/weapon';
import type { TargetStatId } from '@/datas/buildTargets/types';
import { buildTargetText } from '@/locales/buildTargets';
import { BUILD_TARGET_CHECKED_AT, BUILD_TARGET_SOURCE_UPDATED_AT, BUILD_TIERS, FINAL_BUILD_SUBSTAT_TARGETS, evaluateBuildTargets, getBuildTargetProfile, getSuggestedVariant } from '@/runtime/buildTargets';
import { useAppStore } from '@/stores/appStore';
import type { CharacterData } from '@/types/character.type';
import './BuildTargetPanel.css';

export default function BuildTargetPanel({ data }: { data: CharacterData }) {
  const { lang } = useAppStore();
  const [choice, setChoice] = useState('auto');
  const text = buildTargetText[lang];
  const profile = getBuildTargetProfile(data.characterId);
  const suggested = getSuggestedVariant(data);
  const variant = profile.variants.find(item => item.id === choice) ?? suggested;
  const assessment = evaluateBuildTargets(data, variant);
  const rows = [profile.primary, 'resonanceBns', 'critRate', 'critDmg'].filter((id): id is TargetStatId => variant.baseline[id as TargetStatId] !== undefined);
  const statName = (id: StatId) => FixedStats[id][lang];
  const format = (id: TargetStatId, value: number) => `${Number(value.toFixed(1)).toLocaleString()}${['critRate','critDmg','resonanceBns'].includes(id) ? '%' : ''}`;
  const statList = (ids: StatId[]) => ids.map(statName).join(' / ');
  const variantName = (label: string) => ({ 권장:text.recommended, 오류:text.fallacy, 공효:text.energy }[label] ?? label);
  const setLabel = (profile.setRules ?? profile.sets.map(id => [{id,count:profile.setCount}])).map(rule => rule.map(item => `${harmony[item.id][lang]} ×${item.count}`).join(' + ')).join(' / ');

  return (
    <section className={`build-target-panel ${lang}-font`} aria-label={text.title}>
      <div className="build-target-panel__heading">
        <h2>{character[data.characterId][lang]} <span>{text.title}</span></h2>
        <strong className={`build-target-panel__result ${assessment.conditionsMatch ? assessment.tier ?? 'below' : 'mismatch'}`}>
          {assessment.conditionsMatch ? assessment.tier ? `${text[assessment.tier]} · ${text.reached}` : text.below : text.checkConditions}
        </strong>
        {profile.variants.length > 1 && <label className="build-target-panel__variant">
          <span>{text.conditions}</span>
          <select aria-label={text.conditions} value={choice} onChange={event => setChoice(event.target.value)}>
            <option value="auto">{text.auto} · {variantName(suggested.label)}</option>
            {profile.variants.map(item => <option value={item.id} key={item.id}>{item.costs.join('')} · {variantName(item.label)} · {statList(item.main4Exact ?? item.main4)}</option>)}
          </select>
        </label>}
      </div>

      <div className="build-target-panel__conditions">
        <div className={assessment.conditions.weapon ? 'matched' : 'different'}>
          <span>{text.weapon}</span>
          <b data-info-kind="weapon" data-info-id={profile.weaponId} tabIndex={0}>{weaponDict[profile.weaponId][lang]} · R1</b>
          <em>{assessment.conditions.weapon ? text.match : text.mismatch}</em>
        </div>
        <div className={assessment.conditions.mainOptions ? 'matched' : 'different'}>
          <span>{text.main}</span>
          <b>{variant.costs.join('')} · {text.cost4} {statList(variant.main4)} · {variant.costs.includes(3) && <>{text.exact3} {variant.main3 ? statList(variant.main3) : variant.main3Options ? variant.main3Options.map(pair=>pair.map(statName).join(' + ')).join(' | ') : statList(variant.allowed3)} · </>}{text.cost1} {statName(variant.main1)}</b>
          <em>{assessment.conditions.mainOptions ? text.match : text.mismatch}</em>
        </div>
        <div className={assessment.conditions.set ? 'matched' : 'different'}>
          <span>{text.set}</span><b>{setLabel}</b><em>{assessment.conditions.set ? text.match : text.mismatch}</em>
        </div>
      </div>

      <div className="build-target-panel__table-wrap">
        <table aria-label={`${character[data.characterId][lang]} ${text.title}`}>
          <thead><tr>
            <th scope="col">{text.stat}</th>
            <th scope="col" data-tooltip={text.normalizing} data-tooltip-description={text.normalizeHelp} tabIndex={0}>{text.current}<small>{text.normalizing}</small></th>
            {BUILD_TIERS.map(tier => <th scope="col" key={tier} className={assessment.passed[tier] ? 'reached' : ''}>{text[tier]}<small>{assessment.conditionsMatch ? `${rows.filter(id => (assessment.stats[id] ?? 0) >= (assessment.targets[tier][id] ?? 0)).length}/${rows.length}` : '—'}</small></th>)}
          </tr></thead>
          <tbody>{rows.map(id => <tr key={id}>
            <th scope="row" data-info-kind="stat" data-info-id={id} tabIndex={0}><img src={`/ico/stats/${id}.webp`} alt="" />{statName(id)}</th>
            <td className="current num-font">{format(id, assessment.stats[id] ?? 0)}</td>
            {BUILD_TIERS.map(tier => {
              const target = assessment.targets[tier][id]!;
              const reached = (assessment.stats[id] ?? 0) + 1e-6 >= target;
              const gain = target - assessment.targets.wellBuilt[id]!;
              const substat = id === 'atk' && profile.primary === 'atk' ? 'atkPct' : id === 'critDmg' ? 'critDmg' : null;
              const basis = tier === 'wellBuilt' ? text.sourceTarget
                : tier === 'nearFinal' ? `${text.midpoint}: (${format(id, assessment.targets.wellBuilt[id]!)} + ${format(id, assessment.targets.final[id]!)}) ÷ 2`
                : substat ? `${text.substatTotal}: ${statName(substat)} ${FINAL_BUILD_SUBSTAT_TARGETS[substat]}%. ${text.substatProjection}`
                : `${text.gain} ${gain >= 0 ? '+' : ''}${format(id, gain)}`;
              return <td key={tier} className={`${reached ? 'reached' : 'pending'} num-font`} tabIndex={0}
                data-tooltip={`${statName(id)} · ${text[tier]}`}
                data-tooltip-description={`${format(id, target)} · ${basis} · ${reached ? text.reached : `${text.missing} ${format(id, target - (assessment.stats[id] ?? 0))}`}`}>
                {format(id, target)}<span aria-hidden="true">{reached ? '✓' : '·'}</span>
              </td>;
            })}
          </tr>)}</tbody>
        </table>
      </div>

      <div className="build-target-panel__footnote">
        <span data-tooltip={text.normalizing} data-tooltip-description={text.normalizeHelp} tabIndex={0}>{text.normalizing} ⓘ</span>
        <a href={profile.sourceUrl} target="_blank" rel="noreferrer">{profile.sourceKind === 'community' ? text.source : text.supplement} ↗</a>
        {profile.supplementUrl && <a href={profile.supplementUrl} target="_blank" rel="noreferrer">{text.supplemented} ↗</a>}
        <span data-tooltip={text.policy} data-tooltip-description={text.policyHelp} tabIndex={0}>{text.policy} ⓘ</span>
      </div>
      <details className="build-target-panel__details">
        <summary>{text.details}</summary>
        <p>{text.normalizeHelp}</p><p>{text.policyHelp}</p><p>{text.referenceHelp}</p>
        {variant.mainStatAdjusted && <p>{lang === 'kr' ? '이 구성은 기준 무기의 크리티컬 옵션과 반대인 4코 주옵을 기준으로, 크리티컬 22%와 크리티컬 피해 44%를 서로 교환해 환산했습니다.' : 'This alternate 4-cost main swaps 22% Crit Rate for 44% Crit DMG relative to the main opposite the reference weapon’s crit stat.'}</p>}
        {(profile.sourceKind === 'supplement' || profile.supplementUrl) && <p>{text.provisionalHelp}</p>}
        {!!profile.supplementedStats?.length && <p>{text.supplemented}: {statList(profile.supplementedStats)}</p>}
        <p>{text.noCrit}</p>
        {profile.notes && <p><b>{text.originalNotes}: </b>{profile.notes}</p>}
        {profile.sourceKind === 'community' && <p>{text.sourceUpdated}: {BUILD_TARGET_SOURCE_UPDATED_AT}</p>}
        <p>{text.checked}: {BUILD_TARGET_CHECKED_AT} · <a href="/licenses/yeejalky-MIT.txt" target="_blank" rel="noreferrer">{text.license} (MIT)</a></p>
      </details>
    </section>
  );
}

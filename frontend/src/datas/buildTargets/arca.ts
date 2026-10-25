// Frozen user-supplied Arca wiki snapshot. No network access or external supplementation.
import snapshot from './arca-snapshot.json';
import { character } from '../characters';
import type { CharacterId } from '../characterStats';
import { weaponDict, type WeaponId } from '../weapon';
import { harmony, type HarmonyId } from '../harmonies';
import type { StatId } from '../stats';
import type { BuildTargetBaseline, BuildTargetVariant, TargetStats } from './types';

export const ARCA_SOURCE_URL = snapshot.source.url;
export const ARCA_SOURCE_UPDATED_AT = snapshot.source.documentTimeElements[0].text.slice(0, 10);
export const ARCA_CHECKED_AT = snapshot.source.extractedOn;
export const ARCA_SNAPSHOT_SHA256 = snapshot.source.inputSha256;
export const ARCA_UPDATE_POLICY = 'manual-user-request' as const;
type SourceRecord = (typeof snapshot.characters)[number];
const normalized = (text: string) => text.normalize('NFKC').replace(/\([^)]*\)/g, '').replace(/[\s_·,]/g, '');
const unique = <T,>(items: T[]) => [...new Set(items)];
const number = (text?: string): number | undefined => {
  const match = text?.match(/\d+(?:\.\d+)?/);
  return match ? Number(match[0]) : undefined;
};

function weaponId(raw: string): WeaponId | null {
  const first = raw.split(',')[0].split('[')[0].trim();
  const aliases: Record<string, string> = { '죽음의 춤': '죽음과 춤', '별의 교향곡': '뭇별의 교향곡' };
  const name = normalized(aliases[first] ?? first);
  return Object.values(weaponDict).find(weapon => normalized(weapon.kr) === name)?.id ?? null;
}

function statIds(text: string, element: string): StatId[] {
  const tokens = text.replace(/\[[^\]]*\]/g, '').match(/크리티컬 피해|크피|크확|크리티컬|치료 효과 보너스|치유보|체퍼|체%|방어력|공명효율|공효|공퍼|공%|(?:기류|용융|응결|전도|인멸|회절)?피증/g) ?? [];
  return tokens.map(token => {
    if (token === '크피' || token === '크리티컬 피해') return 'critDmg';
    if (token === '크확' || token === '크리티컬') return 'critRate';
    if (token === '치유보' || token === '치료 효과 보너스') return 'healBns';
    if (token === '체퍼' || token === '체%') return 'hpPct';
    if (token === '방어력') return 'defPct';
    if (token === '공효' || token === '공명효율') return 'resonanceBns';
    if (token === '공퍼' || token === '공%') return 'atkPct';
    return `${element}Bns` as StatId;
  });
}

function setRules(raw: string): { id: HarmonyId; count: number }[][] {
  raw = raw.replaceAll('울부짖는 늑대의 불꽃', '울부짖는 불꽃');
  const found = Object.values(harmony).flatMap(set => {
    const offset = normalized(raw).indexOf(normalized(set.kr));
    if (offset < 0) return [];
    const tail = normalized(raw).slice(offset + normalized(set.kr).length);
    const count = Number(tail.match(/^\[(\d)세트/)?.[1] ?? 5);
    return [{ id: set.id, count }];
  });
  const full = found.filter(item => item.count === 5).map(item => [item]);
  const three = found.filter(item => item.count === 3);
  const two = found.filter(item => item.count === 2);
  const one = found.filter(item => item.count === 1);
  if (three.length) return [...full, ...three.flatMap(base => two.map(extra => [base, extra]))];
  if (one.length) return [...full, ...one.flatMap(base => two.flatMap((a, i) => two.slice(i + 1).map(b => [base, a, b])))];
  return full;
}

function primaryValue(raw: string, label: string, cost: string): number | undefined {
  const values = [...raw.matchAll(/(\d+(?:\.\d+)?)\[([^\]]+)\]/g)];
  if (values.length) {
    const selected = values.find(match => match[2] === label || match[2] === cost);
    if (selected) return Number(selected[1]);
    if (values.some(match => /^(속속|속공|공공|\d{5})$/.test(match[2]))) return undefined;
  }
  return number(raw);
}

function energyValue(raw: string): number | undefined {
  // Conditional targets are retained as source text until a variant explicitly selects them.
  if (raw.includes('피증+')) return undefined;
  const recommended = raw.match(/(\d+)\[권장\]/);
  if (recommended) return Number(recommended[1]);
  const range = raw.match(/^(\d+)\s*~\s*(\d+)/);
  return range ? Number(range[2]) : number(raw);
}

function variants(source: SourceRecord, primary: 'atk' | 'hp' | 'def'): BuildTargetVariant[] {
  const id = source.characterId as CharacterId;
  const element = character[id].element;
  const rawStats = source.sourceStats as Record<string, string | undefined>;
  const primaryRaw = rawStats[{ atk: '공격력', hp: '체력', def: '방어력' }[primary]] ?? '';
  const mainRows = source.echoMainOptionRows;
  const first = mainRows[0];
  const result: BuildTargetVariant[] = [];
  for (const row of mainRows) {
    const layouts = (row === first ? row[1] : row[0]).match(/\d{5}/g) ?? [];
    for (const layout of layouts) {
      const costs = layout.split('').map(Number);
      const count4 = costs.filter(cost => cost === 4).length;
      const count3 = costs.filter(cost => cost === 3).length;
      const body = row.slice(row === first ? 2 : 1);
      let main4 = count4 ? unique(statIds(body[0] ?? '', element)) : [];
      // These choices are explicitly conditional on Chain in the source notes.
      if (id === 'changli' || id === 'lupa') main4 = ['critRate'];
      const main4Exact = count4 === 2 && body[1] && statIds(body[1], element).every(stat => stat === 'critRate' || stat === 'critDmg')
        ? [statIds(body[0], element)[0], statIds(body[1], element)[0]] : undefined;
      if (main4Exact) main4 = unique(main4Exact);
      let main1: StatId | null = null;
      const explicit1 = body.find(text => /1코|X\s*3/.test(text));
      if (explicit1) main1 = statIds(explicit1, element).find(stat => stat.endsWith('Pct')) ?? null;
      if (count4 === 1 && body.length >= 5) main1 = statIds(body[3], element)[0] ?? null;
      if (source.equipmentRows.some(row => row.some(text => text.includes('1코스트는 체퍼')))) main1 = 'hpPct';
      let pairs: StatId[][] = [];
      if (count3) {
        const cells = count4 ? body.slice(1) : body;
        pairs = cells.map(text => statIds(text, element)).filter(pair => pair.length === count3);
        if (pairs.length === 0 && cells.length >= count3) {
          const pair = cells.slice(0, count3).map(text => statIds(text, element)[0]);
          if (pair.every(Boolean)) pairs = [pair];
        }
        if (count3 === 1) {
          const explicit3 = body.find(text => text.includes('3코'));
          if (explicit3) pairs = [[statIds(explicit3.split('1코')[0], element)[0]]];
        }
        // The source explicitly permits two ATK mains for Sigrika with enough ER subs.
        if (id === 'sigrika' && !pairs.some(pair => pair.every(stat => stat === 'atkPct'))) pairs.push(['atkPct', 'atkPct']);
      }
      const labeled = [...primaryRaw.matchAll(/\d+\[(속속|속공|공공)\]/g)].map(match => match[1]);
      const selections = labeled.length ? unique(labeled) : ['권장'];
      for (const label of selections) {
        const selectedPairs = labeled.length ? pairs.filter(pair => {
          const atk = pair.filter(stat => stat === 'atkPct').length;
          return label === '공공' ? atk === 2 : label === '속공' ? atk === 1 : atk === 0;
        }) : pairs;
        if (count3 && selectedPairs.length === 0) continue;
        const baseline: TargetStats = {};
        const value = primaryValue(primaryRaw, label, layout);
        if (value !== undefined) baseline[primary] = value;
        const er = energyValue(rawStats['공명 효율'] ?? '');
        if (er !== undefined) baseline.resonanceBns = er;
        const critRow = source.equipmentRows.findIndex(row => row[0] === '크확 / 크피' || row[0] === '크확');
        let critText = '';
        if (critRow >= 0) {
          const candidates = [source.equipmentRows[critRow], ...source.equipmentRows.slice(critRow + 1).filter(row => /^\d{5}$/.test(row[0] ?? ''))];
          critText = candidates.find(row => row.some(cell => cell.includes(layout)))?.at(-1) ?? '';
        }
        const rate = number(critText.match(/크확\s*([\d.]+)%/)?.[1] ?? rawStats['크확']);
        const damage = number(critText.match(/크피\s*([\d.]+)%/)?.[1]);
        if (rate !== undefined) baseline.critRate = rate;
        if (damage !== undefined) baseline.critDmg = damage;
        const requiredMainEcho: Partial<Record<CharacterId, string>> = {
          cartethyia: 'Z02', qingxiao: 'X81', galbrena: 'H56', jingran: 'R71', lucilla: 'R68', suisui: 'R70', verina: 'X78',
        };
        result.push({ id: `${layout}-${label}`, label, costs, main4, main4Exact,
          main3: selectedPairs.length === 1 ? selectedPairs[0] : null,
          main3Options: selectedPairs.length > 1 ? selectedPairs : undefined,
          allowed3: unique(selectedPairs.flat()), main1, baseline,
          mainEchoId: requiredMainEcho[id],
          weaponId: id === 'cartethyia' && layout === '43111' ? 'sword003' : undefined,
          setRules: id === 'lucilla' ? [[{ id: 'Snowfall', count: 5 }]] : undefined,
          mainText: body[0] ?? '', subText: body.slice(1).join(' / ') });
      }
    }
  }
  // The source gives the lower ER target only when Fallacy is equipped.
  if (id === 'shorekeeper') result.push(...result.map(variant => ({ ...variant, id: `${variant.id}-fallacy`, label: '오류', mainEchoId: 'X78', baseline: { ...variant.baseline, resonanceBns: 230 } })));
  return result;
}

export const arcaBuildTargetBaselines: Partial<Record<CharacterId, BuildTargetBaseline>> = Object.fromEntries(
  snapshot.characters.map(source => {
    const fields = source.sourceStats as Record<string, string | undefined>;
    const primary = '체력' in fields ? 'hp' : '방어력' in fields ? 'def' : 'atk';
    const rules = setRules(source.echoSetCondition);
    return [source.characterId, {
      primary, weaponId: weaponId(source.recommendedWeapons), sourceWeapon: source.recommendedWeapons,
      variants: variants(source, primary), sets: unique(rules.flat().map(item => item.id)), setCount: 5, setRules: rules,
      setText: source.echoSetCondition, sourceKind: 'arca', sourceUrl: ARCA_SOURCE_URL,
      notes: source.equipmentRows.slice(4).flat().filter(text => text && text !== '참고사항' && !/^\d{5}$/.test(text)).join('\n'),
      sourcePrimary: fields[{ atk: '공격력', hp: '체력', def: '방어력' }[primary]] ?? '', sourceEnergy: fields['공명 효율'] ?? '',
    } satisfies BuildTargetBaseline];
  }),
);

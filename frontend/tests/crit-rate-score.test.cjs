const { test } = require('node:test');
const assert = require('node:assert/strict');
const fs = require('node:fs');
const path = require('node:path');
const vm = require('node:vm');
const ts = require('typescript');
const root = path.resolve(__dirname, '../src');
const cache = new Map();
function load(filename) {
  filename = path.resolve(filename);
  if (cache.has(filename)) return cache.get(filename);
  const result = {};
  cache.set(filename, result);
  const code = ts.transpileModule(fs.readFileSync(filename, 'utf8'), {
    compilerOptions: { module: ts.ModuleKind.CommonJS, target: ts.ScriptTarget.ES2022 },
  }).outputText;
  vm.runInNewContext(code, { exports: result, console: { log() {} }, require: id => {
    const target = id.startsWith('@/') ? path.join(root, id.slice(2)) : path.resolve(path.dirname(filename), id);
    return load(fs.existsSync(target + '.ts') ? target + '.ts' : path.join(target, 'index.ts'));
  } });
  return result;
}
const { getCritRateBudget, getCritCappedScoreMultiplier } = load(path.join(root, 'runtime/critRateScore.helpers.ts'));
const { calcFinalStat, calcAllEchoScore, calcFinalScore, getCritRateScoreAdjustment } = load(path.join(root, 'runtime/characterData.helpers.ts'));
const { createEmptyCharacterData } = load(path.join(root, 'types/character.type.ts'));
const { characterGuideData } = load(path.join(root, 'datas/characters.guide.ts'));
const { critScoreTooltipLines } = load(path.join(root, 'components/common/tooltipContent.ts'));
const close = (actual, expected) => assert.ok(Math.abs(actual - expected) < 1e-7, `${actual} != ${expected}`);
const equipped = data => data.echoDataIndex.slice(0, 5).map(index => data.echoData[index]);
function build(roll = 10.5) {
  const data = createEmptyCharacterData('aemeath');
  for (const echo of data.echoData) echo.subOptions = [
    { statId: 'critRate', statValue: roll }, { statId: 'critDmg', statValue: 21 },
    { statId: 'atkPct', statValue: 11.6 }, { statId: 'liberationBns', statValue: 11.6 },
    { statId: 'resonanceBns', statValue: 12.4 },
  ];
  return data;
}
function score(data, fixed) {
  const stats = calcFinalStat(data, data.echoDataIndex, {});
  stats.critRate = fixed + getCritRateBudget(0, equipped(data)).substats;
  stats.resonanceBns = 200; // Isolate the crit correction from ER shortfall penalties.
  return calcFinalScore(data, stats, data.weaponId, calcAllEchoScore(data));
}

test('only the amount needed to reach 100% is effective, within the 52.5% substat ceiling', () => {
  const data = build(8.4);
  data.echoData[0].subOptions[0].statValue = 8.6;
  data.echoData[8].subOptions[0].statValue = 999; // Spare must not consume the budget.
  const budget = getCritRateBudget(100.2, equipped(data));
  close(budget.maximum, 52.5);
  close(budget.fixed, 58);
  close(budget.available, 42);
  close(budget.substats, 42.2);
  close(budget.effective, 42);
  close(budget.wasted, 0.2);
  close(budget.ratio, 42 / 42.2);
  assert.equal(getCritRateBudget(55.2, equipped(data)).available, 52.5);
  assert.equal(getCritRateBudget(150, equipped(data)).effective, 0);
});

test('weapon, set, main option and refinement alter the budget through the actual final stats', () => {
  const data = build(6.3);
  const budget = sets => {
    const stats = calcFinalStat(data, data.echoDataIndex, sets);
    return getCritRateBudget(stats.critRate, equipped(data));
  };
  const base = budget({});
  data.weaponId = characterGuideData.aemeath.guideWeapons[0];
  const weapon = budget({});
  assert.ok(weapon.fixed > base.fixed);
  const set = budget({ Star: 5 });
  assert.ok(set.fixed > weapon.fixed);
  data.echoData[0].mainOption = { statId: 'critRate', statValue: 22 };
  const main = budget({ Star: 5 });
  close(main.fixed - set.fixed, 22);
  assert.ok(main.available < set.available);
  data.weaponId = 'sword004';
  const r1 = budget({});
  data.constell[1] = 5;
  const r5 = budget({});
  assert.ok(r5.fixed > r1.fixed);
});

test('surplus crit earns no extra points and never reduces paired-crit bonuses; raw CV stays raw', () => {
  const low = build(6.3), high = build(10.5);
  const lower = score(low, 80), higher = score(high, 80);
  // Both exceed the useful budget: extra rate leaves the score unchanged.
  close(higher[1], lower[1]);
  assert.ok(higher[0] > lower[0]);
  const full = score(high, 100), fullLow = score(low, 100);
  close(full[1], fullLow[1]);
  assert.ok(full[1] >= 0 && full[1] <= 500);
});

test('raising crit rolls is monotonic across 100% and plateaus above the cap', () => {
  for (const fixed of [50, 58, 60, 80, 99, 100, 110]) {
    let previous = -Infinity;
    let capped;
    for (const roll of [6.3, 6.9, 7.5, 8.1, 8.7, 9.3, 9.9, 10.5]) {
      const result = score(build(roll), fixed)[1];
      assert.ok(result >= previous, `fixed ${fixed}, roll ${roll}: ${result} < ${previous}`);
      if (fixed + roll * 5 >= 100) {
        if (capped !== undefined) close(result, capped);
        capped = result;
      }
      previous = result;
    }
  }
});

test('uncapped builds retain legacy total-score weighting and equipped order is irrelevant', () => {
  const data = build(6.3);
  const stats = calcFinalStat(data, data.echoDataIndex, {});
  stats.critRate = 13 + 31.5;
  stats.resonanceBns = 200;
  const scores = calcAllEchoScore(data);
  const total = calcFinalScore(data, stats, null, scores);
  close(total[1], Math.round(Math.min(500, scores.slice(0, 5).reduce((sum, value) => sum + value[1], 0)) * 10) / 10);
  assert.equal(getCritRateScoreAdjustment(data, stats).active, false);
  const before = score(data, 75);
  data.echoDataIndex = [4, 3, 2, 1, 0, 5, 6, 7, 8, 9];
  const after = score(data, 75);
  close(after[0], before[0]);
  close(after[1], before[1]);
});

test('500-point normalization uses legal rolls and reuses unnecessary crit slots', () => {
  const input = { available: 0, critWeight: 4, damageWeight: 2, otherMaxScores: [30, 20, 10, 5, 1], resonanceSlots: 0, needsCrit: true };
  // Best Echo: CD 21*2, four distinct others 30+20+10+5, plus ten-point CD bonus.
  close(getCritCappedScoreMultiplier(input) * 5 * (42 + 65) + 50, 500);
  // Five paired Echoes keep all 50 bonus points even when their CR exceeds the cap.
  const paired = { ...input, available: 20, otherMaxScores: [0, 0, 0, 0, 0] };
  close(getCritCappedScoreMultiplier(paired) * (20 * 4 + 5 * 21 * 2) + 50, 500);
  // Only CR is useful: five max rolls overshoot the useful cap but still define 500.
  close(getCritCappedScoreMultiplier({ ...input, available: 42, damageWeight: 0, otherMaxScores: [0, 0, 0, 0, 0], needsCrit: false }) * 42 * 4 + 50, 500);
  const empty = createEmptyCharacterData('aemeath');
  const budget = getCritRateBudget(13, equipped(empty));
  assert.equal(budget.ratio, 1);
  assert.ok(Number.isFinite(score(empty, 100)[1]));
});

test('total-score tooltip explains the useful and wasted portions in all site languages', () => {
  const budget = getCritRateBudget(110.5, equipped(build()));
  for (const lang of ['kr', 'en', 'jp', 'zh']) {
    const lines = critScoreTooltipLines(budget, lang);
    assert.equal(lines.length, 4);
    assert.ok(lines.some(line => line.includes('42%')));
    assert.ok(lines.some(line => line.includes('10.5%')));
    assert.ok(lines.some(line => line.includes('500')));
  }
});

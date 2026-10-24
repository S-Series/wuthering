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
    return load(target + '.ts');
  } });
  return result;
}
const { calcCharacterStatDetails, calcFinalStat } = load(path.join(root, 'runtime/characterData.helpers.ts'));
const { createEmptyCharacterData } = load(path.join(root, 'types/character.type.ts'));
const { characterStat } = load(path.join(root, 'datas/characterStats.ts'));
const { echoDict } = load(path.join(root, 'datas/echos.ts'));
const { harmony } = load(path.join(root, 'datas/harmonies.ts'));
const { characterGuideData } = load(path.join(root, 'datas/characters.guide.ts'));
const close = (actual, expected) => assert.ok(Math.abs(actual - expected) < 1e-9, `${actual} != ${expected}`);

test('weapon refinement, chain, equipped echo and set sources reconcile with final totals', () => {
  const data = createEmptyCharacterData('zani');
  data.weaponId = 'sword004'; // ER primary; crit-rate passive scaled by refinement.
  data.constell = [2, 3];
  data.echoData[0].mainOption = { statId: 'critRate', statValue: 22 };
  data.echoData[2].subOptions[0] = { statId: 'resonanceBns', statValue: 9.2 };
  data.echoData[3].subOptions[0] = { statId: 'critRate', statValue: 10.5 };
  data.echoData[8].subOptions[0] = { statId: 'resonanceBns', statValue: 12.4 }; // Spare: excluded.
  const erSet = Object.entries(harmony).find(([, set]) => set.option.some(o => o.options.some(s => s.statId === 'resonanceBns')));
  const sets = { [erSet[0]]: 5 };
  const { stats, contributions } = calcCharacterStatDetails(data, data.echoDataIndex, sets);
  for (const statId of ['resonanceBns', 'critRate']) {
    close(contributions.filter(s => s.statId === statId).reduce((sum, s) => sum + s.value, 0), stats[statId]);
    close(stats[statId], calcFinalStat(data, data.echoDataIndex, sets)[statId]);
  }
  close(contributions.find(s => s.kind === 'weaponPrimary').value, 77);
  close(contributions.find(s => s.kind === 'weaponEffect').value, 12);
  close(contributions.find(s => s.kind === 'chain').value, 20);
  assert.equal(contributions.find(s => s.kind === 'echoMain').slot, 1);
  assert.equal(contributions.find(s => s.kind === 'echoSub' && s.statId === 'resonanceBns').slot, 3);
  assert.ok(contributions.some(s => s.kind === 'harmony' && s.name.kr === erSet[1].kr));
  assert.equal(contributions.some(s => s.slot > 5), false);
});

test('main Echo effects and slot labels follow equipped order after swapping with a spare', () => {
  const data = createEmptyCharacterData('aemeath');
  const [echoId, echo] = Object.entries(echoDict.Cost4).find(([, item]) => item.getStats('aemeath').some(s => s.statId === 'resonanceBns'));
  data.echoData[5].echoId = echoId;
  data.echoData[5].subOptions[0] = { statId: 'resonanceBns', statValue: 8.4 };
  const before = calcCharacterStatDetails(data, data.echoDataIndex, {});
  assert.equal(before.contributions.some(s => s.kind === 'mainEcho'), false);
  const order = [5, 1, 2, 3, 4, 0, 6, 7, 8, 9];
  const after = calcCharacterStatDetails(data, order, {});
  const effect = after.contributions.find(s => s.kind === 'mainEcho');
  const amount = echo.getStats('aemeath').filter(s => s.statId === 'resonanceBns').reduce((sum, s) => sum + s.value, 0);
  assert.equal(effect.name.kr, echo.kr);
  assert.equal(after.contributions.find(s => s.kind === 'echoSub').slot, 1);
  close(after.stats.resonanceBns - before.stats.resonanceBns, amount + 8.4);
});

test('empty builds retain only character base and node values without unset options', () => {
  const data = createEmptyCharacterData('aemeath');
  const { stats, contributions } = calcCharacterStatDetails(data, data.echoDataIndex, {});
  const originalGauges = contributions.filter(s => ['resonanceBns', 'critRate'].includes(s.statId));
  assert.equal(originalGauges.length, 3);
  assert.ok(originalGauges.every(s => ['base', 'nodes'].includes(s.kind) && s.value > 0));
  close(contributions.find(s => s.kind === 'base' && s.statId === 'critRate').value, 5);
  close(contributions.find(s => s.kind === 'nodes' && s.statId === 'critRate').value, 8);
  close(stats.resonanceBns, characterStat.aemeath.ResonanceBns);
  close(stats.critRate, characterStat.aemeath.CritRate);
});

test('ATK, HP and DEF sources convert percentages against the correct base and include rounding', () => {
  for (const [characterId, primary, baseKey] of [['aemeath', 'atk', 'baseAtk'], ['jingran', 'hp', 'baseHp'], ['mornye', 'def', 'baseDef']]) {
    const data = createEmptyCharacterData(characterId);
    data.weaponId = characterGuideData[characterId].guideWeapons[0];
    data.constell = [6, 3];
    data.echoData[0].mainOption = { statId: primary + 'Pct', statValue: 18 };
    data.echoData[1].subOptions[0] = { statId: primary, statValue: 40 };
    data.echoData[2].subOptions[0] = { statId: primary + 'Pct', statValue: 9.4 };
    data.echoData[3].subOptions[0] = { statId: 'critDmg', statValue: 18.6 };
    data.echoData[8].mainOption = { statId: primary + 'Pct', statValue: 99 }; // Excluded spare.
    const set = Object.entries(harmony).find(([, set]) => set.option.some(o => o.options.some(s => s.statId === primary + 'Pct')));
    const { stats, contributions } = calcCharacterStatDetails(data, data.echoDataIndex, set ? { [set[0]]: 5 } : {});
    for (const statId of ['atk', 'hp', 'def', 'resonanceBns', 'critRate', 'critDmg']) {
      close(contributions.filter(s => s.statId === statId).reduce((sum, s) => sum + s.value, 0), stats[statId]);
    }
    const pct = contributions.find(s => s.kind === 'echoMain' && s.statId === primary);
    const weaponBase = contributions.find(s => s.kind === 'weaponBase');
    const expectedBase = characterStat[characterId][baseKey] + (primary === 'atk' ? weaponBase.value : 0);
    close(pct.multiplierBase, expectedBase);
    close(pct.percent, 18);
    close(pct.value, expectedBase * 0.18);
    close(contributions.find(s => s.kind === 'echoSub' && s.statId === primary && !s.percent).value, 40);
    assert.ok(contributions.some(s => s.kind === 'echoFixed'));
    assert.ok(contributions.some(s => s.kind === 'rounding'));
    close(contributions.find(s => s.kind === 'echoSub' && s.statId === 'critDmg').value, 18.6);
  }
});

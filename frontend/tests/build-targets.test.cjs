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
  const result = {}; cache.set(filename, result);
  const code = ts.transpileModule(fs.readFileSync(filename, 'utf8'), { compilerOptions: { module: ts.ModuleKind.CommonJS, target: ts.ScriptTarget.ES2022 } }).outputText;
  vm.runInNewContext(code, { exports: result, console: { log() {} }, require: id => load((id.startsWith('@/') ? path.join(root, id.slice(2)) : path.resolve(path.dirname(filename), id)) + '.ts') });
  return result;
}
const { character } = load(path.join(root, 'datas/characters.ts'));
const { weaponDict } = load(path.join(root, 'datas/weapon.ts'));
const { echoDict } = load(path.join(root, 'datas/echos.ts'));
const { FixedStats } = load(path.join(root, 'datas/stats.ts'));
const { harmony } = load(path.join(root, 'datas/harmonies.ts'));
const { calcFinalStat } = load(path.join(root, 'runtime/characterData.helpers.ts'));
const { createEmptyCharacterData } = load(path.join(root, 'types/character.type.ts'));
const { createEmptyEchoRuntime } = load(path.join(root, 'runtime/echo.runtime.ts'));
const { BUILD_TIERS, FINAL_BUILD_SUBSTAT_TARGETS, getBuildTargetProfile, getTierTargets, getSuggestedVariant, getTargetConditions, getBuildComparisonStats, evaluateBuildTargets } = load(path.join(root, 'runtime/buildTargets.ts'));

function build(id, variant) {
  const profile = getBuildTargetProfile(id);
  const data = createEmptyCharacterData(id);
  data.weaponId = profile.weaponId;
  const sets = (profile.setRules?.[0] ?? [{ id:profile.sets[0],count:profile.setCount }]).flatMap(item => Array(item.count).fill(item.id));
  let index4 = 0, index3 = 0;
  variant.costs.forEach((cost, index) => {
    const echo = createEmptyEchoRuntime(cost);
    echo.setId = sets[index] ?? sets[0];
    const dict = echoDict[`Cost${cost}`];
    echo.echoId = Object.keys(dict).find(id=>dict[id].type.includes(echo.setId)) ?? Object.keys(dict)[0];
    if (index === 0 && variant.mainEchoId) echo.echoId = variant.mainEchoId;
    const statId = cost === 4 ? (variant.main4Exact?.[index4++] ?? variant.main4[0]) : cost === 3 ? ((variant.main3 ?? variant.main3Options?.[0])?.[index3++] ?? variant.allowed3[0]) : variant.main1;
    echo.mainOption = { statId, statValue:FixedStats[statId].ValueMain[{4:0,3:1,1:2}[cost]] };
    data.echoData[index] = echo;
  });
  return data;
}

test('all 60 characters preserve source targets and use the midpoint for near-final', () => {
  let community = 0, supplement = 0;
  for (const [id, char] of Object.entries(character)) {
    const profile = getBuildTargetProfile(id);
    assert.ok(profile, id);
    profile.sourceKind === 'community' ? community++ : supplement++;
    assert.ok(profile.sourceUrl.startsWith('https://'));
    assert.equal(weaponDict[profile.weaponId].id.replace(/\d+$/, ''), char.weapon, id);
    assert.ok(profile.variants.length);
    assert.equal(new Set(profile.variants.map(v => v.id)).size, profile.variants.length, id);
    for (const variant of profile.variants) {
      assert.equal(variant.costs.length, 5, id);
      assert.ok(variant.costs.reduce((a,b)=>a+b,0) <= 12, id);
      const tiers = getTierTargets(id, variant);
      assert.ok(tiers.wellBuilt[profile.primary] > 0, id);
      for (const [stat, value] of Object.entries(variant.baseline)) {
        assert.equal(tiers.wellBuilt[stat], value, `${id} ${stat} source`);
        assert.equal(tiers.nearFinal[stat], Math.round((value + tiers.final[stat]) / 2 * 10) / 10, `${id} ${stat} midpoint`);
      }
      for (const tier of BUILD_TIERS) {
        for (const value of Object.values(tiers[tier])) assert.ok(Number.isFinite(value) && value > 0, id);
        assert.ok((tiers[tier].critRate ?? 0) <= 100, id);
        assert.equal(tiers[tier].resonanceBns, variant.baseline.resonanceBns, id);
      }
      assert.ok(getTargetConditions(build(id,variant),variant).mainOptions, `${id} ${variant.id}`);
    }
  }
  assert.equal(Object.keys(character).length, 60);
  assert.equal(community, 54); assert.equal(supplement, 6);
});

test('Aemeath automatically distinguishes ATK/ATK and elemental/ATK source conditions', () => {
  const profile = getBuildTargetProfile('aemeath');
  const doubleAtk = profile.variants.find(v => v.label === '공공');
  const elemental = profile.variants.find(v => v.label === '속공');
  assert.equal(doubleAtk.baseline.atk, 2600);
  assert.equal(elemental.baseline.atk, 2300);
  assert.equal(elemental.baseline.resonanceBns, 125);
  for (const variant of [doubleAtk, elemental]) {
    const data = build('aemeath', variant);
    assert.equal(getSuggestedVariant(data).id, variant.id);
    assert.ok(Object.values(getTargetConditions(data, variant)).every(Boolean));
    assert.ok(evaluateBuildTargets(data, variant, getTierTargets('aemeath',variant).final).passed.final);
  }
  const tiers = getTierTargets('aemeath', elemental);
  assert.equal(tiers.wellBuilt.atk, 2300); assert.equal(tiers.nearFinal.atk, 2402.5); assert.equal(tiers.final.atk, 2505);
  assert.equal(tiers.wellBuilt.critDmg, 270); assert.equal(tiers.nearFinal.critDmg, 269.5); assert.equal(tiers.final.critDmg, 269);
  assert.equal(tiers.nearFinal.critRate, 74.2);
});

test('wrong weapon, wrong main options, wrong set and empty builds never receive a milestone', () => {
  const variant = getBuildTargetProfile('aemeath').variants.find(v => v.label === '속공');
  const data = build('aemeath',variant);
  const perfect = getTierTargets('aemeath',variant).final;
  data.weaponId = 'sword001';
  assert.equal(evaluateBuildTargets(data,variant,perfect).tier,null);
  data.weaponId = 'sword009';
  data.echoData[1].mainOption.statId = 'resonanceBns';
  assert.equal(evaluateBuildTargets(data,variant,perfect).tier,null);
  const wrongSet = build('aemeath',variant);
  wrongSet.echoData.forEach(echo=>echo.setId=null);
  assert.equal(evaluateBuildTargets(wrongSet,variant,perfect).tier,null);
  assert.equal(evaluateBuildTargets(createEmptyCharacterData('aemeath'),variant,perfect).tier,null);
});

test('higher stages require every target, rather than promoting from crit alone', () => {
  const variant = getBuildTargetProfile('aemeath').variants.find(v => v.label === '속공');
  const data = build('aemeath',variant);
  const tiers = getTierTargets('aemeath',variant);
  assert.equal(evaluateBuildTargets(data,variant,tiers.wellBuilt).tier,'wellBuilt');
  assert.equal(evaluateBuildTargets(data,variant,tiers.nearFinal).tier,'nearFinal');
  assert.equal(evaluateBuildTargets(data,variant,{...tiers.final,resonanceBns:124.9}).tier,null);
  assert.equal(evaluateBuildTargets(data,variant,{...tiers.wellBuilt,critRate:tiers.final.critRate}).tier,'wellBuilt');
});

test('comparison removes Chain, refinement, main-Echo and all set bonuses', () => {
  const variant = getBuildTargetProfile('aemeath').variants.find(v => v.label === '속공');
  const data = build('aemeath',variant);
  const first = getBuildComparisonStats(data);
  data.constell = [6,5];
  const second = getBuildComparisonStats(data);
  assert.equal(second.atk, first.atk); assert.equal(second.critRate, first.critRate);
  assert.equal(second.critDmg, first.critDmg); assert.equal(second.resonanceBns, first.resonanceBns);
  // Star's 5-piece crit buff must not raise the compared chance.
  assert.ok(second.critRate < 50);
});

test('all Sonata sets leave table values unchanged while combat stats still include their effects', () => {
  for (const id of ['chisa', 'aemeath', 'cartethyia', 'mornye', 'shorekeeper']) {
    const variant = getBuildTargetProfile(id).variants[0];
    const data = build(id, variant);
    data.echoData.forEach(echo => { echo.setId = null; });
    const comparison = getBuildComparisonStats(data);
    const tiers = getTierTargets(id, variant, data);
    for (const setId of Object.keys(harmony)) {
      data.echoData.forEach(echo => { echo.setId = setId; });
      const withSet = getBuildComparisonStats(data);
      const targetsWithSet = getTierTargets(id, variant, data);
      for (const stat of ['atk', 'hp', 'def', 'critRate', 'critDmg', 'resonanceBns']) {
        assert.equal(withSet[stat], comparison[stat], `${id} ${setId} ${stat} comparison`);
        for (const tier of BUILD_TIERS) assert.equal(targetsWithSet[tier][stat], tiers[tier][stat], `${id} ${setId} ${stat} ${tier}`);
      }
    }
  }
  const data = build('chisa', getBuildTargetProfile('chisa').variants[0]);
  const [setId] = Object.entries(harmony).find(([, set]) => set.option.some(option => option.options.some(stat => stat.statId === 'atkPct')));
  assert.ok(calcFinalStat(data, data.echoDataIndex, { [setId]: 5 }).atk > calcFinalStat(data, data.echoDataIndex, {}).atk);
});

test('utility crit, no-Energy characters, HP/DEF scaling and source exceptions remain character-specific', () => {
  const mornye = getBuildTargetProfile('mornye');
  const tiers = getTierTargets('mornye',mornye.variants[0]);
  assert.equal(mornye.primary,'def');
  for (const tier of BUILD_TIERS) {assert.equal(tiers[tier].critRate,20); assert.equal(tiers[tier].critDmg,undefined); assert.equal(tiers[tier].resonanceBns,240);}
  assert.equal(getBuildTargetProfile('cartethyia').primary,'hp');
  assert.equal(getBuildTargetProfile('phrolova').variants[0].baseline.resonanceBns,undefined);
  const fallacy = getBuildTargetProfile('shorekeeper').variants.find(v=>v.mainEchoId);
  assert.equal(fallacy.baseline.resonanceBns,230);
  assert.equal(getSuggestedVariant(build('shorekeeper',fallacy)).id,fallacy.id);
  assert.equal(getBuildTargetProfile('hsin').sourceKind,'supplement');
  assert.ok(getBuildTargetProfile('buling').supplementUrl);
  assert.ok(getBuildTargetProfile('danjin').supplementedStats.includes('critRate'));
  assert.equal(getBuildTargetProfile('danjin').variants[0].baseline.critRate,70);
});

test('alternate crit mains preserve CV and enforce the chosen 4-cost condition', () => {
  const variants = getBuildTargetProfile('camellya').variants;
  const rate = variants.find(v=>v.main4[0]==='critRate');
  const damage = variants.find(v=>v.main4[0]==='critDmg');
  assert.equal(rate.baseline.critRate*2+rate.baseline.critDmg,damage.baseline.critRate*2+damage.baseline.critDmg);
  assert.equal(getSuggestedVariant(build('camellya',rate)).id,rate.id);
  assert.equal(getSuggestedVariant(build('camellya',damage)).id,damage.id);
  const cart = getBuildTargetProfile('cartethyia').variants[0];
  const invalid = build('cartethyia',cart);
  invalid.echoData[1].mainOption.statId = invalid.echoData[0].mainOption.statId;
  assert.equal(getTargetConditions(invalid,cart).mainOptions,false);
});

test('3-cost pair restrictions do not accidentally accept two Energy mains', () => {
  const variant = getBuildTargetProfile('sigrika').variants[0];
  const data = build('sigrika',variant);
  assert.ok(getTargetConditions(data,variant).mainOptions);
  data.echoData.filter(echo=>echo.cost===3).forEach(echo=>{echo.mainOption={statId:'resonanceBns',statValue:32};});
  assert.equal(getTargetConditions(data,variant).mainOptions,false);
});

test('crit probability remains capped while damage follows the explicit 75% substat budget', () => {
  const profile = getBuildTargetProfile('qingxiao');
  const variant = profile.variants.find(v=>v.baseline.critRate===100);
  const tiers = getTierTargets('qingxiao',variant);
  assert.equal(tiers.final.critRate,100);
  const withoutSubs = getBuildComparisonStats(build('qingxiao', variant));
  assert.equal(tiers.final.critDmg, withoutSubs.critDmg + 75);
});

test('final targets are reached by the exact 35% ATK and 75% damage substat budgets', () => {
  for (const id of ['aemeath', 'zani', 'camellya']) {
    const variant = getBuildTargetProfile(id).variants[0];
    const data = build(id, variant);
    const target = getTierTargets(id, variant, data).final;
    data.echoData[0].subOptions[0] = { statId: 'atkPct', statValue: FINAL_BUILD_SUBSTAT_TARGETS.atkPct };
    data.echoData[0].subOptions[1] = { statId: 'critDmg', statValue: FINAL_BUILD_SUBSTAT_TARGETS.critDmg };
    const stats = getBuildComparisonStats(data);
    assert.equal(stats.atk, target.atk, `${id} final ATK`);
    assert.equal(stats.critDmg, target.critDmg, `${id} final Crit DMG`);
  }
});

test('targets ignore existing substats, Chain and refinement and follow cost/main-stat choices', () => {
  const variant = getBuildTargetProfile('aemeath').variants.find(v => v.label === '속공');
  const data = build('aemeath', variant);
  const before = getTierTargets('aemeath', variant, data);
  data.constell = [6, 5];
  data.echoData[0].subOptions = Array.from({ length: 5 }, () => ({ statId: 'atk', statValue: 999 }));
  data.echoData[8].subOptions[0] = { statId: 'atkPct', statValue: 999 };
  data.echoDataIndex = [0, 3, 2, 4, 1, 5, 6, 7, 8, 9];
  assert.equal(getTierTargets('aemeath', variant, data).final.atk, before.final.atk);
  assert.equal(getTierTargets('aemeath', variant, data).final.critDmg, before.final.critDmg);
  const doubleCrit = { ...variant, costs: [4, 4, 1, 1, 1], main4: ['critDmg'], main4Exact: ['critDmg', 'critDmg'], main3: null, main3Options: undefined };
  assert.equal(getTierTargets('aemeath', doubleCrit).final.critDmg, 150 + 88 + 75);
});

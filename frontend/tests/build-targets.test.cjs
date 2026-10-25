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
  vm.runInNewContext(code, { exports: result, console: { log() {} }, require: id => {
    const target = id.startsWith('@/') ? path.join(root, id.slice(2)) : path.resolve(path.dirname(filename), id);
    return id.endsWith('.json') ? { default: JSON.parse(fs.readFileSync(target, 'utf8')) } : load(target + '.ts');
  } });
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


const source = JSON.parse(fs.readFileSync(path.join(root, 'datas/buildTargets/arca-snapshot.json'), 'utf8'));
const { ARCA_SOURCE_URL, ARCA_SOURCE_UPDATED_AT, ARCA_UPDATE_POLICY } = load(path.join(root, 'datas/buildTargets/arca.ts'));
const { weaponStat } = load(path.join(root, 'datas/weaponStats.ts'));
const close = (a,b) => assert.ok(Math.abs(a-b)<1e-7, a+' != '+b);

function build(id, variant = getBuildTargetProfile(id).variants[0]) {
  const profile = getBuildTargetProfile(id);
  const data = createEmptyCharacterData(id);
  data.weaponId = variant.weaponId ?? profile.weaponId;
  const sets = (variant.setRules ?? profile.setRules)[0].flatMap(item => Array(item.count).fill(item.id));
  let position4 = 0, position3 = 0;
  variant.costs.forEach((cost, index) => {
    const echo = createEmptyEchoRuntime(cost);
    echo.setId = sets[index];
    const dict = echoDict['Cost'+cost];
    echo.echoId = Object.keys(dict).find(id => dict[id].type.includes(echo.setId)) ?? Object.keys(dict)[0];
    if (index===0 && variant.mainEchoId) echo.echoId = variant.mainEchoId;
    const preferred4 = weaponStat[data.weaponId].statType[0] === 'critRate' ? 'critDmg' : 'critRate';
    const statId = cost===4 ? (variant.main4Exact?.[position4++] ?? (variant.main4.includes(preferred4) ? preferred4 : variant.main4[0]))
      : cost===3 ? (variant.main3 ?? variant.main3Options?.[0])[position3++]
      : variant.main1 ?? (profile.primary+'Pct');
    echo.mainOption = {statId, statValue:FixedStats[statId].ValueMain[{4:0,3:1,1:2}[cost]]};
    data.echoData[index] = echo;
  });
  return data;
}

test('exactly the 45 Arca snapshot characters are registered; every other character has no fallback', () => {
  const ids = new Set(source.characters.map(row=>row.characterId));
  assert.equal(ids.size,45);
  assert.equal(ARCA_SOURCE_UPDATED_AT,'2026-10-09');
  assert.equal(ARCA_UPDATE_POLICY,'manual-user-request');
  for (const id of Object.keys(character)) {
    const profile = getBuildTargetProfile(id);
    if (!ids.has(id)) {
      assert.equal(profile,undefined,id);
      assert.equal(getSuggestedVariant(createEmptyCharacterData(id)),undefined,id);
      continue;
    }
    assert.equal(profile.sourceKind,'arca');
    assert.equal(profile.sourceUrl,ARCA_SOURCE_URL);
    assert.ok(profile.weaponId,id+' weapon mapping');
    assert.ok(profile.variants.length,id+' variants');
    assert.ok(profile.setRules.length,id+' set mapping');
    assert.equal(weaponDict[profile.weaponId].id.replace(/[0-9]+$/,''),character[id].weapon,id);
    const raw=source.characters.find(row=>row.characterId===id);
    assert.equal(profile.sourceWeapon,raw.recommendedWeapons);
    for (const variant of profile.variants) {
      assert.equal(variant.costs.length,5);
      assert.ok(variant.costs.reduce((a,b)=>a+b,0)<=12,id);
      for (const value of Object.values(variant.baseline)) assert.ok(Number.isFinite(value)&&value>=0,id);
      assert.ok(getTargetConditions(build(id,variant),variant).mainOptions,id+' '+variant.id);
    }
  }
});

test('direct Arca values replace old overlay and guide supplements', () => {
  const expectations = [
    ['hsin','속공',{atk:2400,critRate:72.5,critDmg:260,resonanceBns:125}],
    ['lucy','속공',{atk:2500,critRate:70,critDmg:265,resonanceBns:130}],
    ['sigrika','권장',{atk:2600,critRate:70,critDmg:270,resonanceBns:150}],
    ['jingran','권장',{hp:50000,critRate:45.5,critDmg:300,resonanceBns:125}],
    ['augusta','속공',{atk:2750,critRate:73,critDmg:220,resonanceBns:125}],
  ];
  for (const [id,label,stats] of expectations) {
    const variant=getBuildTargetProfile(id).variants.find(v=>v.label===label);
    assert.deepEqual(JSON.parse(JSON.stringify(variant.baseline)),stats,id);
  }
});

test('missing, nonnumeric and unsupported condition stats stay absent in every derived tier', () => {
  for (const [id,stat] of [['verina','atk'],['verina','critRate'],['verina','critDmg'],['jinhsi','resonanceBns'],['shorekeeper','critDmg'],['mornye','critDmg'],['rover_aero','resonanceBns']]) {
    const variant=getBuildTargetProfile(id).variants[0];
    assert.equal(variant.baseline[stat],undefined,id+' source');
    const tiers=getTierTargets(id,variant,build(id,variant));
    for (const tier of BUILD_TIERS) assert.equal(tiers[tier][stat],undefined,id+' '+tier);
  }
  const cart=getBuildTargetProfile('cartethyia').variants.find(v=>v.costs.join('')==='43111');
  assert.equal(cart.baseline.hp,undefined);
  assert.equal(cart.baseline.critDmg,undefined);
  for (const id of ['lucilla','phrolova']) {
    const v=getBuildTargetProfile(id).variants[0];
    assert.equal(v.baseline.resonanceBns,0,id+' explicit zero');
  }
});

test('Lucy and Rebecca require the original 1+2+2 set rule, not five-piece substitutions', () => {
  for (const id of ['lucy','rebecca']) {
    const v=getBuildTargetProfile(id).variants[0], data=build(id,v);
    assert.equal(getTargetConditions(data,v).set,true);
    assert.equal(data.echoData[0].setId,'Adam');
    const counts=data.echoData.slice(0,5).reduce((out,e)=>({...out,[e.setId]:(out[e.setId]??0)+1}),{});
    assert.deepEqual(counts,{Adam:1,Memories:2,Tunes:2});
    data.echoData.forEach(e=>e.setId='Radiance');
    assert.equal(getTargetConditions(data,v).set,false);
    data.echoData.forEach(e=>e.setId='Adam');
    assert.equal(getTargetConditions(data,v).set,false);
  }
});

test('3+2 conditions are retained and a lone three-piece never passes', () => {
  for (const id of ['chisa','iuno','qiuyuan','galbrena','phrolova','augusta']) {
    const v=getBuildTargetProfile(id).variants[0],data=build(id,v);
    assert.equal(getTargetConditions(data,v).set,true,id);
    data.echoData.slice(3,5).forEach(e=>e.setId=null);
    assert.equal(getTargetConditions(data,v).set,false,id);
  }
});

test('milestones use original well-built values and the midpoint only where both inputs exist', () => {
  for (const row of source.characters) {
    const id=row.characterId, p=getBuildTargetProfile(id);
    for(const v of p.variants) {
      const tiers=getTierTargets(id,v,build(id,v));
      for(const [stat,value] of Object.entries(v.baseline)) {
        assert.equal(tiers.wellBuilt[stat],value,id);
        assert.equal(tiers.nearFinal[stat],tiers.final[stat]===undefined?undefined:Math.round((value+tiers.final[stat])/2*10)/10,id+' midpoint');
      }
    }
  }
  const p=getBuildTargetProfile('aemeath'),v=p.variants.find(v=>v.label==='속공'),data=build('aemeath',v),tiers=getTierTargets('aemeath',v,data);
  assert.equal(tiers.final.atk,2505);
  assert.equal(tiers.final.critDmg,269);
  assert.equal(tiers.nearFinal.critDmg,269.5);
  assert.equal(tiers.nearFinal.critRate,74.2);
});

test('missing source 1-cost options are not invented; projections require concrete equipped main stats', () => {
  const v=getBuildTargetProfile('lucy').variants.find(v=>v.label==='속공');
  assert.equal(v.main1,null);
  assert.equal(getTierTargets('lucy',v).final.atk,undefined);
  assert.equal(getTierTargets('lucy',v).nearFinal.atk,undefined);
  assert.equal(getTierTargets('lucy',v).wellBuilt.atk,2500);
  assert.equal(getTierTargets('lucy',v,build('lucy',v)).final.atk,2626);
});

test('comparison keeps main Echo effects, excludes all set and Chain effects, and normalizes refinement', () => {
  const v=getBuildTargetProfile('lucy').variants.find(v=>v.label==='속공'),data=build('lucy',v);
  data.echoData[0].echoId='X80';
  [6.9,7.5,7.5,8.7,6.9].forEach((statValue,i)=>data.echoData[i].subOptions[0]={statId:'critRate',statValue});
  const before=getBuildComparisonStats(data);
  close(before.critRate,87.5);
  data.constell=[6,5];
  data.echoData.forEach(e=>e.setId='Radiance');
  const after=getBuildComparisonStats(data);
  for(const stat of ['atk','critRate','critDmg','resonanceBns']) close(after[stat],before[stat]);
  assert.ok(calcFinalStat(data,data.echoDataIndex,{Radiance:5}).critRate>after.critRate);
});

test('projected final targets include the selected main Echo and fixed substat budgets', () => {
  const v=getBuildTargetProfile('lucy').variants.find(v=>v.label==='속공'),data=build('lucy',v);
  data.echoData[0].echoId='R56';
  assert.equal(getTierTargets('lucy',v,data).final.atk,2747);
  for(const id of ['aemeath','zani','camellya']) {
    const v=getBuildTargetProfile(id).variants[0],data=build(id,v),target=getTierTargets(id,v,data).final;
    data.echoData[0].subOptions[0]={statId:'atkPct',statValue:35};
    data.echoData[0].subOptions[1]={statId:'critDmg',statValue:75};
    const stats=getBuildComparisonStats(data);
    assert.equal(stats.atk,target.atk,id);
    assert.equal(stats.critDmg,target.critDmg,id);
  }
});

test('unregistered targets cannot promote a build, and wrong gear never gets a milestone', () => {
  const data=createEmptyCharacterData('suoming');
  assert.equal(evaluateBuildTargets(data,{}).tier,null);
  assert.deepEqual(JSON.parse(JSON.stringify(getTierTargets('suoming',{}))),{wellBuilt:{},nearFinal:{},final:{}});
  const v=getBuildTargetProfile('aemeath').variants.find(v=>v.label==='속공'),good=build('aemeath',v);
  const final=getTierTargets('aemeath',v,good).final;
  assert.equal(evaluateBuildTargets(good,v,final).tier,'final');
  good.weaponId='sword001';
  assert.equal(evaluateBuildTargets(good,v,final).tier,null);
  good.weaponId='sword009';
  good.echoData[1].mainOption.statId='resonanceBns';
  assert.equal(evaluateBuildTargets(good,v,final).tier,null);
});

test('source-specific exceptions stay registered without inventing alternate crit targets', () => {
  const p=getBuildTargetProfile('shorekeeper'),fallacy=p.variants.find(v=>v.mainEchoId);
  assert.equal(fallacy.baseline.resonanceBns,230);
  assert.equal(getSuggestedVariant(build('shorekeeper',fallacy)).id,fallacy.id);
  const cam=getBuildTargetProfile('camellya');
  assert.equal(cam.variants.length,1);
  assert.equal(cam.variants[0].baseline.critRate,65);
  assert.equal(cam.variants[0].baseline.critDmg,280);
  const sub=getBuildTargetProfile('suisui').variants[0];
  assert.equal(sub.costs.join(''),'33111');
  assert.equal(sub.baseline.critRate,20);
  assert.equal(sub.baseline.critDmg,undefined);
});

test('layout-specific source weapon, set and main Echo conditions are enforced', () => {
  const cart=getBuildTargetProfile('cartethyia').variants.find(v=>v.costs.join('')==='43111');
  const data=build('cartethyia',cart);
  assert.equal(cart.weaponId,'sword003');
  assert.equal(getTargetConditions(data,cart).weapon,true);
  data.weaponId=getBuildTargetProfile('cartethyia').weaponId;
  assert.equal(getTargetConditions(data,cart).weapon,false);
  const lucilla=getBuildTargetProfile('lucilla').variants[0], buildLucilla=build('lucilla',lucilla);
  assert.equal(getTargetConditions(buildLucilla,lucilla).set,true);
  buildLucilla.echoData.forEach(e=>e.setId='Cloud');
  assert.equal(getTargetConditions(buildLucilla,lucilla).set,false);
  for (const id of ['cartethyia','qingxiao','galbrena','jingran','lucilla','suisui','verina']) {
    const v=getBuildTargetProfile(id).variants[0], gear=build(id,v);
    assert.ok(v.mainEchoId,id);
    assert.equal(getTargetConditions(gear,v).mainOptions,true,id);
    gear.echoData[0].echoId='not-the-source-main-echo';
    assert.equal(getTargetConditions(gear,v).mainOptions,false,id);
  }
});

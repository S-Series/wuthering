const { test } = require('node:test');
const assert = require('node:assert/strict');
const fs = require('node:fs');
const path = require('node:path');
const vm = require('node:vm');
const ts = require('typescript');
const root = path.join(__dirname, '../src');
const cache = new Map();
function load(relative) {
  if (cache.has(relative)) return cache.get(relative);
  const filename = path.join(root, relative);
  const result = {};
  cache.set(relative, result);
  const code = ts.transpileModule(fs.readFileSync(filename, 'utf8'), {
    compilerOptions: { module: ts.ModuleKind.CommonJS, jsx: ts.JsxEmit.ReactJSX, target: ts.ScriptTarget.ES2022 },
  }).outputText;
  vm.runInNewContext(code, { exports: result, require: id => {
    if (id === '@/datas/echos') return { echoDict: {} };
    if (id === 'react/jsx-runtime') return {};
    const target = id.startsWith('@/') ? id.slice(2) : path.join(path.dirname(relative), id);
    for (const ext of ['.ts', '.tsx']) if (fs.existsSync(path.join(root, target + ext))) return load(target + ext);
    throw Error('Unexpected import: ' + id);
  } });
  return result;
}
const { characterMeta, getCharacterMeta } = load('datas/characters.meta.ts');
const { FixedStats } = load('datas/stats.ts');
const { isValidEchoMainOption, countInvalidEquippedMainOptions } = load('runtime/echoMainOption.helpers.ts');
const { getStatOptionBase } = load('components/features/Card/Echo/echoOptions.helpers.tsx');
const echo = (cost, statId) => ({ cost, mainOption: { statId, statValue: 0 }, subOptions: [] });

test('main dropdown recognizes accepted elemental bonuses without substat weights', () => {
  for (const id of ['hsin', 'suoming']) {
    const options = getStatOptionBase('kr', id, 3);
    assert.equal(options.find(o => o.value === 'electroBns').relevanceTier, 'valid');
    assert.equal(options.find(o => o.value === 'electroBns').scoreWeight, 0);
    assert.equal(options.find(o => o.value === 'fusionBns').relevanceTier, 'invalid');
  }
  assert.equal(getStatOptionBase('kr', 'hsin').find(o => o.value === 'skillBns').relevanceTier, 'valid');
});
test('all characters use the same accepted main stats in dropdowns and scoring', () => {
  for (const [id, meta] of Object.entries(characterMeta)) {
    for (const cost of [1, 3, 4]) {
      for (const option of getStatOptionBase('en', id, cost)) {
        assert.equal(option.relevanceTier === 'valid', isValidEchoMainOption(meta, cost, option.value), id + '/' + cost + '/' + option.value);
      }
    }
  }
});
test('invalid count follows equipped order and ignores spare echoes', () => {
  const echoes = [echo(4, 'critRate'), echo(3, 'electroBns'), echo(3, 'fusionBns'), echo(1, 'atkPct'), echo(1, 'hpPct'), echo(3, 'atkPct')];
  assert.equal(countInvalidEquippedMainOptions(echoes, [0, 1, 5, 3, 4, 2], characterMeta.hsin), 1);
  assert.equal(countInvalidEquippedMainOptions(echoes, [0, 1, 2, 3, 4, 5], characterMeta.hsin), 2);
});
test('resonance shortage and penalty remain separate from actual invalid main count', () => {
  const filename = path.join(root, 'pages/Card/Detail.tsx');
  const source = ts.createSourceFile(filename, fs.readFileSync(filename, 'utf8'), ts.ScriptTarget.Latest, true, ts.ScriptKind.TSX);
  const fn = source.statements.find(node => ts.isFunctionDeclaration(node) && node.name.text === 'getResonancePenalty');
  const result = {};
  const code = ts.transpileModule('export ' + fn.getText(source), { compilerOptions: { module: ts.ModuleKind.CommonJS } }).outputText;
  vm.runInNewContext(code, { exports: result, getCharacterMeta, countInvalidEquippedMainOptions, getCharacterScore: () => ({ resonanceBns: 1 }) });
  const cData = { characterId: 'hsin', constell: [0], echoData: [echo(4, 'critRate'), echo(3, 'electroBns'), echo(3, 'atkPct'), echo(1, 'atkPct'), echo(1, 'hpPct')], echoDataIndex: [0, 1, 2, 3, 4] };
  const low = result.getResonancePenalty(cData, 100);
  assert.equal(low.shortage, 20);
  assert.equal(low.penalty, 45);
  assert.equal(low.invalidMainOptionCount, 1);
  const enough = result.getResonancePenalty(cData, 120);
  assert.equal(enough.penalty, 0);
  assert.equal(enough.invalidMainOptionCount, 1);
});

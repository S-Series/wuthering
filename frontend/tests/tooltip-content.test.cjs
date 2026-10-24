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
const { gameTooltip, imageTooltip, actionTooltip } = load(path.join(root, 'components/common/tooltipContent.ts'));
const { weaponStat } = load(path.join(root, 'datas/weaponStats.ts'));
const { characterConstellStats } = load(path.join(root, 'datas/characterConstellStats.ts'));
const { echoDict } = load(path.join(root, 'datas/echos.ts'));
const { harmony } = load(path.join(root, 'datas/harmonies.ts'));
const { locale } = load(path.join(root, 'locales/locale.ts'));
const context = { lang: 'kr', characterId: 'aemeath', chain: 0, refinement: 5, weaponId: 'sword004' };

test('only the equipped weapon uses the current refinement; recommendations start at R1', () => {
  const selected = gameTooltip('weapon', 'sword004', context);
  assert.ok(selected.lines.includes(`R5 · 크리티컬 +${weaponStat.sword004.value[1] * 2}%`));
  const other = gameTooltip('weapon', 'sword001', context);
  assert.ok(other.lines.some(line => line.startsWith('R1 · ')));
  assert.equal(other.lines.some(line => line.startsWith('R5')), false);
  const preview = gameTooltip('refinement', '2', context);
  assert.ok(preview.lines.includes(`R2 · 크리티컬 +${weaponStat.sword004.value[1] * 1.25}%`));
  assert.equal(gameTooltip('refinement', '6', context), null);
});

test('Echo and set popups use modeled effects, including all set thresholds', () => {
  const [echoId, echo] = Object.entries(echoDict.Cost4).find(([, item]) => item.getStats('aemeath').length);
  const info = gameTooltip('echo', echoId, context);
  assert.equal(info.title, echo.kr);
  assert.equal(info.lines.length, echo.getStats('aemeath').filter(s => s.value !== 0 && s.statId !== 'dummy').length);
  const [setId, set] = Object.entries(harmony).find(([, item]) => item.option.length > 1);
  const setInfo = gameTooltip('harmony', setId, context);
  for (const option of set.option) assert.ok(setInfo.lines.some(line => line.startsWith(`${option.count} · `)));
});

test('attack-specific chain notes are shown without adding them as general stat bonuses', () => {
  const info = gameTooltip('chain', '1', context);
  const effects = characterConstellStats.aemeath[1];
  assert.ok(effects.some(effect => effect.scope === 'specific'));
  for (const effect of effects) if (effect.note) assert.ok(info.lines.includes(effect.note));
  assert.ok(gameTooltip('chain', '0', context));
  assert.equal(gameTooltip('chain', '7', context), null);
});

test('asset lookup handles CDN URLs and query strings; unknown IDs fail safely', () => {
  assert.equal(imageTooltip('https://assets.example/ico/stats/critRate.webp?v=2', context).title, '크리티컬');
  assert.equal(imageTooltip('/unrelated.png', context), null);
  for (const kind of ['stat', 'character', 'weapon', 'echo', 'harmony', 'chain']) {
    assert.equal(gameTooltip(kind, '__proto__', context), null);
    assert.equal(gameTooltip(kind, 'missing', context), null);
  }
});

test('all supported languages include real stat help and decorated action labels keep their descriptions', () => {
  for (const lang of ['kr', 'en', 'jp', 'zh']) {
    const ctx = { ...context, lang };
    assert.ok(gameTooltip('stat', 'critRate', ctx).description);
    const text = locale(lang).card;
    assert.ok(actionTooltip(`ⓘ ${text.help}`, ctx).description);
    assert.equal(actionTooltip(`${text.request} 0:00`, ctx).description, actionTooltip(text.request, ctx).description);
  }
});

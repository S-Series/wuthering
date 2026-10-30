const fs = require('node:fs');
const path = require('node:path');
const vm = require('node:vm');
const ts = require('typescript');

const root = path.resolve(__dirname, '../../src');
const plain = value => JSON.parse(JSON.stringify(value));

// Run the real calculation modules in isolated contexts so baseline data never
// mutates the candidate. No score/calculation functions are stubbed.
function scoreHarness(baselineSheet) {
  const cache = new Map();
  function load(relative) {
    const filename = path.resolve(root, relative);
    if (cache.has(filename)) return cache.get(filename);
    const result = {};
    cache.set(filename, result);
    const code = ts.transpileModule(fs.readFileSync(filename, 'utf8'), {
      compilerOptions: { module: ts.ModuleKind.CommonJS, target: ts.ScriptTarget.ES2022 },
    }).outputText;
    vm.runInNewContext(code, {
      exports: result,
      console: { log() {} },
      require: id => {
        const target = id.startsWith('@/')
          ? path.join(root, id.slice(2))
          : path.resolve(path.dirname(filename), id);
        return load(fs.existsSync(target + '.ts') ? target + '.ts' : path.join(target, 'index.ts'));
      },
    });
    if (filename === path.join(root, 'datas/characterScoreSheet.ts') && baselineSheet) {
      Object.assign(result.characterScoreSheet, plain(baselineSheet));
    }
    return result;
  }
  return {
    ...load('runtime/characterData.helpers.ts'),
    ...load('datas/characterScoreSheet.ts'),
    ...load('types/character.type.ts'),
    ...load('datas/characters.meta.ts'),
    ...load('datas/characters.guide.ts'),
    ...load('datas/characters.ts'),
    ...load('datas/harmonies.ts'),
    plain,
  };
}

function buildScoreFixture(h, id, { damage = 'liberationBns', roll = 7.9, sequence = 0, weapon = null, er = true } = {}) {
  const data = h.createEmptyCharacterData(id);
  const meta = h.characterMeta[id];
  data.weaponId = weapon;
  data.constell = [sequence, 1];
  data.echoData.forEach(echo => {
    echo.setId = meta.harmonySets[0];
    const statId = echo.cost === 4 ? meta.cost4MainStats[0]
      : echo.cost === 3 ? meta.cost3MainStats[0] : `${meta.statType}Pct`;
    echo.mainOption = { statId, statValue: echo.cost === 4 ? 22 : echo.cost === 3 ? 30 : 18 };
    echo.subOptions = [
      { statId: 'critRate', statValue: roll === 11.6 ? 10.5 : 7.5 },
      { statId: 'critDmg', statValue: roll === 11.6 ? 21 : 15 },
      { statId: `${meta.statType}Pct`, statValue: meta.statType === 'def' && roll === 11.6 ? 14.7 : roll },
      { statId: damage, statValue: roll },
      { statId: er ? 'resonanceBns' : 'dummy', statValue: er ? 12.4 : 0 },
    ];
  });
  return data;
}

function evaluateScore(h, data) {
  const counts = {};
  for (const index of data.echoDataIndex.slice(0, 5)) {
    const set = data.echoData[index].setId;
    if (set) counts[set] = (counts[set] ?? 0) + 1;
  }
  const sets = Object.fromEntries(Object.entries(counts).map(([id, count]) => [id,
    Math.max(0, ...h.harmony[id].option.filter(option => count >= option.count).map(option => option.count)),
  ]));
  const stats = h.calcFinalStat(data, data.echoDataIndex, sets);
  const echoes = h.calcAllEchoScore(data);
  return { stats, echoes, final: h.calcFinalScore(data, stats, data.weaponId, echoes), crit: h.getCritRateScoreAdjustment(data, stats) };
}

module.exports = { scoreHarness, buildScoreFixture, evaluateScore };

const { test } = require('node:test');
const assert = require('node:assert/strict');
const baseline = require('./fixtures/score-sheet-2026-10-30.json');
const { scoreHarness, buildScoreFixture, evaluateScore } = require('./helpers/score-harness.cjs');
const current = scoreHarness();
const previous = scoreHarness(baseline.sheets);
const close = (actual, expected) => assert.ok(Math.abs(actual - expected) < 1e-8, `${actual} != ${expected}`);
// Independently calculated from the unchanged top-five/top-four maxima and ER budget.
const zhezhiMultiplier = 90 / ((94.32 * 2 + 93.16 * 3) / 5);

test('only the verified Zhezhi liberation weight changes across all 60 baseline profiles', () => {
  assert.equal(current.characterIds.length, 60);
  const expected = structuredClone(baseline.sheets);
  expected.zhezhi.liberationBns = 0;
  assert.deepEqual(current.plain(current.characterScoreSheet), expected);
});

test('Zhezhi keeps basic and direct skill value; liberation gains no points at S0 through S6', () => {
  for (let sequence = 0; sequence <= 6; sequence++) {
    const data = buildScoreFixture(current, 'zhezhi', { sequence });
    const sheet = current.getCharacterScore('zhezhi', null, sequence, data.echoData.slice(0, 5));
    assert.equal(sheet.basicBns, 1.1);
    assert.equal(sheet.skillBns, 0.1);
    assert.equal(sheet.liberationBns, 0);
    assert.equal(sheet.maxResCount, sequence === 0 ? 4 : 3);
    for (const [damage, weight] of [['basicBns', 1.1], ['skillBns', 0.1], ['liberationBns', 0]]) {
      const low = buildScoreFixture(current, 'zhezhi', { damage, roll: 6.4, sequence });
      const high = structuredClone(low);
      high.echoData[0].subOptions[3].statValue = 11.6;
      const before = current.calcAllEchoScore(low), after = current.calcAllEchoScore(high);
      close(after[0][1] - before[0][1], (11.6 - 6.4) * weight * zhezhiMultiplier);
      assert.equal(after[0][0], before[0][0]);
    }
  }
});

test('removing the tied fifth weight preserves normalization, pair bonus and crit correction', () => {
  for (const damage of ['basicBns', 'heavyBns', 'skillBns', 'liberationBns']) {
    const data = buildScoreFixture(current, 'zhezhi', { damage, roll: 11.6 });
    const old = evaluateScore(previous, data), next = evaluateScore(current, data);
    for (let slot = 0; slot < 10; slot++) {
      const removed = damage === 'liberationBns' ? 11.6 * 0.1 * zhezhiMultiplier : 0;
      close(old.echoes[slot][1] - next.echoes[slot][1], removed);
      assert.equal(next.echoes[slot][0], old.echoes[slot][0]);
    }
    assert.deepEqual(current.plain(next.stats), previous.plain(old.stats));
    assert.deepEqual(current.plain(next.crit), previous.plain(old.crit));
  }
  // Force fixed crit across and beyond the cap, with and without ER penalties.
  for (const fixedCrit of [13, 58, 80, 100, 110]) {
    for (const er of [100, 125, 130, 200]) {
      const data = buildScoreFixture(current, 'zhezhi');
      const stats = current.calcFinalStat(data, data.echoDataIndex, {});
      stats.critRate = fixedCrit + 37.5;
      stats.resonanceBns = er;
      const oldEchoes = previous.calcAllEchoScore(data), nextEchoes = current.calcAllEchoScore(data);
      const old = previous.calcFinalScore(data, stats, null, oldEchoes);
      const next = current.calcFinalScore(data, stats, null, nextEchoes);
      assert.equal(old[0], next[0]);
      assert.ok(old[1] >= next[1]);
      assert.ok(old[1] - next[1] <= 5 * 7.9 * 0.1 * zhezhiMultiplier + 0.1);
      close(previous.getCritRateScoreAdjustment(data, stats).scoreDelta, current.getCritRateScoreAdjustment(data, stats).scoreDelta);
    }
  }
});

test('all profiles retain score behavior except equipped Zhezhi liberation rolls (3840 builds)', () => {
  let cases = 0;
  for (const id of current.characterIds) {
    for (const sequence of [0, 1, 5, 6]) {
      for (const weapon of [null, current.characterGuideData[id].guideWeapons[0]]) {
        for (const damage of ['basicBns', 'heavyBns', 'skillBns', 'liberationBns']) {
          for (const roll of [6.4, 11.6]) {
            const data = buildScoreFixture(current, id, { damage, roll, sequence, weapon, er: roll === 11.6 });
            const input = current.plain(data);
            const old = evaluateScore(previous, data), next = evaluateScore(current, data);
            assert.ok(next.final.every(Number.isFinite), `${id} finite score`);
            assert.ok(next.final[1] >= 0 && next.final[1] <= 500, `${id} score bounds`);
            assert.deepEqual(current.plain(data), input, `${id} input unchanged`);
            if (id !== 'zhezhi' || damage !== 'liberationBns') {
              assert.deepEqual(current.plain(next), previous.plain(old), `${id}/${sequence}/${weapon}/${damage}/${roll}`);
            } else {
              assert.equal(next.final[0], old.final[0]);
              assert.ok(next.final[1] <= old.final[1]);
              const rawDelta = 5 * roll * 0.1 * zhezhiMultiplier;
              assert.ok(Math.abs(old.final[1] - next.final[1] - rawDelta) < 0.10000001);
            }
            cases++;
          }
        }
      }
    }
  }
  assert.equal(cases, 3840);
});

test('spare liberation rolls, equipped order, invalid mains and maximum-score builds remain correct', () => {
  const data = buildScoreFixture(current, 'zhezhi', { damage: 'basicBns' });
  data.echoData[8].subOptions[3] = { statId: 'liberationBns', statValue: 11.6 };
  const old = evaluateScore(previous, data), next = evaluateScore(current, data);
  assert.deepEqual(current.plain(next.final), previous.plain(old.final));
  data.echoDataIndex = [4, 3, 2, 1, 0, 5, 6, 7, 8, 9];
  assert.deepEqual(current.plain(evaluateScore(current, data).final), current.plain(next.final));
  data.echoData[0].mainOption.statId = 'dummy';
  close(current.calcAllEchoScore(data)[0][1], next.echoes[0][1] - 10);

  const maximum = current.createEmptyCharacterData('zhezhi');
  maximum.echoData.forEach((echo, index) => {
    echo.mainOption = { statId: echo.cost === 4 ? 'critDmg' : echo.cost === 3 ? 'glacioBns' : 'atkPct', statValue: 0 };
    echo.subOptions = [
      { statId: 'critRate', statValue: 10.5 }, { statId: 'critDmg', statValue: 21 },
      { statId: 'atkPct', statValue: 11.6 }, { statId: 'basicBns', statValue: 11.6 },
      { statId: index < 2 ? 'skillBns' : 'resonanceBns', statValue: index < 2 ? 11.6 : 12.4 },
    ];
  });
  assert.equal(evaluateScore(current, maximum).final[1], 500);
  assert.deepEqual(current.plain(evaluateScore(current, maximum).final), previous.plain(evaluateScore(previous, maximum).final));
});

const test = require('node:test');
const assert = require('node:assert/strict');
const fs = require('node:fs');
const path = require('node:path');
const vm = require('node:vm');
const ts = require('typescript');

function load(relative) {
  const source = fs.readFileSync(path.join(__dirname, '../src', relative), 'utf8');
  const result = {};
  vm.runInNewContext(ts.transpileModule(source, { compilerOptions: { module: ts.ModuleKind.CommonJS } }).outputText,
    { exports: result });
  return result;
}
const { towerContent } = load('datas/periodic/tower.ts');
const { wastesContent } = load('datas/periodic/wastes.ts');
const { matrixContent } = load('datas/periodic/matrix.ts');
const { getCurrentSeason, getCurrentSeasonRemainingTime } = load('utils/seasonUtils.ts');

test('October 19 has an active season for each dated content', () => {
  const now = new Date(2026, 9, 19, 12);
  for (const [content, season] of [[towerContent, 41], [wastesContent, 22], [matrixContent, 6]]) {
    assert.equal(getCurrentSeason(content, now)?.season, season);
  }
});
test('tower includes the next verified cycle without extrapolating dates', () => {
  assert.equal(getCurrentSeason(towerContent, new Date(2026, 10, 9, 12))?.season, 42);
  assert.equal(towerContent.seasons[0].endDate, '2026-12-07');
});
test('dated seasons are ordered, unique, and do not overlap', () => {
  for (const { seasons } of [towerContent, wastesContent, matrixContent]) {
    assert.equal(new Set(seasons.map(s => s.season)).size, seasons.length);
    seasons.forEach((season, index) => {
      assert.ok(season.startDate < season.endDate);
      if (index > 0) {
        assert.ok(seasons[index - 1].season > season.season);
        assert.ok(season.endDate <= seasons[index - 1].startDate);
      }
    });
  }
});

test('tower and wastes repeat 28-day cycles after the final registered season', () => {
  for (const content of [towerContent, wastesContent]) {
    const latest = content.seasons[0];
    const boundary = new Date(`${latest.endDate}T04:00:00`);
    assert.equal(getCurrentSeason(content, new Date(boundary.getTime() - 1)).season, latest.season);
    const fallback = getCurrentSeason(content, boundary);
    assert.equal(fallback.season, latest.season + 1);
    assert.equal(fallback.startDate, latest.endDate);
    assert.equal(getCurrentSeasonRemainingTime(content, boundary).days, 28);
    const later = new Date(boundary);
    later.setDate(later.getDate() + 85);
    assert.equal(getCurrentSeason(content, later).season, latest.season + 4);
    assert.ok(getCurrentSeasonRemainingTime(content, later).totalMs > 0);
  }
});

test('matrix waits after expiry; future registered seasons do not start early', () => {
  assert.equal(getCurrentSeason(matrixContent, new Date('2026-11-10T04:00:00')), undefined);
  assert.equal(getCurrentSeasonRemainingTime(matrixContent, new Date('2026-11-10T04:00:00')), null);
  assert.equal(getCurrentSeason(towerContent, new Date('2026-11-09T03:59:59')).season, 41);
  assert.equal(getCurrentSeason(towerContent, new Date('2026-11-09T04:00:00')).season, 42);
});

test('fallback is opt-in and requires a historical anchor', () => {
  assert.equal(getCurrentSeason({ seasons: [], fallbackDays: 28 }, new Date()), undefined);
  const source = { seasons: [{ season: 1, startDate: '2026-01-01', endDate: '2026-01-29' }] };
  assert.equal(getCurrentSeason(source, new Date('2026-02-01T12:00:00')), undefined);
  assert.equal(getCurrentSeason({ ...source, fallbackDays: 28 }, new Date('2025-12-01T12:00:00')), undefined);
});

const { test } = require('node:test');
const assert = require('node:assert/strict');
const fs = require('node:fs');
const path = require('node:path');
const vm = require('node:vm');
const ts = require('typescript');
const root = path.resolve(__dirname, '../src');
const plain = value => JSON.parse(JSON.stringify(value));

function harness() {
  const storage = new Map(), session = new Map(), writes = [], events = [], effects = [], popups = [];
  let failWrite = false;
  const localStorage = {
    getItem: key => storage.get(key) ?? null,
    setItem: (key, value) => {
      if (failWrite) throw new Error('storage unavailable');
      writes.push(key); storage.set(key, value);
    },
  };
  const cache = new Map();
  const post = { id: 15, date: '2026-10-06', title: { kr: 'Ver 1.4.2' }, data: { kr: 'release' } };
  const posts = [post];
  let refresh;
  const stubs = {
    react: { useEffect: fn => effects.push(fn) },
    'react-router-dom': { useLocation: () => ({ pathname: '/card' }) },
    'react/jsx-runtime': { jsx: (type, props) => ({ type, props }), jsxs: (type, props) => ({ type, props }) },
    '@/posts/homePosts': { HOME_POSTS: posts },
    '@/stores/appStore': { useAppStore: () => ({ lang: 'kr' }) },
    '@/stores/characterDataStore': { useCharacter: () => ({ refreshAllScoresForNotice: id => refresh(id) }) },
    '@/contexts/PopupContext': { useOverlay: () => ({ openOverlay: (...args) => popups.push(args) }) },
  };
  function load(relative) {
    const filename = path.resolve(root, relative);
    if (cache.has(filename)) return cache.get(filename);
    const result = {}; cache.set(filename, result);
    const code = ts.transpileModule(fs.readFileSync(filename, 'utf8'), {
      compilerOptions: { module: ts.ModuleKind.CommonJS, target: ts.ScriptTarget.ES2022, jsx: ts.JsxEmit.ReactJSX },
    }).outputText;
    vm.runInNewContext(code, {
      exports: result, localStorage, Event: class { constructor(type) { this.type = type; } },
      window: { localStorage, sessionStorage: { getItem: key => session.get(key) ?? null, setItem: (key, value) => session.set(key, value) }, dispatchEvent: event => events.push(event.type) },
      console: { log() {}, error() {} },
      require: id => {
        if (stubs[id]) return stubs[id];
        if (id.endsWith('.css')) return {};
        const target = id.startsWith('@/') ? path.join(root, id.slice(2)) : path.resolve(path.dirname(filename), id);
        return load(target + (fs.existsSync(target + '.ts') ? '.ts' : '.tsx'));
      },
    });
    return result;
  }
  const { createEmptyCharacterData } = load('types/character.type.ts');
  const { characterIds } = load('datas/characters.ts');
  const characters = Object.fromEntries(characterIds.map(id => [id, createEmptyCharacterData(id)]));
  const lucy = characters.lucy;
  lucy.weaponId = 'pistol007';
  lucy.isFavorite = true;
  for (let i = 0; i < 5; i++) {
    const echo = lucy.echoData[i];
    echo.setId = i === 0 ? 'Adam' : i < 3 ? 'Memories' : 'Radiance';
    echo.mainOption = { statId: i === 0 ? 'critRate' : 'atkPct', statValue: i === 0 ? 22 : i < 3 ? 30 : 18 };
    echo.subOptions = [{ statId: 'critRate', statValue: 7.5 }, { statId: 'critDmg', statValue: 15 }, { statId: 'atkPct', statValue: 7.9 }, { statId: 'heavyBns', statValue: 8.6 }, { statId: 'resonanceBns', statValue: 10.8 }];
  }
  const api = load('summaryData/noticeScoreRefresh.ts');
  refresh = id => api.refreshScoresForNotice(id, characters);
  return {
    ...api, storage, writes, events, popups, posts, characters, characterIds, load,
    failWrites: value => { failWrite = value; },
    runPopup() { load('components/features/Home/GlobalNoticePopup.tsx').default(); effects.splice(0).forEach(fn => fn()); },
  };
}

test('new notice rebuilds every score using equipped stats and sets, preserving gear and favorites', () => {
  const h = harness(), before = plain(h.characters);
  h.storage.set('character_stat_data', JSON.stringify({ version: 1, data: { lucy: { score: 333.3 } } }));
  assert.equal(h.refreshScoresForNotice(15, h.characters), true);
  const saved = JSON.parse(h.storage.get('character_stat_data'));
  const { calcFinalStat, calcAllEchoScore, calcFinalScore } = h.load('runtime/characterData.helpers.ts');
  const lucy = h.characters.lucy;
  const stats = calcFinalStat(lucy, lucy.echoDataIndex, { Adam: 1, Memories: 2, Radiance: 2 });
  const expected = calcFinalScore(lucy, stats, lucy.weaponId, calcAllEchoScore(lucy))[1];
  assert.equal(saved.data.lucy.score, expected);
  assert.notEqual(expected, 333.3);
  assert.deepEqual(Object.keys(saved.data).sort(), [...h.characterIds].sort());
  assert.equal(saved.data.rover_spectro.score, 0);
  assert.deepEqual(plain(h.characters), before);
  assert.equal(h.storage.get(h.NOTICE_SCORE_REFRESH_KEY), '15');
  assert.deepEqual(h.events, ['wuthering:character-summary-updated']);
});

test('missing snapshots are scored using first recommended weapons and conditional set assumptions', () => {
  const h = harness();
  delete h.characters.sigrika;
  delete h.characters.galbrena;
  h.characters.aemeath.weaponId = null;
  const before = plain(h.characters), seen = new Map();
  const runtime = h.load('runtime/characterData.helpers.ts');
  const original = runtime.calcFinalScore;
  runtime.calcFinalScore = (data, stats, weaponId, scores) => {
    seen.set(data.characterId, { data: plain(data), budget: runtime.getCritRateScoreAdjustment(data, stats) });
    return original(data, stats, weaponId, scores);
  };
  assert.equal(h.refreshScoresForNotice(17, h.characters), true);
  assert.equal(seen.size, h.characterIds.length);
  assert.equal(seen.get('sigrika').data.weaponId, 'gauntlet008');
  assert.equal(seen.get('galbrena').data.weaponId, 'pistol004');
  assert.equal(seen.get('aemeath').data.weaponId, 'sword009');
  for (const [id, setId] of [['sigrika', 'Sound'], ['galbrena', 'Shadow']]) {
    const assumption = seen.get(id).budget.conditionalSet;
    assert.equal(assumption.setId, setId);
    assert.equal(assumption.bonuses.find(bonus => bonus.statId === 'critRate').value, 20);
  }
  assert.deepEqual(plain(h.characters), before);
});

test('a scoring-rules update refreshes a previously completed notice exactly once', () => {
  const h = harness();
  h.storage.set(h.NOTICE_SCORE_REFRESH_KEY, '17');
  h.storage.set(h.NOTICE_SCORE_RULES_KEY, 'older-rules');
  assert.equal(h.refreshScoresForNotice(17, h.characters), true);
  assert.equal(h.storage.get(h.NOTICE_SCORE_RULES_KEY), h.NOTICE_SCORE_RULES_VERSION);
  assert.equal(h.refreshScoresForNotice(17, h.characters), false);
  assert.equal(h.events.length, 1);
});

test('repeated effects, reloads and popup dismissal cannot repeat the same version refresh', () => {
  const h = harness();
  h.runPopup(); h.runPopup();
  // A new session or language-render may show the popup again, but not rescore.
  h.runPopup();
  assert.equal(h.popups.length, 1);
  assert.equal(h.events.length, 1);
  assert.equal(h.refreshScoresForNotice(15, h.characters), false);
  h.posts[0] = { ...h.posts[0], id: 16 };
  h.runPopup();
  assert.equal(h.popups.length, 2);
  assert.equal(h.events.length, 2);
  assert.equal(h.storage.get(h.NOTICE_SCORE_REFRESH_KEY), '16');
});

test('previously hidden or session-shown notices still refresh stale scores once on rollout', () => {
  const h = harness();
  h.storage.set('wuthering.homeNotice.dismissedIds', '[15]');
  h.runPopup();
  assert.equal(h.popups.length, 0);
  assert.equal(h.events.length, 1);
  h.runPopup();
  assert.equal(h.events.length, 1);
});

test('failed calculation or storage never marks the version complete or corrupts the existing cache', () => {
  const h = harness();
  const old = JSON.stringify({ version: 1, data: { lucy: { score: 333.3 } } });
  h.storage.set('character_stat_data', old);
  h.characters.lucy.echoData[0].subOptions[0].statValue = NaN;
  assert.throws(() => h.refreshScoresForNotice(15, h.characters));
  assert.equal(h.storage.get('character_stat_data'), old);
  assert.equal(h.storage.has(h.NOTICE_SCORE_REFRESH_KEY), false);
  h.characters.lucy.echoData[0].subOptions[0].statValue = 7.5;
  h.failWrites(true);
  assert.throws(() => h.refreshScoresForNotice(15, h.characters));
  assert.equal(h.storage.get('character_stat_data'), old);
  assert.equal(h.events.length, 0);
  h.failWrites(false);
  assert.equal(h.refreshScoresForNotice(15, h.characters), true);
});

test('a failed refresh still opens the notice and remains retryable', () => {
  const h = harness();
  h.characters.lucy.echoData[0].subOptions[0].statValue = NaN;
  h.runPopup();
  assert.equal(h.popups.length, 1);
  assert.equal(h.storage.has(h.NOTICE_SCORE_REFRESH_KEY), false);
  h.characters.lucy.echoData[0].subOptions[0].statValue = 7.5;
  h.runPopup();
  assert.equal(h.events.length, 1);
  assert.equal(h.popups.length, 1);
});

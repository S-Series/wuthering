const { test } = require('node:test');
const assert = require('node:assert/strict');
const fs = require('node:fs');
const path = require('node:path');
const vm = require('node:vm');
const ts = require('typescript');
const root = path.resolve(__dirname, '../src');
const plain = value => JSON.parse(JSON.stringify(value));
const favoritesKey = 'wuthering.characters.favorites';
const charactersKey = 'wm-character-data';

// Run the actual provider's state transitions and persistence without a browser,
// isolating score rendering and network access from the storage contract.
function harness(savedFavorites, savedCharacters = {}) {
  const storage = new Map([[favoritesKey, JSON.stringify(savedFavorites)], [charactersKey, JSON.stringify(savedCharacters)]]);
  const localStorage = { getItem: key => storage.get(key) ?? null, setItem: (key, value) => storage.set(key, value) };
  const state = [];
  let cursor = 0, effects = [];
  const listeners = new Map();
  const react = {
    createContext: () => ({ Provider: 'provider' }),
    createElement: (type, props) => ({ type, props }),
    useContext: () => null,
    useMemo: callback => callback(),
    useCallback: callback => callback,
    useEffect: callback => { effects.push(callback); },
    useState: initial => {
      const index = cursor++;
      if (!(index in state)) state[index] = typeof initial === 'function' ? initial() : initial;
      return [state[index], update => { state[index] = typeof update === 'function' ? update(state[index]) : update; }];
    },
  };
  const cache = new Map();
  const stubs = {
    react: { __esModule: true, default: react, ...react },
    '@/datas/characters': { characterIds: ['rover_spectro', 'aemeath', 'zani'] },
    '@/summaryData/storage': { saveCharacterScore() {} },
    '@/runtime/characterData.helpers': {
      calcBaseStat: () => ({}),
      calcAllEchoScore: () => [],
      calcFinalScore: () => [0, 0],
      calcCharacterStatDetails: () => ({ stats: {}, contributions: [] }),
    },
  };
  function load(filename) {
    filename = path.resolve(filename);
    if (cache.has(filename)) return cache.get(filename);
    const result = {};
    cache.set(filename, result);
    const code = ts.transpileModule(fs.readFileSync(filename, 'utf8'), {
      compilerOptions: { module: ts.ModuleKind.CommonJS, target: ts.ScriptTarget.ES2022, jsx: ts.JsxEmit.React, esModuleInterop: true },
    }).outputText;
    vm.runInNewContext(code, {
      exports: result, console: { log() {} }, localStorage,
      window: { addEventListener: (name, callback) => listeners.set(name, callback), removeEventListener: name => listeners.delete(name) },
      require: id => {
        if (stubs[id]) return stubs[id];
        const target = id.startsWith('@/') ? path.join(root, id.slice(2)) : path.resolve(path.dirname(filename), id);
        return load(target + (fs.existsSync(target + '.ts') ? '.ts' : '.tsx'));
      },
    });
    return result;
  }
  const { CharacterProvider } = load(path.join(root, 'stores/characterDataStore.tsx'));
  const { createEmptyCharacterData } = load(path.join(root, 'types/character.type.ts'));
  return {
    storage, listeners, empty: createEmptyCharacterData,
    snapshot: () => JSON.parse(storage.get(charactersKey)),
    render: () => {
      cursor = 0;
      effects = [];
      const result = CharacterProvider({ children: null }).props.value;
      effects.forEach(callback => callback());
      return result;
    },
  };
}

test('legacy local favorites migrate into character snapshots without overriding explicit saved states', () => {
  const app = harness(['aemeath', 'aemeath', 'zani', 'invalid'], { zani: { isFavorite: false } });
  const view = app.render();
  assert.deepEqual(plain(view.favoriteCharacterIds), ['aemeath']);
  assert.equal(app.snapshot().aemeath.isFavorite, true);
  assert.equal(app.snapshot().zani.isFavorite, false);
  assert.deepEqual(JSON.parse(app.storage.get(favoritesKey)), ['aemeath']);
});

test('toggling any character writes the same state to local favorites and the cloud-ready snapshot', () => {
  const app = harness([]);
  let view = app.render();
  view.toggleFavoriteCharacter('aemeath');
  view = app.render();
  assert.deepEqual(plain(view.favoriteCharacterIds), ['aemeath']);
  assert.equal(view.characterId, 'rover_spectro', 'favoriting a different card does not select it');
  assert.equal(app.snapshot().aemeath.isFavorite, true);
  view.toggleFavoriteCharacter('aemeath');
  app.render();
  assert.equal(app.snapshot().aemeath.isFavorite, false);
  assert.deepEqual(JSON.parse(app.storage.get(favoritesKey)), []);
});

test('full cloud restore replaces explicit favorites, preserves legacy omissions, and keeps build data', () => {
  const app = harness(['aemeath']);
  let view = app.render();
  const aemeath = app.empty('aemeath');
  aemeath.weaponId = 'sword004';
  aemeath.echoData[0].subOptions[0] = { statId: 'critRate', statValue: 10.5 };
  view.replaceCharacterDataSnapshot({ aemeath, zani: { ...app.empty('zani'), isFavorite: true } });
  view = app.render();
  assert.deepEqual(plain(view.favoriteCharacterIds), ['aemeath', 'zani']);
  assert.equal(app.snapshot().aemeath.weaponId, 'sword004');
  assert.equal(app.snapshot().aemeath.echoData[0].subOptions[0].statValue, 10.5);
  view.replaceCharacterDataSnapshot({ aemeath: { ...aemeath, isFavorite: false }, zani: { ...app.empty('zani'), isFavorite: false } });
  view = app.render();
  assert.deepEqual(plain(view.favoriteCharacterIds), []);
  assert.equal(app.snapshot().aemeath.isFavorite, false, 'explicit unfavorite is not merged as a union');
});

test('selected-character cloud restore updates favorites immediately and leaves other characters intact', () => {
  const app = harness(['zani']);
  let view = app.render();
  view.replaceCharacterData('aemeath', { ...app.empty('aemeath'), isFavorite: true });
  view = app.render();
  assert.deepEqual(plain(view.favoriteCharacterIds), ['aemeath', 'zani']);
  view.replaceCharacterData('aemeath', app.empty('aemeath'));
  view = app.render();
  assert.deepEqual(plain(view.favoriteCharacterIds), ['aemeath', 'zani'], 'old cloud snapshots do not erase local favorites');
  view.replaceCharacterData('aemeath', { ...app.empty('aemeath'), isFavorite: false });
  view = app.render();
  assert.deepEqual(plain(view.favoriteCharacterIds), ['zani']);
});

test('cross-tab favorites update both the displayed state and cloud-ready character data', () => {
  const app = harness([]);
  app.render();
  app.storage.set(favoritesKey, JSON.stringify(['aemeath']));
  app.listeners.get('storage')({ key: favoritesKey });
  const view = app.render();
  assert.deepEqual(plain(view.favoriteCharacterIds), ['aemeath']);
  assert.equal(app.snapshot().aemeath.isFavorite, true);
});

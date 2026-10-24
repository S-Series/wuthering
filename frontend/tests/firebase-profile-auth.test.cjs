const test = require('node:test');
const assert = require('node:assert/strict');
const fs = require('node:fs');
const path = require('node:path');
const vm = require('node:vm');
const ts = require('typescript');

test('mismatched or signed-out profile access fails before Firestore I/O', async () => {
  const result = {};
  let currentUser = null;
  let reads = 0, writes = 0;
  const code = ts.transpileModule(fs.readFileSync(path.join(__dirname, '../src/firebase/user.ts'), 'utf8'),
    { compilerOptions: { module: ts.ModuleKind.CommonJS } }).outputText;
  vm.runInNewContext(code, { exports: result, require: name => {
    if (name === './firebase') return { requireAuth: () => ({ currentUser }), requireDb: () => ({}) };
    if (name === 'firebase/firestore') return {
      doc: () => ({}), getDoc: async () => { reads++; return { exists: () => false }; }, setDoc: async () => { writes++; },
    };
    if (name === 'firebase/auth') return {};
    if (name === '@/datas/characterStats') return { characterStat: {} };
    throw new Error(name);
  } });
  for (const user of [null, { uid: 'bob' }]) {
    currentUser = user;
    await assert.rejects(result.getGameProfile('alice'), /does not match/);
    await assert.rejects(result.saveGameProfile('alice', {}), /does not match/);
  }
  assert.equal(reads, 0);
  assert.equal(writes, 0);
  currentUser = { uid: 'alice' };
  await result.getGameProfile('alice');
  await result.saveGameProfile('alice', { gameLevel: 90 });
  assert.equal(reads, 2);
  assert.equal(writes, 1);
});

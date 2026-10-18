const test = require('node:test');
const assert = require('node:assert/strict');
const fs = require('node:fs');
const path = require('node:path');
const vm = require('node:vm');
const ts = require('typescript');
const source = fs.readFileSync(path.join(__dirname, '../src/stores/cloudCharacterCache.ts'), 'utf8');
const compiled = ts.transpileModule(source, { compilerOptions: { module: ts.ModuleKind.CommonJS, target: ts.ScriptTarget.ES2022 } }).outputText;
const context = { exports: {} };
vm.runInNewContext(compiled, context);
const { hasCloudSnapshot, mergeCloudSnapshot } = context.exports;
const empty = { status: 'idle', data: {}, updatedAt: null, fetchedForUid: null, loadedAll: false, loadedCharacterIds: [] };
const plain = value => JSON.parse(JSON.stringify(value));

test('a partial load cannot masquerade as a full download or another character', () => {
  const partial = mergeCloudSnapshot(empty, 'user-a', { rover_spectro: { level: 90 } }, 'v1', 'rover_spectro');
  assert.equal(hasCloudSnapshot(partial, 'user-a', 'rover_spectro'), true);
  assert.equal(hasCloudSnapshot(partial, 'user-a', 'aemeath'), false);
  assert.equal(hasCloudSnapshot(partial, 'user-a'), false);
  assert.equal(hasCloudSnapshot(partial, 'user-b', 'rover_spectro'), false);
});
test('known absent characters are cached without retrying every time', () => {
  const absent = mergeCloudSnapshot(empty, 'user-a', {}, null, 'rover_spectro');
  assert.equal(hasCloudSnapshot(absent, 'user-a', 'rover_spectro'), true);
  assert.equal(hasCloudSnapshot(absent, 'user-a'), false);
});
test('targeted updates preserve other cached characters and account isolation', () => {
  const full = mergeCloudSnapshot(empty, 'user-a', { rover_spectro: { level: 90 }, aemeath: { level: 80 } }, 'v1');
  const changed = mergeCloudSnapshot(full, 'user-a', { rover_spectro: { level: 99 } }, 'v2', 'rover_spectro');
  assert.equal(hasCloudSnapshot(changed, 'user-a'), true);
  assert.deepEqual(plain(changed.data.aemeath), { level: 80 });
  const switched = mergeCloudSnapshot(changed, 'user-b', {}, null, 'rover_spectro');
  assert.deepEqual(plain(switched.data), {});
  assert.equal(switched.loadedAll, false);
  assert.deepEqual(plain(full.data.rover_spectro), { level: 90 }, 'inputs are not mutated');
});

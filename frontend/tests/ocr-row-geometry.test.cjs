const test = require('node:test');
const assert = require('node:assert/strict');
const fs = require('node:fs');
const vm = require('node:vm');
const ctx = {};
vm.runInNewContext(fs.readFileSync(require('node:path').join(__dirname, '../public/ocr/row-geometry.js'), 'utf8'), ctx);

function image(unit, pitch, count = 7) {
  const width = Math.round(unit * 6), height = Math.round(unit * 6.5);
  const pixels = new Uint8ClampedArray(width * height * 4);
  for (let row = 0; row < count; row++) {
    const center = Math.round(unit * 0.9 + row * pitch);
    for (let y = center - Math.round(unit * 0.12); y <= center + Math.round(unit * 0.12); y++) {
      for (let x = width * 0.2 | 0; x < width * 0.8; x++) pixels.set([210, 215, 220, 255], (y * width + x) * 4);
    }
  }
  return ctx.findStatRows(pixels, width, height, unit);
}

test('actual row pitch replaces profile offsets at different resolutions', () => {
  for (const unit of [30, 60, 90]) {
    for (const ratio of [0.55, 0.62, 0.7]) {
      const rows = image(unit, unit * ratio);
      assert.equal(rows.length, 7);
      rows.forEach((row, i) => assert.ok(Math.abs(row.center - (unit * 0.9 + i * unit * ratio)) <= 1));
    }
  }
});
test('incomplete or blank rows use fallback rather than inventing positions', () => {
  assert.equal(image(60, 38, 0), null);
  assert.equal(image(60, 38, 4), null);
});

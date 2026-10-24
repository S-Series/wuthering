const test = require('node:test');
const assert = require('node:assert/strict');
const fs = require('node:fs');
const vm = require('node:vm');
const ctx = {};
vm.runInNewContext(fs.readFileSync(require('node:path').join(__dirname, '../public/ocr/row-geometry.js'), 'utf8'), ctx);

function image(unit, pitch, missing = []) {
  const width = Math.round(unit * 6), height = Math.round(unit * 6.5);
  const pixels = new Uint8ClampedArray(width * height * 4);
  for (let row = 0; row < 7; row++) {
    if (missing.includes(row)) continue;
    const center = Math.round(unit * 0.9 + row * pitch);
    for (let y = center - Math.round(unit * 0.12); y <= center + Math.round(unit * 0.12); y++) {
      for (let x = width * 0.2 | 0; x < width * 0.8; x++) pixels.set([210, 215, 220, 255], (y * width + x) * 4);
    }
  }
  return ctx.findStatRows(pixels, width, height, unit, Array.from({ length: 7 }, (_, i) => unit * (0.9 + i * 0.62)));
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
test('a missing middle row leaves other rows detected at their own positions', () => {
  const rows = image(60, 38, [3]);
  assert.equal(rows[3], null);
  rows.forEach((row, i) => {
    if (i !== 3) assert.ok(Math.abs(row.center - (54 + i * 38)) <= 1);
  });
  assert.ok(image(60, 38, [0, 1, 2, 3, 4, 5, 6]).every(row => row === null));
});

test('irregular row gaps, widths and heights are measured independently, keeping the percent column', () => {
  const unit = 60, width = 400, height = 420;
  const pixels = new Uint8ClampedArray(width * height * 4);
  const centers = [53, 99, 130, 181, 214, 259, 297];
  const halfHeights = [6, 9, 5, 7, 6, 8, 5];
  centers.forEach((center, index) => {
    for (let y = center-halfHeights[index]; y <= center+halfHeights[index]; y++) {
      for (let x = 45 + index*3; x < 180 + index*4; x++) pixels.set([210, 215, 220, 255], (y*width+x)*4);
      // A detached value and % at the far right must be retained in the same box.
      for (let x = 365; x < 392; x++) pixels.set([210, 215, 220, 255], (y*width+x)*4);
    }
  });
  const rows = ctx.findStatRows(pixels, width, height, unit, [54, 91, 129, 166, 203, 240, 277]);
  rows.forEach((row, i) => {
    assert.equal(row.center, centers[i] + 0.5);
    assert.ok(row.top < centers[i]-halfHeights[i]);
    assert.ok(row.bottom > centers[i]+halfHeights[i]);
    assert.ok(row.right >= 392);
    assert.ok(row.left < 45+i*3);
  });
  assert.notEqual(rows[0].bottom-rows[0].top, rows[1].bottom-rows[1].top);
});

test('colored header text is measured without including thin divider lines', () => {
  const width = 300, height = 70, pixels = new Uint8ClampedArray(width*height*4);
  for (let y = 20; y < 35; y++) {
    for (let x = 10; x < 160; x++) pixels.set([225, 211, 120, 255], (y*width+x)*4);
  }
  for (let x = 0; x < width; x++) pixels.set([210, 215, 220, 255], (60*width+x)*4);
  const box = ctx.findRegionBounds(pixels, width, height, 60, true);
  assert.ok(box.left < 10 && box.right > 160);
  assert.ok(box.top < 20 && box.bottom > 35 && box.bottom < 60);
});

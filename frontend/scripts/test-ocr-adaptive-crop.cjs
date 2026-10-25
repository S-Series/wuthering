const { chromium } = require(process.env.PLAYWRIGHT_PATH || 'playwright');
const assert = require('node:assert/strict');
const fs = require('node:fs');
const path = require('node:path');
const os = require('node:os');

const sample = process.argv[2];
if (!sample) throw new Error('Pass a full Echo screenshot path.');
const output = path.join(os.tmpdir(), 'wuthering-adaptive-crop');
const origin = process.env.OCR_TEST_ORIGIN || 'http://127.0.0.1:5173';
fs.mkdirSync(output, { recursive: true });
(async () => {
  const browser = await chromium.launch({ channel: 'msedge', headless: true });
  try {
    const page = await browser.newPage();
    await page.route(`${origin}/`, route => route.fulfill({ contentType: 'text/html', body: '<input type="file">' }));
    await page.goto(`${origin}/`);
    await page.locator('input').setInputFiles(sample);
    for (const variant of [{ scale: 1 }, { scale: 0.75 }, { scale: 1.5 }, { scale: 3 }, { scale: 1, panel: true }]) {
      const result = await page.evaluate(async ({ scale, panel }) => {
        const { prepareOcrImage } = await import('/src/api/ocr.preprocess.ts');
        const original = document.querySelector('input').files[0];
        const image = await createImageBitmap(original);
        const box = panel ? [image.width * 0.825, image.height * 0.11, image.width * 0.17, image.height * 0.45]
          : [0, 0, image.width, image.height];
        const canvas = new OffscreenCanvas(Math.round(box[2] * scale), Math.round(box[3] * scale));
        canvas.getContext('2d').drawImage(image, ...box, 0, 0, canvas.width, canvas.height);
        image.close();
        const file = new File([await canvas.convertToBlob()], 'scaled.png', { type: 'image/png' });
        const prepared = await prepareOcrImage(file, new AbortController().signal, { splitHeader: true });
        const atlas = await createImageBitmap(prepared.file);
        const check = new OffscreenCanvas(atlas.width, atlas.height);
        const ctx = check.getContext('2d');
        ctx.drawImage(atlas, 0, 0);
        atlas.close();
        const edges = prepared.metadata.bands.slice(2).map(band => {
          const { data } = ctx.getImageData(16, band.top, check.width - 32, band.bottom - band.top);
          const width = check.width - 32, height = band.bottom - band.top;
          let top = height, bottom = -1;
          for (let y = 0; y < height; y++) {
            let count = 0;
            for (let x = Math.round(width * 0.12); x < width * 0.94; x++) {
              const i = (y * width + x) * 4;
              const rgb = [data[i], data[i+1], data[i+2]];
              if (Math.min(...rgb) >= 155 && Math.max(...rgb)-Math.min(...rgb) < 65) count++;
            }
            if (count >= width * 0.03) { top = Math.min(top, y); bottom = y; }
          }
          return { top, bottom, height };
        });
        return { metadata: prepared.metadata, edges, bytes: Array.from(new Uint8Array(await prepared.file.arrayBuffer())) };
      }, variant);
      assert.equal(result.metadata.bands.length, 9);
      assert.ok(result.metadata.width <= 832, 'The aligned atlas must stay within its size limit');
      for (const band of result.metadata.bands) {
        assert.ok(band.left >= 16 && band.right <= result.metadata.width - 16);
        assert.ok(band.right > band.left);
        const [left, top, right, bottom] = band.source;
        assert.ok(left >= 0 && top >= 0 && right <= result.metadata.sourceWidth && bottom <= result.metadata.sourceHeight);
        assert.ok(right > left && bottom > top);
        assert.equal(band.method, 'detected', `Each visible region must be detected independently: ${band.index}`);
      }
      for (const row of result.edges) {
        assert.ok(row.bottom >= row.top, 'Each row must contain text');
        assert.ok(row.top >= 2 && row.bottom < row.height - 2, `Text must not touch crop boundary: ${JSON.stringify(row)}`);
      }
      const name = variant.panel ? 'cropped-panel' : `scale-${variant.scale}`;
      fs.writeFileSync(path.join(output, `${name}.png`), Buffer.from(result.bytes));
      fs.writeFileSync(path.join(output, `${name}.json`), JSON.stringify(result.metadata, null, 2));
      console.log(`PASS ${name}: nine independent boxes, all seven text rows intact`);
    }
    console.log('Artifacts:', output);
  } finally { await browser.close(); }
})().catch(error => { console.error(error); process.exitCode = 1; });

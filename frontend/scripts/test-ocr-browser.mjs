import { chromium } from "playwright";
import assert from "node:assert/strict";
import { mkdir, writeFile } from "node:fs/promises";
import os from "node:os";
import path from "node:path";

const browser = await chromium.launch({ channel: "msedge", headless: true });
const page = await browser.newPage();
await page.route("http://127.0.0.1:5173/", route => route.fulfill({ contentType: "text/html", body: '<input type="file">' }));
await page.goto("http://127.0.0.1:5173/");
const temp = "C:/Users/inwea/AppData/Local/Temp/";
const records = "D:/_Record/Wuthering Waves/";
const samples = [
  ["fold", temp+"codex-clipboard-0d40687c-e45e-4703-88a0-4bdc79959a30.png"],
  ["phone", temp+"codex-clipboard-41703f31-e0b6-4b6c-b1c5-fc6338080040.png"],
  ["desktop", temp+"codex-clipboard-4ab2563e-f89b-4be5-b962-c3fb72c4f5a3.png"],
  ["tablet", temp+"codex-clipboard-19c68921-4f1c-4ce5-b615-a15877143956.png"],
  ["panel", temp+"codex-clipboard-360fdcfa-1bf2-4340-9a31-1fe283e25c67.png"],
  ["small-panel", temp+"codex-clipboard-e3e4b249-7844-4444-a2ef-94fc94aae3a6.png"],
  ...["21.54.42.32", "21.52.55.92", "21.52.28.00", "21.52.03.23", "21.51.54.78", "21.51.15.82", "21.48.59.51"]
    .map(stamp => [stamp, records+`Wuthering Waves Screenshot 2026.09.12 - ${stamp}.png`]),
];
const output = path.join(os.tmpdir(), "wuthering-ocr-browser");
await mkdir(output, { recursive: true });
try {
  for (const [name, file] of samples) {
    await page.locator("input").setInputFiles(file);
    const result = await page.evaluate(async () => {
      const { prepareOcrImage } = await import("/src/api/ocr.preprocess.ts");
      const original = document.querySelector("input").files[0];
      const bitmap = await createImageBitmap(original);
      const originalWidth = bitmap.width;
      bitmap.close();
      const start = performance.now();
      const result = await prepareOcrImage(original, new AbortController().signal);
      return { metadata: result.metadata, bytes: Array.from(new Uint8Array(await result.file.arrayBuffer())),
        originalWidth, originalBytes: original.size, ms: Math.round(performance.now()-start) };
    });
    assert.equal(result.metadata.bands.length, 8);
    assert.deepEqual(result.metadata.bands.map(b => b.index), [-1,0,1,2,3,4,5,6]);
    assert.ok(result.metadata.width <= 840);
    assert.ok(result.metadata.width <= result.originalWidth + 32, "Crop must not upscale the source");
    await writeFile(path.join(output, name+".png"), Buffer.from(result.bytes));
    await writeFile(path.join(output, name+".json"), JSON.stringify(result.metadata));
    console.log(name, result.ms+"ms", result.originalBytes+" -> "+result.bytes.length+" bytes");
  }
  assert.equal(await page.evaluate(async () => {
    const { prepareOcrImage } = await import("/src/api/ocr.preprocess.ts");
    const controller = new AbortController();
    const promise = prepareOcrImage(document.querySelector("input").files[0], controller.signal);
    controller.abort();
    try { await promise; return false; } catch (error) { return error.name === "AbortError"; }
  }), true);
  console.log(`All ${samples.length} browser crops and cancellation passed. Artifacts:`, output);
} finally {
  await browser.close();
}

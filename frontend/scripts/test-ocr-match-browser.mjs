import { chromium } from "playwright";
import assert from "node:assert/strict";

const browser = await chromium.launch({ channel: "msedge", headless: true });
try {
  const page = await browser.newPage();
  await page.route("http://127.0.0.1:5173/", route => route.fulfill({ contentType: "text/html", body: '<input type="file">' }));
  await page.goto("http://127.0.0.1:5173/");
  const samples = [
    ["41703f31-e0b6-4b6c-b1c5-fc6338080040", "Dream", ["havocBns", "atk", "liberationBns", "critDmg", "critRate", "atk", "resonanceBns"]],
    ["19c68921-4f1c-4ce5-b615-a15877143956", "Heart", ["critDmg", "atk", "basicBns", "critRate", "resonanceBns", "def", "hp"]],
  ];
  for (const [sample, setId, statIds] of samples) {
    await page.locator("input").setInputFiles(`C:/Users/inwea/AppData/Local/Temp/codex-clipboard-${sample}.png`);
    const matches = await page.evaluate(async () => {
      const { prepareOcrImage } = await import("/src/api/ocr.preprocess.ts");
      const { matchOcrImages } = await import("/src/api/ocr.match.ts");
      const signal = new AbortController().signal;
      const prepared = await prepareOcrImage(document.querySelector("input").files[0], signal, { splitHeader: true });
      return matchOcrImages(prepared.file, prepared.metadata, "kr", signal);
    });
    assert.equal(matches.harmony.id, setId);
    assert.deepEqual(matches.rows.map(row => row.match?.id), statIds);
  }
  const checks = await page.evaluate(async () => {
    const { resolveMatchedStat, matchOcrImages } = await import("/src/api/ocr.match.ts");
    const result = (id, texts, index) => resolveMatchedStat({ id, score: 0.9 }, { id: "sub_1", success: true, texts }, index);
    const canvas = new OffscreenCanvas(300, 300);
    canvas.getContext("2d").fillRect(0, 0, 300, 300);
    const file = new File([await canvas.convertToBlob()], "blank.png");
    const metadata = { width: 300, height: 300, bands: [{ index: 2, top: 100, bottom: 130 }], icon: [20, 20, 50, 50] };
    const blank = await matchOcrImages(file, metadata, "kr", new AbortController().signal);
    const controller = new AbortController();
    const pending = matchOcrImages(file, metadata, "kr", controller.signal);
    controller.abort();
    let aborted = false;
    try { await pending; } catch (error) { aborted = error.name === "AbortError"; }
    return {
      crit: result("critRate", ["크리티컬", "87%"], 2),
      atk: result("atk", ["50", "공격력"], 3),
      percent: result("atk", ["공격력", "109%"], 3),
      invalid: result("critRate", ["999%"], 2),
      multiple: result("atk", ["50", "60"], 2),
      blank, aborted,
    };
  });
  assert.deepEqual(checks.crit, { id: "critRate", value: 8.7, corrected: true });
  assert.deepEqual(checks.atk, { id: "atk", value: 50, corrected: false });
  assert.deepEqual(checks.percent, { id: "atkPct", value: 10.9, corrected: true });
  assert.equal(checks.invalid, null);
  assert.equal(checks.multiple, null);
  assert.equal(checks.blank.harmony, null);
  assert.equal(checks.blank.rows[0].match, null);
  assert.ok(checks.aborted);
  console.log("PASS: phone/tablet stat and harmony IDs, decimal correction, invalid values, blank image, cancellation");
} finally {
  await browser.close();
}

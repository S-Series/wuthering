import { chromium } from "playwright";
import assert from "node:assert/strict";

const ids = ["name", "cost", "main_1", "main_2", "sub_1", "sub_2", "sub_3", "sub_4", "sub_5"];
const browser = await chromium.launch({ channel: "msedge", headless: true });
try {
  const page = await browser.newPage();
  let calls = 0;
  await page.route("**/api/ocr/batch", async route => {
    const request = route.request();
    const form = await new Request("http://test", { method: "POST", headers: { "content-type": request.headers()["content-type"] }, body: request.postDataBuffer() }).formData();
    const files = form.getAll("files");
    assert.ok(["kr", "en", "jp", "zh"].includes(form.get("lang")), "Send the language code, not the store object");
    assert.deepEqual(files.map(file => file.name), ids.map(id => `${id}.png`));
    for (const file of files) {
      assert.equal(file.type, "image/png");
      const data = Buffer.from(await file.arrayBuffer());
      assert.equal(data.subarray(1, 4).toString(), "PNG");
      assert.ok(data.readUInt32BE(16) > 0);
      assert.ok(data.readUInt32BE(20) > 0);
    }
    calls++;
    if (calls === 2) {
      await route.fulfill({ status: 503, body: "unavailable" });
      return;
    }
    await route.fulfill({ json: { success: true, regions: ids.map(id => ({ id, success: id !== "sub_2", texts: id === "sub_1" ? [] : [`result-${id}`] })).reverse() } });
  });
  await page.goto("http://127.0.0.1:5173/test");
  await page.locator("input[type=file]").setInputFiles("C:/Users/inwea/AppData/Local/Temp/codex-clipboard-e3e4b249-7844-4444-a2ef-94fc94aae3a6.png");
  await page.getByRole("status").filter({ hasText: "9개 영역" }).waitFor({ timeout: 60_000 });
  assert.equal(calls, 0, "Crop alone must not send OCR requests");
  await page.getByRole("button", { name: "OCR 요청", exact: true }).click();
  await page.locator(".crop-ocr-text").first().waitFor();
  assert.deepEqual(await page.locator(".crop-ocr-text").allTextContents(), ids.map(id => id === "sub_1" ? "인식된 텍스트 없음" : id === "sub_2" ? "인식 실패" : `result-${id}`));
  assert.equal(calls, 1, "Nine files must use a single request");
  await page.setViewportSize({ width: 390, height: 844 });
  assert.equal(await page.evaluate(() => document.documentElement.scrollWidth > innerWidth), false);
  await page.screenshot({ path: "C:/Users/inwea/AppData/Local/Temp/ocr-batch-mobile.png", fullPage: true });
  await page.getByRole("button", { name: "OCR 요청", exact: true }).click();
  await page.getByRole("alert").filter({ hasText: "503" }).waitFor();
  assert.equal(await page.locator(".crop-ocr-text").count(), 0, "Do not show stale results after a failed retry");
  console.log("PASS: nine PNGs in one request, ID mapping, empty/failed regions, retry error, mobile layout (mock server)");
} finally {
  await browser.close();
}

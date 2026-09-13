import assert from "node:assert/strict";
import { createServer } from "vite";

const server = await createServer({ server: { middlewareMode: true }, appType: "custom", optimizeDeps: { noDiscovery: true, include: [] } });
try {
  const { parseVisionResponse } = await server.ssrLoadModule("/src/api/ocr.vision.ts");
  const response = (texts) => ({ version: 1, header: ["COST 3"], harmony: null,
    rows: texts.map((text, index) => ({ index, tokens: [{ text, confidence: 0.99 }], imageMatch: null })) });
  const korean = response(["공격력 30.0%", "공격력 100", "크리티컬 7.5%", "크리티컬 피해 17.4%", "공명 스킬 피해 보너스 8.6%", "강공격 피해 보너스 6.4%", "공명 효율 10.8%"]);
  assert.deepEqual(parseVisionResponse(korean, "kr").echoStats, [
    ["atkPct", 30], ["atk", 100], ["critRate", 7.5], ["critDmg", 17.4],
    ["skillBns", 8.6], ["heavyBns", 6.4], ["resonanceBns", 10.8],
  ]);
  const missing = structuredClone(korean);
  missing.rows.splice(3, 1);
  const parsed = parseVisionResponse(missing, "kr");
  assert.deepEqual(parsed.echoStats[3], ["dummy", 0]);
  assert.deepEqual(parsed.echoStats[4], ["skillBns", 8.6]);
  const invalid = structuredClone(korean);
  invalid.rows[2].tokens[0].text = "크리티컬 75%";
  assert.deepEqual(parseVisionResponse(invalid, "kr").echoStats[2], ["dummy", 0]);
  const conflict = structuredClone(korean);
  conflict.rows[2].imageMatch = { statId: "def", similarity: 0.95 };
  assert.deepEqual(parseVisionResponse(conflict, "kr").echoStats[2], ["dummy", 0]);
  const low = structuredClone(korean);
  low.rows[2].tokens[0].confidence = 0.2;
  assert.deepEqual(parseVisionResponse(low, "kr").echoStats[2], ["dummy", 0]);
  const english = response(["ATK 30.0%", "ATK 100", "ATK 7.1%", "Crit. DMG 17.4%", "Crit. Rate 9.3%", "ATK 60", "Resonance Skill DMG Bonus 9.4%"]);
  assert.deepEqual(parseVisionResponse(english, "en").echoStats.slice(2), [
    ["atkPct", 7.1], ["critDmg", 17.4], ["critRate", 9.3], ["atk", 60], ["skillBns", 9.4],
  ]);
  console.log("OCR resolution: Korean/English, percentages, missing rows, conflicts, invalid values and low confidence passed.");
} finally {
  await server.close();
}

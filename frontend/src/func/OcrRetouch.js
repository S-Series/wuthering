import stringSimilarity from "string-similarity";
import { FixedStats } from "../Datas/Stats";
import { correctionMap } from "../func/TextCorrection";

export function OcrRetouch({ text, lang }) {
  if (!text || !Array.isArray(text)) return { retType: [], retValue: [] };
  if (!lang) lang = "en";

  const statList = FixedStats.map(stat => stat[lang]).filter(Boolean);
  const correction = correctionMap[lang] || {};
  const correctedText = text.map((t) => correction[t.trim()] || t.trim());

  let startIndex = -1;

  for (let i = 0; i < correctedText.length; i++) {
    const { bestMatch } = stringSimilarity.findBestMatch(correctedText[i], statList);
    if (bestMatch.rating > 0.7) {
      startIndex = i;
      break;
    }
  }

  if (startIndex === -1 || startIndex + 13 >= correctedText.length) {
    return { retType: [], retValue: [] };
  }

  const rawTypes = [];
  const rawValues = [];

  for (let i = 0; i < 14; i += 2) {
    const key = correctedText[startIndex + i];
    const val = correctedText[startIndex + i + 1];

    const { bestMatch } = stringSimilarity.findBestMatch(key, statList);
    const matched = bestMatch.rating > 0.7 ? bestMatch.target : null;

    if (matched) {
      rawTypes.push(matched);
      rawValues.push(val);
    }
  }

  const retType = [];
  const retValue = [];

  for (let i = 0; i < rawTypes.length; i++) {
    const label = rawTypes[i];
    const value = parseFloat(rawValues[i]);

    const candidates = FixedStats.filter(stat => stat[lang] === label);
    let selectedId = candidates[0]?.id || null;

    if (candidates.length > 1) {
      const hasPct = candidates.find(c => c.id.includes("Pct"));
      const hasRaw = candidates.find(c => !c.id.includes("Pct"));

      if (hasPct && hasRaw) {
        selectedId = value > 30 ? hasRaw.id : hasPct.id;
      }
    }

    retType.push(selectedId);
    retValue.push( Math.floor(value * 10) / 10);
  }

  console.log({ retType, retValue });

  return { retType, retValue };
}

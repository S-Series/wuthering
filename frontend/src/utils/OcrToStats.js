import { useCallback } from "react";
import { createEmptyEcho } from "../data/Echos";
import { FixedStats } from "../data/Stats";
import { echoDict } from "../data/Echos";

function similarity(a, b) {
  a = a.replace(/\s+/g, "");
  b = b.replace(/\s+/g, "");
  if (a.includes(b) || b.includes(a)) return 1;
  let match = 0;
  for (const ch of a) if (b.includes(ch)) match++;
  return match / Math.max(a.length, b.length);
}

const retouchList = {
  kr: [
    [/라어용|라어움|라어요|라어워|라어운/g, "방어력"],
    [/H위프|H위lI프|H위표|피혜|피해/g, "피해"],
    [/음운/g, "공명"],
  ],
};

const checkSim = {
  kr: {
    효율: "ResonanceBns", // 공명 효율
    공격: "normalBns", // 일반 공격 피해보너스
    강공격: "heavyBns", // 강공격 피해보너스
    스킬: "skillBns", // 공명 스킬 피해보너스
    해방: "ultBns", // 공명 해방 피해보너스
    응결: "GlacioBns", // 응결 피해보너스
    융용: "FusionBns", // 융용 피해보너스
    전도: "ElectroBns", // 전도 피해보너스
    기류: "AeroBns", // 기류 피해보너스
    회절: "SpectroBns", // 회절 피해보너스
    인멸: "HavocBns", // 인멸 피해보너스
  },
};

function applyRetouch(texts, lang) {
  const rules = retouchList[lang] || [];
  return texts.map((t) => {
    let result = t;
    rules.forEach(([pattern, replacement]) => {
      result = result.replace(pattern, replacement);
    });
    return result;
  });
}

export function useOcrRetouch() {
  const OcrToStats = useCallback((texts, lang = "kr") => {
    if (!texts || !Array.isArray(texts)) return createEmptyEcho(4);
    const refinedTexts = applyRetouch(texts, lang);

    const statData = createEmptyEcho(4);

    // -----------------------
    // COST 추출
    // -----------------------
    const costIdx = refinedTexts.findIndex((t) =>
      t.toUpperCase().includes("COST")
    );
    if (costIdx !== -1 && refinedTexts[costIdx + 1]) {
      const costValue = parseInt(
        refinedTexts[costIdx + 1].replace(/[^0-9]/g, "")
      );
      if (!isNaN(costValue)) statData.cost = costValue;
    }

    // -----------------------
    // echoId: 가장 유사한 이름의 ID 찾기
    // -----------------------
    const rawName = refinedTexts.slice(0, costIdx).join(" ").trim();
    let best = { id: "default", name: "default", score: 0 };

    Object.values(echoDict).forEach((group) => {
      Object.values(group).forEach((item) => {
        const refName = item[lang] || item.kr;
        const score = similarity(rawName, refName);
        if (score > best.score) best = { id: item.id, name: refName, score };
      });
    });

    statData.echoId = best.id;

    // -----------------------
    // FixedStats 매칭 함수
    // -----------------------
    const findStatId = (text) => {
      if (typeof text !== "string") return null;

      // 전처리: 특수문자 제거
      const clean = text.replace(/[^가-힣A-Za-z]/g, "");

      // -------------------------------
      // FixedStats에서 직접 매칭
      // -------------------------------
      for (const [key, val] of Object.entries(FixedStats)) {
        const ref = val[lang] || val.kr;
        if (typeof ref !== "string") continue;
        const refClean = ref.replace(/[^가-힣A-Za-z]/g, "");
        if (clean.includes(refClean) || refClean.includes(clean)) {
          return FixedStats[key].id;
        }
      }

      // -------------------------------
      // checkSim에서 보조 매칭
      // -------------------------------
      const simTable = checkSim[lang] || {};
      for (const [keyword, statId] of Object.entries(simTable)) {
        if (clean.includes(keyword)) {
          return statId;
        }
      }
      return null;
    };

    // -----------------------
    // Stats 추출 및 수치 보정
    // -----------------------
    const Stats = [];

    for (let i = 0; i < refinedTexts.length; i++) {
      const t = refinedTexts[i];
      if (/[0-9]/.test(t)) {
        const fixed = t.replace(/[:,]/g, "").replace(/[^0-9.%]/g, "");
        let value = parseFloat(fixed.replace("%", ""));
        if (isNaN(value)) continue;

        const hasPercent = t.includes("%");
        if (hasPercent) value = parseFloat((value / 10).toFixed(1));

        const prev = refinedTexts[i - 1] || "";
        const prev2 = refinedTexts[i - 2] || "";

        const ignoreWords = ["cost", "+", "25"]
        if (ignoreWords.some(
          (word) => prev.toLowerCase().includes(word) 
          || prev2.toLowerCase().includes(word))) 
          continue;
        if (value <= 5 || value > 580) continue;


        let statId = findStatId(prev + prev2) || findStatId(prev);
        if (!statId) continue;

        if (statId === "CritRate" && value >= 11) {
          statId = "CritDmg";
        }
        else if (hasPercent) {
          if (statId === "hp") statId = "hpPct";
          else if (statId === "atk") statId = "atkPct";
          else if (statId === "def") statId = "defPct";
        }

        if (Stats.length < 10) {
          Stats.push([statId, value]);
        }
      }
    }

    console.log(JSON.parse(JSON.stringify(Stats)));

    if (Stats.length > 0) {
      statData.mainStat = Stats[0][0];
      Stats.shift();
    }
    statData.subStats = Stats.slice(-5);
    statData.subStats.map((item) => {
      if (item[0] === null) item[0] = FixedStats.dummy.id;
      const idx = Object.values(FixedStats[item[0]]?.ValueSub ?? []).findIndex(
        (v) => Number(v) === item[1]
      );
      item[1] = idx;
    })
    while (statData.subStats.length < 5) {
      statData.subStats.push([FixedStats.dummy.id, -1]);
    }

    return statData;
  }, []);

  return { OcrToStats };
}

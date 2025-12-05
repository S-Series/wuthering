import { useCallback } from "react";
import { createEmptyEcho } from "../data/Echos";
import { FixedStats } from "../data/Stats";
import { echoDict } from "../data/Echos";
import stringSimilarity from "string-similarity";

const retouchList = {
  kr: [
    [/라어용|라어움|라어요|라어워|라어운|라o운|라워/g, "방어력"],
    [/H위프|H위lI프|H위표|피혜|피해|H위l표/g, "피해"],
    [/음운/g, "공명"],
    [/룡우/g, "효율"],
    [/ㄱ릉|균릉|눈운공릉|눈운릉/g, "일반"],
    [/유우/g, "해방"],
    [/H위l프룸콩/g, "인멸피해"],
  ],
};

/* unuse function
function similarity(a, b) {
  a = a.replace(/\s+/g, "");
  b = b.replace(/\s+/g, "");
  if (a.includes(b) || b.includes(a)) return 1;
  let match = 0;
  for (const ch of a) if (b.includes(ch)) match++;
  return match / Math.max(a.length, b.length);
}

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
}*/

//#region functions
function findClosestEcho(keyword) {
  const candidates = [];

  for (const [cost, group] of Object.entries(echoDict)) {
    for (const [id, data] of Object.entries(group)) {
      const langs = [data.kr, data.en, data.jp, data.zh].filter(Boolean);

      langs.forEach((val) => {
        const similarity = stringSimilarity.compareTwoStrings(
          keyword.toLowerCase(),
          val.toLowerCase()
        );

        candidates.push({
          id,
          cost,
          matchLang: val,
          score: similarity,
          ...data,
        });
      });
    }
  }

  candidates.sort((a, b) => b.score - a.score);
  const best = candidates[0];
  return best.score >= 0.5 ? best : null;
}
function findClosestStat(keyword) {
  if (!keyword || typeof keyword !== "string") return null;

  const candidates = [];

  for (const [id, data] of Object.entries(FixedStats)) {
    const langs = [data.kr, data.en, data.jp, data.zh].filter(Boolean);
    langs.forEach((val) => {
      const similarity = stringSimilarity.compareTwoStrings(
        keyword.toLowerCase(),
        val.toLowerCase()
      );

      candidates.push({
        id,
        matchLang: val,
        score: similarity,
        ...data,
      });
    });
  }

  candidates.sort((a, b) => b.score - a.score);
  const best = candidates[0];
  return best && best.score >= 0.5 ? best : null;
}
//#endregion

export function useOcrRetouch() {
  const OcrToStats = useCallback((texts, lang = "kr") => {
    if (!texts || !Array.isArray(texts)) return createEmptyEcho(4);
    /* Old Retouch Algorithm
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
    }*/

    let statData = createEmptyEcho();
    let result = [], temp = [], echoData = [];

    const retouch = retouchList[lang];
    const fixedTexts = texts.map((texts) => {
      let result = texts;
      for (const [pat, rep] of retouch ?? []) result = result.replace(pat, rep);
      return result;
    });

    fixedTexts.forEach((item) => {
      if (/\d/.test(item)) {
        const key = temp.join("").replace(/\s/g, "");
        const value = item.replace(/[^\d.&%-]/g, "");
        if (key) {
          if (/COST/i.test(key)) {
            const [before, _] = key.split(/COST/i);
            if (before) echoData.push(before);
            echoData.push(value);
          } else {
            result.push([ key, value ]);
          }
        }
        temp = [];
      } else {
        temp.push(item);
      }
    });

    result = result.slice(-7);
    while (result.length < 7) result.push([FixedStats.dummy.id, 0]);
    
    const fixedEchoData = findClosestEcho(echoData[0]);
    const fixedStatData = result.map((item) => [
      findClosestStat(item[0]).id,
      item[1],
    ]);
    const tempMainStat = fixedStatData[0];
    const tempSubStats = fixedStatData.slice(2, 7);
    const tempSubStatsValue = tempSubStats.map((item) => {
      if (["hp", "atk", "def"].some((key) => item[0].includes(key))) {
        if (item[1].includes("%")) {
          return [
            `${item[0]}Pct`,
            parseFloat(String(item[1]).replace(/[^0-9.]/g, "")) / 10,
          ];
        } else return [item[0], Number(item[1])];
      } else {
        if (item[1].includes("%")) {
          return [
            item[0],
            parseFloat(String(item[1]).replace(/[^0-9.]/g, "")) / 10,
          ];
        } else return [item[0], Number(item[1])];
      }
    });

    statData.echoId = fixedEchoData.id;
    statData.cost = parseInt(String(fixedEchoData.cost).replace(/[^0-9.]/g, ""));
    statData.mainStat = [
      tempMainStat[0],
      tempMainStat[1].includes("%")
        ? parseFloat(String(tempMainStat[1]).replace(/[^0-9.]/g, "")) / 10
        : Number(tempMainStat[1]),
    ];
    statData.subStats = tempSubStatsValue.map((item) => {
      const valueList = FixedStats[item[0]]?.ValueSub ?? [];
      const numericValue = parseFloat(item[1]);

      if (!valueList || valueList.length === 0) return [item[0], -1];

      const numericList = valueList.map((v) => parseFloat(v));

      const closestIndex = numericList.reduce((bestIdx, v, idx, arr) => {
        const diff = Math.abs(v - numericValue);
        const bestDiff = Math.abs(arr[bestIdx] - numericValue);
        return diff < bestDiff ? idx : bestIdx;
      }, 0);

      return [item[0], closestIndex];
    });

    return statData;
  }, []);

  return { OcrToStats };
}

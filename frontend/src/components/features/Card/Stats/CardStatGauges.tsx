import { useEffect, useId, useState, type CSSProperties } from "react";
import { getCharacterMeta } from "@/datas/characters.meta";
import { FixedStats } from "@/datas/stats";
import { getSuggestedVariant } from "@/runtime/buildTargets";
import type { GaugeStatId, StatContribution } from "@/runtime/characterData.helpers";
import { useAppStore } from "@/stores/appStore";
import { useCharacter } from "@/stores/characterDataStore";

import "./CardStatGauges.css";

const messages = {
  kr: {
    label: "세팅 스탯 현황",
    sources: "스탯 출처",
    base: "캐릭터 기본값",
    nodes: "회로·스킬 노드",
    chain: "캐릭터 돌파 효과",
    weaponOptions: "무기 옵션",
    echoFixedGroup: "에코 고정 옵션",
    echoMainGroup: "에코 주옵션",
    echoSubGroup: "에코 부옵션",
    weaponPrimary: "무기 주옵",
    weaponBase: "무기 기초 공격력",
    echoFixed: "고정 옵션",
    rounding: "반올림·보정",
    increase: "증가",
    weaponEffect: "무기 효과",
    echo: "에코",
    echoMain: "주옵",
    echoSub: "부옵",
    mainEcho: "메인 에코 효과",
    harmony: "세트 효과",
    reached: "권장치 달성",
    shortage: "부족",
    cap: "확률 상한",
    excess: "초과",
    target: "권장",
  },
  en: {
    label: "Build stat overview",
    sources: "Stat sources",
    base: "Character base",
    nodes: "Skill nodes",
    chain: "Resonance Chain",
    weaponOptions: "Weapon stats",
    echoFixedGroup: "Echo fixed stats",
    echoMainGroup: "Echo main stats",
    echoSubGroup: "Echo substats",
    weaponPrimary: "Weapon stat",
    weaponBase: "Weapon base ATK",
    echoFixed: "fixed stat",
    rounding: "Rounding adjustment",
    increase: "increase",
    weaponEffect: "Weapon effect",
    echo: "Echo",
    echoMain: "main stat",
    echoSub: "substat",
    mainEcho: "Main Echo effect",
    harmony: "Sonata effect",
    reached: "Target reached",
    shortage: "below target",
    cap: "Chance cap",
    excess: "over cap",
    target: "Target",
  },
  jp: {
    label: "ビルドステータス",
    sources: "ステータス内訳",
    base: "キャラクター基礎値",
    nodes: "スキルノード",
    chain: "共鳴チェーン",
    weaponOptions: "武器ステータス",
    echoFixedGroup: "音骸固定ステータス",
    echoMainGroup: "音骸メインステータス",
    echoSubGroup: "音骸サブステータス",
    weaponPrimary: "武器メインステータス",
    weaponBase: "武器基礎攻撃力",
    echoFixed: "固定ステータス",
    rounding: "端数補正",
    increase: "増加",
    weaponEffect: "武器効果",
    echo: "音骸",
    echoMain: "メインステータス",
    echoSub: "サブステータス",
    mainEcho: "メイン音骸効果",
    harmony: "セット効果",
    reached: "推奨値達成",
    shortage: "不足",
    cap: "確率上限",
    excess: "超過",
    target: "推奨",
  },
  zh: {
    label: "配装属性概览",
    sources: "属性来源",
    base: "角色基础",
    nodes: "技能节点",
    chain: "共鸣链",
    weaponOptions: "武器属性",
    echoFixedGroup: "声骸固定属性",
    echoMainGroup: "声骸主属性",
    echoSubGroup: "声骸副属性",
    weaponPrimary: "武器主属性",
    weaponBase: "武器基础攻击力",
    echoFixed: "固定属性",
    rounding: "取整修正",
    increase: "增加",
    weaponEffect: "武器效果",
    echo: "声骸",
    echoMain: "主属性",
    echoSub: "副属性",
    mainEcho: "主声骸效果",
    harmony: "合鸣效果",
    reached: "已达推荐值",
    shortage: "未达标",
    cap: "概率上限",
    excess: "超出上限",
    target: "推荐",
  },
};

const slotNames = ["Ⅰ", "Ⅱ", "Ⅲ", "Ⅳ", "Ⅴ"];
const sourceGroups = [
  { id: "base", label: "base", kinds: ["base"] },
  { id: "weaponOptions", label: "weaponOptions", kinds: ["weaponBase", "weaponPrimary"] },
  { id: "weaponEffect", label: "weaponEffect", kinds: ["weaponEffect"] },
  { id: "nodes", label: "nodes", kinds: ["nodes"] },
  { id: "chain", label: "chain", kinds: ["chain"] },
  { id: "echoFixed", label: "echoFixedGroup", kinds: ["echoFixed"] },
  { id: "echoMain", label: "echoMainGroup", kinds: ["echoMain"] },
  { id: "echoSub", label: "echoSubGroup", kinds: ["echoSub"] },
  { id: "mainEcho", label: "mainEcho", kinds: ["mainEcho"] },
  { id: "harmony", label: "harmony", kinds: ["harmony"] },
  { id: "rounding", label: "rounding", kinds: ["rounding"] },
] as const;

function groupSources(sources: StatContribution[]) {
  return sourceGroups.map((group) => {
    const items = sources.filter((source) => (group.kinds as readonly string[]).includes(source.kind));
    return { ...group, items, total: items.reduce((sum, source) => sum + source.value, 0) };
  }).filter((group) => group.items.length > 0);
}

function sourceLabel(source: StatContribution, text: typeof messages.kr) {
  if (source.kind === "echoMain" || source.kind === "echoSub" || source.kind === "echoFixed") {
    return `${text.echo} ${slotNames[(source.slot ?? 1) - 1]} · ${text[source.kind]}`;
  }
  if (source.kind === "weaponEffect") return `${text.weaponEffect} · R${source.level}`;
  if (source.kind === "chain") return `${text.chain} · C1–${source.level}`;
  if (source.kind === "harmony") return `${source.level} · ${text.harmony}`;
  return text[source.kind];
}

export default function CardStatGauges() {
  const { lang } = useAppStore();
  const { characterData, characterFinalStat, statContributions } = useCharacter();
  const tooltipId = useId();
  const [active, setActive] = useState<{ id: GaugeStatId; style: CSSProperties } | null>(null);
  useEffect(() => {
    if (!active) return;
    const dismiss = (event: Event) => {
      if (event.target instanceof Element && event.target.closest(".card-stat-gauge__sources")) return;
      setActive(null);
    };
    window.addEventListener("scroll", dismiss, true);
    window.addEventListener("resize", dismiss);
    return () => {
      window.removeEventListener("scroll", dismiss, true);
      window.removeEventListener("resize", dismiss);
    };
  }, [active]);
  if (!characterFinalStat) return null;

  const text = messages[lang];
  const meta = getCharacterMeta(characterData.characterId, characterData.constell[0]);
  const energyTarget = getSuggestedVariant(characterData)?.baseline.resonanceBns;
  const gauges: { id: GaugeStatId; target?: number; targetLabel?: string; status?: string }[] = [
    { id: meta.statType },
    {
      id: "resonanceBns" as const,
      target: energyTarget,
      targetLabel: text.target,
      status: energyTarget === undefined ? undefined : characterFinalStat.resonanceBns >= energyTarget
        ? text.reached
        : `${(energyTarget - characterFinalStat.resonanceBns).toFixed(1)}% ${text.shortage}`,
    },
    {
      id: "critRate" as const,
      target: 100,
      targetLabel: text.cap,
      status: characterFinalStat.critRate > 100
        ? `${(characterFinalStat.critRate - 100).toFixed(1)}% ${text.excess}`
        : `${text.cap} 100%`,
    },
    { id: "critDmg" },
  ];

  function showSources(element: HTMLElement, id: GaugeStatId) {
    const rect = element.getBoundingClientRect();
    const above = rect.top > window.innerHeight - rect.bottom;
    const width = Math.min(352, window.innerWidth - 16);
    setActive({ id, style: {
      width,
      left: Math.max(8, Math.min(rect.left, window.innerWidth - width - 8)),
      ...(above ? { bottom: window.innerHeight - rect.top } : { top: rect.bottom }),
    } });
  }

  const isPercent = (id: GaugeStatId) => id === "resonanceBns" || id === "critRate" || id === "critDmg";
  const format = (value: number, id: GaugeStatId) => isPercent(id)
    ? `${value.toFixed(1)}%`
    : Number.isInteger(value) ? value.toLocaleString() : value.toFixed(1);

  return (
    <section className={`card-stat-gauges ${lang}-font`} aria-label={text.label}>
      {gauges.map(({ id, target, targetLabel, status }) => {
        const current = characterFinalStat[id];
        const sources = statContributions.filter((source) => source.statId === id);
        const groups = groupSources(sources);
        const minimum = id === "resonanceBns" ? 90 : id === "critDmg" ? 100 : 0;
        const scale = target !== undefined && target > minimum ? target : Math.max(minimum + 1, current);
        const range = scale - minimum;
        const filled = Math.min(scale, Math.max(minimum, current));
        const base = sources.filter((source) => source.kind === "base" || source.kind === "weaponBase").reduce((sum, source) => sum + source.value, 0);
        const difference = current - base;
        const footer = status ?? `${text.increase} ${difference >= 0 ? "+" : ""}${format(difference, id)}`;
        const label = FixedStats[id][lang];
        const sourceId = `${tooltipId}-${id}`;

        return (
          <div
            className={`card-stat-gauge card-stat-gauge--${id}`}
            key={id}
            tabIndex={0}
            role="group"
            aria-label={label}
            aria-describedby={active?.id === id ? sourceId : undefined}
            onMouseEnter={(event) => showSources(event.currentTarget, id)}
            onMouseLeave={(event) => {
              if (!event.currentTarget.contains(document.activeElement)) setActive(null);
            }}
            onFocus={(event) => showSources(event.currentTarget, id)}
            onBlur={() => setActive(null)}
            onClick={(event) => event.currentTarget.focus({ preventScroll: true })}
            onKeyDown={(event) => { if (event.key === "Escape") setActive(null); }}
          >
            <div className="card-stat-gauge__header">
              <span>{label}</span>
              <strong className="num-font">
                {format(current, id)}{target !== undefined && <span> / {target}%</span>}
              </strong>
            </div>
            <div
              className="card-stat-gauge__track"
              role="progressbar"
              aria-label={label}
              aria-valuemin={minimum}
              aria-valuemax={scale}
              aria-valuenow={filled}
              aria-valuetext={`${format(current, id)}${target !== undefined ? ` · ${targetLabel} ${target}%` : ""} · ${footer}`}
            >
              {groups.map((group) => (
                <span
                  className={`card-stat-gauge__segment source-${group.id}`}
                  key={group.id}
                  style={{ width: `${range > 0 ? Math.max(0, group.total - (group.id === "base" ? minimum : 0)) / range * 100 : 0}%` }}
                />
              ))}
            </div>
            <div className="card-stat-gauge__footer">
              <span>{text.sources} ⓘ</span>
              <span className={id === "resonanceBns" && target !== undefined && current < target ? "is-short" : ""}>
                {footer}
              </span>
            </div>
            <div
              className="card-stat-gauge__sources"
              role="tooltip"
              id={sourceId}
              hidden={active?.id !== id}
              style={active?.id === id ? active.style : undefined}
              ref={(element) => { if (element && active?.id === id) element.scrollTop = 0; }}
            >
              <strong className="card-stat-gauge__sources-title">{label} · {text.sources}</strong>
              <div className="card-stat-gauge__source-groups">
                {groups.map((group) => {
                  const single = group.items.length === 1 ? group.items[0] : null;
                  return (
                    <div className={`card-stat-gauge__source-group source-${group.id}`} key={group.id}>
                      <div className="card-stat-gauge__group-header">
                        <span className="card-stat-gauge__dot" aria-hidden="true" />
                        <span className="card-stat-gauge__source-label">
                          <span>{text[group.label]}</span>
                          {single?.slot && <small>{text.echo} {slotNames[single.slot - 1]}</small>}
                          {single?.level && <small>{single.kind === "weaponEffect" ? `R${single.level}` : single.kind === "chain" ? `C1–${single.level}` : single.level}</small>}
                          {single?.name && <small>{single.name[lang]}</small>}
                          {single?.percent !== undefined && <small>{single.percent.toFixed(1)}% × {single.multiplierBase?.toLocaleString()}</small>}
                        </span>
                        <b className="num-font">{group.id !== "base" && group.total >= 0 ? "+" : ""}{format(group.total, id)}</b>
                      </div>
                      {!single && (
                        <ul aria-label={text[group.label]}>
                          {group.items.map((source, index) => (
                            <li key={index}>
                              <span className="card-stat-gauge__source-label">
                                <span>{sourceLabel(source, text)}</span>
                                {source.name && <small>{source.name[lang]}</small>}
                                {source.percent !== undefined && <small>{source.percent.toFixed(1)}% × {source.multiplierBase?.toLocaleString()}</small>}
                              </span>
                              <b className="num-font">{source.value >= 0 ? "+" : ""}{format(source.value, id)}</b>
                            </li>
                          ))}
                        </ul>
                      )}
                    </div>
                  );
                })}
              </div>
            </div>
          </div>
        );
      })}
    </section>
  );
}

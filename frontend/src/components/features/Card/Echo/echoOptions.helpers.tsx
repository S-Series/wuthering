import { echoDict } from "@/datas/echos";
import type { SelectOptionWithImage, SelectOptionStatOriginal, SelectOriginalOption, Cost } from "./echoOptions.types";
import { type StylesConfig } from "react-select";
import type { LangType } from "@/stores/appStore";
import { characterScoreSheet } from "@/datas/characterScoreSheet";
import type { CharacterId } from "@/datas/characterStats";
import { FixedStats, type StatId } from "@/datas/stats";
import { harmony } from "@/datas/harmonies";
import { characterMeta } from "@/datas/characters.meta";

type RelevantOptionData = Pick<SelectOptionStatOriginal, "scoreWeight" | "isRelevant" | "relevanceTier">;

function getRelevantTier(data: unknown) {
    if (typeof data !== "object" || data === null) return undefined;

    const option = data as RelevantOptionData;
    return option.relevanceTier;
}

function getRelevantOptionStyle<Option>(
    baseSelectStyles: StylesConfig<Option, false>
): StylesConfig<Option, false>["option"] {
    return (base, state) => {
        const common = baseSelectStyles.option
            ? baseSelectStyles.option(base, state)
            : base;
        const tier = getRelevantTier(state.data);

        if (!tier) return common;

        const rgb = tier === "valid" ? "255, 215, 100"
            : tier === "partial" ? "125, 211, 252" : "156, 163, 175";
        const background = state.isSelected
            ? `linear-gradient(90deg, rgba(${rgb}, 0.62), #252830)`
            : state.isFocused
                ? `linear-gradient(90deg, rgba(${rgb}, 0.48), #202329)`
                : `linear-gradient(90deg, rgba(${rgb}, 0.28), #14171d)`;

        return {
            ...common,
            borderLeft: `3px solid rgb(${rgb})`,
            background,
            color: tier === "invalid" ? "#c5c8ce" : "#fff",
            fontWeight: 900,
        };
    };
}

export const formatOptionWithImage = <
    T extends SelectOptionWithImage
>(
    opt: T,
    lang: string,
    fontSize?: string,
) => (
    <div style={{ display: "flex", alignItems: "center", gap: "min(1vw, 0.7rem)", height: "clamp(1.75rem, 2.75vw, 2.75rem)" }}>
        {opt.path && (
            <img alt=""
                src={opt.path}
                style={{ width: "auto", height: "90%", aspectRatio: "1 / 1" }}
            />
        )}
        <span className={`${lang}-font`}
            style={{
                wordBreak: "normal",
                whiteSpace: "pre",
                msTextOverflow: "ellipsis",
                fontSize: fontSize ?? "clamp(0.8125rem, 1.3vw, 1rem)",
            }}>
            {(opt.label)
                .replaceAll("공명의 메아리 · ", "공명의 메아리 · \n")
                .replaceAll("Nightmare: ", "Nightmare:\n")
                .replaceAll("Reminiscence: ", "Reminiscence:\n")}
        </span>
    </div>
);

export const formatOptionWithImage_Smaller = <
    T extends SelectOptionWithImage
>(
    opt: T,
    lang: string,
    fontSize?: string,
) => (
    <div style={{ display: "flex", alignItems: "center", gap: "min(0.5vw, 0.27rem)", height: "clamp(1.5rem, 2vw, 2rem)" }}>
        {opt.path && (
            <img alt=""
                src={opt.path}
                style={{ width: "auto", height: "80%", transform: "translate(-7.5%, 2.5%)" }}
            />
        )}
        <span className={`${lang}-font`}
            style={{
                wordBreak: "keep-all",
                whiteSpace: "nowrap",
                fontSize: fontSize ?? "clamp(0.8125rem, 1.15vw, 0.85rem)",
            }}>
            {opt.label}
        </span>
    </div>
);

export const getStatDropStyle = <Option,>(
    baseSelectStyles: StylesConfig<Option, false>,
    slotHeight: number): StylesConfig<Option, false> => ({
        ...baseSelectStyles,
        option: getRelevantOptionStyle(baseSelectStyles),
        control: (base, state) => {
            const common = baseSelectStyles.control
                ? baseSelectStyles.control(base, state)
                : base;

            return {
                ...common,
                display: "flex",
                alignItems: "center",
                minHeight: 0,
                height: `${slotHeight / 13}px`,
                overflow: "hidden",
            };
        },
        container: (base, state) => {
            const common = baseSelectStyles.container
                ? baseSelectStyles.container(base, state)
                : base;

            return {
                ...common,
                minHeight: 0,
            };
        },
        singleValue: (base, state) => {
            const common = baseSelectStyles.singleValue
                ? baseSelectStyles.singleValue(base, state)
                : base;

            return {
                ...common,
                minHeight: 0,
                height: `${slotHeight / 13}px`,
                lineHeight: `${slotHeight / 13}px`,
                overflow: "hidden",
                color: "white",
            };
        },
        valueContainer: (base, state) => {
            const common = baseSelectStyles.valueContainer
                ? baseSelectStyles.valueContainer(base, state)
                : base;

            return {
                ...common,
                minHeight: 0,
                height: `${slotHeight / 13}px`,
                paddingTop: 0,
                paddingBottom: 0,
                paddingLeft: `${slotHeight / 80}px`,
                paddingRight: `${slotHeight / 160}px`,
                overflow: "hidden",
            };
        },
        dropdownIndicator: (base, state) => {
            const common = baseSelectStyles.dropdownIndicator
                ? baseSelectStyles.dropdownIndicator(base, state)
                : base;

            return {
                ...common,
                paddingTop: 0,
                paddingBottom: 0,
                paddingLeft: `${slotHeight / 80}px`,
                paddingRight: `${slotHeight / 80}px`,
            };
        },
        placeholder: (base, state) => {
            const common = baseSelectStyles.placeholder
                ? baseSelectStyles.placeholder(base, state)
                : base;

            return {
                ...common,
                margin: 0,
                paddingTop: 0,
                paddingBottom: 0,
                paddingLeft: `${slotHeight / 160}px`,
                paddingRight: `${slotHeight / 320}px`,
                lineHeight: `${slotHeight / 13}px`,
            };
        },
    })

export const getStatDropStyleOptionWide = <Option,>(
    baseSelectStyles: StylesConfig<Option, false>,
    slotHeight: number): StylesConfig<Option, false> => ({
        ...baseSelectStyles,
        option: getRelevantOptionStyle(baseSelectStyles),
        menu: (base, state) => {
            const common = baseSelectStyles.menu
                ? baseSelectStyles.menu(base, state)
                : base;

            return {
                ...common,
                right: 0,
                minWidth: "100%",
                width: "max-content",
                maxWidth: "min(18rem, 90vw)",
            };
        },
        control: (base, state) => {
            const common = baseSelectStyles.control
                ? baseSelectStyles.control(base, state)
                : base;

            return {
                ...common,
                display: "flex",
                alignItems: "center",
                minHeight: 0,
                height: `${slotHeight}px`,
                overflow: "hidden",
                fontSize: `${Math.min(14, Math.max(11, slotHeight * 0.35))}px`,
            };
        },
        container: (base, state) => {
            const common = baseSelectStyles.container
                ? baseSelectStyles.container(base, state)
                : base;

            return {
                ...common,
                minHeight: 0,
            };
        },
        singleValue: (base, state) => {
            const common = baseSelectStyles.singleValue
                ? baseSelectStyles.singleValue(base, state)
                : base;

            return {
                ...common,
                minHeight: 0,
                height: "auto",
                lineHeight: 1.2,
                overflow: "hidden",
                color: "white",
            };
        },
        valueContainer: (base, state) => {
            const common = baseSelectStyles.valueContainer
                ? baseSelectStyles.valueContainer(base, state)
                : base;

            return {
                ...common,
                minHeight: 0,
                height: "auto",
                paddingTop: 0,
                paddingBottom: 0,
                paddingLeft: 4,
                paddingRight: 0,
                overflow: "hidden",
            };
        },
        dropdownIndicator: (base, state) => {
            const common = baseSelectStyles.dropdownIndicator
                ? baseSelectStyles.dropdownIndicator(base, state)
                : base;

            return {
                ...common,
                paddingTop: 0,
                paddingBottom: 0,
                paddingLeft: 3,
                paddingRight: 3,
            };
        },
        indicatorsContainer: (base, state) => {
            const common = baseSelectStyles.indicatorsContainer
                ? baseSelectStyles.indicatorsContainer(base, state)
                : base;
            return {
                ...common,
                position: "relative",
                zIndex: 999,
                pointerEvents: "auto",
            }
        },
        clearIndicator: (base, state) => {
            const common = baseSelectStyles.clearIndicator
                ? baseSelectStyles.clearIndicator(base, state)
                : base;

            return {
                ...common,
                position: "relative",
                zIndex: 999,
                pointerEvents: "auto",
                cursor: "pointer",
            }
        },
        placeholder: (base, state) => {
            const common = baseSelectStyles.placeholder
                ? baseSelectStyles.placeholder(base, state)
                : base;

            return {
                ...common,
                margin: 0,
                paddingTop: 0,
                paddingBottom: 0,
                paddingLeft: 4,
                paddingRight: 0,
                lineHeight: 1.2,
            };
        },
    })

export const getStatDropStyleLarge = <Option,>(
    baseSelectStyles: StylesConfig<Option, false>,
    slotHeight: number): StylesConfig<Option, false> => ({
        ...baseSelectStyles,
        option: getRelevantOptionStyle(baseSelectStyles),
        control: (base, state) => {
            const common = baseSelectStyles.control
                ? baseSelectStyles.control(base, state)
                : base;
            return {
                ...common,
                minHeight: 0,
                height: `${slotHeight}px`,
                overflow: "hidden",
                fontSize: `${Math.min(14, Math.max(11, slotHeight * 0.35))}px`,
            };
        },
        container: (base, state) => {
            const common = baseSelectStyles.container
                ? baseSelectStyles.container(base, state)
                : base;
            return {
                ...common,
                color: "white",
            };
        },
        singleValue: (base, state) => {
            const common = baseSelectStyles.singleValue
                ? baseSelectStyles.singleValue(base, state)
                : base;
            return {
                ...common,
                color: "white",
            };
        },
        clearIndicator: (base, state) => {
            const common = baseSelectStyles.clearIndicator
                ? baseSelectStyles.clearIndicator(base, state)
                : base;

            return {
                ...common,
                position: "relative",
                zIndex: 999,
                pointerEvents: "auto",
                cursor: "pointer",
            }
        },
    })

export const getStatDropStyleDrag = <Option,>(
    baseSelectStyles: StylesConfig<Option, false>): StylesConfig<Option, false> => ({
        ...baseSelectStyles,
        option: (base, state) => ({
            ...getRelevantOptionStyle(baseSelectStyles)(base, state),
            fontSize: "11px",
        }),
        menu: (base, state) => {
            const common = baseSelectStyles.menu
                ? baseSelectStyles.menu(base, state)
                : base;

            return {
                ...common,
                minWidth: "100%",
                width: "max-content",
                maxWidth: "min(18rem, 90vw)",
            };
        },
        control: (base, state) => {
            const common = baseSelectStyles.control
                ? baseSelectStyles.control(base, state)
                : base;

            return {
                ...common,
                display: "flex",
                alignItems: "center",
                minHeight: 0,
                width: "100%",
                maxWidth: "100%",
                height: "100%",
                boxSizing: "border-box",
                fontSize: "10px",
            };
        },
        container: (base, state) => {
            const common = baseSelectStyles.container
                ? baseSelectStyles.container(base, state)
                : base;

            return {
                ...common,
                width: "100%",
                maxWidth: "100%",
                minHeight: 0,
                height: "100%",
            };
        },
        singleValue: (base, state) => {
            const common = baseSelectStyles.singleValue
                ? baseSelectStyles.singleValue(base, state)
                : base;

            return {
                ...common,
                minHeight: 0,
                height: "auto",
                lineHeight: 1.2,
                overflow: "hidden",
                color: "white",
            };
        },
        valueContainer: (base, state) => {
            const common = baseSelectStyles.valueContainer
                ? baseSelectStyles.valueContainer(base, state)
                : base;

            return {
                ...common,
                minHeight: 0,
                height: "auto",
                paddingTop: 0,
                paddingBottom: 0,
                paddingLeft: 4,
                paddingRight: 0,
                overflow: "hidden",
            };
        },
        dropdownIndicator: (base, state) => {
            const common = baseSelectStyles.dropdownIndicator
                ? baseSelectStyles.dropdownIndicator(base, state)
                : base;

            return {
                ...common,
                padding: 3,
            };
        },
        placeholder: (base, state) => {
            const common = baseSelectStyles.placeholder
                ? baseSelectStyles.placeholder(base, state)
                : base;

            return {
                ...common,
                margin: 0,
                paddingTop: 0,
                paddingBottom: 0,
                paddingLeft: 4,
                paddingRight: 0,
                lineHeight: 1.2,
            };
        },
    })

export const HARMONY_OPTIONS_BASE: SelectOriginalOption[] = Object.values(harmony).map((v) => ({
    value: v.id,
    kr: v.kr,
    en: v.en,
    jp: v.jp,
    zh: v.zh,
    path: `/ico/harmony/${v.id}.png`,
}));

export const getEchoOptionBase = (
    lang: LangType,
    selectedCost: Cost,
    BASE_URL: string
): SelectOriginalOption[] => {
    const safeCost = (selectedCost ?? 4);
    const costKey = `Cost${safeCost}` as const;

    return Object.entries(echoDict[costKey] ?? []).map(([echoId, echo]) => (
    {
        value: echoId,
        label: echo[lang],
        kr: echo.kr,
        en: echo.en,
        jp: echo.jp,
        zh: echo.zh,
        harmonies: echo.type,
        path: `${BASE_URL}/ico/echos/${echoId}.webp`,
    }));
}

export const getStatOptionBase = (
    lang: LangType,
    characterId?: CharacterId,
): SelectOptionStatOriginal<StatId>[] => {
    const score = characterId ? characterScoreSheet[characterId] : null;
    const flatRelevantStat = characterId ? characterMeta[characterId]?.statType : null;
    const list = Object.entries(FixedStats).filter(
      (v) => v[1].id !== "dummy").map(([, stat]) => {
        const statId = stat.id;
        const scoreWeight = score?.[statId] ?? 0;
        const isFlatRelevant = statId === FixedStats.atk.id
            ? (score?.atkPct ?? 0) >= 1
            : statId === flatRelevantStat;
        const relevanceTier: NonNullable<SelectOptionStatOriginal["relevanceTier"]> =
            scoreWeight >= 1 ? "valid"
                : scoreWeight > 0 || isFlatRelevant ? "partial" : "invalid";
        const isRelevant = relevanceTier !== "invalid";

        return {
        value: statId,
        label: stat[lang],
        kr: stat.kr,
        en: stat.en,
        jp: stat.jp,
        zh: stat.zh,
        path: `/ico/stats/${statId}.webp`,
        mainValue: stat.ValueMain,
        subValue: stat.ValueSub,
        scoreWeight,
        isRelevant,
        relevanceTier,
      };
    });

    if (!score) return list;

    return [...list].sort((a, b) => {
      const rank = { valid: 2, partial: 1, invalid: 0 };
      const tierDifference = rank[b.relevanceTier] - rank[a.relevanceTier];
      if (tierDifference !== 0) return tierDifference;
      const aScore = a.scoreWeight ?? 0;
      const bScore = b.scoreWeight ?? 0;
      return bScore - aScore;
    })
}

import { echoDict, harmony } from "@/datas/echos";
import type { SelectOptionWithImage, SelectOptionStatOriginal, SelectOriginalOption, Cost } from "./EchoSelect.type";
import Select, { type FormatOptionLabelMeta, type StylesConfig } from "react-select";
import type { LangType } from "@/stores/appStore";
import { characterScoreSheet } from "@/datas/characterScoreSheet";
import type { CharacterId } from "@/datas/characterStats";
import { FixedStats } from "@/datas/stats";

export const formatOptionWithImage = <
    T extends SelectOptionWithImage<any>
>(
    opt: T,
    lang: string,
    _meta: FormatOptionLabelMeta<T>
) => (
    <div style={{ display: "flex", alignItems: "center", gap: "min(1vw, 0.7rem)", height: "min(2.75vw, 2.75rem)" }}>
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
                fontSize: "min(1.3vw, 1rem)",
            }}>
            {(opt.label)
                .replaceAll("공명의 메아리 · ", "공명의 메아리 · \n")
                .replaceAll("Nightmare: ", "Nightmare:\n")
                .replaceAll("Reminiscence: ", "Reminiscence:\n")}
        </span>
    </div>
);

export const formatOptionWithImage_Smaller = <
    T extends SelectOptionWithImage<any>
>(
    opt: T,
    lang: string,
    _meta: FormatOptionLabelMeta<T>
) => (
    <div style={{ display: "flex", alignItems: "center", gap: "min(0.5vw, 0.27rem)", height: "min(2vw, 2rem)" }}>
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
                fontSize: "min(1.15vw, 0.85rem)",
            }}>
            {opt.label}
        </span>
    </div>
);

export const getStatDropStyle = (
    baseSelectStyles: StylesConfig<any, false>,
    slotHeight: number): StylesConfig<any, false> => ({
        ...baseSelectStyles,
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

export const getStatDropStyleOptionWide = (
    baseSelectStyles: StylesConfig<any, false>,
    slotHeight: number): StylesConfig<any, false> => ({
        ...baseSelectStyles,
        menu: (base, state) => {
            const common = baseSelectStyles.menu
                ? baseSelectStyles.menu(base, state)
                : base;

            return {
                ...common,
                right: 0,
                minWidth: `${slotHeight / 3.8}px`,
                width: "max-content",
                maxWidth: `${slotHeight / 1.8}px`,
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
                height: `${slotHeight / 13}px`,
                overflow: "hidden",
                fontSize: `${slotHeight / 30}px`,
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
                paddingLeft: `${slotHeight / 100}px`,
                paddingRight: `${slotHeight / 100}px`,
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
                paddingLeft: `${slotHeight / 160}px`,
                paddingRight: `${slotHeight / 320}px`,
                lineHeight: `${slotHeight / 13}px`,
            };
        },
    })

export const getStatDropStyleLarge = (
    baseSelectStyles: StylesConfig<any, false>,
    slotHeight: number): StylesConfig<any, false> => ({
        ...baseSelectStyles,
        control: (base, state) => {
            const common = baseSelectStyles.control
                ? baseSelectStyles.control(base, state)
                : base;
            return {
                ...common,
                minHeight: 0,
                height: `${slotHeight / 10}px`,
                overflow: "hidden",
                fontSize: `${slotHeight / 30}px`,
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

export const getStatDropStyleDrag = (
    baseSelectStyles: StylesConfig<any, false>,
    slotHeight: number, isWide: boolean): StylesConfig<any, false> => ({
        ...baseSelectStyles,
        menu: (base, state) => {
            const common = baseSelectStyles.menu
                ? baseSelectStyles.menu(base, state)
                : base;

            return {
                ...common,
                right: 0,
                minWidth: `${slotHeight / 3.8}px`,
                width: "max-content",
                maxWidth: `${slotHeight / 1.8}px`,
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
                width: "auto",
                height: `${slotHeight / 13}px`,
                aspectRatio: `${isWide ? "3.15 / 1" : "2 / 1"}`,
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
                paddingTop: "20%",
                paddingBottom: "20%",
                paddingLeft: `${slotHeight / 400}px`,
                paddingRight: `${slotHeight / 400}px`,
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
    const costKey = `Cost${selectedCost}` as const;

    return Object.entries(echoDict[costKey]).map(([echoId, echo]) => (
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
    characterId: CharacterId,
): SelectOptionStatOriginal[] => {
    const score = characterScoreSheet[characterId];
    const list = Object.entries(FixedStats).filter(
      (v) => v[1].id !== "dummy").map(([statId, stat]) => ({
        value: statId,
        label: stat[lang],
        kr: stat.kr,
        en: stat.en,
        jp: stat.jp,
        zh: stat.zh,
        path: `/ico/stats/${statId}.webp`,
        mainValue: stat.ValueMain,
        subValue: stat.ValueSub,
      }));

    return [...list].sort((a, b) => {
      const aScore = score?.[a.value as keyof typeof score] ?? 0;
      const bScore = score?.[b.value as keyof typeof score] ?? 0;
      return bScore - aScore;
    })
}

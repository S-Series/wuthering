import { useEffect, useMemo, useRef, useState } from "react";
import type { StylesConfig } from "react-select";
import Select, { type FormatOptionLabelMeta } from "react-select";

import { useAppStore } from "@/stores/appStore"
import { useStyleStore } from "@/stores/styleStore"
import { useUserStore } from "@/stores/userStore"

import { FixedStats } from "@/datas/stats";
import { echoDict, harmony, type EchoData } from "@/datas/echos";

import type { EchoRuntime } from "@/runtime/echo.runtime";

import "./EchoSelect.css"

interface EchoSelectProps {
    index?: 0 | 1 | 2 | 3 | 4;
}

//#region Dropdown Tools ====================================
type SelectOption<T = any> = {
    value: T;
    label: string;
    isDisabled?: false;
}
type SelectOriginalOption<T = any> = {
    value: T;
    kr: string;
    en: string;
    jp: string;
    zh: string;
    path: string;
}
type SelectOptionWithImage<T = any> = {
    value: T;
    label: string;
    path: string;
    isDisabled?: false;
}

type SelectOptionStatOriginal<T = any> = {
    value: T;
    label: string;
    kr: string;
    en: string;
    jp: string;
    zh: string;
    path: string;
    mainValue: number[];
    subValue: number[];
}

const formatOptionWithImage = <
    T extends SelectOptionWithImage<any>
>(
    opt: T,
    _meta: FormatOptionLabelMeta<T>
) => (
    <div style={{ display: "flex", alignItems: "center", gap: 8, height: 32 }}>
        {opt.path && (
            <img
                src={opt.path}
                alt=""
                style={{ objectFit: "contain", height: "100%", aspectRatio: "1 / 1" }}
            />
        )}
        <span style={{ wordBreak: "keep-all" }}>{opt.label}</span>
    </div>
);
//#endregion ====================================

export default function EchoSelect({ index = 0 }: EchoSelectProps) {
    const BASE_URL = import.meta.env.VITE_IMAGE_BASE;
    const { lang } = useAppStore();
    const { baseSelectStyles } = useStyleStore();
    const { selectedCharacter, updateEcho } = useUserStore();

    const wrapRef = useRef<HTMLDivElement | null>(null);
    const [slotHeight, setSlotHeight] = useState(16);

    console.log(selectedCharacter);

    //#region Ui Datas ====================================

    type Cost = 1 | 3 | 4;
    const selectedCost = useMemo<Cost>(() => {
        return selectedCharacter.echoes[index]?.cost || 4
    }, [index, selectedCharacter.echoes[index]]);

    const selectedEchoData = useMemo<EchoRuntime | null>(() => {
        console.log("changed");
        return selectedCharacter.echoes[index]
    }, [index, selectedCharacter]);

    const selectedEchoDictionaryData = useMemo<EchoData | null>(() => {
        const costKey = `Cost${selectedCost}` as const;
        const found = Object.entries(echoDict[costKey]).find(
            ([echoId]) => echoId === selectedEchoData?.echoId
        );
        return found ? found[1] : null;
    }, [selectedCost, selectedEchoData]);

    useEffect(() => {
        console.log(selectedEchoDictionaryData);
    }, [selectedEchoDictionaryData])

    //#endregion ====================================

    //#region Dropdown Styles ====================================

    const STAT_DROP_STYLE = useMemo<StylesConfig<any, false>>(() => {
        return ({
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
    }, [baseSelectStyles, slotHeight])

    const STAT_DROP_STYLE_OPTION_WIDE = useMemo<StylesConfig<any, false>>(() => {
        return ({
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
                };
            },
            container: (base, state) => {
                const common = baseSelectStyles.container
                    ? baseSelectStyles.container(base, state)
                    : base;

                return {
                    ...common,
                    minHeight: 0,
                    color: "white",
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
    }, [baseSelectStyles, slotHeight])

    const STAT_DROP_STYLE_LARGE = useMemo<StylesConfig<any, false>>(() => {
        return ({
            ...baseSelectStyles,
            control: (base, state) => {
                const common = baseSelectStyles.control
                    ? baseSelectStyles.control(base, state)
                    : base;

                return {
                    ...common,
                    minHeight: 0,
                    height: `${slotHeight / 8}px`,
                    overflow: "hidden",
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
        })
    }, [baseSelectStyles, slotHeight])
    //#endregion ====================================

    //#region Dropdown Options Original ====================================

    const HARMONY_OPTIONS_BASE = useMemo<SelectOriginalOption[]>(() => {
        return Object.values(harmony).map((v) => ({
            value: v.id,
            kr: v.kr,
            en: v.en,
            jp: v.jp,
            zh: v.zh,
            path: "default.webp",
        }));
    }, [harmony]);

    const ECHO_ID_OPTION_BASE = useMemo<SelectOriginalOption[]>(() => {
        const costKey = `Cost${selectedCost}` as const;

        return Object.entries(echoDict[costKey]).map(([echoId, echo]) => ({
            value: echoId,
            label: echo.kr,
            kr: echo.kr,
            en: echo.en,
            jp: echo.jp,
            zh: echo.zh,
            path: `${BASE_URL}/ico/echos/${echoId}.webp`,
        }));
    }, [selectedCost, echoDict]);

    const STAT_OPTION_BASE: SelectOptionStatOriginal[] =
        Object.entries(FixedStats).map(([statId, stat]) => ({
            value: statId,
            label: stat.kr,
            kr: stat.kr,
            en: stat.en,
            jp: stat.jp,
            zh: stat.zh,
            path: "",
            mainValue: stat.ValueMain,
            subValue: stat.ValueSub,
        }));
    //#endregion ====================================

    //#region Dropdown Options ====================================

    const COST_DROP_OPTION: SelectOption<Cost>[] = [
        { value: 4, label: "Cost 4" },
        { value: 3, label: "Cost 3" },
        { value: 1, label: "Cost 1" },
    ]

    const HARMONY_DROP_OPTION = useMemo<SelectOptionWithImage[]>(() => {
        const types = selectedEchoDictionaryData?.type ?? [];
        if (types.length === 0) return HARMONY_OPTIONS_BASE.map((opt) => ({
            ...opt,
            label: opt[lang],
        }));

        return HARMONY_OPTIONS_BASE
            .filter((opt) => types.includes(opt.value))
            .map((opt) => ({
                ...opt,
                label: opt[lang],
            }));
    }, [HARMONY_OPTIONS_BASE, selectedEchoDictionaryData, lang]);

    const ECHO_ID_DROP_OPTION = useMemo<SelectOptionWithImage<string>[]>(() => {
        return ECHO_ID_OPTION_BASE.map((opt) => ({
            value: opt.value,
            label: opt[lang],
            path: opt.path,
        }));
    }, [ECHO_ID_OPTION_BASE, lang]);

    const STAT_OPTION_MAIN_COST4 = STAT_OPTION_BASE.filter(
        (opt) => opt.mainValue[2] !== 0
    )
    const STAT_OPTION_MAIN_COST3 = STAT_OPTION_BASE.filter(
        (opt) => opt.mainValue[1] !== 0
    )
    const STAT_OPTION_MAIN_COST1 = STAT_OPTION_BASE.filter(
        (opt) => opt.mainValue[0] !== 0
    )

    //#endregion ====================================

    //#region Ui Datas ====================================

    useEffect(() => {
        const el = wrapRef.current;
        if (!el) return;

        const update = () => {
            const rect = el.getBoundingClientRect();
            const h = Math.max(1, Math.round(rect.height));
            setSlotHeight((prev) => (prev === h ? prev : h));
        };

        update();

        const ro = new ResizeObserver(() => update());
        ro.observe(el);
        return () => ro.disconnect();
    }, []); //resize observer
    //#endregion ====================================

    //* =========================================================    
    return ( 
        <div className="echo-select-wrapper" ref={wrapRef}>
            <div className="drop-slot">
                <Select options={COST_DROP_OPTION}
                    isSearchable={false}
                    styles={STAT_DROP_STYLE}
                    value={COST_DROP_OPTION.find((e) => e.value === selectedCost) ?? null}
                    onChange={(opt) => {
                        updateEcho(index, (prev) => (prev ? { ...prev, cost: opt?.value || 1 } : prev));
                    }}
                />
                <Select options={HARMONY_DROP_OPTION}
                    isSearchable={false}
                    styles={STAT_DROP_STYLE_OPTION_WIDE}
                    formatOptionLabel={formatOptionWithImage}
                    value={HARMONY_DROP_OPTION.find((e) => e.value === selectedCharacter.echoes[index].setId) ?? null}
                    onChange={(opt) => {
                        updateEcho(index, (prev) => (prev ? { ...prev, setId: opt?.value || "dummy" } : prev));
                    }}
                />
            </div>
            <div className="drop-slot large">
                <Select options={ECHO_ID_DROP_OPTION}
                    isSearchable={false}
                    styles={STAT_DROP_STYLE_LARGE}
                    formatOptionLabel={formatOptionWithImage}
                    value={ECHO_ID_OPTION_BASE.find((e) => e.value === selectedCharacter.echoes[index].echoId) ?? null}
                    onChange={(opt) => {
                        updateEcho(index, (prev) => (prev ? { ...prev, echoId: opt?.value || "dummy" } : prev));
                    }}
                />
            </div>

            <div className="divider" />

            <div className="drop-slot">
                <Select styles={STAT_DROP_STYLE} />
                <Select styles={STAT_DROP_STYLE} />
            </div>

            <div className="divider" />

            <div className="drop-slot">
                <Select menuPortalTarget={document.body} options={STAT_OPTION_MAIN_COST4} styles={STAT_DROP_STYLE} />
                <Select menuPortalTarget={document.body} options={STAT_OPTION_MAIN_COST3} styles={STAT_DROP_STYLE_OPTION_WIDE} />
            </div><div className="drop-slot">
                <Select menuPortalTarget={document.body}  options={STAT_OPTION_MAIN_COST1} styles={STAT_DROP_STYLE_OPTION_WIDE} />
                <Select styles={STAT_DROP_STYLE} />
            </div><div className="drop-slot">
                <Select styles={STAT_DROP_STYLE} />
                <Select styles={STAT_DROP_STYLE} />
            </div><div className="drop-slot">
                <Select styles={STAT_DROP_STYLE} />
                <Select styles={STAT_DROP_STYLE} />
            </div><div className="drop-slot">
                <Select styles={STAT_DROP_STYLE} />
                <Select styles={STAT_DROP_STYLE} />
            </div>
        </div>
    )
} 
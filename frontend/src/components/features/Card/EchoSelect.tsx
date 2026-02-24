import { useEffect, useMemo, useRef, useState } from "react";
import type { StylesConfig } from "react-select";
import Select, { type FormatOptionLabelMeta } from "react-select";

import { useAppStore } from "@/stores/appStore"
import { useStyleStore } from "@/stores/styleStore"
import { useCharacter } from "@/stores/characterDataStore"

import { FixedStats } from "@/datas/stats";
import { echoDict, harmony, type EchoData } from "@/datas/echos";

import type { EchoRuntime } from "@/runtime/echo.runtime";
import { setEchoId, patchEchoMainOption, patchEchoSubOption, setEchoCost, setEchoSetId, } from "@/runtime/characterData.helpers";

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


//#endregion ====================================

export default function EchoSelect({ index = 0 }: EchoSelectProps) {
    const BASE_URL = import.meta.env.VITE_IMAGE_BASE;
    const { lang } = useAppStore();
    const { baseSelectStyles } = useStyleStore();
    const { characterData, patchCharacterData } = useCharacter();

    const wrapRef = useRef<HTMLDivElement | null>(null);
    const [slotHeight, setSlotHeight] = useState(16);

    //#region Format ====================================
    const formatOptionWithImage = <
        T extends SelectOptionWithImage<any>
    >(
        opt: T,
        _meta: FormatOptionLabelMeta<T>
    ) => (
        <div style={{ display: "flex", alignItems: "center", gap: "min(1vw, 1rem)", height: "min(2.75vw, 2.75rem)" }}>
            {opt.path && (
                <img alt=""
                    src={opt.path}
                    style={{ objectFit: "contain", height: "100%", aspectRatio: "1 / 1" }}
                />
            )}
            <span className={`${lang}-font`}
                style={{
                    wordBreak: "normal",
                    whiteSpace: "pre",
                    msTextOverflow: "ellipsis",
                    fontSize: "min(1.2vw, 1.2rem)",
                }}>
                {(opt.label)
                    .replaceAll("Nightmare: ", "Nightmare:\n")
                    .replaceAll("Reminiscence: ", "Reminiscence:\n")}
            </span>        
        </div>
    );

    const formatOptionWithImage_Smaller = <
        T extends SelectOptionWithImage<any>
    >(
        opt: T,
        _meta: FormatOptionLabelMeta<T>
    ) => (
        <div style={{ display: "flex", alignItems: "center", gap: "min(0.25vw, 0.25rem)", height: "min(2vw, 2rem)" }}>
            {opt.path && (
                <img alt=""
                    src={opt.path}
                    style={{ objectFit: "contain", height: "70%", transform: "translate(-7.5%, -2.5%)" }}
                />
            )}
            <span className={`${lang}-font`}
                style={{
                    wordBreak: "keep-all",
                    whiteSpace: "nowrap",
                    fontSize: "min(1vw, 1rem)",
                }}>
                {opt.label}
            </span>
        </div>
    );
    //#endregion

    //#region Ui Datas ====================================

    type Cost = 1 | 3 | 4;
    const selectedCost = useMemo<Cost>(() => {
        return characterData.echoData[index]?.cost || 4
    }, [index, characterData.echoData[index]]);

    const selectedEchoData = useMemo<EchoRuntime | null>(() => {
        console.log("changed");
        return characterData.echoData[index]
    }, [index, characterData]);

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
            path: `/ico/harmony/${v.id}.png`,
        }));
    }, [harmony]);

    const ECHO_ID_OPTION_BASE = useMemo<SelectOriginalOption[]>(() => {
        const costKey = `Cost${selectedCost}` as const;

        return Object.entries(echoDict[costKey]).map(([echoId, echo]) => ({
            value: echoId,
            label: echo[lang],
            kr: echo.kr,
            en: echo.en,
            jp: echo.jp,
            zh: echo.zh,
            path: `${BASE_URL}/ico/echos/${echoId}.webp`,
        }));
    }, [selectedCost, echoDict]);

    const STAT_OPTION_BASE: SelectOptionStatOriginal[] =
        Object.entries(FixedStats).filter((v) => v[1].id !== "dummy").map(([statId, stat]) => ({
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
        (opt) => opt.mainValue[0] !== 0
    )
    const STAT_OPTION_MAIN_COST3 = STAT_OPTION_BASE.filter(
        (opt) => opt.mainValue[1] !== 0
    )
    const STAT_OPTION_MAIN_COST1 = STAT_OPTION_BASE.filter(
        (opt) => opt.mainValue[2] !== 0
    )
    const STAT_OPTION_SUB = STAT_OPTION_BASE.filter(
        (opt) => opt.subValue.length !== 0
    )

    type SelectOpt = { value: number; label: string };

    const isFixedStatId = (id: string): id is keyof typeof FixedStats => id in FixedStats;

    const STAT_OPTION_VALUE_SUBS = useMemo(() => {
        const echo = characterData.echoData[index];

        return echo.subOptions.map((sub) => {
            const id = sub.statId;

            if (!id || id === "dummy") return [] as SelectOpt[];
            if (!isFixedStatId(id)) return [] as SelectOpt[];

            return FixedStats[id].ValueSub.map((value) => ({
                value,
                label: String(value),
            }));
        }) as [SelectOpt[], SelectOpt[], SelectOpt[], SelectOpt[], SelectOpt[]];
    }, [index, characterData.echoData]);

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
                        patchCharacterData(setEchoCost(characterData, index, opt.value))
                    }}
                />
                <Select options={HARMONY_DROP_OPTION}
                    isSearchable={false}
                    styles={STAT_DROP_STYLE_OPTION_WIDE}
                    formatOptionLabel={formatOptionWithImage_Smaller}
                    value={HARMONY_DROP_OPTION.find((e) => e.value 
                        === characterData.echoData[index].setId) ?? null
                    }
                    onChange={(opt) => {
                        patchCharacterData(setEchoSetId(characterData, index, opt.value))
                    }}
                />
            </div>

            <div className="drop-slot large">
                <Select options={ECHO_ID_DROP_OPTION}
                    isClearable={true}
                    isSearchable={false}
                    styles={STAT_DROP_STYLE_LARGE}
                    formatOptionLabel={formatOptionWithImage}
                    value={ECHO_ID_OPTION_BASE.find((e) => e.value
                        === characterData.echoData[index].echoId) ?? null
                    }
                    onChange={(opt) => {
                        patchCharacterData(setEchoId(characterData, index as 0 | 1 | 2 | 3 | 4, opt.value));
                    }}
                />
            </div>

            <div className="divider" />

            <div className="drop-slot">
                <Select options={(() => {
                    switch (characterData.echoData[index].cost) {
                        case 4: return STAT_OPTION_MAIN_COST4;
                        case 3: return STAT_OPTION_MAIN_COST3;
                        case 1: return STAT_OPTION_MAIN_COST1;
                        default: return [];
                    }})()}
                    styles={STAT_DROP_STYLE_OPTION_WIDE}
                    formatOptionLabel={formatOptionWithImage_Smaller}
                    menuPortalTarget={document.body}
                    value={STAT_OPTION_BASE.find((e) => e.value
                        === characterData.echoData[index].mainOption.statId) ?? null
                    }
                    onChange={(opt) => {
                        if (!opt) return;
                        patchCharacterData(patchEchoMainOption(characterData, index, {
                            statId: opt.value, 
                            statValue: (() => {
                                const echoData = characterData.echoData[index];
                                const statId = opt.value;

                                if (!statId || statId === "dummy") return 0;

                                const costIndexMap: Record<1 | 3 | 4, number> = {
                                    4: 0,
                                    3: 1,
                                    1: 2,
                                };

                                const idx = costIndexMap[echoData.cost];
                                const stat = FixedStats[statId as keyof typeof FixedStats];

                                if (!stat) return 0;

                                return stat.ValueMain[idx];
                            })()
                        }));
                    }}
                />

                <span className="main-stat-span num-font">
                    {characterData.echoData[index].mainOption.statValue.toFixed(1)}%
                </span>
            </div>

            <div className="divider" />

            {[0, 1, 2, 3, 4].map((idx) => {
                return (<div className="drop-slot">
                    <div style={{width: "65%"}}>
                    <Select options={STAT_OPTION_SUB}
                        styles={STAT_DROP_STYLE_OPTION_WIDE}
                        formatOptionLabel={formatOptionWithImage_Smaller}
                        menuPlacement="auto"
                        menuPosition="fixed"
                        minMenuHeight={200}
                        menuShouldScrollIntoView={false}
                        menuPortalTarget={document.body}
                        value={STAT_OPTION_BASE.find((e) => e.value
                            === characterData.echoData[index].subOptions[idx].statId) ?? null
                        }
                        onChange={(opt) => {
                            if (!opt) return;
                            patchCharacterData(patchEchoSubOption(characterData, index, idx as 0 | 1 | 2 | 3 | 4, { statId: opt.value }));
                        }}
                    />
                    </div>

                    <div style={{width: "35%"}}>
                    <Select options={STAT_OPTION_VALUE_SUBS[idx]}
                        styles={STAT_DROP_STYLE_OPTION_WIDE}
                        menuPlacement="auto"
                        menuPosition="fixed"
                        minMenuHeight={200}
                        menuShouldScrollIntoView={false}
                        menuPortalTarget={document.body}
                        value={STAT_OPTION_VALUE_SUBS[idx].find((e) => e.value
                            === characterData.echoData[index].subOptions[idx].statValue) ?? null
                        }
                        onChange={(opt) => {
                            if (!opt) return;
                            patchCharacterData(patchEchoSubOption(characterData, index, idx as 0 | 1 | 2 | 3 | 4, { statValue: opt.value }));
                        }}
                    />
                    </div>
                </div>)
            })}
        </div>
    )
} 
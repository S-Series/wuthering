import { useEffect, useMemo, useRef, useState } from "react";
import type { StylesConfig } from "react-select";
import Select from "react-select";

import { useAppStore } from "@/stores/appStore"
import { useStyleStore } from "@/stores/styleStore"
import { useCharacter } from "@/stores/characterDataStore"

import { FixedStats } from "@/datas/stats";
import { echoDict, type EchoData } from "@/datas/echos";

import type { EchoSelectProps, SelectOption, SelectOriginalOption, SelectOptionWithImage, SelectOptionStatOriginal, Cost, SelectOpt } from "./EchoSelect.type";
import { formatOptionWithImage, formatOptionWithImage_Smaller, getStatDropStyleOptionWide, getStatDropStyleLarge, HARMONY_OPTIONS_BASE, getEchoOptionBase, getStatOptionBase } from "./EchoSelect.helper";

import { createEmptyEchoRuntime, type EchoRuntime } from "@/runtime/echo.runtime";
import { patchEchoAt, setEchoId, patchEchoMainOption, patchEchoSubOption, setEchoCost, setEchoSetId, } from "@/runtime/characterData.helpers";
import { locale } from "@/locales/locale";
import { useElevatedOverlay } from "@/contexts/useElevatedOverlay";

import "./EchoSelect.css"

//#endregion ====================================

type DropStyleOption =
  | SelectOption<Cost>
  | SelectOptionWithImage
  | SelectOptionWithImage<string>
  | SelectOptionStatOriginal
  | SelectOpt;

const PLACEHOLDERS = {
  kr: {
    cost: "코스트 선택",
    harmony: "하모니 선택",
    mainStat: "주옵션 선택",
    subStat: "부옵션 선택",
    subValue: "수치 선택",
  },
  en: {
    cost: "Select cost",
    harmony: "Select harmony",
    mainStat: "Select main stat",
    subStat: "Select sub stat",
    subValue: "Select value",
  },
  jp: {
    cost: "コスト選択",
    harmony: "ハーモニー選択",
    mainStat: "メイン選択",
    subStat: "サブ選択",
    subValue: "数値選択",
  },
  zh: {
    cost: "选择Cost",
    harmony: "选择套装",
    mainStat: "选择主词条",
    subStat: "选择副词条",
    subValue: "选择数值",
  },
} as const;

export default function EchoSelect({ index = 0 }: EchoSelectProps) {
  const BASE_URL = import.meta.env.VITE_IMAGE_BASE;
  const { lang, imgVer } = useAppStore();
  const { baseSelectStyles } = useStyleStore();
  const { characterData, patchCharacterData } = useCharacter();
  const { openElevatedOverlay, closeElevatedOverlay } = useElevatedOverlay();
  const localeText = locale(lang).card;
  const placeholders = PLACEHOLDERS[lang] ?? PLACEHOLDERS.kr;

  const wrapRef = useRef<HTMLDivElement | null>(null);
  const [slotHeight, setSlotHeight] = useState(16);
  const echoData = characterData.echoData[index];

  const selectedCost = useMemo<Cost>(() => {
    return echoData?.cost || 4
  }, [echoData]);

  const selectedEchoData = useMemo<EchoRuntime | null>(() => {
    return echoData
  }, [echoData]);

  const selectedEchoDictionaryData = useMemo<EchoData | null>(() => {
    const costKey = `Cost${selectedCost}` as const;
    const found = Object.entries(echoDict[costKey]).find(
      ([echoId]) => echoId === (selectedEchoData?.echoId ?? "")
    );
    if (!found) return null;

    const [echoId, data] = found;
    return {
      id: echoId,
      ...data,
    };
  }, [selectedCost, selectedEchoData]);

  const STAT_DROP_STYLE_OPTION_WIDE = useMemo<StylesConfig<DropStyleOption, false>>(() =>
    getStatDropStyleOptionWide(baseSelectStyles, slotHeight)
    , [baseSelectStyles, slotHeight])

  const STAT_DROP_STYLE_LARGE = useMemo<StylesConfig<DropStyleOption, false>>(() =>
    getStatDropStyleLarge(baseSelectStyles, slotHeight)
    , [baseSelectStyles, slotHeight])


  /// const HARMONY_OPTIONS_BASE; <<= imported, unChange data
  const ECHO_ID_OPTION_BASE: SelectOriginalOption[] =
    useMemo<SelectOriginalOption[]>(() =>
      getEchoOptionBase(lang, selectedCost, BASE_URL)
      , [lang, selectedCost, BASE_URL]);

  const STAT_OPTION_BASE = useMemo<SelectOptionStatOriginal[]>(() =>
    getStatOptionBase(lang, characterData.characterId)
    , [lang, characterData.characterId])


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
  }, [selectedEchoDictionaryData, lang]);

  const ECHO_ID_DROP_OPTION = useMemo<SelectOptionWithImage<string>[]>(() => {
    return ECHO_ID_OPTION_BASE
      .filter((item) => {
        if (!item.harmonies) return true;
        if (!echoData.setId) return true;
        return item.harmonies.includes(echoData.setId)
      }).map((opt) => ({
        value: opt.value,
        label: opt[lang],
        path: opt.path + `?v=${imgVer}`,
      }));
  }, [ECHO_ID_OPTION_BASE, lang, echoData.setId, imgVer]);

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

  useEffect(() => {
    const el = wrapRef.current;
    if (!el) return;

    const update = () => {
      const rect = el.getBoundingClientRect();
      const h = Math.max(1, Math.round(rect.height)) * 0.8;
      setSlotHeight((prev) => (prev === h ? prev : h));
    };

    update();

    const ro = new ResizeObserver(() => update());
    ro.observe(el);
    return () => ro.disconnect();
  }, []); //resize observer

  const resetEchoData = () => {
    patchCharacterData(
      patchEchoAt(characterData, index, createEmptyEchoRuntime(4)),
    );
  };

  const openResetConfirm = () => {
    openElevatedOverlay(
      <div className={`echo-reset-confirm ${lang}-font`}>
        <p>{localeText.resetEchoDataMessage}</p>
        <div className="echo-reset-confirm__actions">
          <button
            type="button"
            className="cancel"
            onClick={closeElevatedOverlay}
          >
            {localeText.resetEchoDataCancel}
          </button>
          <button
            type="button"
            className="confirm"
            onClick={() => {
              resetEchoData();
              closeElevatedOverlay();
            }}
          >
            {localeText.resetEchoDataConfirm}
          </button>
        </div>
      </div>,
      {
        title: localeText.resetEchoDataTitle,
        width: "min(92vw, 28rem)",
        ratio: null,
      },
    );
  };

  //* =========================================================    
  return (
    <div className="echo-select-wrapper" ref={wrapRef}>
      <div className="echo-select-base-grid">
        <div className="drop-slot large">
          <Select
            options={COST_DROP_OPTION}
            isSearchable={false}
            placeholder={placeholders.cost}
            styles={STAT_DROP_STYLE_LARGE}
            value={COST_DROP_OPTION.find((e) => e.value === selectedCost) ?? null}
            onChange={(opt) => {
              patchCharacterData(setEchoCost(characterData, index, opt?.value));
            }}
          />
        </div>

        <div className="drop-slot large">
          <Select
            options={HARMONY_DROP_OPTION}
            isClearable={true}
            isSearchable={false}
            placeholder={placeholders.harmony}
            styles={STAT_DROP_STYLE_LARGE}
            formatOptionLabel={(opt, meta) =>
              formatOptionWithImage_Smaller(opt, lang, meta)
            }
            value={
              HARMONY_DROP_OPTION.find(
                (e) => e.value === characterData.echoData[index].setId
              ) ?? null
            }
            onChange={(opt) => {
              patchCharacterData(
                setEchoSetId(characterData, index, opt?.value ?? null)
              );
            }}
          />
        </div>

        <div className="drop-slot large echo-select-echo-field">
          <Select
            options={ECHO_ID_DROP_OPTION}
            isClearable={true}
            isSearchable={true}
            placeholder={
              <div style={{display: "flex", alignItems: "center", gap: "min(0.5vw, 0.5rem)"}}>
                <img
                  style={{
                    width: "auto",
                    height: "min(2vw, 2rem)",
                    aspectRatio: "1/1",
                  }}
                  src="/default.webp"
                />
                <span style={{whiteSpace: "nowrap", fontSize: "min(1vw, 1rem)"}}>
                  {localeText.echoSearch}
                </span>
              </div>
            }
            styles={STAT_DROP_STYLE_LARGE}
            formatOptionLabel={(opt, meta) =>
              formatOptionWithImage(opt, lang, meta)
            }
            value={
              ECHO_ID_OPTION_BASE.find(
                (e) => e.value === characterData.echoData[index].echoId
              ) ?? null
            }
            onChange={(opt) => {
              patchCharacterData(
                setEchoId(
                  characterData,
                  index as 0 | 1 | 2 | 3 | 4,
                  opt?.value ?? null
                )
              );
            }}
          />
        </div>
      </div>

      <div className="echo-select-main-grid">
        <div className="drop-slot">
          <Select
            options={(() => {
              switch (characterData.echoData[index].cost) {
                case 4:
                  return STAT_OPTION_MAIN_COST4;
                case 3:
                  return STAT_OPTION_MAIN_COST3;
                case 1:
                  return STAT_OPTION_MAIN_COST1;
                default:
                  return [];
              }
            })()}
            placeholder={placeholders.mainStat}
            styles={STAT_DROP_STYLE_OPTION_WIDE}
            formatOptionLabel={(opt, meta) =>
              formatOptionWithImage_Smaller(opt, lang, meta)
            }
            menuPortalTarget={document.body}
            value={
              STAT_OPTION_BASE.find(
                (e) => e.value === characterData.echoData[index].mainOption.statId
              ) ?? null
            }
            onChange={(opt) => {
              if (!opt) return;
              patchCharacterData(
                patchEchoMainOption(characterData, index, {
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
                  })(),
                })
              );
            }}
          />

          <span className="main-stat-span num-font">
            {(characterData?.echoData[index]?.mainOption?.statValue ?? 0).toFixed(
              1
            )}
            %
          </span>
        </div>
      </div>

      <div className="echo-select-sub-grid">
        {[0, 1, 2, 3, 4].map((idx) => {
          return (
            <div key={`echo-stat-drop-${idx}`} className="drop-slot">
              <div className="sub-stat-select">
                <Select
                  options={STAT_OPTION_SUB}
                  placeholder={placeholders.subStat}
                  styles={STAT_DROP_STYLE_OPTION_WIDE}
                formatOptionLabel={(opt, meta) =>
                  formatOptionWithImage_Smaller(opt, lang, meta)
                }
                menuPosition="fixed"
                minMenuHeight={200}
                menuShouldScrollIntoView={false}
                menuPortalTarget={document.body}
                value={
                  STAT_OPTION_BASE.find(
                    (e) =>
                      e.value ===
                      characterData.echoData[index].subOptions[idx].statId
                  ) ?? null
                }
                onChange={(opt) => {
                  if (!opt) return;
                  patchCharacterData(
                    patchEchoSubOption(
                      characterData,
                      index,
                      idx as 0 | 1 | 2 | 3 | 4,
                      { statId: opt.value }
                    )
                  );
                  }}
                />
              </div>

              <div className="sub-value-select">
                <Select
                  options={STAT_OPTION_VALUE_SUBS[idx]}
                  placeholder={placeholders.subValue}
                  styles={STAT_DROP_STYLE_OPTION_WIDE}
                  menuPlacement="auto"
                  menuPosition="fixed"
                  minMenuHeight={200}
                  menuShouldScrollIntoView={false}
                  menuPortalTarget={document.body}
                  value={
                    STAT_OPTION_VALUE_SUBS[idx].find(
                      (e) =>
                        e.value ===
                        characterData.echoData[index].subOptions[idx].statValue
                    ) ?? null
                  }
                  onChange={(opt) => {
                    if (!opt) return;
                    patchCharacterData(
                      patchEchoSubOption(
                        characterData,
                        index,
                        idx as 0 | 1 | 2 | 3 | 4,
                        { statValue: opt.value }
                      )
                    );
                  }}
                />
              </div>
            </div>
          );
        })}
      </div>

      <button
        type="button"
        className={`${lang}-font echo-select-reset-button`}
        onClick={openResetConfirm}
      >
        {localeText.resetEchoData}
      </button>
    </div>
  );
} 

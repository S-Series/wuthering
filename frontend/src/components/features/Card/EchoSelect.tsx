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

import "./EchoSelect.css"

//#endregion ====================================

export default function EchoSelect({ index = 0 }: EchoSelectProps) {
  const BASE_URL = import.meta.env.VITE_IMAGE_BASE;
  const { lang, imgVer } = useAppStore();
  const { baseSelectStyles } = useStyleStore();
  const { characterData, patchCharacterData } = useCharacter();
  const localeText = locale(lang).card;

  const wrapRef = useRef<HTMLDivElement | null>(null);
  const [slotHeight, setSlotHeight] = useState(16);

  const selectedCost = useMemo<Cost>(() => {
    return characterData.echoData[index]?.cost || 4
  }, [index, characterData.echoData[index]]);

  const selectedEchoData = useMemo<EchoRuntime | null>(() => {
    return characterData.echoData[index]
  }, [index, characterData]);

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

  const STAT_DROP_STYLE_OPTION_WIDE = useMemo<StylesConfig<any, false>>(() =>
    getStatDropStyleOptionWide(baseSelectStyles, slotHeight)
    , [baseSelectStyles, slotHeight])

  const STAT_DROP_STYLE_LARGE = useMemo<StylesConfig<any, false>>(() =>
    getStatDropStyleLarge(baseSelectStyles, slotHeight)
    , [baseSelectStyles, slotHeight])


  /// const HARMONY_OPTIONS_BASE; <<= imported, unChange data
  const ECHO_ID_OPTION_BASE: SelectOriginalOption[] =
    useMemo<SelectOriginalOption[]>(() =>
      getEchoOptionBase(lang, selectedCost, BASE_URL)
      , [lang, selectedCost]);

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
        if (!characterData.echoData[index].setId) return true;
        return item.harmonies.includes(characterData.echoData[index].setId)
      }).map((opt) => ({
        value: opt.value,
        label: opt[lang],
        path: opt.path + `?v=${imgVer}`,
      }));
  }, [ECHO_ID_OPTION_BASE, lang, characterData.echoData[index], index]);

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
      const h = Math.max(1, Math.round(rect.height));
      setSlotHeight((prev) => (prev === h ? prev : h));
    };

    update();

    const ro = new ResizeObserver(() => update());
    ro.observe(el);
    return () => ro.disconnect();
  }, []); //resize observer

  //* =========================================================    
  return (
    <div className="echo-select-wrapper" ref={wrapRef}>
      <button
        type="button"
        className={`${lang}-font echo-select-reset-button`}
        onClick={() =>
          patchCharacterData(
            patchEchoAt(characterData, index, createEmptyEchoRuntime(4)),
          )
        }
      >
        {localeText.resetEchoData}
      </button>

      <div className="drop-slot large">
        <Select
          options={COST_DROP_OPTION}
          isSearchable={false}
          styles={STAT_DROP_STYLE_LARGE}
          value={COST_DROP_OPTION.find((e) => e.value === selectedCost) ?? null}
          onChange={(opt) => {
            patchCharacterData(setEchoCost(characterData, index, opt.value));
          }}
        />
      </div>

      <div className="drop-slot large">
        <Select
          options={HARMONY_DROP_OPTION}
          isClearable={true}
          isSearchable={false}
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

      <div className="drop-slot large">
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

      <div className="divider" />

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

      <div className="divider" />

      {[0, 1, 2, 3, 4].map((idx) => {
        return (
          <div key={`echo-stat-drop-${idx}`} className="drop-slot">
            <div style={{ width: "65%" }}>
              <Select
                options={STAT_OPTION_SUB}
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

            <div style={{ width: "35%" }}>
              <Select
                options={STAT_OPTION_VALUE_SUBS[idx]}
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
  );
} 

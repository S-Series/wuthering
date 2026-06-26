import { useEffect, useMemo, useState, type ReactNode } from "react";
import {
  DndContext,
  closestCenter,
  PointerSensor,
  useSensor,
  useSensors,
  type DragEndEvent,
} from "@dnd-kit/core";
import {
  SortableContext,
  verticalListSortingStrategy,
  arrayMove,
} from "@dnd-kit/sortable";

import { echoDict, type EchoId } from "@/datas/echos";
import { FixedStats, type StatId } from "@/datas/stats";
import { useAppStore, type LangType } from "@/stores/appStore";

import { OcrDragItem } from "./OcrDragItem";

import "./OcrDragSelect.override.css"
import Select, { type StylesConfig } from "react-select";
import { useCharacter } from "@/stores/characterDataStore";
import { formatOptionWithImage, formatOptionWithImage_Smaller, getStatDropStyleLarge, HARMONY_OPTIONS_BASE, getEchoOptionBase, getStatOptionBase, getStatDropStyleDrag } from "./EchoSelect.helper";
import { useStyleStore } from "@/stores/styleStore";
import type { Cost, SelectOpt, SelectOption, SelectOptionStatOriginal, SelectOptionWithImage } from "./EchoSelect.type";
import { createEmptyEchoRuntime, type EchoRuntime, type EchoStatOption } from "@/runtime/echo.runtime";
import { patchEchoAt } from "@/runtime/characterData.helpers";
import { locale } from "@/locales/locale";
import { getEquipmentRank } from "@/types/character.type";

export type DragItem = {
  id: number;
  statId: StatId | null;
  statValue: number | null;
  statName: string | null;
};

type Props = {
  datas: {
    cost: 4 | 3 | 1;
    echoId: EchoId | null;
    stats: [StatId, number][] | null;
  };
  selectIdx: number;
  onSelectIdx: React.Dispatch<React.SetStateAction<0 | 1 | 2 | 3 | 4 | 5 | 6 | 7 | 8 | 9>>;
  height: number;
  resetAction: () => void;
  inputSlot?: ReactNode;
  resultSlot?: ReactNode;
};

export type EchoRuntimeWith7Subs = Omit<EchoRuntime, "subOptions"> & {
  subOptions: [
    EchoStatOption,
    EchoStatOption,
    EchoStatOption,
    EchoStatOption,
    EchoStatOption,
    EchoStatOption,
    EchoStatOption
  ];
};

const InitTempEcho = () => {
  const temp = createEmptyEchoRuntime(4)
  const data:EchoRuntimeWith7Subs = {
    ...temp,
    subOptions: [
      {statId: "dummy", statValue: 0},
      {statId: "dummy", statValue: 0},
      {statId: "dummy", statValue: 0},
      {statId: "dummy", statValue: 0},
      {statId: "dummy", statValue: 0},
      {statId: "dummy", statValue: 0},
      {statId: "dummy", statValue: 0}
    ]
  }

  return data;
}

const DEFAULT_ORDER = [0, 1, 2, 3, 4, 5, 6];

function createItems(data: EchoStatOption[] | null, lang: LangType): DragItem[] {
  const stats = data?.slice(2) ?? [];
  const fixedStats = Object.values(FixedStats);

  return Array.from({ length: 7 }, (_, index) => {
    const stat = stats[index];

    return {
      id: index,
      statId: stat?.statId ?? null,
      statValue: stat?.statValue ?? null,
      statName: stat
        ? fixedStats.find((item) => item.id === stat.statId)?.[lang] ?? null
        : null,
    };
  });
}

const PERCENT_STAT_KEYS = ["crit", "Pct", "Bns"];

function formatStatValue(statId: string, value: number) {
  if (!statId || statId === "dummy") return "- - -";
  if (value === -1) return "- - -";

  const formatted = Number.isInteger(value) ? value.toFixed(0) : value.toFixed(1);
  const suffix = PERCENT_STAT_KEYS.some((key) => statId.includes(key)) ? "%" : "";

  return `${formatted}${suffix}`;
}

function getMainStatValue(statId: string, cost: Cost) {
  if (!statId || statId === "dummy") return 0;

  const stat = FixedStats[statId as keyof typeof FixedStats];
  if (!stat) return 0;

  const costIndexMap: Record<Cost, number> = {
    4: 0,
    3: 1,
    1: 2,
  };

  return stat.ValueMain[costIndexMap[cost]] ?? 0;
}

function OcrTargetPreview({
  baseUrl,
  echoData,
  score,
  slotNumber,
}: {
  baseUrl: string;
  echoData: EchoRuntime;
  score: [number, number];
  slotNumber: number;
}) {
  const costStatId = echoData.cost === 1 ? FixedStats.hp.id : FixedStats.atk.id;
  const costStatValue = (() => {
    switch (echoData.cost) {
      case 4: return 150;
      case 3: return 100;
      case 1: return 2280;
      default: return -1;
    }
  })();
  const rank = getEquipmentRank(score[1] ?? 0);

  return (
    <div className="ocr-target-preview-card">
      <div className="ocr-target-preview-card__header">
        <span>미리보기 · Slot {slotNumber}</span>
        <img src={`/ico/rank/${rank}.png`} alt="rank" />
      </div>

      <div className="ocr-target-preview-card__hero">
        <img
          className="echo"
          src={`${baseUrl}/ico/echos/${echoData.echoId}.webp`}
          onError={(e) => {
            e.currentTarget.onerror = null;
            e.currentTarget.src = "/default.webp";
          }}
          alt=""
        />
        <img
          className="harmony"
          src={`/ico/harmony/${echoData.setId}.png`}
          onError={(e) => {
            e.currentTarget.onerror = null;
            e.currentTarget.src = "/default.webp";
          }}
          alt=""
        />
      </div>

      <div className="ocr-target-preview-card__stats main">
        <PreviewStat statId={echoData.mainOption.statId} value={echoData.mainOption.statValue} />
        <PreviewStat statId={costStatId} value={costStatValue} muted />
      </div>

      <div className="ocr-target-preview-card__stats sub">
        {echoData.subOptions.map((item, index) => (
          <PreviewStat
            key={`ocr-target-preview-stat-${index}`}
            statId={item.statId}
            value={item.statValue}
            muted={item.statId === "dummy"}
          />
        ))}
      </div>

      <div className="ocr-target-preview-card__score">
        <span>Cv. <em className="num-font">{score[0].toFixed(1)}</em>pt</span>
        <span>Av. <em className="num-font">{score[1].toFixed(1)}</em>pt</span>
      </div>
    </div>
  );
}

function PreviewStat({
  statId,
  value,
  muted = false,
}: {
  statId: string;
  value: number;
  muted?: boolean;
}) {
  return (
    <div className={`ocr-target-preview-stat ${muted ? "muted" : ""}`}>
      <img
        src={`/ico/stats/${statId}.webp`}
        onError={(e) => {
          e.currentTarget.onerror = null;
          e.currentTarget.src = "/default.webp";
        }}
        alt=""
      />
      <span className="num-font">{formatStatValue(statId, value)}</span>
    </div>
  );
}

export default function OcrDragSelect({
  datas,
  selectIdx,
  onSelectIdx,
  height,
  resetAction,
  inputSlot,
  resultSlot,
}: Props) {
  const baseUrl = import.meta.env.VITE_IMAGE_BASE;
  const { cost, echoId, stats } = datas;
  const { lang, imgVer } = useAppStore();
  const { baseSelectStyles } = useStyleStore();
  const { characterData, equipmentScore, patchCharacterData } = useCharacter();
  const localeText = locale(lang).card;

  const [sourceItems, setSourceItems] = useState<DragItem[]>([]);
  const [itemOrder, setItemOrder] = useState<number[]>(DEFAULT_ORDER);

  const [tempEcho, setTempEcho] = useState<EchoRuntimeWith7Subs>(InitTempEcho());

  const sensors = useSensors(
    useSensor(PointerSensor, {
      activationConstraint: { distance: 6 },
    })
  );

  useEffect(() => {
    const nextStats: EchoStatOption[] = (stats ?? []).map(
      ([statId, statValue]) => ({
        statId,
        statValue,
      })
    );

    const tempEchoData: EchoRuntimeWith7Subs = {
      echoId,
      setId: null,
      cost,
      mainOption: { 
        statId: stats?.[0]?.[0] ?? "dummy",
        statValue: stats?.[0]?.[1] ?? 0
      },
      subOptions: [{
        statId: stats?.[2]?.[0] ?? "dummy",
        statValue: stats?.[2]?.[1] ?? 0
      },{
        statId: stats?.[3]?.[0] ?? "dummy",
        statValue: stats?.[3]?.[1] ?? 0
      },{
        statId: stats?.[4]?.[0] ?? "dummy",
        statValue: stats?.[4]?.[1] ?? 0
      },{
        statId: stats?.[5]?.[0] ?? "dummy",
        statValue: stats?.[5]?.[1] ?? 0
      },{
        statId: stats?.[6]?.[0] ?? "dummy",
        statValue: stats?.[6]?.[1] ?? 0
      },{
        statId: stats?.[7]?.[0] ?? "dummy",
        statValue: stats?.[7]?.[1] ?? 0
      },{
        statId: stats?.[8]?.[0] ?? "dummy",
        statValue: stats?.[8]?.[1] ?? 0
      }]
    }

    // eslint-disable-next-line react-hooks/set-state-in-effect
    setTempEcho(tempEchoData);
    setSourceItems(createItems(nextStats, lang));
    setItemOrder(DEFAULT_ORDER);
  }, [echoId, cost, stats, lang]);

  const displayItems = useMemo(() => {
    return itemOrder
      .map((itemId) => sourceItems.find((item) => item.id === itemId))
      .filter((item): item is DragItem => item != null);
  }, [sourceItems, itemOrder]);

  const handleDragEnd = (event: DragEndEvent) => {
    const { active, over } = event;

    if (!over || active.id === over.id) return;

    setItemOrder((prev) => {
      const oldIndex = prev.findIndex((itemId) => itemId === active.id);
      const newIndex = prev.findIndex((itemId) => itemId === over.id);

      if (oldIndex < 0 || newIndex < 0) return prev;
      return arrayMove(prev, oldIndex, newIndex);
    });
  };

  function toEchoRuntime(
    source: EchoRuntimeWith7Subs,
    itemOrder: number[]
  ): EchoRuntime {
    const picked = itemOrder.slice(0, 5).map((idx) => source.subOptions[idx]);

    return {
      echoId: source.echoId,
      setId: source.setId,
      cost: source.cost,
      mainOption: source.mainOption,
      subOptions: picked as EchoRuntime["subOptions"],
    };
  }

  const DragOptions = [
    (() => getStatDropStyleDrag(baseSelectStyles, height))(),
    (() => getStatDropStyleDrag(baseSelectStyles, height))(),
  ] as [StylesConfig<SelectOptionStatOriginal | SelectOpt, false>, StylesConfig<SelectOptionStatOriginal | SelectOpt, false>];

  const STAT_DROP_STYLE_LARGE = useMemo(
    () => getStatDropStyleLarge(baseSelectStyles, height),
    [baseSelectStyles, height]
  );
  // ==============================================================

  const tempEchoData = useMemo(() => {
    const tempData = Object.entries(echoDict[`Cost${tempEcho?.cost ?? 4}`]).find(
      ([echoId]) => echoId === (tempEcho?.echoId ?? "")
    );
    if (!tempData) return null;

    const [echoId, data] = tempData;
    return {
      id: echoId,
      ...data,
    }
  }, [tempEcho.cost, tempEcho.echoId])

  const COST_DROP_OPTION: SelectOption<Cost>[] = [
    { value: 4, label: "Cost 4" },
    { value: 3, label: "Cost 3" },
    { value: 1, label: "Cost 1" },
  ]
  
  const EchoOption = useMemo(() => {
    const base = getEchoOptionBase(lang, tempEcho.cost, baseUrl)

    return base
      .filter((item) => {
        if (!item.harmonies) return true;
        if (!tempEcho.setId) return true;
        return item.harmonies.includes(tempEcho.setId)
      }).map((opt) => ({
        value: opt.value,
        label: opt[lang],
        path: opt.path + `?v=${imgVer}`,
      }));
  }, [baseUrl, imgVer, lang, tempEcho.cost, tempEcho.setId])

  const HARMONY_DROP_OPTION = useMemo<SelectOptionWithImage[]>(() => {
    const types = tempEchoData?.type ?? [];
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
  }, [lang, tempEchoData?.type]);

  const STAT_OPTION_BASE = useMemo<SelectOptionStatOriginal[]>(() =>
    getStatOptionBase(lang)
    , [lang])

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
  const dropStatOptions = useMemo(() => {
    return tempEcho.subOptions.map((sub) => {
      const id = sub.statId;

      if (!id || id === "dummy") return [] as SelectOpt[];
      if (!isFixedStatId(id)) return [] as SelectOpt[];

      return FixedStats[id].ValueSub.map((value) => ({
        value,
        label: String(value),
      }));
    }) as [SelectOpt[], SelectOpt[], SelectOpt[], SelectOpt[], SelectOpt[], SelectOpt[], SelectOpt[]];
  }, [tempEcho])

  const handleApplyData = () => {
    const echoData = toEchoRuntime(tempEcho, itemOrder);
    patchCharacterData(
      patchEchoAt(
        characterData,
        selectIdx as 0 | 1 | 2 | 3 | 4 | 5 | 6 | 7 | 8 | 9,
        echoData,
      ),
    );
    setTempEcho(InitTempEcho());
    resetAction();
  };

  return (
    <div className="ocr-drag-select">
      <DndContext
        sensors={sensors}
        collisionDetection={closestCenter}
        onDragEnd={handleDragEnd}
      >
        <SortableContext
          items={itemOrder}
          strategy={verticalListSortingStrategy}
        >
          <div className="ocr-drag-select__list">
            <div className="ocr-drag-select__target-fields">
              <div className="ocr-drag-select__target-buttons">
                {Array.from({ length: 10 }, (_, idx) => {
                  const echoIndex = idx as 0 | 1 | 2 | 3 | 4 | 5 | 6 | 7 | 8 | 9;

                  return (
                    <button
                      key={`ocr-target-slot-${idx}`}
                      type="button"
                      className={selectIdx === idx ? "active" : ""}
                      onClick={() => onSelectIdx(echoIndex)}
                    >
                      {idx + 1}
                    </button>
                  );
                })}
              </div>

              <div className="ocr-drag-select__target-preview">
                <OcrTargetPreview
                  baseUrl={baseUrl}
                  echoData={characterData.echoData[selectIdx]}
                  score={equipmentScore?.[selectIdx] ?? [0, 0]}
                  slotNumber={selectIdx + 1}
                />
              </div>
            </div>

            <div className="ocr-drag-select__image-fields">
              {inputSlot}
              {resultSlot}
            </div>

            <div className="ocr-drag-select__editor-fields">
              <Select options={COST_DROP_OPTION}
                styles={STAT_DROP_STYLE_LARGE}
                onChange={(opt) => {
                  if (!opt) return;
                  setTempEcho((p) => {
                    if (!p) return p;
                    return {
                      ...p,
                      cost: opt.value,
                      mainOption: {
                        ...p.mainOption,
                        statValue: getMainStatValue(
                          p.mainOption.statId,
                          opt.value,
                        ),
                      },
                    };
                  });
                }}
                value={COST_DROP_OPTION.find(item => item.value === tempEcho.cost) ?? null}

                />
              <Select options={HARMONY_DROP_OPTION}
                styles={STAT_DROP_STYLE_LARGE}
                formatOptionLabel={(opt, meta) =>
                  formatOptionWithImage_Smaller(opt, lang, meta)
                }
                onChange={(opt) => {
                  if (!opt) return;
                  setTempEcho((p) => {
                    if (!p) return p;
                    return { ...p, setId: opt.value };
                  });
                }}
                value={HARMONY_DROP_OPTION.find(item => item.value === tempEcho.setId) ?? null}
                />
              <Select options={EchoOption}
                styles={STAT_DROP_STYLE_LARGE}
                placeholder={
                  <div style={{ display: "flex", alignItems: "center", gap: "min(0.5vw, 0.5rem)" }}>
                    <img
                      style={{
                        width: "auto",
                        height: "min(2vw, 2rem)",
                        aspectRatio: "1/1",
                      }}
                      src="/default.webp"
                    />
                    <span style={{ whiteSpace: "nowrap", fontSize: "min(1vw, 1rem)" }}>
                      {localeText.echoSearch}
                    </span>
                  </div>
                }
                isClearable={true}
                formatOptionLabel={(opt, meta) =>
                  formatOptionWithImage(opt, lang, meta)
                }
                onChange={(opt) => {
                  setTempEcho((p) => {
                    if (!p) return p;
                    return { ...p, echoId: opt?.value ?? null };
                  });
                }}
                value={EchoOption.find(item => item.value === tempEcho.echoId) ?? null}
                />

              <div className="ocr-drag-select__main-stat">
                <div style={{ width: "70%" }}>
                  <Select options={(() => {
                      switch (tempEcho?.cost) {
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
                    styles={STAT_DROP_STYLE_LARGE}
                    formatOptionLabel={(opt, meta) =>
                      formatOptionWithImage_Smaller(opt, lang, meta)
                    }
                    onChange={(opt) => {
                      if (!opt) return;
                      setTempEcho((p) => {
                        if (!p) return p;
                        return {
                          ...p,
                          mainOption: {
                            statId: opt.value,
                            statValue: getMainStatValue(opt.value, p.cost),
                          },
                        };
                      });
                    }}
                  />
                </div>
                <span className="num-font" style={{ marginLeft: "auto" }}>
                  {formatStatValue(
                    tempEcho.mainOption.statId,
                    tempEcho.mainOption.statValue ?? 0,
                  )}
                </span>
              </div>

              <div className="ocr-drag-select__sub-fields">
                {displayItems.map((item, displayIndex) => (
                  <OcrDragItem
                    key={item.id}
                    item={tempEcho.subOptions[item.id]}
                    itemId={item.id}
                    displayIndex={displayIndex}
                    onSelectChange={setTempEcho}
                    styles={DragOptions}
                    options={[STAT_OPTION_SUB, dropStatOptions[displayIndex]]}
                  />
                ))}
              </div>

              <button className="ocr-drag-select__apply-button"
                type="button"
                onClick={handleApplyData}
              >
                {localeText.applyData}
              </button>
            </div>
          </div>
        </SortableContext>
      </DndContext>
    </div>
  );
}

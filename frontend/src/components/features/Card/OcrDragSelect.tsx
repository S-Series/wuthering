import { useEffect, useMemo, useState } from "react";
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

import { echoDict, type EchoData, type EchoId } from "@/datas/echos";
import { FixedStats, type StatId } from "@/datas/stats";
import { useAppStore, type LangType } from "@/stores/appStore";

import { OcrDragItem } from "./OcrDragItem";

import "./OcrDragSelect.override.css"
import Select, { type StylesConfig } from "react-select";
import { useCharacter } from "@/stores/characterDataStore";
import { formatOptionWithImage, formatOptionWithImage_Smaller, getStatDropStyleOptionWide, getStatDropStyleLarge, HARMONY_OPTIONS_BASE, getEchoOptionBase, getStatOptionBase, getStatDropStyleDrag } from "./EchoSelect.helper";
import { useStyleStore } from "@/stores/styleStore";
import type { Cost, SelectOpt, SelectOption, SelectOptionStatOriginal, SelectOptionWithImage, SelectOriginalOption } from "./EchoSelect.type";
import { createEmptyEchoRuntime, type EchoRuntime, type EchoStatOption, type EchoStatOptionSub } from "@/runtime/echo.runtime";
import { patchEchoAt } from "@/runtime/characterData.helpers";

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
  height: number;
  resetAction: () => void;
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

export default function OcrDragSelect({ datas, selectIdx, height, resetAction }: Props) {
  const baseUrl = import.meta.env.VITE_IMAGE_BASE;
  const { lang, imgVer } = useAppStore();
  const { baseSelectStyles } = useStyleStore();
  const { characterData, patchCharacterData } = useCharacter();

  const [sourceItems, setSourceItems] = useState<DragItem[]>([]);
  const [itemOrder, setItemOrder] = useState<number[]>(DEFAULT_ORDER);

  const [tempEcho, setTempEcho] = useState<EchoRuntimeWith7Subs>(InitTempEcho());

  const sensors = useSensors(
    useSensor(PointerSensor, {
      activationConstraint: { distance: 6 },
    })
  );

  useEffect(() => {
    const nextStats: EchoStatOption[] = (datas?.stats ?? []).map(
      ([statId, statValue]) => ({
        statId,
        statValue,
      })
    );

    console.log(datas)

    const tempEchoData: EchoRuntimeWith7Subs = {
      echoId: datas.echoId,
      setId: null,
      cost: datas.cost,
      mainOption: { 
        statId: datas?.stats?.[0]?.[0] ?? "dummy",
        statValue: datas?.stats?.[0]?.[1] ?? 0
      },
      subOptions: [{
        statId: datas?.stats?.[2]?.[0] ?? "dummy",
        statValue: datas?.stats?.[2]?.[1] ?? 0
      },{
        statId: datas?.stats?.[3]?.[0] ?? "dummy",
        statValue: datas?.stats?.[3]?.[1] ?? 0
      },{
        statId: datas?.stats?.[4]?.[0] ?? "dummy",
        statValue: datas?.stats?.[4]?.[1] ?? 0
      },{
        statId: datas?.stats?.[5]?.[0] ?? "dummy",
        statValue: datas?.stats?.[5]?.[1] ?? 0
      },{
        statId: datas?.stats?.[6]?.[0] ?? "dummy",
        statValue: datas?.stats?.[6]?.[1] ?? 0
      },{
        statId: datas?.stats?.[7]?.[0] ?? "dummy",
        statValue: datas?.stats?.[7]?.[1] ?? 0
      },{
        statId: datas?.stats?.[8]?.[0] ?? "dummy",
        statValue: datas?.stats?.[8]?.[1] ?? 0
      }]
    }

    setTempEcho(tempEchoData);
    setSourceItems(createItems(nextStats, lang));
    setItemOrder(DEFAULT_ORDER);
  }, [datas.echoId, datas.cost, datas.stats, lang]);

  const displayItems = useMemo(() => {
    console.log(toEchoRuntime(tempEcho, itemOrder));
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

  const DragOptions: [StylesConfig<any, false>, StylesConfig<any, false>] = [
    (() => getStatDropStyleDrag(baseSelectStyles, height, true))(),
    (() => getStatDropStyleDrag(baseSelectStyles, height, false))(),
  ];

  const STAT_DROP_STYLE_LARGE = useMemo<StylesConfig<any, false>>(
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
  }, [tempEcho])

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
  }, [lang, tempEcho])

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
  }, [lang, tempEcho]);

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
            <Select options={COST_DROP_OPTION}
              styles={STAT_DROP_STYLE_LARGE}
              onChange={(opt) => {
                if (!opt) return;
                setTempEcho((p) => {
                  if (!p) return p;
                  return { ...p, cost: opt.value };
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
                  <span style={{ whiteSpace: "nowrap", fontSize: "min(1vw, 1rem)" }}>에코명으로 검색</span>
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

            <div className="divider" />

            <div style={{ display: "flex", alignItems: "center" }}>
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
                      return { ...p, mainOption:{ statId: opt.value, statValue: 0 } };
                    });
                  }}
                />
              </div>
              <span className="num-font" style={{ marginLeft: "auto" }}>
                {tempEcho.mainOption.statValue ?? 0}.0%
              </span>
            </div>

            <div className="divider" />

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
        </SortableContext>
      </DndContext>

      <button className="ocr-drag-select__apply-button"
        type="button"
        onClick={() => {
          console.log(selectIdx);
          const echoData = toEchoRuntime(tempEcho, itemOrder);
          patchCharacterData(patchEchoAt(characterData, selectIdx as 0 | 1 | 2 | 3 | 4 | 5 | 6 | 7 | 8 | 9, echoData))
          setTempEcho(InitTempEcho());
        }}
      >
        데이터 적용
      </button>
    </div>
  );
}
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

import { EchoOcrSubstatItem } from "./EchoOcrSubstatItem";
import EchoOcrTargetPreview from "./EchoOcrTargetPreview";

import "./EchoOcrResultEditor.css"
import Select, { type StylesConfig } from "react-select";
import { useCharacter } from "@/stores/characterDataStore";
import { formatOptionWithImage, formatOptionWithImage_Smaller, HARMONY_OPTIONS_BASE, getEchoOptionBase, getStatOptionBase, getStatDropStyleDrag } from "../echoOptions.helpers";
import { useStyleStore } from "@/stores/styleStore";
import type { Cost, SelectOpt, SelectOption, SelectOptionStatOriginal, SelectOptionWithImage } from "../echoOptions.types";
import { createEmptyEchoRuntime, type EchoRuntime, type EchoStatOption } from "@/runtime/echo.runtime";
import { patchEchoAt } from "@/runtime/characterData.helpers";
import { locale } from "@/locales/locale";
import { ResetScrollMenuList } from "@/components/common/ResetScrollMenuList";
import type { HarmonyId } from "@/datas/harmonies";

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
    setId?: HarmonyId | null;
  };
  selectIdx: number;
  resetAction: () => void;
  inputSlot?: ReactNode;
  resultSlot?: ReactNode;
};

const DEFAULT_ORDER = [0, 1, 2, 3, 4];

function createItems(data: EchoStatOption[] | null, lang: LangType): DragItem[] {
  const stats = data ?? [];
  const fixedStats = Object.values(FixedStats);

  return Array.from({ length: 5 }, (_, index) => {
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

function getRecognizedSubStats(stats: [StatId, number][] | null) {
  if (!stats) return [];

  return stats.length > 5
    ? stats.slice(2, 7)
    : stats.slice(0, 5);
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

export default function EchoOcrResultEditor({
  datas,
  selectIdx,
  resetAction,
  inputSlot,
  resultSlot,
}: Props) {
  const baseUrl = import.meta.env.VITE_IMAGE_BASE;
  const { cost, echoId, stats, setId } = datas;
  const { lang, imgVer } = useAppStore();
  const { baseSelectStyles } = useStyleStore();
  const { characterData, equipmentScore, patchCharacterData } = useCharacter();
  const localeText = locale(lang).card;

  const [sourceItems, setSourceItems] = useState<DragItem[]>([]);
  const [itemOrder, setItemOrder] = useState<number[]>(DEFAULT_ORDER);

  const [tempEcho, setTempEcho] = useState<EchoRuntime>(() => createEmptyEchoRuntime(4));

  const sensors = useSensors(
    useSensor(PointerSensor, {
      activationConstraint: { distance: 6 },
    })
  );

  useEffect(() => {
    const recognizedSubStats = getRecognizedSubStats(stats);
    const nextStats: EchoStatOption[] = recognizedSubStats.map(
      ([statId, statValue]) => ({
        statId,
        statValue,
      })
    );
    const hasFullEchoRows = (stats?.length ?? 0) > 5; 

    const tempEchoData: EchoRuntime = {
      echoId,
      setId: setId ?? null,
      cost,
      mainOption: {  
        statId: hasFullEchoRows ? stats?.[0]?.[0] ?? "dummy" : "dummy",
        statValue: hasFullEchoRows ? stats?.[0]?.[1] ?? 0 : 0,
      },
      subOptions: Array.from({ length: 5 }, (_, index) => ({
        statId: recognizedSubStats[index]?.[0] ?? FixedStats.dummy.id,
        statValue: recognizedSubStats[index]?.[1] ?? 0,
      })) as EchoRuntime["subOptions"],
    }

    // eslint-disable-next-line react-hooks/set-state-in-effect
    setTempEcho(tempEchoData);
    setSourceItems(createItems(nextStats, lang));
    setItemOrder(DEFAULT_ORDER);
  }, [echoId, cost, stats, setId, lang]);

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

  const DragOptions = useMemo(
    (): [StylesConfig<SelectOptionStatOriginal<StatId>, false>, StylesConfig<SelectOpt, false>] => [
      getStatDropStyleDrag(baseSelectStyles as unknown as StylesConfig<SelectOptionStatOriginal<StatId>, false>),
      getStatDropStyleDrag(baseSelectStyles as unknown as StylesConfig<SelectOpt, false>),
    ],
    [baseSelectStyles],
  );

  const fieldStyles = useMemo(() => ({
    cost: getStatDropStyleDrag(baseSelectStyles as unknown as StylesConfig<SelectOption<Cost>, false>),
    harmony: getStatDropStyleDrag(baseSelectStyles as unknown as StylesConfig<SelectOptionWithImage<HarmonyId>, false>),
    echo: getStatDropStyleDrag(baseSelectStyles as unknown as StylesConfig<SelectOptionWithImage<EchoId>, false>),
    stat: getStatDropStyleDrag(baseSelectStyles as unknown as StylesConfig<SelectOptionStatOriginal<StatId>, false>),
  }),
    [baseSelectStyles],
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
  
  const EchoOption = useMemo<SelectOptionWithImage<EchoId>[]>(() => {
    const base = getEchoOptionBase(lang, tempEcho.cost, baseUrl)

    return base
      .filter((item) => {
        if (!item.harmonies) return true;
        if (!tempEcho.setId) return true;
        return item.harmonies.includes(tempEcho.setId)
      }).map((opt) => ({
        value: opt.value as EchoId,
        label: opt[lang],
        path: opt.path + `?v=${imgVer}`,
      }));
  }, [baseUrl, imgVer, lang, tempEcho.cost, tempEcho.setId])

  const HARMONY_DROP_OPTION = useMemo<SelectOptionWithImage<HarmonyId>[]>(() => {
    const types = tempEchoData?.type ?? [];
    if (types.length === 0) return HARMONY_OPTIONS_BASE.map((opt) => ({
      ...opt,
      value: opt.value as HarmonyId,
      label: opt[lang],
    }));

    return HARMONY_OPTIONS_BASE
      .filter((opt) => types.includes(opt.value as HarmonyId))
      .map((opt) => ({
        ...opt,
        value: opt.value as HarmonyId,
        label: opt[lang],
      }));
  }, [lang, tempEchoData?.type]);

  const STAT_OPTION_BASE = useMemo<SelectOptionStatOriginal<StatId>[]>(() =>
    getStatOptionBase(lang, characterData.characterId)
    , [lang, characterData.characterId])

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
    }) as [SelectOpt[], SelectOpt[], SelectOpt[], SelectOpt[], SelectOpt[]];
  }, [tempEcho])

  const handleApplyData = () => {
    const echoData: EchoRuntime = {
      ...tempEcho,
      subOptions: itemOrder.map((idx) => tempEcho.subOptions[idx]) as EchoRuntime["subOptions"],
    };
    patchCharacterData(
      patchEchoAt(
        characterData,
        selectIdx as 0 | 1 | 2 | 3 | 4 | 5 | 6 | 7 | 8 | 9,
        echoData,
      ),
    );
    setTempEcho(createEmptyEchoRuntime(4));
    resetAction();
  };

  return (
    <div className="echo-ocr-result-editor">
      <div className="echo-ocr-result-editor__target-preview">
        <EchoOcrTargetPreview
          baseUrl={baseUrl}
          echoData={characterData.echoData[selectIdx]}
          score={equipmentScore?.[selectIdx] ?? [0, 0]}
          slotNumber={selectIdx + 1}
        />
      </div>

      <div className="echo-ocr-result-editor__image-fields">
        {inputSlot}
        {resultSlot}
      </div>

      <div className="echo-ocr-result-editor__editor-fields">
        <div className="echo-ocr-result-editor__base-fields">
          <Select
            options={COST_DROP_OPTION}
            styles={fieldStyles.cost}
            components={{ MenuList: ResetScrollMenuList }}
            menuPortalTarget={document.body}
            menuPosition="fixed"
            menuShouldScrollIntoView={false}
            isSearchable={false}
            value={COST_DROP_OPTION.find((option) => option.value === tempEcho.cost)}
            onChange={(option) => {
              if (!option) return;
              setTempEcho((prev) => ({
                ...prev,
                cost: option.value,
                echoId: null,
                setId: null,
                mainOption: { statId: "dummy", statValue: 0 },
              }));
            }}
          />
          <Select
            options={HARMONY_DROP_OPTION}
            styles={fieldStyles.harmony}
            components={{ MenuList: ResetScrollMenuList }}
            menuPortalTarget={document.body}
            menuPosition="fixed"
            menuShouldScrollIntoView={false}
            isClearable
            isSearchable={false}
            placeholder="하모니 선택"
            formatOptionLabel={(option) => formatOptionWithImage_Smaller(option, lang, "11px")}
            value={HARMONY_DROP_OPTION.find((option) => option.value === tempEcho.setId) ?? null}
            onChange={(option) => setTempEcho((prev) => ({ ...prev, setId: option?.value ?? null }))}
          />
          <Select
            options={EchoOption}
            styles={fieldStyles.echo}
            components={{ MenuList: ResetScrollMenuList }}
            menuPortalTarget={document.body}
            menuPosition="fixed"
            menuShouldScrollIntoView={false}
            isClearable
            isSearchable
            placeholder={localeText.echoSearch}
            formatOptionLabel={(option) => formatOptionWithImage(option, lang, "11px")}
            value={EchoOption.find((option) => option.value === tempEcho.echoId) ?? null}
            onChange={(option) => setTempEcho((prev) => ({ ...prev, echoId: option?.value ?? null }))}
          />
          <div className="echo-ocr-result-editor__main-stat">
            <Select
              options={tempEcho.cost === 4 ? STAT_OPTION_MAIN_COST4 : tempEcho.cost === 3 ? STAT_OPTION_MAIN_COST3 : STAT_OPTION_MAIN_COST1}
              styles={fieldStyles.stat}
              components={{ MenuList: ResetScrollMenuList }}
              menuPortalTarget={document.body}
              menuPosition="fixed"
              menuShouldScrollIntoView={false}
              isSearchable={false}
              placeholder="주옵션"
              value={STAT_OPTION_BASE.find((option) => option.value === tempEcho.mainOption.statId) ?? null}
              onChange={(option) => {
                if (!option) return;
                setTempEcho((prev) => ({
                  ...prev,
                  mainOption: { statId: option.value, statValue: getMainStatValue(option.value, prev.cost) },
                }));
              }}
            />
            <span className="num-font">{tempEcho.mainOption.statValue || "-"}</span>
          </div>
        </div>

        <DndContext sensors={sensors} collisionDetection={closestCenter} onDragEnd={handleDragEnd}>
          <SortableContext items={itemOrder} strategy={verticalListSortingStrategy}>
            <div className="echo-ocr-result-editor__sub-fields" aria-label="부옵션 순서">
              {displayItems.map((item, displayIndex) => (
                <EchoOcrSubstatItem
                  key={item.id}
                  item={tempEcho.subOptions[item.id]}
                  itemId={item.id}
                  displayIndex={displayIndex}
                  options={[STAT_OPTION_SUB, dropStatOptions[item.id]]}
                  styles={DragOptions}
                  onSelectChange={setTempEcho}
                />
              ))}
            </div>
          </SortableContext>
        </DndContext>

        <button
          type="button"
          className="echo-ocr-result-editor__apply-button"
          onClick={handleApplyData}
          disabled={!tempEcho.echoId || !tempEcho.setId || tempEcho.mainOption.statId === "dummy"}
        >
          데이터 적용
        </button>
      </div>
    </div>
  )
}

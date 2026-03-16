import { useEffect, useMemo, useRef, useState } from "react";
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

import { useAppStore, type LangType } from "@/stores/appStore";
import { useCharacter } from "@/stores/characterDataStore";

import { OcrDragSelectItem } from "./OcrDragSelectItem";

import { FixedStats, type StatId } from "@/datas/stats";

import { getStatDropStyleLarge, getStatDropStyleOptionWide, getStatDropStyleDrag, getStatOptionBase, getEchoOptionBase, formatOptionWithImage } from "./EchoSelect.helper";
import type { SelectOpt, SelectOptionStatOriginal } from "./EchoSelect.type";

import "./EchoDragSelect.css";
import "./OcrDragSelect.override.css"
import { useStyleStore } from "@/stores/styleStore";
import type { StylesConfig } from "react-select";
import { createEmptyEchoRuntime, type EchoRuntime, type EchoStatOption } from "@/runtime/echo.runtime";
import { patchEchoAt, patchEchoMainOption } from "@/runtime/characterData.helpers";
import Select from "react-select";
import type { EchoId } from "@/datas/echos";

export type DragItem = {
  id: number;
  statId: StatId;
  statValue: number;
  statName: string | null;
};

const createItems = (data: EchoStatOption[] | null, lang: LangType): DragItem[] => {
  const names = Object.values(FixedStats);

  const sliced = data?.slice(2) ?? [];

  return Array.from({ length: 7 }, (_, index) => {
    const stat = sliced[index];

    return {
      id: index,
      statId: stat?.statId ?? null,
      statValue: stat?.statValue ?? null,
      statName: stat
        ? names.find(item => item.id === stat.statId)?.[lang] ?? null
        : null,
    };
  });
};

type Props = {
  datas: {
    cost: 4 | 3 | 1,
    echoId: EchoId | null,
    stats: [StatId, number][] | null,
  },
  selectIdx: 0 | 1 | 2 | 3 | 4 | 5 | 6 | 7 | 8 | 9;
}

export default function OcrSelectDrag({ datas, selectIdx }: Props) {
  const { lang } = useAppStore();
  const { characterData, patchCharacterData } = useCharacter();
  const { baseSelectStyles } = useStyleStore();

  const BASE_URL = import.meta.env.VITE_IMAGE_BASE;

  const DragRef = useRef(null);

  const [items, setItems] = useState<DragItem[]>([]);
  const [height, setHeight] = useState(0);

  const [echoData, setEchoData] = useState<EchoRuntime>(createEmptyEchoRuntime(4));
  const [statData, setStatData] = useState<EchoStatOption[]>([]);

  const sensors = useSensors(
    useSensor(PointerSensor, {
      activationConstraint: {
        distance: 6,
      },
    })
  );

  const handleDragEnd = (event: DragEndEvent) => {
    const { active, over } = event;

    if (!over || active.id === over.id) return;

    setItems((prev) => {
      const oldIndex = prev.findIndex((item) => item.id === active.id);
      const newIndex = prev.findIndex((item) => item.id === over.id);

      const next = arrayMove(prev, oldIndex, newIndex);

      const order0Based = next.map((item) => item.id);
      return next;
    });
  };

  const styles: StylesConfig<any, false>[] = [
    getStatDropStyleDrag(baseSelectStyles, height, true),
    getStatDropStyleDrag(baseSelectStyles, height, false),
    getStatDropStyleOptionWide(baseSelectStyles, height),
    getStatDropStyleLarge(baseSelectStyles, height),
  ]

  const COST_DROP_OPTION = [
    { value: 4, label: "Cost 4" },
    { value: 3, label: "Cost 3" },
    { value: 1, label: "Cost 1" },
  ]

  const statOptionBase = useMemo<SelectOptionStatOriginal[]>(
    () => getStatOptionBase(lang, characterData.characterId).filter(
      (opt) => opt.subValue.length !== 0
    ), [lang, characterData.characterId]
  )

  const mainStatOptionBase = useMemo<SelectOptionStatOriginal[]>(() => {
    const cost = 4;
    const index = cost === 4 ? 0 : cost === 3 ? 1 : 2;

    return getStatOptionBase(lang, characterData.characterId).filter(
      (opt) => opt.mainValue[index] > 0
    )}, [lang, characterData.characterId]
  )

  const statSelectOption = useMemo(() => {
    return items.map((item) => { 
      const id: StatId = item.statId;

      if (!item.statId) return [];

      return FixedStats[id].ValueSub.map((value) => ({
        value,
        label: String(value),
      }));
    }) as SelectOpt[][]
  }, [items, statData])

  const mainStatSelectOption = useMemo(() => {

  }, [mainStatOptionBase]) 

  const ECHO_ID_OPTION_BASE = useMemo(() =>
      getEchoOptionBase(lang, echoData.cost, BASE_URL)
      , [lang, echoData.cost]);


  useEffect(() => {
    if (!DragRef.current) return;

    const observer = new ResizeObserver((entries) => {
      const entry = entries[0];
      setHeight(entry.contentRect.height);
    });

    observer.observe(DragRef.current);

    return () => {
      observer.disconnect();
    };
  }, []);
  
  useEffect(() => {
    const nextStats: EchoStatOption[] = (datas?.stats ?? []).map(
      ([statId, statValue]) => ({
        statId,
        statValue,
      }));
    setStatData(nextStats);
    setItems(createItems(nextStats, lang));
    setEchoData((p) => ({
      ...p, 
      cost: datas?.cost, 
      echoId: datas?.echoId ?? null,
      mainOption: nextStats[0] ?? ["dummy", 0],
    }));
  }, [datas])

  useEffect(() => console.log("items: ", items), [items]);
  useEffect(() => console.log("echos: ", echoData), [echoData]);

  return (
    <>
      <div ref={DragRef} className="stat-drag-select">
        <div style={{ display: "flex", width: "100%", justifyContent: "space-between" }}>
          <div style={{width: "42.5%"}}>
            <Select options={COST_DROP_OPTION}
              styles={styles[2]}
              menuPlacement="auto"
              menuPosition="fixed"
              minMenuHeight={200}
              menuShouldScrollIntoView={false}
              value={COST_DROP_OPTION.find((e) => e.value === echoData.cost)}
              onChange={(opt) => setEchoData((prev) => ({...prev, cost: opt.value}))}
            />
          </div>
          
          <div style={{width: "55%"}}>
            <Select options={mainStatOptionBase}
              styles={styles[2]}
              menuPlacement="auto"
              menuPosition="fixed"
              minMenuHeight={200}
              menuShouldScrollIntoView={false}
              value={mainStatOptionBase.find((e) => e.value === echoData.mainOption.statId)}
              onChange={(opt) => setEchoData((prev) => ({...prev, mainOption: {
                statId: opt.value,
                  statValue: (() => {
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
              }}))}
            />
          </div>
          
        </div>

        <div style={{ display: "flex", width: "100%" }}>
          <div style={{width: "100%"}}>
          <Select options={ECHO_ID_OPTION_BASE}
            formatOptionLabel={(opt, meta) => formatOptionWithImage(opt, lang, meta)}
            styles={styles[3]}
            menuPlacement="auto"
            menuPosition="fixed"
            minMenuHeight={200}
            menuShouldScrollIntoView={false}
            value={ECHO_ID_OPTION_BASE.find((e) => e.value === echoData.echoId)}
            onChange={(opt) => setEchoData((prev) => ({...prev, echoId: opt.value}))}
          />
          </div>
        </div> 

        <DndContext
          sensors={sensors}
          collisionDetection={closestCenter}
          onDragEnd={handleDragEnd}
        >
          <SortableContext
            items={items.map((item) => item.id)}
            strategy={verticalListSortingStrategy}
          >
            <div className="stat-drag-list">
              {items.map((item, index) => (
                <OcrDragSelectItem key={item.id}
                  item={item}
                  index={index}
                  styles={[styles[0], styles[1]]}
                  options={[statOptionBase, statSelectOption?.[index] ?? []]}
                  onSelectChange={setItems} />
              ))}
            </div>
          </SortableContext>
        </DndContext>
      </div>

      <button className="ocr-drag-select-apply-button"
        onClick={() => {
          const changed: EchoStatOption[] = items
            .filter(
              (item): item is DragItem & { statId: StatId; statValue: number } =>
                item.statId !== null && item.statValue !== null
            )
            .map((item) => ({
              statId: item.statId,
              statValue: item.statValue,
            }));

          console.log(changed);

          setEchoData((prev) => {
            return { ...prev, subOptions: [
              changed[0] ?? {statId: "dummy", statValue: 0},
              changed[1] ?? {statId: "dummy", statValue: 0},
              changed[2] ?? {statId: "dummy", statValue: 0},
              changed[3] ?? {statId: "dummy", statValue: 0},
              changed[4] ?? {statId: "dummy", statValue: 0},
            ] }
          })
          patchCharacterData(patchEchoAt(characterData, selectIdx, echoData))
        }}>
        <span> asdf </span>
      </button>
    </>
  );
}
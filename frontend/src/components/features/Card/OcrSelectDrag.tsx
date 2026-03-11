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

import { getStatDropStyleDrag, getStatOptionBase } from "./EchoSelect.helper";
import type { SelectOpt, SelectOptionStatOriginal } from "./EchoSelect.type";

import "./EchoDragSelect.css";
import "./OcrSelectDrag.override.css"
import { useStyleStore } from "@/stores/styleStore";
import type { StylesConfig } from "react-select";
import { createEmptyEchoRuntime, type EchoRuntime } from "@/runtime/echo.runtime";
import { patchEchoAt, patchEchoMainOption } from "@/runtime/characterData.helpers";

type DragItem = {
  id: number;
  statId: StatId;
  statValue: number;
  statName: string | null;
};

const createItems = (data: [StatId, number][] | null, lang: LangType): DragItem[] => {
  const names = Object.values(FixedStats);

  if (!data) return [];

  const sliced = data.slice(2);

  return sliced.map((_, index) => ({
    id: index,
    statId: sliced[index]?.[0],
    statValue: sliced[index]?.[1],
    statName: names.find(item => item.id === sliced[index][0])?.[lang] ?? null,
  }));
};

type Props = {
  datas: {
    stats: [StatId, number][] | null
  },
  selectIdx: 0 | 1 | 2 | 3 | 4 | 5 | 6 | 7 | 8 | 9;
}

export default function OcrSelectDrag({ datas, selectIdx }: Props) {
  const { lang } = useAppStore();
  const { characterData, patchCharacterData } = useCharacter();
  const { baseSelectStyles } = useStyleStore();

  const [items, setItems] = useState<DragItem[]>([]);
  const [height, setHeight] = useState(0);

  const [echoData, setEchoData] = useState<EchoRuntime>(createEmptyEchoRuntime(4));

  const DragRef = useRef(null);

  useEffect(() => {
    setItems(createItems(datas?.stats, lang))
  }, [datas])

  useEffect(() => console.log(echoData), [echoData]);

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

      return arrayMove(prev, oldIndex, newIndex);
    });
  };

  const STYLES: [StylesConfig<any, false>, StylesConfig<any, false>] = [
    getStatDropStyleDrag(baseSelectStyles, height, true),
    getStatDropStyleDrag(baseSelectStyles, height, false),
  ]

  const STAT_OPTION_BASE = useMemo<SelectOptionStatOriginal[]>(
    () => getStatOptionBase(lang, characterData.characterId).filter(
      (opt) => opt.subValue.length !== 0
    ), [lang, characterData.characterId]
  )

  const StatSelectOption = useMemo(() => {
    if (!datas) return [];
    if (!datas.stats) return [];
    const sliced = datas?.stats?.slice(2);

    return sliced?.map((item) => {
      const id: StatId = item[0];

      return FixedStats[id].ValueSub.map((value) => ({
        value,
        label: String(value),
      }));
    }) as SelectOpt[][]
  }, [datas])

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

  return (
    <>
      <div ref={DragRef} className="stat-drag-select">
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
                  styles={STYLES}
                  options={[STAT_OPTION_BASE, StatSelectOption?.[index] ?? []]}
                  onSelectChange={setEchoData} />
              ))}
            </div>
          </SortableContext>
        </DndContext>
      </div>
      <button className="ocr-drag-select-apply-button"
        onClick={() => {
          console.log("assdf")
          patchCharacterData(patchEchoAt(characterData, selectIdx, echoData))
        }}>
        <span> asdf </span>
      </button>
    </>
  );
}
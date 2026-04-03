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

import type { EchoId } from "@/datas/echos";
import { FixedStats, type StatId } from "@/datas/stats";
import { useAppStore, type LangType } from "@/stores/appStore";

import { OcrDragItem } from "./OcrDragItem";

import "./OcrDragSelect.override.css"
import Select from "react-select/base";

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
  resetAction: () => void;
};

type EchoStatOption = {
  statId: StatId;
  statValue: number;
};

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

export default function OcrDragSelect({
  datas,
  selectIdx,
  resetAction,
}: Props) {
  const { lang } = useAppStore();

  const [sourceItems, setSourceItems] = useState<DragItem[]>([]);
  const [itemOrder, setItemOrder] = useState<number[]>(DEFAULT_ORDER);

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

    setSourceItems(createItems(nextStats, lang));
    setItemOrder(DEFAULT_ORDER);
  }, [datas, lang]);

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
            <Select/>
            <Select/>
            <Select/>
            {displayItems.map((item, displayIndex) => (
              <OcrDragItem
                key={item.id}
                item={item}
                itemId={item.id}
                displayIndex={displayIndex}
                onSelectChange={setSourceItems}
                styles={[{} as any, {} as any]}
                options={[[], []]}
              />
            ))}
          </div>
        </SortableContext>
      </DndContext>

      <button
        type="button"
        onClick={() => {
          console.log("sourceItems:", sourceItems);
          console.log("itemOrder:", itemOrder);
          console.log("displayItems:", displayItems);
          console.log("selectIdx:", selectIdx);
          resetAction();
        }}
      >
        확인
      </button>
    </div>
  );
}
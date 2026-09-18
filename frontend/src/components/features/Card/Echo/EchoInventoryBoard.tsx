import React, { useMemo, type ReactNode } from "react";
import {
  DndContext,
  closestCenter,
  MouseSensor,
  TouchSensor,
  useSensor,
  useSensors,
  type DragEndEvent,
} from "@dnd-kit/core";
import {
  SortableContext,
  rectSortingStrategy,
  arrayMove,
} from "@dnd-kit/sortable";

import "./EchoInventoryBoard.css";
import { useCharacter } from "@/stores/characterDataStore";
import type { EchoRuntime } from "@/runtime/echo.runtime";
import { ECHO_CANDIDATES } from "@/datas/echos";
import { useAppStore, type LangType } from "@/stores/appStore";
import { setEchoDataIndexes } from "@/runtime/characterData.helpers";
import type { ScoreList } from "@/types/character.type";
import EchoInventoryItem, { type EchoInventoryItemData } from "./EchoInventoryItem";

const createItems = (
  num: number,
  data: EchoRuntime[] | null,
  scores: ScoreList,
  lang: LangType
): EchoInventoryItemData[] => {
  const names = ECHO_CANDIDATES[lang];

  return Array.from({ length: 10 }, (_, index) => ({
    id: index,
    num: num,
    echoName: names.find(item => item.echoId === data?.[index].echoId)?.text ?? null,
    src: `${data?.[index].echoId}.webp`,
    cvScore: scores[index]?.[0] ?? 0,
    avScore: scores[index]?.[1] ?? 0,
  }));
};

const reOrderItems = (order: number[], items: EchoInventoryItemData[]) => {
  return order.map(id => items.find(v => v.id === id)!)
}

type EchoIndexTuple =
  [number, number, number, number, number,
    number, number, number, number, number];

function assertEchoIndexTuple(arr: number[]): asserts arr is EchoIndexTuple {
  if (arr.length !== 10) {
    throw new Error("Echo index must have length 10");
  }
}

type Props = {
  num: number;
  onClick?: React.Dispatch<React.SetStateAction<0 | 1 | 2 | 3 | 4 | 5 | 6 | 7 | 8 | 9>>;
  ocrPanel?: ReactNode;
}

export default function EchoInventoryBoard({ num, onClick, ocrPanel }: Props) {
  const { lang } = useAppStore();
  const { characterData, equipmentScore, patchCharacterData } = useCharacter();
  const BASE_URL = import.meta.env.VITE_IMAGE_BASE;
  const items = useMemo(
    () => reOrderItems(
      characterData.echoDataIndex,
      createItems(num, characterData.echoData, equipmentScore, lang),
    ),
    [num, characterData.echoData, characterData.echoDataIndex, lang, equipmentScore],
  );

  const patchEchoDataIndexes = (nextIndexes: number[]) => {
    assertEchoIndexTuple(nextIndexes);

    patchCharacterData(
      setEchoDataIndexes(characterData, nextIndexes)
    );
  };

  const sensors = useSensors(
    useSensor(MouseSensor, {
      activationConstraint: {
        distance: 6,
      },
    })
  );

  const handleDragEnd = (event: DragEndEvent) => {
    const { active, over } = event;

    if (!over || active.id === over.id) return;

    const oldIndex = items.findIndex((item) => item.id === active.id);
    const newIndex = items.findIndex((item) => item.id === over.id);

    const nextItems = arrayMove(items, oldIndex, newIndex);
    const nextIndexes = nextItems.map((item) => item.id);

    patchEchoDataIndexes(nextIndexes);
  };

  return (
    <div className="echo-inventory-board">
      <DndContext
        sensors={sensors}
        collisionDetection={closestCenter}
        onDragEnd={handleDragEnd}
      >
        <SortableContext
          items={items.map((item) => item.id)}
          strategy={rectSortingStrategy}
        >
          <div className="echo-drag-board">
            <span className="echo-drag-row-label equipped">착용</span>
            <span className="echo-drag-row-label spare">예비슬롯</span>
            <div className="echo-drag-list">
              {items.map((item) => (
                <EchoInventoryItem
                  key={item.id}
                  baseUrl={BASE_URL}
                  item={item}
                  index={item.id}
                  onSelect={(index) => onClick?.(index as 0 | 1 | 2 | 3 | 4 | 5 | 6 | 7 | 8 | 9)}
                />
              ))}
            </div>
          </div>
        </SortableContext>
      </DndContext>

      <div className="echo-ocr-board">
        {ocrPanel}
      </div>
    </div>
  );
}

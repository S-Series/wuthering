import React, { useEffect, useState } from "react";
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
  useSortable,
  rectSortingStrategy,
  arrayMove,
} from "@dnd-kit/sortable";
import { CSS } from "@dnd-kit/utilities";

import "./EchoDragSelect.css";
import { useCharacter } from "@/stores/characterDataStore";
import type { EchoRuntime } from "@/runtime/echo.runtime";
import { ECHO_CANDIDATES } from "@/datas/echos";
import { useAppStore, type LangType } from "@/stores/appStore";
import { setEchoDataIndexes } from "@/runtime/characterData.helpers";
import { getEquipmentRank } from "@/types/character.type";
import type { ScoreList } from "@/types/character.type";
import { FixedStats, type StatId } from "@/datas/stats";

type DragItem = {
  id: number;
  num: number;
  echoName: string | null;
  src: string[];
  label: EchoRuntime | null;
};

const createItems = (
  num: number,
  data: EchoRuntime[] | null,
  scores: ScoreList,
  lang: LangType
): DragItem[] => {
  const names = ECHO_CANDIDATES[lang];

  return Array.from({ length: 10 }, (_, index) => ({
    id: index,
    num: num,
    echoName: names.find(item => item.echoId === data?.[index].echoId)?.text ?? null,
    src: [`${data?.[index].echoId}.webp`, `${getEquipmentRank(scores?.[Math.abs(index)][1] ?? 0)}.png`],
    label: null,
  }));
};

const reOrderItems = (order: number[], items: DragItem[]) => {
  return order.map(id => items.find(v => v.id === id)!)
}

type SortableItemProps = {
  baseUrl: string;
  num: number;
  item: DragItem;
  index: number;
  onClick?: React.Dispatch<React.SetStateAction<0 | 1 | 2 | 3 | 4 | 5 | 6 | 7 | 8 | 9>>;
};

type EchoIndexTuple =
  [number, number, number, number, number,
    number, number, number, number, number];

function assertEchoIndexTuple(arr: number[]): asserts arr is EchoIndexTuple {
  if (arr.length !== 10) {
    throw new Error("Echo index must have length 10");
  }
}

const PERCENT_STAT_KEYS = ["crit", "Pct", "Bns"];

function EchoDragStat({
  statId,
  value,
  muted = false,
}: {
  statId: StatId | string;
  value: number;
  muted?: boolean;
}) {
  const displayValue = value === -1
    ? "- - -"
    : `${Number.isInteger(value) ? value.toFixed(0) : value.toFixed(1)}${
      PERCENT_STAT_KEYS.some((key) => statId.includes(key)) ? "%" : ""
    }`;

  return (
    <div className={`echo-drag-stat ${muted ? "muted" : ""}`}>
      <img
        alt="stat icon"
        src={`/ico/stats/${statId}.webp`}
        onError={(e) => {
          e.currentTarget.onerror = null;
          e.currentTarget.src = "/default.webp";
        }}
      />
      <span className="num-font">{displayValue}</span>
    </div>
  );
}

function SortableItem({ item, baseUrl, index, onClick }: SortableItemProps) {
  const {
    attributes,
    listeners,
    setNodeRef,
    transform,
    transition,
    isDragging,
  } = useSortable({ id: item.id });

  const { characterData } = useCharacter();

  const style: React.CSSProperties = {
    transform: CSS.Transform.toString(transform),
    transition,
  };

  const isSelected = characterData.echoDataIndex.slice(0, 5).includes(index);
  const isActivated = (item.num === index);
  const echoData = characterData.echoData[index];
  const costStatId = echoData?.cost === 1 ? FixedStats.hp.id : FixedStats.atk.id;
  const costStatValue = (() => {
    switch (echoData?.cost) {
      case 4: return 150;
      case 3: return 100;
      case 1: return 2280;
      default: return -1;
    }
  })();
  return (
    <div
      ref={setNodeRef}
      style={style}
      className={[
        "echo-drag-item",
        index === 0 ? "main" : "",
        isDragging ? "dragging" : "",
        isActivated ? "activated" : "",
        isSelected ? "selected" : "",
        item.echoName === null ? "disable" : ""
      ].join(" ").trim()}
      onClick={() => { if (onClick) onClick(item.id as 0 | 1 | 2 | 3 | 4 | 5 | 6 | 7 | 8 | 9); }}
      {...attributes}
      {...listeners}
    >
      <div className="hover-motion">
        <div className="echo-drag-header">
          <span className="echo-drag-label">{item.echoName ?? "Empty Slot"}</span>
        </div>

        <div className="echo-drag-image-slot">
          <img className="echo-img" src={`${baseUrl}/ico/echos/${item.src[0]}`}
            onError={(e) => {
              e.currentTarget.onerror = null;
              e.currentTarget.src = "/default.webp"
            }} />
          <img
            className="harmony-img"
            src={`/ico/harmony/${echoData?.setId}.png`}
            onError={(e) => {
              e.currentTarget.onerror = null;
              e.currentTarget.src = "/default.webp";
            }}
          />
        </div>

        <div className="echo-drag-stat-list main">
          <EchoDragStat
            statId={echoData?.mainOption.statId ?? "dummy"}
            value={echoData?.mainOption.statValue ?? -1}
          />
          <EchoDragStat statId={costStatId} value={costStatValue} muted />
        </div>

        <div className="echo-drag-stat-list sub">
          {[0, 1, 2, 3, 4].map((subIdx) => (
            <EchoDragStat
              key={`echo-drag-stat-${index}-${subIdx}`}
              statId={echoData?.subOptions[subIdx]?.statId ?? "dummy"}
              value={echoData?.subOptions[subIdx]?.statValue ?? -1}
              muted={echoData?.subOptions[subIdx]?.statId === "dummy"}
            />
          ))}
        </div>

        <div className="echo-drag-score">
          <img className="score-img" src={`/ico/rank/${item.src[1]}`} />
        </div>
      </div>
    </div>
  );
}

type Props = {
  num: number;
  onClick?: React.Dispatch<React.SetStateAction<0 | 1 | 2 | 3 | 4 | 5 | 6 | 7 | 8 | 9>>;
}

export default function EchoDragSelect({ num, onClick }: Props) {
  const { lang } = useAppStore();
  const { characterData, equipmentScore, patchCharacterData } = useCharacter();
  const [items, setItems] = useState<DragItem[]>(createItems(num, null, equipmentScore, lang));
  const BASE_URL = import.meta.env.VITE_IMAGE_BASE;

  useEffect(() => {
    setItems(
      reOrderItems(
        characterData.echoDataIndex,
        createItems(num, characterData.echoData, equipmentScore, lang)
      )
    );
  }, [num, characterData.echoData, characterData.echoDataIndex, lang, equipmentScore]);

  const patchEchoDataIndexes = (nextIndexes: number[]) => {
    assertEchoIndexTuple(nextIndexes);

    patchCharacterData(
      setEchoDataIndexes(characterData, nextIndexes)
    );
  };

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

    const oldIndex = items.findIndex((item) => item.id === active.id);
    const newIndex = items.findIndex((item) => item.id === over.id);

    const nextItems = arrayMove(items, oldIndex, newIndex);
    const nextIndexes = nextItems.map((item) => item.id);

    setItems(nextItems);
    patchEchoDataIndexes(nextIndexes);
  };

  return (
    <div className="echo-drag-select">
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
                <SortableItem key={item.id} num={num} baseUrl={BASE_URL} item={item} index={item.id} onClick={onClick} />
              ))}
            </div>
          </div>
        </SortableContext>
      </DndContext>
    </div>
  );
}

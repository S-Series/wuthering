import type { CSSProperties } from "react";
import { useSortable } from "@dnd-kit/sortable";
import { CSS } from "@dnd-kit/utilities";

import { useCharacter } from "@/stores/characterDataStore";
import "./EchoInventoryItem.css";
import { useAppStore } from "@/stores/appStore";
import { getEquipmentRank } from "@/types/character.type";

export type EchoInventoryItemData = {
  id: number;
  num: number;
  echoName: string | null;
  src: string;
  cvScore: number;
  avScore: number;
};

type Props = {
  baseUrl: string;
  item: EchoInventoryItemData;
  index: number;
  onSelect?: (index: number) => void;
};

export default function EchoInventoryItem({ item, baseUrl, index, onSelect }: Props) {
  const {
    attributes,
    listeners,
    setNodeRef,
    transform,
    transition,
    isDragging,
    isOver,
  } = useSortable({ id: item.id });
  const { lang } = useAppStore();
  const { characterData } = useCharacter();

  const style: CSSProperties = {
    transform: CSS.Transform.toString(transform),
    transition,
  };
  const isEquipped = characterData.echoDataIndex.slice(0, 5).includes(index);
  const isActivated = item.num === index;
  const echoData = characterData.echoData[index];
  const rank = getEquipmentRank(item.avScore);

  return (
    <div
      ref={setNodeRef}
      style={style}
      className={[
        "echo-inventory-item",
        characterData.echoDataIndex[0] === index ? "main" : "",
        isDragging ? "dragging" : "",
        isActivated ? "activated" : "",
        isActivated ? "selected" : "",
        isEquipped ? "equipped" : "",
        isOver && !isDragging ? "drag-over" : "",
        item.echoName === null ? "disable" : "",
      ].join(" ").trim()}
      onClick={() => onSelect?.(item.id)}
      {...attributes}
      {...listeners}
      aria-pressed={isActivated}
      aria-label={`${item.echoName ?? "Empty Slot"} · Slot ${index + 1}`}
      onKeyDown={(event) => {
        listeners?.onKeyDown?.(event);
        if (event.key === "Enter" || event.key === " ") {
          event.preventDefault();
          onSelect?.(item.id);
        }
      }}
    >
      <div className="echo-drag-image-slot">
        <img
          className="echo-img"
          src={`${baseUrl}/ico/echos/${item.src}`}
          onError={(event) => {
            event.currentTarget.onerror = null;
            event.currentTarget.src = "/default.webp";
          }}
        />
        <div className="echo-drag-icon-slot">
          <img
            className="harmony-img"
            src={`/ico/harmony/${echoData?.setId}.png`}
            onError={(event) => {
              event.currentTarget.onerror = null;
              event.currentTarget.src = "/default.webp";
            }}
          />
          <img
            className="rank-img"
            src={`/ico/rank/${rank}.png`}
            onError={(event) => {
              event.currentTarget.onerror = null;
              event.currentTarget.src = "/default.webp";
            }}
          />
        </div>
      </div>

      <div className="span-slot">
        <span className={`${lang}-font`}> Cv.</span>
        <span className="num-font">{item.cvScore.toFixed(1)} <em>pts</em></span>
      </div>

      <div className="span-slot">
        <span className={`${lang}-font`}> Av.</span>
        <span className="num-font">{item.avScore.toFixed(1)} <em>pts</em></span>
      </div>

    </div>
  )
}

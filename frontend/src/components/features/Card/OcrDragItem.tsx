import Select, { type StylesConfig, type SingleValue } from "react-select";
import { CSS } from "@dnd-kit/utilities";
import { useSortable } from "@dnd-kit/sortable";
import type { SelectOpt, SelectOptionStatOriginal } from "./EchoSelect.type";
import type { StatId } from "@/datas/stats";
import type React from "react";
import type { DragItem } from "./OcrDragSelect";

type SortableItemProps = {
  item: DragItem;
  itemId: number;
  displayIndex: number;
  styles: [StylesConfig<any, false>, StylesConfig<any, false>];
  options: [SelectOptionStatOriginal[], SelectOpt[]];
  onSelectChange: React.Dispatch<React.SetStateAction<DragItem[]>>;
};

export function OcrDragItem({
  item,
  itemId,
  displayIndex,
  options,
  styles,
  onSelectChange,
}: SortableItemProps) {
  const {
    attributes,
    listeners,
    setNodeRef,
    transform,
    transition,
    isDragging,
  } = useSortable({ id: itemId });

  const style: React.CSSProperties = {
    transform: CSS.Transform.toString(transform),
    transition,
  };

  const isSelected = displayIndex < 5;

  return (
    <div
      ref={setNodeRef}
      style={style}
      className={[
        "ocr-drag-item",
        isDragging ? "dragging" : "",
        isSelected ? "selected" : "",
        item.statName === null ? "disable" : "",
      ].join(" ").trim()}
    >
      <div className="ocr-drag-item__inner">
        <button
          type="button"
          className="ocr-drag-item__handle"
          {...attributes}
          {...listeners}
        >
          ☰
        </button>

        <div
          className="stat-select-wrap"
          onPointerDown={(e) => e.stopPropagation()}
          onMouseDown={(e) => e.stopPropagation()}
        >
          <Select
            styles={styles[0]}
            options={options[0]}
            onChange={(opt: SingleValue<SelectOptionStatOriginal>) => {
              if (!opt) return;

              onSelectChange((prev) =>
                prev.map((v) =>
                  v.id === itemId
                    ? {
                      ...v,
                      statId: opt.value as StatId,
                      statName: opt.label ?? null,
                    }
                    : v
                )
              );
            }}
            menuPortalTarget={document.body}
            menuPosition="fixed"
            isSearchable={false}
            value={options[0].find((opt) => opt.value === item.statId) ?? null}
          />
        </div>

        <div style={{ width: "2.5%" }} />

        <div
          className="stat-select-wrap"
          onPointerDown={(e) => e.stopPropagation()}
          onMouseDown={(e) => e.stopPropagation()}
        >
          <Select
            styles={styles[1]}
            options={options[1]}
            onChange={(opt: SingleValue<SelectOpt>) => {
              if (!opt) return;

              onSelectChange((prev) =>
                prev.map((v) =>
                  v.id === itemId
                    ? {
                      ...v,
                      statValue: Number(opt.value),
                    }
                    : v
                )
              );
            }}
            menuPortalTarget={document.body}
            menuPosition="fixed"
            isSearchable={false}
            value={
              options[1].find(
                (opt) => opt.value.toString() === item.statValue?.toString()
              ) ?? null
            }
          />
        </div>
      </div>
    </div>
  );
}
import Select, { type StylesConfig, type SingleValue } from "react-select";
import { CSS } from "@dnd-kit/utilities";
import { useSortable } from "@dnd-kit/sortable";
import type { SelectOpt, SelectOptionStatOriginal } from "./EchoSelect.type";
import type { StatId } from "@/datas/stats";
import type React from "react";
import type { EchoStatOption } from "@/runtime/echo.runtime";
import type { EchoRuntimeWith7Subs } from "./OcrDragSelect";

type SortableItemProps = {
  item: EchoStatOption;
  itemId: number;
  displayIndex: number;
  styles: [
    StylesConfig<SelectOptionStatOriginal<StatId>, false>,
    StylesConfig<SelectOpt, false>,
  ];
  options: [SelectOptionStatOriginal<StatId>[], SelectOpt[]];
  onSelectChange: React.Dispatch<React.SetStateAction<EchoRuntimeWith7Subs>>;
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
        item.statId === null ? "disable" : "",
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
            onChange={(opt: SingleValue<SelectOptionStatOriginal<StatId>>) => {
              if (!opt) return;

              onSelectChange((prev) => {
                if (!prev) return prev;

                const nextSubOptions = [...prev.subOptions] as typeof prev.subOptions;
                nextSubOptions[itemId] = {
                  statId: opt.value,
                  statValue: 0,
                };

                return {
                  ...prev,
                  subOptions: nextSubOptions,
                };
              });
            }}
            menuPortalTarget={document.body}
            menuPosition="fixed"
            isSearchable={false}
            value={options[0].find((opt) => opt.value === item.statId) ?? null}
          />
        </div>

        <div style={{ width: "2.5%" }} />

        <div
          className="stat-select-wrap stat"
          onPointerDown={(e) => e.stopPropagation()}
          onMouseDown={(e) => e.stopPropagation()}
        >
          <Select
            styles={styles[1]}
            options={options[1]}
            onChange={(opt: SingleValue<SelectOpt>) => {
              if (!opt) return;

              onSelectChange((prev) => {
                if (!prev) return prev;

                const nextSubOptions = [...prev.subOptions] as typeof prev.subOptions;
                nextSubOptions[itemId] = {
                  ...nextSubOptions[itemId],
                  statValue: opt.value,
                };

                return {
                  ...prev,
                  subOptions: nextSubOptions,
                };
              });
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

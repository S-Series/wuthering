import Select, { type SingleValue, type StylesConfig } from "react-select";
import { CSS } from "@dnd-kit/utilities";
import { useSortable } from "@dnd-kit/sortable";
import type { SelectOpt, SelectOptionStatOriginal } from "./EchoSelect.type";
import type { StatId } from "@/datas/stats";
import type React from "react";
import type { EchoRuntime } from "@/runtime/echo.runtime";
import { useEffect } from "react";

type SortableItemProps = {
  item: {
    id: number;
    statId: StatId;
    statValue: number;
    statName: string | null;
  };
  index: number;
  styles: [StylesConfig<any,false>, StylesConfig<any,false>];
  options: [SelectOptionStatOriginal[], SelectOpt[]];
  onSelectChange: React.Dispatch<React.SetStateAction<EchoRuntime>>;
};

//$ =================================================
export function OcrDragSelectItem({
  item,
  index,
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
  } = useSortable({ id: item.id });

  const style: React.CSSProperties = {
    transform: CSS.Transform.toString(transform),
    transition,
  };

  const isSelected = index < 5;

  useEffect(() => onSelectChange((prev) => {
    const nextSubOptions = [...prev.subOptions] as typeof prev.subOptions;

    nextSubOptions[index] = {
      ...nextSubOptions[index],
      statId: item.statId,
      statValue: item.statValue,
    };

    return {
      ...prev,
      subOptions: nextSubOptions,
    };
  }), [item])

  return (
    <div
      ref={setNodeRef}
      style={style}
      className={[
        "stat-drag-item",
        isDragging ? "dragging" : "",
        isSelected ? "selected" : "",
        item.statName === null ? "disable" : "",
      ].join(" ").trim()}
    >
      <div className="hover-motion">
        <button
          type="button"
          className="drag-handle"
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
            onChange={(opt) => {
              console.log(opt);
              onSelectChange((prev) => {
                const nextSubOptions = [...prev.subOptions] as typeof prev.subOptions;

                nextSubOptions[index] = {
                  ...nextSubOptions[index],
                  statId: opt?.value ?? "dummy",
                };

                return {
                  ...prev,
                  subOptions: nextSubOptions,
                };
              })
            }}
            menuPortalTarget={document.body}
            menuPosition="fixed"
            isSearchable={false}
            value={options[0].find((opt) => { return opt.value === item.statId })}
          />
        </div>

        <div style={{width: "2.5%"}}/>

        <div
          className="stat-select-wrap"
          onPointerDown={(e) => e.stopPropagation()}
          onMouseDown={(e) => e.stopPropagation()}
        >
          <Select
            styles={styles[1]}
            options={options[1]}
            onChange={(opt) => {
              console.log(opt);
              onSelectChange((prev) => {
                const nextSubOptions = [...prev.subOptions] as typeof prev.subOptions;

                nextSubOptions[index] = {
                  ...nextSubOptions[index],
                  statValue: opt?.value ?? 0,
                };

                return {
                  ...prev,
                  subOptions: nextSubOptions,
                };
              })
            }}
            menuPortalTarget={document.body}
            menuPosition="fixed"
            isSearchable={false}
            value={options[1].find((opt) => opt.value.toString() === item.statValue.toString())}
          />
        </div>
      </div>
    </div>
  );
}

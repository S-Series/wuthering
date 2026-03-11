import Select, { type SingleValue } from "react-select";
import { CSS } from "@dnd-kit/utilities";
import { useSortable } from "@dnd-kit/sortable";

type SelectOption = {
  value: string;
  label: string;
};

type SortableItemProps = {
  item: {
    id: number;
    statName: string | null;
    src: string;
  };
  baseUrl: string;
  index: number;
  options: SelectOption[];
  onSelectChange: (itemId: number, value: SelectOption | null) => void;
};

//$ =================================================
export function OcrDragSelectItem({
  item,
  index,
  options,
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

  const handleSelectChange = (next: SingleValue<SelectOption>) => {
    onSelectChange(item.id, next ?? null);
  };

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
          <Select<SelectOption, false>
            options={options}
            onChange={handleSelectChange}
            menuPortalTarget={document.body}
            menuPosition="fixed"
            isClearable
            isSearchable={false}
          />
        </div>

        <div
          className="stat-select-wrap"
          onPointerDown={(e) => e.stopPropagation()}
          onMouseDown={(e) => e.stopPropagation()}
        >
          <Select<SelectOption, false>
            options={options}
            onChange={handleSelectChange}
            menuPortalTarget={document.body}
            menuPosition="fixed"
            isClearable
            isSearchable={false}
          />
        </div>
      </div>
    </div>
  );
}

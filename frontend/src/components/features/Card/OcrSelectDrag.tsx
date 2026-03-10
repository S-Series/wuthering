import { useEffect, useState } from "react";
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
import { FixedStats, type StatId } from "@/datas/stats";
import { OcrDragSelectItem } from "./OcrDragSelectItem";

import "./EchoDragSelect.css";
import "./OcrDragSelect.override.css"

type DragItem = {
    id: number;
    statName: string | null;
    src: string;
};

const createItems = (data: [StatId, number][] | null, lang: LangType): DragItem[] => {
    const names = Object.values(FixedStats);

    if(!data) return [];

    const sliced = data.slice(2);

    return sliced.map((_, index) => ({
        id: index,
        statName: names.find(item => item.id === sliced[index][0])?.[lang] ?? null,
        src: `${sliced[index]?.[0]}.webp`,
        label: null,
    }));
};
type Props = {
    datas: [StatId, number][] | null
}

export default function OcrSelectDrag({ datas }: Props) {
    const { lang } = useAppStore();
    const [items, setItems] = useState<DragItem[]>([]);

    useEffect(() => {
        setItems(createItems(datas, lang))
    }, [datas])

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

    return (
        <>
            <div className="stat-drag-select">
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
                                    baseUrl=""
                                    index={index}
                                    options={[]}
                                    onSelectChange={() => { }} />
                            ))}
                        </div>
                    </SortableContext>
                </DndContext>

            </div>
            <button />
        </>
    );
}
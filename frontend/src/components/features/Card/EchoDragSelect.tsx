import React, { useEffect, useMemo, useState } from "react";
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
	verticalListSortingStrategy,
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

type DragItem = {
	id: number;
	echoName: string | null;
	src: string[];
	label: EchoRuntime | null;
};

const createItems = (data: EchoRuntime[] | null, scores: any, lang: LangType): DragItem[] => {
	const names = ECHO_CANDIDATES[lang];

	return Array.from({ length: 10 }, (_, index) => ({
		id: index,
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
	item: DragItem;
	index: number;
	onClick?: React.Dispatch<React.SetStateAction<number>>;
};

type EchoIndexTuple =
	[number, number, number, number, number,
		number, number, number, number, number];

function assertEchoIndexTuple(arr: number[]): asserts arr is EchoIndexTuple {
	if (arr.length !== 10) {
		throw new Error("Echo index must have length 10");
	}
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

	const style: React.CSSProperties = {
		transform: CSS.Transform.toString(transform),
		transition,
	};

	const isSelected = index < 5;

	return (
		<div
			ref={setNodeRef}
			style={style}
			className={[
				"echo-drag-item",
				index === 0 ? "main" : "",
				isDragging ? "dragging" : "",
				isSelected ? "selected" : "",
				item.echoName === null ? "disable" : ""
			].join(" ").trim()}
			onClick={() => { if (onClick) onClick(item.id); }}
			{...attributes}
			{...listeners}
		>
			<div className="hover-motion">
				<img className="echo-img" src={`${baseUrl}/ico/echos/${item.src[0]}`} 
					onError={(e) => {
						e.currentTarget.onerror = null;
						e.currentTarget.src = "/default.webp"
					}}/>
				<span className="echo-drag-label">{item.echoName}</span>
				<img className="score-img" src={`/ico/rank/${item.src[1]}`} />
			</div>
		</div>
	);
}

type Props = {
	onClick?: React.Dispatch<React.SetStateAction<number>>;
}

export default function EchoDragSelect({onClick}: Props) {
	const { lang } = useAppStore();
	const { characterData, equipmentScore, patchCharacterData } = useCharacter();
	const [items, setItems] = useState<DragItem[]>(createItems(null, equipmentScore, lang));
	const BASE_URL = import.meta.env.VITE_IMAGE_BASE;

	useEffect(() => {
		setItems(
			reOrderItems(
				characterData.echoDataIndex,
				createItems(characterData.echoData, equipmentScore, lang)
			)
		);
	}, [characterData.echoData, characterData.echoDataIndex, lang, equipmentScore]);

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
					strategy={verticalListSortingStrategy}
				>
					<div className="echo-drag-list">
						{items.map((item, index) => (
							<SortableItem key={item.id} baseUrl={BASE_URL} item={item} index={index} onClick={onClick} />
						))}
					</div>
				</SortableContext>
			</DndContext>
		</div>
	);
}
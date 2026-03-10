import { useRef, useState } from "react";

type ItemId = "A" | "B";
type Position = { x: number; y: number };

const INITIAL_POSITIONS: Record<ItemId, Position> = {
  A: { x: 100, y: 100 },
  B: { x: 250, y: 100 },
};

export default function DragTwoItemsWithDropZone() {
  const dropRef = useRef<HTMLDivElement | null>(null);

  const [positions, setPositions] = useState<Record<ItemId, Position>>(INITIAL_POSITIONS);
  const [draggingId, setDraggingId] = useState<ItemId | null>(null);
  const [offset, setOffset] = useState({ x: 0, y: 0 });

  const handlePointerDown = (id: ItemId, e: React.PointerEvent<HTMLDivElement>) => {
    const pos = positions[id];

    setDraggingId(id);
    setOffset({
      x: e.clientX - pos.x,
      y: e.clientY - pos.y,
    });
  };

  const handlePointerMove = (e: React.PointerEvent<HTMLDivElement>) => {
    if (!draggingId) return;

    setPositions((prev) => ({
      ...prev,
      [draggingId]: {
        x: e.clientX - offset.x,
        y: e.clientY - offset.y,
      },
    }));
  };

  const handlePointerUp = (e: React.PointerEvent<HTMLDivElement>) => {
    if (!draggingId) return;

    const releasedId = draggingId;
    setDraggingId(null);

    const rect = dropRef.current?.getBoundingClientRect();

    const isInsideDropZone =
      !!rect &&
      e.clientX >= rect.left &&
      e.clientX <= rect.right &&
      e.clientY >= rect.top &&
      e.clientY <= rect.bottom;

    if (isInsideDropZone) {
      setPositions((prev) => ({
        ...prev,
        [releasedId]: {
          x: rect!.left,
          y: rect!.top,
        },
      }));
    } else {
      setPositions((prev) => ({
        ...prev,
        [releasedId]: INITIAL_POSITIONS[releasedId],
      }));
    }
  };

  return (
    <div
      onPointerMove={handlePointerMove}
      onPointerUp={handlePointerUp}
      style={{
        width: "100vw",
        height: "100vh",
        position: "relative",
        background: "#f5f5f5",
      }}
    >
      <div
        ref={dropRef}
        style={{
          position: "absolute",
          left: 500,
          top: 100,
          width: 140,
          height: 140,
          border: "2px dashed #666",
          background: "#ffffff",
          display: "flex",
          alignItems: "center",
          justifyContent: "center",
        }}
      >
        DROP
      </div>

      <div
        onPointerDown={(e) => handlePointerDown("A", e)}
        style={{
          position: "absolute",
          left: positions.A.x,
          top: positions.A.y,
          width: 100,
          height: 100,
          background: "skyblue",
          cursor: "grab",
          transition: draggingId === "A" ? "none" : "left 220ms ease-out, top 220ms ease-out",
        }}
      >
        A
      </div>

      <div
        onPointerDown={(e) => handlePointerDown("B", e)}
        style={{
          position: "absolute",
          left: positions.B.x,
          top: positions.B.y,
          width: 100,
          height: 100,
          background: "salmon",
          cursor: "grab",
          transition: draggingId === "B" ? "none" : "left 220ms ease-out, top 220ms ease-out",
        }}
      >
        B
      </div>
    </div>
  );
}
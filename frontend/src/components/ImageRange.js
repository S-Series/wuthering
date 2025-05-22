import "./ImageRange.css";
import { useEffect, useRef, useState } from "react";

function ImageRange({ src = null, crop, onChange }) {
  const dragging = useRef(false);
  const isFocused = useRef(false);
  const offset = useRef({ x: 0, y: 0 });

  const imageSlotRef = useRef(null);
  const [slotSize, setSlotSize] = useState({ width: 0, height: 0 });
  const [imgSize, setImgSize] = useState({ width: 0, height: 0 });
  const [minScale, setMinScale] = useState(1);

  const handleMouseDown = (e) => {
    e.preventDefault();
    dragging.current = true;
    offset.current = {
      x: e.clientX - crop.x,
      y: e.clientY - crop.y,
    };
  };

  const handleKeyDown = (e) => {
    if (!isFocused.current) return;
    const delta = 1;
    let dx = 0,
      dy = 0;

    switch (e.key) {
      case "ArrowUp":
        dy = -delta;
        break;
      case "ArrowDown":
        dy = delta;
        break;
      case "ArrowLeft":
        dx = -delta;
        break;
      case "ArrowRight":
        dx = delta;
        break;
      default:
        return;
    }

    e.preventDefault();
    onChange({
      ...crop,
      x: crop.x + dx,
      y: crop.y + dy,
    });
  };

  useEffect(() => {
    const handleMouseMove = (e) => {
      if (!dragging.current) return;
      e.preventDefault();

      const newX = Math.min(
        Math.max(
          e.clientX - offset.current.x,
          (imgSize.width * crop.s - 272) / -2
        ),
        (imgSize.width * crop.s - 272) / +2
      );
      const newY = Math.min(
        Math.max(
          e.clientY - offset.current.y,
          (imgSize.height * crop.s - 220) / -2
        ),
        (imgSize.height * crop.s - 220) / +2
      );

      onChange({
        ...crop,
        x: newX,
        y: newY,
      });
    };

    const handleMouseUp = () => {
      dragging.current = false;
    };

    window.addEventListener("mousemove", handleMouseMove);
    window.addEventListener("mouseup", handleMouseUp);
    return () => {
      window.removeEventListener("mousemove", handleMouseMove);
      window.removeEventListener("mouseup", handleMouseUp);
    };
  }, [crop]);

  useEffect(() => {
    window.addEventListener("keydown", handleKeyDown);
    return () => window.removeEventListener("keydown", handleKeyDown);
  }, [crop]);

  useEffect(() => {
    if (!src) return;

    const img = new Image();
    img.onload = () => {
      const naturalWidth = img.naturalWidth;
      const naturalHeight = img.naturalHeight;

      setImgSize({ width: naturalWidth, height: naturalHeight });

      const fitScale = Math.max(272 / naturalWidth, 220 / naturalHeight, 0.1);
      setMinScale(fitScale);

      onChange({
        ...crop,
        s: fitScale,
      });
    };

    img.src = src;
  }, [src]);

  useEffect(() => {
    const elem = document.querySelector(".image-range-body");
    if (!elem) return;

    const handleWheel = (e) => {
      e.preventDefault();
      const delta = e.deltaY < 0 ? 0.025 : -0.025;
      const newScale = Math.min(Math.max(crop.s + delta, minScale), 10);

      const newX = Math.min(
        Math.max(
          e.clientX - offset.current.x,
          (imgSize.width * newScale - 272) / -2
        ),
        (imgSize.width * newScale - 272) / +2
      );
      const newY = Math.min(
        Math.max(
          e.clientY - offset.current.y,
          (imgSize.height * newScale - 220) / -2
        ),
        (imgSize.height * newScale - 220) / +2
      );

      onChange({ ...crop, x: newX, y: newY, s: newScale });
    };

    elem.addEventListener("wheel", handleWheel, { passive: false });

    return () => {
      elem.removeEventListener("wheel", handleWheel);
    };
  }, [crop]);

  useEffect(() => {
    if (imageSlotRef.current) {
      setSlotSize({
        width: imageSlotRef.current.offsetWidth,
        height: imageSlotRef.current.offsetHeight,
      });
    }
  }, []);

  return (
    <div className="image-range-body">
      <div className="image-range-slot">
        <div
          className="image-range-handler"
          draggable={false}
        />
        {src !== null && (
          <div className="image-range-image" ref={imageSlotRef}>
            <img
              src={src}
              draggable={false}
              onMouseDown={handleMouseDown}
              onClick={() => (isFocused.current = true)}
              style={{
                position: "absolute",
                transform: `translate(
                    ${crop.x + slotSize.width / 2 - imgSize.width / 2}px, 
                    ${
                      crop.y + slotSize.height / 2 - imgSize.height / 2
                    }px) scale(${crop.s})`,
                transformOrigin: "center",
                userSelect: "none",
                pointerEvents: "auto",
                cursor: dragging.current ? "grabbing" : "grab",
                objectFit: "contain",
                overflow: "hidden",
              }}
            />
          </div>
        )}
      </div>
      <div className="image-range-data">
        
      </div>
    </div>
  );
}

export default ImageRange;

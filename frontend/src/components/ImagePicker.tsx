import { useRef, useMemo, useState, useEffect } from "react";
import "./ImagePicker.css";

type Props = {
  src: string | null;
  defaultSrc?: string | null;
  onChangeSrc: (nextSrc: string | null) => void;
};

export default function ImagePicker(props: Props) {
  const { src, defaultSrc = null, onChangeSrc } = props;

  const inputRef = useRef<HTMLInputElement>(null);
  const wrapperRef = useRef<HTMLDivElement>(null);
  const imgRef = useRef<HTMLImageElement>(null);

  const isDraggingRef = useRef(false);
  const lastPosRef = useRef({ x: 0, y: 0 });

  const displaySrc = useMemo(() => {
    return src ?? defaultSrc ?? null;
  }, [src, defaultSrc]);
  
  const [imageReady, setImageReady] = useState(false);

  const [x, setX] = useState(0);
  const [y, setY] = useState(0);

  const [scale, setScale] = useState(1);
  const [imgScale, setImgScale] = useState(1);

  const [wrapperSize, setWrapperSize] = useState({ w: 0, h: 0 });

  useEffect(() => {
  const wrapper = wrapperRef.current;
  if (!wrapper) return;

  const updateSize = () => {
    const rect = wrapper.getBoundingClientRect();
    setWrapperSize({ w: rect.width, h: rect.height });
  };

  requestAnimationFrame(updateSize);

  const observer = new ResizeObserver((entries) => {
    const rect = entries[0].contentRect;
    setWrapperSize({ w: rect.width, h: rect.height });
  });

  observer.observe(wrapper);

  return () => observer.disconnect();
}, []);

  const ImagePositionClamp = (nextScale = scale) => {
    const img = imgRef.current;
    if (!img) return;
    if (!wrapperSize.w || !wrapperSize.h) return;

    const naturalW = img.naturalWidth;
    const naturalH = img.naturalHeight;

    const effectiveScale = imgScale * nextScale;

    const scaledW = naturalW * effectiveScale;
    const scaledH = naturalH * effectiveScale;

    const maxX = Math.max(0, (scaledW - wrapperSize.w) / 2);
    const maxY = Math.max(0, (scaledH - wrapperSize.h) / 2);

    setX((prev) => Math.min(maxX, Math.max(-maxX, prev)));
    setY((prev) => Math.min(maxY, Math.max(-maxY, prev)));
  };

  const MIN_SCALE = 1;
  const MAX_SCALE = 10;

  const ImageScaleClamp = (nextScale: number) => {
    const clamped = Math.min(MAX_SCALE, Math.max(MIN_SCALE, nextScale));
    setScale(clamped);
    ImagePositionClamp(clamped);
  };

  const handleMouseDown = (e: React.MouseEvent) => {
    isDraggingRef.current = true;
    lastPosRef.current = { x: e.clientX, y: e.clientY };
  };

  const handleMouseMove = (e: React.MouseEvent) => {
    if (!isDraggingRef.current) return;

    const dx = e.clientX - lastPosRef.current.x;
    const dy = e.clientY - lastPosRef.current.y;

    lastPosRef.current = { x: e.clientX, y: e.clientY };

    setX((prev) => prev + dx);
    setY((prev) => prev + dy);
  };

  const handleMouseUp = () => {
    isDraggingRef.current = false;
    ImagePositionClamp();
  };

  const handleWheel = (e: React.WheelEvent) => {
    e.preventDefault();
    const zoomSpeed = 0.001;
    ImageScaleClamp(scale - e.deltaY * zoomSpeed);
  };

  useEffect(() => {
    const img = imgRef.current;
    if (!img) return;
    if (!wrapperSize.w || !wrapperSize.h) return;
    if (!img.naturalWidth || !img.naturalHeight) return;

    const containScale = Math.min(
      wrapperSize.w / img.naturalWidth,
      wrapperSize.h / img.naturalHeight
    );

    setImgScale(containScale);

    ImagePositionClamp(scale);
  }, [wrapperSize.w, wrapperSize.h]);

  useEffect(() => {
    if (!imageReady) return;
    if (!wrapperSize.w || !wrapperSize.h) return;

    const img = imgRef.current;
    if (!img) return;

    const containScale = Math.max(
      wrapperSize.w / img.naturalWidth,
      wrapperSize.h / img.naturalHeight
    );

    setImgScale(containScale);
    setScale(1);
    setX(0);
    setY(0);
  }, [imageReady, wrapperSize.w, wrapperSize.h]);

  return (
    <div className="image-picker-slot"
      ref={wrapperRef}
      onDoubleClick={() => inputRef.current?.click()}
      onMouseDown={handleMouseDown}
      onMouseMove={handleMouseMove}
      onMouseUp={handleMouseUp}
      onMouseLeave={handleMouseUp}
      onWheel={handleWheel}
    >
      {displaySrc && (
        <img
          ref={imgRef}
          src={displaySrc}
          draggable={false}
          onLoad={() => setImageReady(true)}
          style={{
            transform: `
              translate(-50%, -50%)
              translate(${x}px, ${y}px)
              scale(${imgScale * scale})
            `,
          }}
        />
      )}

      <input
        ref={inputRef}
        type="file"
        accept="image/*"
        hidden
        onChange={(e) => {
          const file = e.target.files?.[0];
          e.currentTarget.value = "";
          if (!file) return;

          const reader = new FileReader();
          reader.onload = () => {
            if (typeof reader.result === "string") {
              onChangeSrc(reader.result);
            }
          };
          reader.readAsDataURL(file);
        }}
      />
    </div>
  );
}

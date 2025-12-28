import { useRef, useMemo, useState } from "react";

import "./ImagePicker.css"

type Props = {
    src: string | null;
    defaultSrc?: string | null;
    onChangeSrc: (nextSrc: string | null) => void;
    className?: string;
    style?: React.CSSProperties;
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

    const [x, setX] = useState(0);
    const [y, setY] = useState(0);
    const [scale, setScale] = useState(1);
    const [imgScale, setImgScale] = useState(1);

    const ImagePositionClamp = (nextScale = scale) => {
        const wrapper = wrapperRef.current;
        const img = imgRef.current;
        if (!wrapper || !img) return;

        const wrapperW = wrapper.clientWidth;
        const wrapperH = wrapper.clientHeight;

        const naturalW = img.naturalWidth;
        const naturalH = img.naturalHeight;

        const scaledW = naturalW * nextScale * imgScale;
        const scaledH = naturalH * nextScale * imgScale;

        const maxX = Math.max(0, (scaledW - wrapperW) / 2);
        const maxY = Math.max(0, (scaledH - wrapperH) / 2);

        setX((prev) => Math.min(maxX, Math.max(-maxX, prev)));
        setY((prev) => Math.min(maxY, Math.max(-maxY, prev)));
    };

    const MIN_SCALE = 0.2;
    const MAX_SCALE = 5;

    const ImageScaleClamp = (nextScale: number) => {
        const clampedScale = Math.min(
            MAX_SCALE,
            Math.max(MIN_SCALE, nextScale)
        );

        setScale(clampedScale);

        ImagePositionClamp(clampedScale);
    };

    const handleMouseDown = (e: React.MouseEvent) => {
        isDraggingRef.current = true;
        lastPosRef.current = {
            x: e.clientX,
            y: e.clientY,
        };
    };

    const handleMouseMove = (e: React.MouseEvent) => {
        if (!isDraggingRef.current) return;

        const dx = e.clientX - lastPosRef.current.x;
        const dy = e.clientY - lastPosRef.current.y;

        lastPosRef.current = {
            x: e.clientX,
            y: e.clientY,
        };

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
        const delta = e.deltaY;

        ImageScaleClamp(scale - delta * zoomSpeed);
    };


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
            {displaySrc ? (
                <img className=""
                    ref={imgRef}
                    src={displaySrc}
                    alt=""
                    draggable={false}
                    style={{
                        transform: `
                            translate(-50%, -50%)
                            translate(${x}px, ${y}px)
                            scale(${scale * imgScale})`,
                    }}
                />
            ) : null}

            <input
                ref={inputRef}
                type="file"
                accept="image/*"
                hidden
                onChange={(e) => {
                    const file = e.target.files?.[0] ?? null;
                    e.currentTarget.value = "";
                    if (!file) return;

                    const reader = new FileReader();
                    reader.onload = () => {
                        const result = reader.result;
                        if (typeof result !== "string") return;
                        onChangeSrc(result);
                    };
                    reader.readAsDataURL(file);
                }}
            />
        </div>
    );
}

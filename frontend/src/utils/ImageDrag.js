import "./ImageDrag.css";
import { useState, useRef, useEffect, useLayoutEffect } from "react";

function ImageDrag({ path = null, sizeValue = 1, inputable = false }) {
  const apiUrl = process.env.REACT_APP_API_URL;

  const imageSlotRef = useRef();
  const imageContRef = useRef();
  const fileInputRef = useRef();

  const [reloadKey, setReloadKey] = useState(false);
  const [resizeKey, setResizeKey] = useState(false);

  const [hovered, setHovered] = useState(false);
  const [dragging, setDragging] = useState(false);
  const [doubleClicked, setDoubleClicked] = useState(false);

  const [imageSize, setImageSize] = useState({ width: 0, height: 0 });
  const [imageTrans, setImageTrans] = useState({ x: 0, y: 0, s: 1 });
  const [imageMinZoom, setImageMinZoom] = useState(1);

  const [maxTrans, setMaxTrans] = useState({ x: 0, y: 0 });
  const [slotSize, setSlotSize] = useState({ width: 0, height: 0 });

  const [imgPath, setImgPath] = useState("");

  useEffect(() => {
    function handleResize() {
      setReloadKey((prev) => !prev);
    }

    window.addEventListener("resize", handleResize);
    return () => window.removeEventListener("resize", handleResize);
  }, []);
  useEffect(() => {
    setImgPath(path);
  }, [path]);
  useEffect(() => {
    if (imageSize.width == 0 || imageSize.height == 0) return;

    const boxWidth = imageSlotRef.current.offsetWidth;
    const boxHeight = imageSlotRef.current.offsetHeight;

    const sizeValue = Math.max(
      boxWidth / imageSize.width,
      boxHeight / imageSize.height
    );

    setSlotSize({ width: boxWidth, height: boxHeight });

    setMaxTrans({
      x: (imageSize.width * sizeValue - boxWidth) / 2,
      y: (imageSize.height * sizeValue - boxHeight) / 2,
    });

    setImageTrans((prev) => ({
      ...prev,
      s: sizeValue,
    }));
    setImageMinZoom(sizeValue);
  }, [imageSize, reloadKey]);
  useEffect(() => {
    function wheel(e) {
      if (!hovered) return;
      e.preventDefault();

      const sizeValue = e.deltaY > 0 ? -0.05 : 0.05;

      setImageTrans((prev) => ({
        ...prev,
        s: Math.max(imageMinZoom, prev.s + sizeValue),
      }));
      setResizeKey((prev) => !prev);
    }
    window.addEventListener("wheel", wheel, { passive: false });
    return () => {
      window.removeEventListener("wheel", wheel);
    };
  }, [hovered]);
  useEffect(() => {
    //console.log(imageTrans);
    if (!dragging) return;
    let prev = { x: 0, y: 0 };

    const handleMouseMove = (e) => {
      const dx = e.clientX - prev.x;
      const dy = e.clientY - prev.y;
      prev.x = e.clientX;
      prev.y = e.clientY;
      setImageTrans((prev) => ({
        ...prev,
        x: Math.min(Math.max(prev.x + dx, -maxTrans.x), maxTrans.x),
        y: Math.min(Math.max(prev.y + dy, -maxTrans.y), maxTrans.y),
      }));
    };

    const handleMouseUp = () => {
      setDragging(false);
      window.removeEventListener("mousemove", handleMouseMove);
      window.removeEventListener("mouseup", handleMouseUp);
    };

    const handleMouseDown = (e) => {
      prev.x = e.clientX;
      prev.y = e.clientY;
      window.addEventListener("mousemove", handleMouseMove);
      window.addEventListener("mouseup", handleMouseUp);
    };

    window.addEventListener("mousedown", handleMouseDown);

    return () => {
      window.removeEventListener("mousedown", handleMouseDown);
      window.removeEventListener("mousemove", handleMouseMove);
      window.removeEventListener("mouseup", handleMouseUp);
    };
  }, [dragging]);
  useEffect(() => {
    const mx = (imageSize.width * imageTrans.s - slotSize.width) / 2;
    const my = (imageSize.height * imageTrans.s - slotSize.height) / 2;
    setMaxTrans({ x: mx, y: my });

    const dx = Math.min(Math.max(imageTrans.x, -maxTrans.x), maxTrans.x);
    const dy = Math.min(Math.max(imageTrans.y, -maxTrans.y), maxTrans.y);
    setImageTrans((prev) => ({ ...prev, x: dx, y: dy }));
  }, [resizeKey]);
  useEffect(() => {
    if (!inputable) return;

    const handlePaste = (e) => {
      const items = e.clipboardData?.items;
      if (!items) return;

      for (const item of items) {
        if (item.type.startsWith("image/")) {
          const file = item.getAsFile();
          const reader = new FileReader();
          reader.onload = (event) => {
            setImgPath(event.target.result); // ✅ base64 이미지 적용
          };
          reader.readAsDataURL(file);
          break;
        }
      }
    };

    window.addEventListener("paste", handlePaste);
    return () => window.removeEventListener("paste", handlePaste);
  }, [inputable]);

  useLayoutEffect(() => {}, []);

  function boxHovered(isOvered) {
    setHovered(isOvered);
  }
  function handleDoubleClick() {
    console.log("double click");
    if (!inputable) return;
    if (fileInputRef.current) fileInputRef.current.click();
  }
  function handleFileChange(item) {
    const file = item.target.files[0];
    if (!file) return;

    const reader = new FileReader();
    reader.onload = (item) => {
      setImgPath(item.target.result);
    };
    reader.readAsDataURL(file);
  }

  return (
    <div
      className="image-drag-slot"
      ref={imageSlotRef}
      src={imgPath ? imgPath : null}
      onMouseEnter={() => boxHovered(true)}
      onMouseLeave={() => boxHovered(false)}
      onMouseDown={() => setDragging(true)}
      onDoubleClick={() => {
        handleDoubleClick();
      }}
      onError={(e) => {
        e.currentTarget.onerror = null;
        e.currentTarget.src = "none";
      }}
      style={{
        userSelect: "none",
        WebkitUserSelect: "none",
      }}>
      <input
        ref={fileInputRef}
        type="file"
        accept="image/*"
        draggable="false"
        style={{
          display: "none",
          userSelect: "none",
          WebkitUserSelect: "none",
        }}
        onChange={handleFileChange} 
      />
      <img
        className="image-drag-slot-content"
        ref={imageContRef}
        src={imgPath ? imgPath : null}
        draggable="false"
        onDragStart={(e) => e.preventDefault()}
        onLoad={(e) => {
          setImageSize({
            width: e.target.naturalWidth,
            height: e.target.naturalHeight,
          });
        }}
        style={{
          pointerEvents: "none",
          userSelect: "none",
          WebkitUserSelect: "none",
          transform: `translate(${imageTrans.x}px, ${imageTrans.y}px) scale(${imageTrans.s})`,
        }}
      />
    </div>
  );
}
export default ImageDrag;

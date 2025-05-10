import { useRef, useState, useEffect } from "react";
import DropSlot from "./DropSlot";
import "./OcrSlot.css";

function OCRSlot({ isMain }) {
  const boxRef = useRef(null);
  const [imageURL, setImageURL] = useState(null);

  useEffect(() => {
    const handlePaste = (e) => {
      const items = e.clipboardData.items;
      for (const item of items) {
        if (item.type.indexOf("image") !== -1) {
          const file = item.getAsFile();
          const url = URL.createObjectURL(file);
          setImageURL(url);
          e.preventDefault(); // 브라우저 기본 삽입 방지
        }
      }
    };

    const box = boxRef.current;
    box.addEventListener("paste", handlePaste);

    return () => box.removeEventListener("paste", handlePaste);
  }, []);

  const slotClass = isMain ? "ocr-input-slot main-slot" : "ocr-input-slot";

  return (
    <div className="ocr-body">
      <div
        className={slotClass}
        tabIndex={0}
        ref={boxRef}
        contentEditable={false}>
        {imageURL ? (
          <img src={imageURL} alt="paste image" className="ocr-preview-img" />
        ) : (
          <p className="ocr-guide-text">{isMain ? "Main Slot" : ""}</p>
        )}
      </div>
      <DropSlot />
    </div>
  );
}

export default OCRSlot;

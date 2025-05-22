import "./OcrSlot.css";
import { useRef } from "react";
import { OcrRetouch } from "../func/OcrRetouch";

function OCRSlot({ index, imgPath, selected, onClick, isMain, setImgPath }) {
  const fileInputRef = useRef();

  const slotClass =
    (isMain ? "ocr-input-slot main-slot" : "ocr-input-slot") +
    (selected ? " selected" : "");

  const handleDoubleClick = () => {
    fileInputRef.current?.click();
  };

  const handleFileChange = (e) => {
    const file = e.target.files[0];
    if (!file) return;

    const reader = new FileReader();
    reader.onload = () => {
      setImgPath((prev) => ({
        ...prev,
        [index]: reader.result,
      }));
    };
    reader.readAsDataURL(file);
  };

  return (
    <div className="ocr-body">
      <div
        className={slotClass}
        tabIndex={0}
        onClick={onClick}
        onDoubleClick={handleDoubleClick}
        contentEditable={false}
      >
        {imgPath ? (
          <img src={imgPath} alt="paste image" className="ocr-preview-img" />
        ) : (
          <p className="ocr-guide-text">{isMain ? "Main Slot" : ""}</p>
        )}

        <input
          type="file"
          accept="image/*"
          ref={fileInputRef}
          style={{ display: "none" }}
          onChange={handleFileChange}
        />
      </div>
    </div>
  );
}

export default OCRSlot;

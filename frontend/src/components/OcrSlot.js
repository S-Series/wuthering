import "./OcrSlot.css";
import { useRef, useState, useEffect } from "react";
import { OcrRetouch } from "../func/OcrRetouch";

function OCRSlot({ isMain }) {
  const boxRef = useRef(null);
  const [imageURL, setImageURL] = useState(null);
  const [ocrData, setOcrData] = useState({ ocrType: [], ocrValue: [] });

  const lang = localStorage.getItem("lang") || "kr";

  useEffect(() => {
    const handlePaste = (e) => {
      const items = e.clipboardData.items;
      for (const item of items) {
        if (item.type.indexOf("image") !== -1) {
          const file = item.getAsFile();
          const url = URL.createObjectURL(file);
          setImageURL(url);
          e.preventDefault();
        }
      }
    };

    const box = boxRef.current;
    box.addEventListener("paste", handlePaste);
    return () => box.removeEventListener("paste", handlePaste);
  }, []);

  useEffect(() => {
    if (!imageURL) return;

    const sendToOCR = async () => {
      const blob = await fetch(imageURL).then((res) => res.blob());
      const file = new File([blob], "image.png", { type: blob.type });

      const formData = new FormData();
      formData.append("file", file);

      const response = await fetch("http://localhost:8000/ocr?lang=kr", {
        method: "POST",
        body: formData,
      });

      const result = await response.json();
      const { retType, retValue } = OcrRetouch({ text: result.text, lang });
      setOcrData({ ocrType: retType, ocrValue: retValue });
    };

    sendToOCR();
  }, [imageURL]);

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
      {/*ocrData.ocrType.length > 0 && (
        <div className="ocr-result-box">
          <pre>{JSON.stringify(ocrData, null, 2)}</pre>
        </div>
      )*/}
    </div>
  );
}

export default OCRSlot;

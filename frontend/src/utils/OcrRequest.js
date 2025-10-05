import React, { useEffect, useState } from "react";

const apiUrl = process.env.REACT_APP_API_URL;

function OcrRequest({ imgUrl = "", isTesting = false }) {
  const [file, setFile] = useState(null);
  const [resultImg, setResultImg] = useState("/default.webp");

  useEffect(() => {
    if (!imgUrl) return;

    (async () => {
      try {
        const res = await fetch(imgUrl);
        const blob = await res.blob();
        const fileObj = new File([blob], "upload.png", { type: blob.type });

        const fd = new FormData();
        fd.append("file", fileObj);

        const ocrRes = await fetch(`http://127.0.0.1:8000/ocr`, {
          method: "POST",
          body: fd,
        });

        if (!ocrRes.ok) throw new Error(`HTTP ${ocrRes.status}`);
        const data = await ocrRes.json();
        console.log("OCR 결과:", data);
      } catch (err) {
        console.error("OCR 요청 실패:", err);
      }
    })();
  }, [imgUrl]);

  useEffect(() => {
    if (!file) return;

    (async () => {
      try {
        const fd = new FormData();
        fd.append("file", file);

        const ocrRes = await fetch(`https://sseries-wuthering-ocr-kr.hf.space/ocr`, {
          method: "POST",
          body: fd,
        });

        if (!ocrRes.ok) throw new Error(`HTTP ${ocrRes.status}`);

        const data = await ocrRes.json();
        console.log(data);

        if (data.image_base64) {
          setResultImg(`data:image/jpeg;base64,${data.image_base64}`);
        } else {
          setResultImg(null);
        }
      } catch (err) {
        setResultImg(null);
      }
    })();
  }, [file]);

  return (
    <div>
      {isTesting && (
        <div>
          <input
            type="file"
            accept="image/*"
            onChange={(e) => {
              if (e.target.files && e.target.files[0]) {
                setFile(e.target.files[0]);
              }
            }}
          />
        </div>
      )}
      <img src={resultImg} />
    </div>
  );
}

export default OcrRequest;

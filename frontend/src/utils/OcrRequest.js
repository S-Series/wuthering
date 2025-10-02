import React, { useEffect, useState } from "react";

const apiUrl = process.env.REACT_APP_API_URL;

function OcrRequest({ imgUrl = "", isTesting = false }) {
  const [file, setFile] = useState(null);

  useEffect(() => {
    if (!imgUrl) return;

    (async () => {
      try {
        const res = await fetch(imgUrl);
        const blob = await res.blob();
        const fileObj = new File([blob], "upload.png", { type: blob.type });

        const fd = new FormData();
        fd.append("file", fileObj);

        const ocrRes = await fetch(`${apiUrl}/ocr?lang=kr`, {
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

  // 테스트 모드에서 직접 업로드한 파일을 OCR 요청
  useEffect(() => {
    if (!file) return;

    (async () => {
      try {
        const fd = new FormData();
        fd.append("file", file);

        const ocrRes = await fetch(`${apiUrl}/ocr?lang=kr`, {
          method: "POST",
          body: fd,
        });

        if (!ocrRes.ok) throw new Error(`HTTP ${ocrRes.status}`);
        const data = await ocrRes.json();
        console.log("OCR 결과 (업로드):", data);
      } catch (err) {
        console.error("OCR 업로드 실패:", err);
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
    </div>
  );
}

export default OcrRequest;

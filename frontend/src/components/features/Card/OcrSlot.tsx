import { useState } from "react";
import { requestOcrByUrl } from "@/api/ocr.api";
import { normalizeOcrTexts, ocrImageBase64ToDataUrl, retouchOcrTexts } from "@/api/ocr.api.helper";

import { useAppStore } from "@/stores/appStore";

import "./OcrSlot.css"

export default function OcrPlayground() {
  const {lang} = useAppStore();

  const [file, setFile] = useState<File | null>(null);
  const [status, setStatus] = useState<"Idle" | "Requested" | "Successed" | "Failed">("Idle");
  const [debug, setDebug] = useState<string>("");
  const [preview, setPreview] = useState<string | null>(null);

  const endpointUrl = "http://localhost:8080/api/ocr" as string;

  const run = async () => {
    if (!file) return;

    setStatus("Requested");
    setDebug("");
    setPreview(null);

    try {
      const data = await requestOcrByUrl(endpointUrl, file, lang, { timeoutMs: 60_000 });

      const texts = normalizeOcrTexts(data);
      const img = ocrImageBase64ToDataUrl(data.image_base64);

      if (img) setPreview(img);

      setDebug(
        JSON.stringify(
          {
            ok: true,
            textsCount: texts.length,
            full_text: data.full_text,
            texts: retouchOcrTexts(texts, "kr"),
          },
          null,
          2
        )
      );

      setStatus("Successed");
    } catch (e) {
      setStatus("Failed");
      setDebug(String(e));
      console.error(e);
    }
  };

  return (
    <div className="ocr-comp-body">
      <div className="ocr-slot">
        <div className="file-slot"
          tabIndex={0}
          onClick={() => {}}>
          <input
            type="file"
            accept="image/*"
            onChange={(e) => setFile(e.target.files?.[0] ?? null)}
          />
          <button>
            <span className={`${lang}-font`}>파일선택</span>
          </button>
        </div>

        <button onClick={run} disabled={!file || status === "Requested"}>
          OCR 요청
        </button>

        {preview ? <img src={preview} /> : null}
        <div>status: {status}</div>
      </div>


      <pre style={{ whiteSpace: "pre-wrap", border: "1px solid #ddd", padding: 12 }}>
        {debug}
      </pre>
    </div>
  );
}
import { useEffect, useRef, useState } from "react";
import { requestOcrByUrl } from "@/api/ocr.api";
import { normalizeOcrTexts, ocrImageBase64ToDataUrl, retouchOcrTexts } from "@/api/ocr.api.helper";

import { useAppStore } from "@/stores/appStore";

import "./OcrSlot.css"

export default function OcrPlayground() {
  const { lang } = useAppStore();

  const slotRef = useRef<HTMLDivElement | null>(null);
  const fileInputRef = useRef<HTMLInputElement | null>(null);

  const [file, setFile] = useState<File | null>(null);
  const [status, setStatus] = useState<"Idle" | "Requested" | "Successed" | "Failed">("Idle");
  const [debug, setDebug] = useState<string>("");
  const [preview, setPreview] = useState<string | null>(null);

  const [isFocused, setFocused] = useState(false);

  const endpointUrl = `${import.meta.env.VITE_GATEWAY_URL}/api/ocr` as string;

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

  useEffect(() => {
    const handleClickOutside = (e: MouseEvent) => {
      if (!slotRef.current) return;

      if (!slotRef.current.contains(e.target as Node)) {
        setFocused(false);
      }
    };

    document.addEventListener("mousedown", handleClickOutside);

    return () => {
      document.removeEventListener("mousedown", handleClickOutside);
    };
  }, []);

  useEffect(() => {
    const onPaste = (e: ClipboardEvent) => {
      if (!isFocused) return;

      const items = e.clipboardData?.items;
      if (!items) return;

      const imageItem = Array.from(items).find((it) => it.type.startsWith("image/"));
      if (!imageItem) return;

      const blob = imageItem.getAsFile();
      if (!blob) return;

      // 이름이 없을 수 있으니 임의로 만들어줌
      const ext = blob.type.split("/")[1] || "png";
      const pastedFile = new File([blob], `pasted-${Date.now()}.${ext}`, { type: blob.type });

      // React state 업데이트
      setFile(pastedFile);

      // input에도 파일 주입(가능한 브라우저에서)
      if (fileInputRef.current) {
        const dt = new DataTransfer();
        dt.items.add(pastedFile);

        // TS가 싫어할 수 있어서 캐스팅
        (fileInputRef.current as HTMLInputElement).files = dt.files;
      }

      // 기본 paste 동작 방지 (원치 않으면 제거)
      e.preventDefault();
    };

    window.addEventListener("paste", onPaste);
    return () => window.removeEventListener("paste", onPaste);
  }, [isFocused]);

  return (
    <div className="ocr-comp-body">
      <div className="ocr-slot">
        <div className={`file-slot ${isFocused ? "focused" : ""}`}
          ref={slotRef}
          tabIndex={0}
          onClick={() => {
            isFocused
              ? fileInputRef.current?.click()
              : setFocused(true)
          }}>
          <input className="image-input"
            ref={fileInputRef}
            type="file"
            accept="image/*"
            onChange={(e) => setFile(e.target.files?.[0] ?? null)}
          />
          {file ? <img src={URL.createObjectURL(file)} /> : null}
        </div>

        <button onClick={run} disabled={!file || status === "Requested"}>
          OCR 요청
        </button>

        <div>
          {preview ? <img src={preview} /> : null}
        </div>
        
        <div>status: {status}</div>
      </div>

      <div className="ocr-slot">
          <span>{debug}</span>
          <span>{debug}</span>
      </div>

      <div className="ocr-slot">
      </div>
    </div>
  );
}
import { useEffect, useRef, useState } from "react";
import { requestOcrByUrl } from "@/api/ocr.api";
import { normalizeOcrTexts, ocrImageBase64ToDataUrl, retouchOcrTexts, textsToStats } from "@/api/ocr.api.helper";

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
            texts: textsToStats(retouchOcrTexts(texts, lang), lang),
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

      const ext = blob.type.split("/")[1] || "png";
      const pastedFile = new File([blob], `pasted-${Date.now()}.${ext}`, { type: blob.type });

      setFile(pastedFile);

      if (fileInputRef.current) {
        const dt = new DataTransfer();
        dt.items.add(pastedFile);

        (fileInputRef.current as HTMLInputElement).files = dt.files;
      }

      e.preventDefault();
    };

    window.addEventListener("paste", onPaste);
    return () => window.removeEventListener("paste", onPaste);
  }, [isFocused]);

  return (
    <div className="ocr-comp-body">
      <div className="ocr-slot">
        <span className="en-font">status: {status}</span>

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
          {file ? (
            <img src={URL.createObjectURL(file)} />
          ) : (
            isFocused ? (
              <span className={`${lang}-font`} style={{whiteSpace:"pre", textAlign:"center"}}>
                {`Click to Select Image\nor\n"Ctrl+V" to Paste Image`}
              </span>
            ) : (
              <span>Click me to Start!</span>
            )
          )}
        </div>

        <div style={{ display: "flex", width: "100%", height:"auto" }}>
          {status === "Requested" ? (
            <div className="ocr-loading-slot">
              <div className="ocr-loading" />
              <span className="en-font">OCR Loading...</span>
            </div>
          ) : (
            <button className="ocr-button" onClick={run} disabled={!file}>
              OCR 요청
            </button>
          )}
        </div>
      </div>

      <div className="ocr-slot">
        <span className="en-font">OCR Result</span>
        <div className="file-slot">
          {preview ? <img src={preview} /> : null}
        </div>
        <span>{debug}</span>
      </div>

      <div className="ocr-slot">
      </div>
    </div>
  );
}
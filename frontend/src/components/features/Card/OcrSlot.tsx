import { useEffect, useMemo, useRef, useState } from "react";
import { requestOcrByUrl } from "@/api/ocr.api";
import { normalizeOcrTexts, ocrImageBase64ToDataUrl, retouchOcrTexts, textsToStats } from "@/api/ocr.api.helper";

import { useAppStore } from "@/stores/appStore";

import { locale } from "@/locales/locale";
import type { EchoId } from "@/datas/echos";
import { FixedStats, type StatId } from "@/datas/stats";

import "./OcrSlot.css"

export default function OcrPlayground() {
  const { lang } = useAppStore();

  const slotRef = useRef<HTMLDivElement | null>(null);
  const fileInputRef = useRef<HTMLInputElement | null>(null);

  const [file, setFile] = useState<File | null>(null);
  const [status, setStatus] = useState<"Idle" | "Requested" | "Successed" | "Failed">("Idle");
  const [debug, setDebug] = useState<{
    echoId: EchoId | null,
    echoName: string | null,
    cost: number,
    echoStats: [StatId, number][]
  } | null>();
  const [preview, setPreview] = useState<string | null>(null);

  const [isBoaring, setBoaring] = useState(false);

  const [isFocused, setFocused] = useState(false);

  const localeText = useMemo(() => locale(lang).ocr, [lang]);

  const endpointUrl = `${import.meta.env.VITE_GATEWAY_URL}/api/ocr` as string;

  const run = async () => {
    if (!file) return;

    setStatus("Requested");
    setDebug(null);
    setPreview(null);

    try {
      const data = await requestOcrByUrl(endpointUrl, file, lang, { timeoutMs: 60_000 });

      const texts = normalizeOcrTexts(data);
      const img = ocrImageBase64ToDataUrl(data.image_base64);

      if (img) setPreview(img);

      setDebug(textsToStats(retouchOcrTexts(texts, lang), lang));

      setStatus("Successed");
    } catch (e) {
      setStatus("Failed");
      setDebug(null);
      console.error(e);
    }
  };

  const StatsToText = (data: [StatId, number] | null): string => {
    if (!data) return "Error"
    const head: string = FixedStats[data[0]][lang];
    const tail = data[1].toString()
      + (["pct", "bns", "crit"].some((keyword) =>
        FixedStats[data[0]].id.toLowerCase().includes(keyword)
      )
        ? "%" : "");

    return `${head}: ${tail}`;
  }

  useEffect(() => {
    const onKeyDown = (e: KeyboardEvent) => {
      if (e.key === "Escape") setFocused(false);
    };
    document.addEventListener("keydown", onKeyDown);

    const handleClickOutside = (e: MouseEvent) => {
      if (!slotRef.current) return;

      if (!slotRef.current.contains(e.target as Node)) {
        setFocused(false);
      }
    };
    document.addEventListener("mousedown", handleClickOutside);

    return () => {
      document.removeEventListener("keydown", onKeyDown);
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

  useEffect(() => {
    setBoaring(false);
    if (status !== "Requested") return;

    const timer = setTimeout(() => { setBoaring(true) }, 1 * 1000);

    return () => clearTimeout(timer);
  }, [status])

  return (
    <div className="ocr-comp-body">
      <div className="ocr-slot">
        <div className="inner-slot top">
          <span className="en-font">{localeText.status}: {status}</span>

          <div className={`file-slot ${isFocused ? "focused" : ""}`}
            style={{ height: "60%" }}
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
              !isFocused ? (
                <span style={{ textDecoration: "underline" }}>{localeText.description1}</span>
              ) : (
                <span className={`${lang}-font`} style={{ whiteSpace: "pre", textAlign: "center" }}>
                  {localeText.description2}
                </span>
              )
            )}
          </div>

          <div style={{ display: "flex", flexDirection: "column", width: "100%", height: "20%" }}>
            {isBoaring ? (
              <span className={`${lang}-font`}
                style={{ whiteSpace: "pre", textAlign: "left", fontSize: "min(1vw, 1rem)", marginLeft: "10%" }}>
                {localeText.description3}
              </span>
            ) : (null)}

            {status === "Requested" ? (
              <div className="ocr-loading-slot">
                <div className="ocr-loading" />

                <span className="en-font">{localeText.loading}</span>
              </div>
            ) : (
              <button className="ocr-button" onClick={run} disabled={!file}>
                {localeText.request}
              </button>
            )}
          </div>
        </div>

        <div className="inner-slot bottom">
          <span className="en-font">{localeText.result}</span>

          <div style={{ display: "flex", width: "95%" }}>
            <div style={{ display: "flex", width: "65%" }}>
              <div className="file-slot">
                {preview ? <img src={preview} /> : null}
              </div>
            </div>

            <div style={{ display: "flex", flexDirection: "column", width: "30%"}}>
              <span className="ocr-span-font-sizing" style={{ marginTop: "auto" }}>
                §EchoId
              </span>
              <span className="ocr-span-font-sizing">
                {debug?.echoId ?? "undefined"}
              </span>
              <span className="ocr-span-font-sizing">
                §Cost
              </span>
              <span className="ocr-span-font-sizing" style={{ marginBottom: "10%" }}>
                EchoId
              </span>
            </div>
          </div>

          <div className="text-box">
            {debug ? (<>
              <span style={{ fontSize: "min(1vw, 0.85rem)" }}>{StatsToText(debug.echoStats[0]) ?? "undefined"}</span>
              <span style={{ fontSize: "min(1vw, 0.85rem)" }}>{StatsToText(debug.echoStats[1]) ?? "undefined"}</span>
              <span style={{ fontSize: "min(1vw, 0.85rem)" }}>{StatsToText(debug.echoStats[2]) ?? "undefined"}</span>
              <span style={{ fontSize: "min(1vw, 0.85rem)" }}>{StatsToText(debug.echoStats[3]) ?? "undefined"}</span>
              <span style={{ fontSize: "min(1vw, 0.85rem)" }}>{StatsToText(debug.echoStats[4]) ?? "undefined"}</span>
              <span style={{ fontSize: "min(1vw, 0.85rem)" }}>{StatsToText(debug.echoStats[5]) ?? "undefined"}</span>
              <span style={{ fontSize: "min(1vw, 0.85rem)" }}>{StatsToText(debug.echoStats[6]) ?? "undefined"}</span>
              <span style={{ fontSize: "min(1vw, 0.85rem)" }}>{StatsToText(debug.echoStats[7]) ?? "undefined"}</span>
            </>) : (null)}
          </div>
        </div>
      </div>



      <div className="ocr-slot big">
      </div>
    </div>
  );
}
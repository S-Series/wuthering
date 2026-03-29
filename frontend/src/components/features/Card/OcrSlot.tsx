import { useEffect, useMemo, useRef, useState } from "react";
import { requestOcrByUrl } from "@/api/ocr.api";
import { normalizeOcrTexts, ocrImageBase64ToDataUrl, retouchOcrTexts, textsToStats, checkOcrHealthByLang } from "@/api/ocr.api.helper";

import { useAppStore } from "@/stores/appStore";

import { locale } from "@/locales/locale";
import type { EchoId } from "@/datas/echos";
import { FixedStats, type StatId } from "@/datas/stats";

import OcrSelect from "@/components/features/Card/OcrSelect";
import "./OcrSlot.css"
import OcrSelectDrag from "./OcrDragSelect";
import { getRandomGif } from "@/lib/randomImg";


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

  const [isHealthy, setHealthy] = useState<boolean | null>(null);
  const [isBoaring, setBoaring] = useState(false);
  const [isFocused, setFocused] = useState(false);
  const [selectIdx, setSelectIdx] = useState<0 | 1 | 2 | 3 | 4 | 5 | 6 | 7 | 8 | 9>(0);

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

  const handleResetDebug = () => {
    setFile(null);
    setPreview(null);
    setDebug(null);
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
    const run = async () => {
      try {
        const health = await checkOcrHealthByLang(lang);
        setHealthy(health?.ok || false);
      } catch (e) {
        console.error(e);
        setHealthy(false);
      }
    };

    run();
  }, [lang]);

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

    const timer = setTimeout(() => { setBoaring(true) }, 10 * 1000);

    return () => clearTimeout(timer);
  }, [status])

  console.log(isHealthy);

  return (
    <div className="ocr-comp-body">
      <div className="ocr-slot ocr">
        {isHealthy === null ? (
          <div className="container checking">
            <img src={getRandomGif() ?? "/default.webp"} />
            <span>{localeText.healthCheck}</span>
          </div>) : (null)
        }

        <div className={`container ${isHealthy ? "" : "disable"}`}>
          <div className="inner-slot top">
            <span className="en-font">{localeText.status}: {status}</span>

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
                  style={{ whiteSpace: "pre", textAlign: "center", fontSize: "min(1vw, 1rem)" }}>
                  {localeText.description3}
                </span>
              ) : (null)}

              {!isHealthy ? (
                <span className={`${lang}-font`}
                  style={{ whiteSpace: "pre", textAlign: "center", fontSize: "min(1vw, 1rem)" }}>
                  {localeText.healthFalse}
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
              {/*
              <span className={`${lang}-font`}
                style={{ whiteSpace: "pre", textAlign: "center", fontSize: "min(1vw, 1rem)" }}>
                {(() => {
                  switch (lang) {
                    case "kr":
                      return "현재 OCR 서버 호스팅에 장애가 있습니다\n호스팅이 복구되는 대로 다시 연결하겠습니다";
                    case "en":
                      return "The OCR server hosting is currently experiencing an issue.\nWe will reconnect it as soon as the hosting is restored.";
                    case "jp":
                      return "現在、OCRサーバーのホスティングに障害が発生しています。\nホスティングが復旧し次第、再度接続いたします。";
                    case "zh":
                      return "当前 OCR 服务器托管出现故障。\n托管恢复后我们会立即重新连接。";
                    default:
                      return "";
                  }
                })()}
              </span>
                <button className="ocr-button" disabled>
                  {localeText.request}
                </button>
                */}
            </div>
          </div>

          <div className="inner-slot bottom">
            <span className="en-font">{localeText.result}</span>

            <div className="text-box">
              {debug ? (<>
                <span style={{ fontSize: "min(1vw, 0.85rem)" }}>EchoName: {debug?.echoName ?? "undefined"}</span>
                <span style={{ fontSize: "min(1vw, 0.85rem)" }}>Cost: {debug?.cost ?? "undefined"}</span>
                {debug.echoStats.map((item, idx) =>
                  <span key={`stat-text-${idx}`} style={{ fontSize: "min(1vw, 0.85rem)" }}>
                    {StatsToText(item) ?? "undefined"}
                  </span>
                )}
              </>) : (null)}
            </div>
          </div>
        </div>

        <div className={`container ${isHealthy ? "" : "disable"}`}>
          <div className="inner-slot result">
            <span className="en-font">{localeText.result}</span>
            <div className="file-slot">
              {preview ? <img src={preview} /> : null}
            </div>
          </div>

          <div style={{ display: "flex", flexDirection: "column", width: "90%", height: "67.5%", alignItems: "center", marginTop: "2.5%" }}>
            <OcrSelectDrag datas={{
              cost: debug?.cost as 4 | 3 | 1 ?? 4,
              echoId: debug?.echoId ?? null,
              stats: debug?.echoStats ?? null,
            }} selectIdx={selectIdx} resetAction={handleResetDebug} />
          </div>
        </div>
      </div>

      <div className="ocr-slot echo">
        <OcrSelect selectIdx={selectIdx} setSelectIdx={setSelectIdx} />
      </div>
    </div>
  );
}
import { useCallback, useEffect, useMemo, useRef, useState } from "react";

import { requestOcrByUrl } from "@/api/ocr.api";
import {
  checkOcrHealthByLang,
  normalizeOcrTexts,
  ocrImageBase64ToDataUrl,
  retouchOcrTexts,
  textsToStats,
  wakeOcrByLang,
} from "@/api/ocr.api.helper";
import type { EchoId } from "@/datas/echos";
import { locale } from "@/locales/locale";
import { getRandomGif } from "@/lib/randomImg";
import { useAppStore } from "@/stores/appStore";
import type { StatId } from "@/datas/stats";

import OcrDragSelect from "./OcrDragSelect";

export type OcrDebugData = {
  echoId: EchoId | null;
  echoName: string | null;
  cost: number;
  echoStats: [StatId, number][];
};

type EchoIndex = 0 | 1 | 2 | 3 | 4 | 5 | 6 | 7 | 8 | 9;

type Props = {
  selectIdx: EchoIndex;
  onSelectIdx: React.Dispatch<React.SetStateAction<EchoIndex>>;
  initialDebug: OcrDebugData | null | undefined;
  onDebugChange: (debug: OcrDebugData | null) => void;
};

export default function OcrImageInput({
  selectIdx,
  onSelectIdx,
  initialDebug,
  onDebugChange,
}: Props) {
  const { lang } = useAppStore();
  const slotRef = useRef<HTMLDivElement | null>(null);
  const fileInputRef = useRef<HTMLInputElement | null>(null);
  const ocrAbortRef = useRef<AbortController | null>(null);
  const ocrRequestIdRef = useRef(0);
  const filePreviewUrlRef = useRef<string | null>(null);

  const [file, setFile] = useState<File | null>(null);
  const [status, setStatus] = useState<
    "Idle" | "Requested" | "Successed" | "Failed"
  >("Idle");
  const [debug, setDebug] = useState<OcrDebugData | null>(
    initialDebug ?? null,
  );
  const [preview, setPreview] = useState<string | null>(null);
  const [refHeight, setRefHeight] = useState(0);
  const [isHealthy, setHealthy] = useState<boolean | null>(null);
  const [isBoaring, setBoaring] = useState(false);
  const [isFocused, setFocused] = useState(false);
  const [activeSelectIdx, setActiveSelectIdx] = useState<EchoIndex>(selectIdx);

  const localeText = useMemo(() => locale(lang).ocr, [lang]);
  const endpointUrl = `${import.meta.env.VITE_GATEWAY_URL}/api/ocr`;
  const [filePreviewUrl, setFilePreviewUrl] = useState<string | null>(null);

  const handleSelectIdx: React.Dispatch<React.SetStateAction<EchoIndex>> = (
    action,
  ) => {
    setActiveSelectIdx((current) => {
      const next = typeof action === "function" ? action(current) : action;
      onSelectIdx(next);
      return next;
    });
  };

  const cancelActiveOcrRequest = useCallback(() => {
    ocrAbortRef.current?.abort();
    ocrAbortRef.current = null;
    ocrRequestIdRef.current += 1;
  }, []);

  const replaceFile = useCallback((nextFile: File | null) => {
    cancelActiveOcrRequest();

    if (filePreviewUrlRef.current) {
      URL.revokeObjectURL(filePreviewUrlRef.current);
      filePreviewUrlRef.current = null;
    }

    const nextPreviewUrl = nextFile ? URL.createObjectURL(nextFile) : null;
    filePreviewUrlRef.current = nextPreviewUrl;

    setFile(nextFile);
    setFilePreviewUrl(nextPreviewUrl);
    setStatus("Idle");
    setBoaring(false);
    setPreview(null);
    setDebug(null);
    onDebugChange(null);

    if (!nextFile && fileInputRef.current) {
      fileInputRef.current.value = "";
    }
  }, [cancelActiveOcrRequest, onDebugChange]);

  const run = async () => {
    if (!file) return;

    cancelActiveOcrRequest();
    const controller = new AbortController();
    ocrAbortRef.current = controller;
    const requestId = ocrRequestIdRef.current;

    setStatus("Requested");
    setBoaring(false);
    setDebug(null);
    setPreview(null);
    onDebugChange(null);

    try {
      const data = await requestOcrByUrl(endpointUrl, file, lang, {
        signal: controller.signal,
        timeoutMs: 180_000,
      });
      if (controller.signal.aborted || ocrRequestIdRef.current !== requestId) {
        return;
      }

      const texts = normalizeOcrTexts(data);
      const image = ocrImageBase64ToDataUrl(data.image_base64);
      const nextDebug = textsToStats(
        retouchOcrTexts(texts, lang),
        lang,
      ) as OcrDebugData;

      if (image) setPreview(image);
      setDebug(nextDebug);
      onDebugChange(nextDebug);
      setBoaring(false);
      setStatus("Successed");
    } catch (error) {
      if (controller.signal.aborted) return;
      setBoaring(false);
      setStatus("Failed");
      setDebug(null);
      onDebugChange(null);
      console.error(error);
    } finally {
      if (ocrRequestIdRef.current === requestId) {
        ocrAbortRef.current = null;
      }
    }
  };

  const handleResetDebug = () => {
    replaceFile(null);
  };

  useEffect(() => {
    return () => {
      ocrAbortRef.current?.abort();
      if (filePreviewUrlRef.current) {
        URL.revokeObjectURL(filePreviewUrlRef.current);
      }
    };
  }, []);

  useEffect(() => {
    const onKeyDown = (event: KeyboardEvent) => {
      if (event.key === "Escape") setFocused(false);
    };
    const handleClickOutside = (event: MouseEvent) => {
      const element = slotRef.current;
      if (element && !element.contains(event.target as Node)) {
        setFocused(false);
      }
    };

    document.addEventListener("keydown", onKeyDown);
    document.addEventListener("mousedown", handleClickOutside);

    return () => {
      document.removeEventListener("keydown", onKeyDown);
      document.removeEventListener("mousedown", handleClickOutside);
    };
  }, []);

  useEffect(() => {
    const element = slotRef.current;
    if (!element) return;

    const updateHeight = () => {
      setRefHeight(element.getBoundingClientRect().height * 1.8);
    };
    updateHeight();

    const observer = new ResizeObserver(updateHeight);
    observer.observe(element);

    return () => observer.disconnect();
  }, []);

  useEffect(() => {
    let cancelled = false;
    const controller = new AbortController();

    const checkHealth = async () => {
      setHealthy(null);

      try {
        await wakeOcrByLang(lang, {
          signal: controller.signal,
          timeoutMs: 180_000,
        });
        if (cancelled) return;

        const health = await checkOcrHealthByLang(lang, {
          signal: controller.signal,
        });
        if (cancelled) return;

        setHealthy(health?.ok || false);
      } catch (error) {
        if (cancelled) return;

        console.error(error);
        setHealthy(false);
      }
    };

    void checkHealth();

    return () => {
      cancelled = true;
      controller.abort();
    };
  }, [lang]);

  useEffect(() => {
    const onPaste = (event: ClipboardEvent) => {
      if (!isFocused) return;

      const imageItem = Array.from(event.clipboardData?.items ?? []).find(
        (item) => item.type.startsWith("image/"),
      );
      const blob = imageItem?.getAsFile();
      if (!blob) return;

      const extension = blob.type.split("/")[1] || "png";
      const pastedFile = new File(
        [blob],
        `pasted-${Date.now()}.${extension}`,
        { type: blob.type },
      );
      replaceFile(pastedFile);

      if (fileInputRef.current) {
        const transfer = new DataTransfer();
        transfer.items.add(pastedFile);
        fileInputRef.current.files = transfer.files;
      }

      event.preventDefault();
    };

    window.addEventListener("paste", onPaste);
    return () => window.removeEventListener("paste", onPaste);
  }, [isFocused, replaceFile]);

  useEffect(() => {
    if (status !== "Requested") return;

    const timer = window.setTimeout(() => setBoaring(true), 10_000);
    return () => window.clearTimeout(timer);
  }, [status]);

  return (
    <div className="ocr-comp-body ocr-image-input-panel">
      {isHealthy === null && (
        <div className="container checking">
          <img src={getRandomGif() ?? "/default.webp"} alt="" />
          <span>{localeText.healthCheck}</span>
        </div>
      )}

      <div className="ocr-image-input-content">
        <OcrDragSelect
          datas={{
            cost: (debug?.cost as 4 | 3 | 1) ?? 4,
            echoId: debug?.echoId ?? null,
            stats: debug?.echoStats ?? null,
          }}
          selectIdx={activeSelectIdx}
          onSelectIdx={handleSelectIdx}
          height={refHeight}
          resetAction={handleResetDebug}
          inputSlot={
            <section className="ocr-image-card ocr-image-card--input">
              <span className="en-font">
                {localeText.status}: {status}
              </span>

              <div
                className={`file-slot ${isFocused ? "focused" : ""}`}
                ref={slotRef}
                tabIndex={0}
                onClick={() => {
                  if (isFocused) fileInputRef.current?.click();
                  else setFocused(true);
                }}
              >
                <input
                  className="image-input"
                  ref={fileInputRef}
                  type="file"
                  accept="image/*"
                  onChange={(event) =>
                    replaceFile(event.target.files?.[0] ?? null)
                  }
                />
                {file ? (
                  <img src={filePreviewUrl ?? ""} alt="" />
                ) : !isFocused ? (
                  <span style={{ textDecoration: "underline" }}>
                    {localeText.description1}
                  </span>
                ) : (
                  <span
                    className={`${lang}-font`}
                    style={{ whiteSpace: "pre", textAlign: "center" }}
                  >
                    {localeText.description2}
                  </span>
                )}
              </div>

              <div className="ocr-request-slot">
                {isBoaring && (
                  <span className={`${lang}-font ocr-message`}>
                    {localeText.description3}
                  </span>
                )}
                {!isHealthy && (
                  <span className={`${lang}-font ocr-message`}>
                    {localeText.healthFalse}
                  </span>
                )}

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
            </section>
          }
          resultSlot={
            <section className="ocr-image-card ocr-image-card--preview">
              <span className="en-font">{localeText.result}</span>
              <div className="file-slot">
                {preview && <img src={preview} alt="" />}
              </div>
            </section>
          }
        />
      </div>
    </div>
  );
}

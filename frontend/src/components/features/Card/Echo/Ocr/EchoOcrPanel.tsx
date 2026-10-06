import { useCallback, useEffect, useMemo, useRef, useState } from "react";

import {
  checkOcrHealthByLang,
  wakeOcrByLang,
} from "@/api/ocr.api.helper";
import type { EchoId } from "@/datas/echos";
import { locale } from "@/locales/locale";
import { getRandomGif } from "@/lib/randomImg";
import { useAppStore } from "@/stores/appStore";
import type { StatId } from "@/datas/stats";
import type { HarmonyId } from "@/datas/harmonies";

import EchoOcrResultEditor from "./EchoOcrResultEditor";
import { recognizeEchoImage } from "./echoOcr.helpers";
import "./EchoOcrPanel.css";
import { useElevatedOverlay } from "@/contexts/useElevatedOverlay";
import EchoBatchOcrDialog from "./EchoBatchOcrDialog";

export type EchoOcrResult = {
  echoId: EchoId | null;
  echoName: string | null;
  cost: number;
  echoStats: [StatId, number][];
  setId?: HarmonyId | null;
};

type EchoIndex = 0 | 1 | 2 | 3 | 4 | 5 | 6 | 7 | 8 | 9;
const MAX_OCR_IMAGES = 10;

type OcrImageStatus = "Queued" | "Requested" | "Successed" | "Failed";

type OcrImageItem = {
  id: string;
  file: File;
  previewUrl: string;
  status: OcrImageStatus;
  result: EchoOcrResult | null;
  error: string | null;
};

type Props = {
  selectIdx: EchoIndex;
  initialDebug: EchoOcrResult | null | undefined;
  onDebugChange: (debug: EchoOcrResult | null) => void;
};

export default function EchoOcrPanel({
  selectIdx,
  initialDebug,
  onDebugChange,
}: Props) {
  const { lang } = useAppStore();
  const { openElevatedOverlay } = useElevatedOverlay();
  const slotRef = useRef<HTMLDivElement | null>(null);
  const fileInputRef = useRef<HTMLInputElement | null>(null);
  const ocrAbortRef = useRef<AbortController | null>(null);
  const ocrRequestIdRef = useRef(0);
  const previewUrlsRef = useRef<Set<string>>(new Set());
  const activeImageIdRef = useRef<string | null>(null);

  const [images, setImages] = useState<OcrImageItem[]>([]);
  const [activeImageId, setActiveImageId] = useState<string | null>(null);
  const [debug, setDebug] = useState<EchoOcrResult | null>(
    initialDebug ?? null,
  );
  const [isHealthy, setHealthy] = useState<boolean | null>(null);
  const [isFocused, setFocused] = useState(false);

  const localeText = useMemo(() => locale(lang).ocr, [lang]);
  const activeImage = images.find(image => image.id === activeImageId) ?? null;
  const isProcessing = images.some((image) => image.status === "Requested");
  const hasPendingImages = images.some(
    (image) => image.status === "Queued" || image.status === "Failed",
  );

  const cancelActiveOcrRequest = useCallback(() => {
    ocrAbortRef.current?.abort();
    ocrAbortRef.current = null;
    ocrRequestIdRef.current += 1;
  }, []);

  const selectImage = useCallback((image: OcrImageItem | null) => {
    const nextId = image?.id ?? null;
    const nextResult = image?.result ?? null;

    activeImageIdRef.current = nextId;
    setActiveImageId(nextId);
    setDebug(nextResult);
    onDebugChange(nextResult);
  }, [onDebugChange]);

  const updateImage = useCallback(
    (id: string, patch: Partial<OcrImageItem>) => {
      setImages((current) =>
        current.map((image) =>
          image.id === id ? { ...image, ...patch } : image,
        ),
      );
    },
    [],
  );

  const queueFile = useCallback((selectedFiles: File[]) => {
    const files = selectedFiles
      .filter((item) => item.type.startsWith("image/"))
      .slice(0, Math.max(0, MAX_OCR_IMAGES - previewUrlsRef.current.size));
    if (!files.length || ocrAbortRef.current) return;

    const queuedImages = files.map(file => {
      const previewUrl = URL.createObjectURL(file);
      previewUrlsRef.current.add(previewUrl);
      const queuedImage: OcrImageItem = {
        id: crypto.randomUUID(),
        file,
        previewUrl,
        status: "Queued",
        result: null,
        error: null,
      };
      return queuedImage;
    });

    setImages(current => [...current, ...queuedImages]);
    selectImage(queuedImages[0]);
  }, [selectImage]);

  const runOcr = useCallback(async () => {
    const pendingImages = images.filter(
      (image) => image.status === "Queued" || image.status === "Failed",
    );
    if (pendingImages.length === 0 || ocrAbortRef.current) return;

    cancelActiveOcrRequest();
    const controller = new AbortController();
    ocrAbortRef.current = controller;
    const requestId = ocrRequestIdRef.current;

    if (images.length > 1) {
      const firstImage = images[0];
      updateImage(firstImage.id, { status: "Requested", error: null });
      let first: { result: EchoOcrResult | null; error: string | null };
      try {
        first = { result: firstImage.result ?? await recognizeEchoImage(firstImage.file, lang, controller.signal), error: null };
      } catch (error) {
        if (controller.signal.aborted) return;
        first = { result: null, error: error instanceof Error ? error.message : "OCR failed" };
      }
      if (controller.signal.aborted || requestId !== ocrRequestIdRef.current) return;
      ocrAbortRef.current = null;
      setFocused(false);
      openElevatedOverlay(
        <EchoBatchOcrDialog files={images.map(image => image.file)} first={first} startIndex={selectIdx} requestLang={lang} />,
        { title: localeText.batchTitle, width: "min(96vw, 68rem)", height: "min(88vh, 42rem)", ratio: null, closeOnBackdrop: false },
      );
      previewUrlsRef.current.forEach(url => URL.revokeObjectURL(url));
      previewUrlsRef.current.clear();
      setImages([]);
      selectImage(null);
      return;
    }

    for (const image of pendingImages) {
      if (controller.signal.aborted || ocrRequestIdRef.current !== requestId) {
        break;
      }

      updateImage(image.id, { status: "Requested", error: null });

      try {
        const result = await recognizeEchoImage(
          image.file,
          lang,
          controller.signal,
        );
        updateImage(image.id, {
          status: "Successed",
          result,
          error: null,
        });

        if (activeImageIdRef.current === image.id) {
          setDebug(result);
          onDebugChange(result);
        }
      } catch (error) {
        if (controller.signal.aborted) break;

        const message =
          error instanceof Error ? error.message : "OCR 처리에 실패했습니다.";
        updateImage(image.id, {
          status: "Failed",
          result: null,
          error: message,
        });

        if (activeImageIdRef.current === image.id) {
          setDebug(null);
          onDebugChange(null);
        }
        console.error(error);
      }
    }

    if (ocrRequestIdRef.current === requestId) {
      ocrAbortRef.current = null;
    }
  }, [cancelActiveOcrRequest, images, lang, onDebugChange, updateImage, openElevatedOverlay, selectIdx, localeText.batchTitle, selectImage]);

  const removeImage = useCallback((id: string) => {
    const targetIndex = images.findIndex((image) => image.id === id);
    const target = images[targetIndex];
    if (!target || target.status === "Requested") return;

    URL.revokeObjectURL(target.previewUrl);
    previewUrlsRef.current.delete(target.previewUrl);

    const nextImages = images.filter((image) => image.id !== id);
    setImages(nextImages);

    if (activeImageIdRef.current === id) {
      selectImage(nextImages[targetIndex] ?? nextImages[targetIndex - 1] ?? null);
    }
  }, [images, selectImage]);

  const handleAppliedImage = useCallback(() => {
    if (activeImageIdRef.current) removeImage(activeImageIdRef.current);
  }, [removeImage]);

  useEffect(() => {
    const previewUrls = previewUrlsRef.current;

    return () => {
      ocrAbortRef.current?.abort();
      previewUrls.forEach((url) => URL.revokeObjectURL(url));
      previewUrls.clear();
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
      if (!isFocused || isProcessing) return;

      const pastedFile = Array.from(event.clipboardData?.items ?? [])
        .filter((item) => item.type.startsWith("image/"))
        .map((item) => {
          const blob = item.getAsFile();
          if (!blob) return null;

          const extension = blob.type.split("/")[1] || "png";
          return new File(
            [blob],
            `pasted-${Date.now()}.${extension}`,
            { type: blob.type },
          );
        })
        .filter((file): file is File => file !== null);
      if (!pastedFile.length) return;

      queueFile(pastedFile);

      event.preventDefault();
    };

    window.addEventListener("paste", onPaste);
    return () => window.removeEventListener("paste", onPaste);
  }, [isFocused, isProcessing, queueFile]);

  return (
    <div className="ocr-image-input-panel">
      {isHealthy === null && (
        <div className="container checking">
          <img src={getRandomGif() ?? "/default.webp"} alt="" />
          <span>{localeText.healthCheck}</span>
        </div>
      )}

      <div className="ocr-image-input-content">
        <EchoOcrResultEditor
          datas={{
            cost: (debug?.cost as 4 | 3 | 1) ?? 4,
            echoId: debug?.echoId ?? null,
            stats: debug?.echoStats ?? null,
            setId: debug?.setId ?? null,
          }}
          selectIdx={selectIdx}
          resetAction={handleAppliedImage}
          inputSlot={
            <section className="ocr-image-card ocr-image-card--input">
              <div
                className={`file-slot ocr-file-slot ${isFocused ? "focused" : ""}`}
                ref={slotRef}
                tabIndex={0}
                onFocus={() => setFocused(true)}
                onDragOver={event => event.preventDefault()}
                onDrop={event => { event.preventDefault(); queueFile(Array.from(event.dataTransfer.files)); }}
              >
                <input
                  className="image-input"
                  ref={fileInputRef}
                  type="file"
                  accept="image/*"
                  multiple
                  disabled={isProcessing || images.length >= MAX_OCR_IMAGES}
                  onChange={(event) => {
                    const selectedFiles = Array.from(event.target.files ?? []);
                    event.target.value = "";
                    queueFile(selectedFiles);
                  }}
                />
                {!activeImage ? (
                  <button
                    type="button"
                    className="ocr-file-slot__empty"
                    onClick={() => fileInputRef.current?.click()}
                  >
                    <span className={`${lang}-font`}>
                      {isFocused
                        ? localeText.description2
                        : localeText.description1}
                    </span>
                  </button>
                ) : images.length > 1 ? (
                  <div className="ocr-file-slot__queue">
                    {images.map(image => <article key={image.id}>
                      <img src={image.previewUrl} alt={image.file.name} />
                      <button type="button" disabled={isProcessing} aria-label={`Remove ${image.file.name}`} onClick={() => removeImage(image.id)}>×</button>
                    </article>)}
                    <button type="button" disabled={isProcessing || images.length >= MAX_OCR_IMAGES} onClick={() => fileInputRef.current?.click()}>{localeText.batchAdd}</button>
                  </div>
                ) : (
                  <article
                    className={`ocr-single-image ${
                      activeImageId === activeImage.id ? "selected" : ""
                    } ${activeImage.status.toLowerCase()}`}
                  >
                    <button
                      type="button"
                      className="ocr-single-image__select"
                      onClick={() => fileInputRef.current?.click()}
                      title={activeImage.error ?? activeImage.file.name}
                    >
                      <img
                        src={activeImage.previewUrl}
                        alt={activeImage.file.name}
                      />
                    </button>
                    <span
                      className="ocr-single-image__status"
                      aria-label={activeImage.status}
                    >
                      {activeImage.status === "Requested"
                        ? ""
                        : activeImage.status === "Successed"
                          ? "✓"
                          : activeImage.status === "Failed"
                            ? "!"
                            : "…"}
                    </span>
                    <button
                      type="button"
                      className="ocr-single-image__remove"
                      aria-label={localeText.batchAdd}
                      disabled={activeImage.status === "Requested"}
                      onClick={() => fileInputRef.current?.click()}
                    >
                      +
                    </button>
                    <button
                      type="button"
                      className="ocr-single-image__delete"
                      aria-label={`Remove ${activeImage.file.name}`}
                      disabled={activeImage.status === "Requested"}
                      onClick={() => removeImage(activeImage.id)}
                    >
                      ×
                    </button>
                  </article>
                )}
                <button
                  type="button"
                  className="ocr-file-slot__request"
                  disabled={!hasPendingImages || isProcessing}
                  onClick={() => void runOcr()}
                >
                  {localeText.request}
                </button>
                {activeImage?.error && (
                  <p className="ocr-file-slot__error" role="alert">{activeImage.error}</p>
                )}
              </div>
            </section>
          }
        />
      </div>
    </div>
  );
}

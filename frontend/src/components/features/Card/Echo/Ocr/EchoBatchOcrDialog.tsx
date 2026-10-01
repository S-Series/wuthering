import { useCallback, useEffect, useMemo, useRef, useState } from "react";

import { wakeOcrByLang } from "@/api/ocr.api.helper";
import { useElevatedOverlay } from "@/contexts/useElevatedOverlay";
import { locale } from "@/locales/locale";
import { echoOcrResultToRuntime, recognizeEchoImage } from "./echoOcr.helpers";
import { useAppStore } from "@/stores/appStore";
import { useCharacter } from "@/stores/characterDataStore";
import type { CharacterData } from "@/types/character.type";

import type { EchoOcrResult } from "./EchoOcrPanel";
import "./EchoBatchOcrDialog.css";

type BatchStatus = "queued" | "processing" | "success" | "failed";

type BatchItem = {
  id: string;
  file: File;
  previewUrl: string;
  status: BatchStatus;
  result: EchoOcrResult | null;
  error: string | null;
};

type Props = {
  startIndex: number;
};

export default function EchoBatchOcrDialog({ startIndex }: Props) {
  const { lang } = useAppStore();
  const { characterData, patchCharacterData } = useCharacter();
  const { closeElevatedOverlay } = useElevatedOverlay();
  const inputRef = useRef<HTMLInputElement | null>(null);
  const abortRef = useRef<AbortController | null>(null);
  const previewUrlsRef = useRef<Set<string>>(new Set());
  const [items, setItems] = useState<BatchItem[]>([]);
  const [isProcessing, setProcessing] = useState(false);
  const [batchError, setBatchError] = useState<string | null>(null);

  const localeText = useMemo(() => locale(lang).ocr, [lang]);
  const capacity = 10 - startIndex;
  const completedCount = items.filter(
    (item) => item.status === "success" || item.status === "failed",
  ).length;
  const successCount = items.filter((item) => item.status === "success").length;

  const addFiles = useCallback((files: File[]) => {
    if (isProcessing) return;

    setItems((current) => {
      const available = Math.max(0, capacity - current.length);
      const nextFiles = files
        .filter((file) => file.type.startsWith("image/"))
        .slice(0, available);
      const additions = nextFiles.map<BatchItem>((file) => {
        const previewUrl = URL.createObjectURL(file);
        previewUrlsRef.current.add(previewUrl);
        return {
          id: crypto.randomUUID(),
          file,
          previewUrl,
          status: "queued",
          result: null,
          error: null,
        };
      });

      return [...current, ...additions];
    });
  }, [capacity, isProcessing]);

  const removeItem = useCallback((id: string) => {
    if (isProcessing) return;

    setItems((current) => {
      const target = current.find((item) => item.id === id);
      if (target) {
        URL.revokeObjectURL(target.previewUrl);
        previewUrlsRef.current.delete(target.previewUrl);
      }
      return current.filter((item) => item.id !== id);
    });
  }, [isProcessing]);

  const updateItem = useCallback(
    (id: string, patch: Partial<BatchItem>) => {
      setItems((current) =>
        current.map((item) =>
          item.id === id ? { ...item, ...patch } : item,
        ),
      );
    },
    [],
  );

  const runBatch = useCallback(async () => {
    const queuedItems = items.filter(
      (item) => item.status === "queued" || item.status === "failed",
    );
    if (queuedItems.length === 0 || abortRef.current) return;

    const controller = new AbortController();
    abortRef.current = controller;
    setProcessing(true);
    setBatchError(null);

    try {
      await wakeOcrByLang(lang, {
        signal: controller.signal,
        timeoutMs: 180_000,
      });

      for (const item of queuedItems) {
        if (controller.signal.aborted) break;
        updateItem(item.id, {
          status: "processing",
          result: null,
          error: null,
        });

        try {
          const result = await recognizeEchoImage(
            item.file,
            lang,
            controller.signal,
          );
          updateItem(item.id, { status: "success", result, error: null });
        } catch (error) {
          if (controller.signal.aborted) break;
          updateItem(item.id, {
            status: "failed",
            result: null,
            error:
              error instanceof Error
                ? error.message
                : "OCR 처리에 실패했습니다.",
          });
        }
      }
    } catch (error) {
      if (!controller.signal.aborted) {
        setBatchError(
          error instanceof Error
            ? error.message
            : "OCR 서버에 연결하지 못했습니다.",
        );
      }
    } finally {
      if (abortRef.current === controller) abortRef.current = null;
      setProcessing(false);
    }
  }, [items, lang, updateItem]);

  const applyResults = useCallback(() => {
    const nextEchoData = [...characterData.echoData] as CharacterData["echoData"];

    items.forEach((item, index) => {
      const targetIndex = startIndex + index;
      if (!item.result || item.status !== "success" || targetIndex >= 10) return;
      nextEchoData[targetIndex] = echoOcrResultToRuntime(item.result);
    });

    patchCharacterData({ echoData: nextEchoData });
    closeElevatedOverlay();
  }, [characterData.echoData, closeElevatedOverlay, items, patchCharacterData, startIndex]);

  useEffect(() => {
    const previewUrls = previewUrlsRef.current;
    return () => {
      abortRef.current?.abort();
      previewUrls.forEach((url) => URL.revokeObjectURL(url));
      previewUrls.clear();
    };
  }, []);

  return (
    <div className="echo-batch-ocr-dialog">
      <input
        ref={inputRef}
        className="echo-batch-ocr-dialog__input"
        type="file"
        accept="image/*"
        multiple
        disabled={isProcessing || items.length >= capacity}
        onChange={(event) => {
          addFiles(Array.from(event.target.files ?? []));
          event.target.value = "";
        }}
      />

      <div className="echo-batch-ocr-dialog__toolbar">
        <p>
          Slot {startIndex + 1} - 10 · {items.length}/{capacity}
        </p>
        <button
          type="button"
          disabled={isProcessing || items.length >= capacity}
          onClick={() => inputRef.current?.click()}
        >
          + {localeText.batchAdd}
        </button>
      </div>

      <div
        className={`echo-batch-ocr-dialog__queue ${items.length === 0 ? "empty" : ""}`}
        onDragOver={(event) => event.preventDefault()}
        onDrop={(event) => {
          event.preventDefault();
          addFiles(Array.from(event.dataTransfer.files));
        }}
      >
        {items.length === 0 ? (
          <button type="button" onClick={() => inputRef.current?.click()}>
            {localeText.batchEmpty}
          </button>
        ) : (
          items.map((item, index) => (
            <article
              className={`echo-batch-ocr-item ${item.status}`}
              key={item.id}
              title={item.error ?? item.file.name}
            >
              <img src={item.previewUrl} alt={item.file.name} />
              <span className="echo-batch-ocr-item__slot">
                Slot {startIndex + index + 1}
              </span>
              <span
                className="echo-batch-ocr-item__status"
                aria-label={item.status}
              >
                {item.status === "processing"
                  ? ""
                  : item.status === "success"
                    ? "✓"
                    : item.status === "failed"
                      ? "!"
                      : "…"}
              </span>
              <button
                type="button"
                aria-label={`Remove ${item.file.name}`}
                disabled={isProcessing}
                onClick={() => removeItem(item.id)}
              >
                ×
              </button>
            </article>
          ))
        )}
      </div>

      <div className="echo-batch-ocr-dialog__progress" aria-live="polite">
        <span>
          {isProcessing ? localeText.batchProgress : localeText.batchComplete}
        </span>
        <strong>{completedCount} / {items.length}</strong>
        <div>
          <i
            style={{
              width: items.length === 0
                ? "0%"
                : `${(completedCount / items.length) * 100}%`,
            }}
          />
        </div>
      </div>

      {batchError && (
        <p className="echo-batch-ocr-dialog__error" role="alert">
          {batchError}
        </p>
      )}

      <div className="echo-batch-ocr-dialog__actions">
        <button
          type="button"
          disabled={items.length === 0 || isProcessing}
          onClick={() => void runBatch()}
        >
          {localeText.batchStart}
        </button>
        <button
          type="button"
          disabled={isProcessing || successCount === 0}
          onClick={applyResults}
        >
          {localeText.batchApply} ({successCount})
        </button>
      </div>
    </div>
  );
}

import { useEffect } from "react";
import { useLocation } from "react-router-dom";

import { checkOcrHealthByLang, wakeOcrByLang } from "@/api/ocr.api.helper";
import { useAppStore } from "@/stores/appStore";

const OCR_PING_TIMEOUT_MS = 5_000;
const OCR_WAKE_TIMEOUT_MS = 180_000;
const OCR_RETRY_INTERVAL_MS = 30_000;
const OCR_RATE_LIMIT_RETRY_INTERVAL_MS = 5 * 60_000;
const OCR_HEALTH_CACHE_MS = 10 * 60_000;

const lastHealthyAtByLang = new Map<string, number>();
const inFlightByLang = new Set<string>();

function isRateLimitError(error: unknown) {
  return error instanceof Error && error.message.includes("429");
}

export default function OcrServerWatcher() {
  const { lang } = useAppStore();
  const location = useLocation();
  const shouldWatchOcr = location.pathname.startsWith("/card");

  useEffect(() => {
    if (!shouldWatchOcr) return;

    let stopped = false;
    let retryTimer: number | null = null;
    const controller = new AbortController();

    const clearRetryTimer = () => {
      if (retryTimer === null) return;

      window.clearTimeout(retryTimer);
      retryTimer = null;
    };

    const scheduleRetry = (delayMs = OCR_RETRY_INTERVAL_MS) => {
      clearRetryTimer();
      retryTimer = window.setTimeout(() => {
        void pingAndWake();
      }, delayMs);
    };

    const pingAndWake = async () => {
      if (stopped) return;

      const lastHealthyAt = lastHealthyAtByLang.get(lang) ?? 0;
      if (Date.now() - lastHealthyAt < OCR_HEALTH_CACHE_MS) return;
      if (inFlightByLang.has(lang)) return;

      inFlightByLang.add(lang);

      try {
        const health = await checkOcrHealthByLang(lang, {
          signal: controller.signal,
          timeoutMs: OCR_PING_TIMEOUT_MS,
        });

        if (stopped) return;
        if (health?.ok) {
          lastHealthyAtByLang.set(lang, Date.now());
          inFlightByLang.delete(lang);
          return;
        }
      } catch (error) {
        if (stopped) return;

        if (isRateLimitError(error)) {
          console.warn("OCR health is rate limited. Retrying later.", error);
          inFlightByLang.delete(lang);
          scheduleRetry(OCR_RATE_LIMIT_RETRY_INTERVAL_MS);
          return;
        }

        console.warn("OCR ping failed. Trying to wake server.", error);
      }

      try {
        await wakeOcrByLang(lang, {
          signal: controller.signal,
          timeoutMs: OCR_WAKE_TIMEOUT_MS,
        });

        if (stopped) return;

        const health = await checkOcrHealthByLang(lang, {
          signal: controller.signal,
          timeoutMs: OCR_PING_TIMEOUT_MS,
        });

        if (health?.ok) {
          lastHealthyAtByLang.set(lang, Date.now());
          return;
        }
      } catch (error) {
        if (stopped) return;

        if (isRateLimitError(error)) {
          console.warn("OCR wake/health is rate limited. Retrying later.", error);
          scheduleRetry(OCR_RATE_LIMIT_RETRY_INTERVAL_MS);
          return;
        }

        console.warn("OCR wake failed. Will retry ping.", error);
      } finally {
        inFlightByLang.delete(lang);
      }

      if (!stopped) scheduleRetry();
    };

    void pingAndWake();

    return () => {
      stopped = true;
      controller.abort();
      clearRetryTimer();
    };
  }, [lang, shouldWatchOcr]);

  return null;
}

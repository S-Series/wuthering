import { useEffect } from "react";

import {
  checkOcrHealthByLang,
  wakeOcrByLang,
} from "@/api/ocr.api.helper";
import { useAppStore } from "@/stores/appStore";

const OCR_PING_TIMEOUT_MS = 5_000;
const OCR_WAKE_TIMEOUT_MS = 180_000;
const OCR_RETRY_INTERVAL_MS = 30_000;

export default function OcrServerWatcher() {
  const { lang } = useAppStore();

  useEffect(() => {
    let stopped = false;
    let retryTimer: number | null = null;
    const controller = new AbortController();

    const clearRetryTimer = () => {
      if (retryTimer === null) return;

      window.clearTimeout(retryTimer);
      retryTimer = null;
    };

    const scheduleRetry = () => {
      clearRetryTimer();

      retryTimer = window.setTimeout(() => {
        void pingAndWake();
      }, OCR_RETRY_INTERVAL_MS);
    };

    const pingAndWake = async () => {
      if (stopped) return;

      try {
        const health = await checkOcrHealthByLang(lang, {
          signal: controller.signal,
          timeoutMs: OCR_PING_TIMEOUT_MS,
        });

        if (stopped) return;
        if (health?.ok) return;
      } catch (error) {
        if (stopped) return;

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

        if (health?.ok) return;
      } catch (error) {
        if (stopped) return;

        console.warn("OCR wake failed. Will retry ping.", error);
      }

      if (!stopped) scheduleRetry();
    };

    void pingAndWake();

    return () => {
      stopped = true;
      controller.abort();
      clearRetryTimer();
    };
  }, [lang]);

  return null;
}

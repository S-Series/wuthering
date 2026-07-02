export type YoutubeLatestVideo = {
  videoId: string;
  title: string;
  thumbnail: string;
  publishedAt: string;
};
export type YoutubePlaylistType = "officialTrailer" | "characterTrailer" | "characterIntro";
export type YoutubeLang = "kr" | "en" | "jp" | "zh";

export async function fetchLatestYoutube(
  lang: string,
  type: YoutubePlaylistType,
  opts?: { signal?: AbortSignal; timeoutMs?: number }
): Promise<YoutubeLatestVideo | null> {
  const url =
    `${import.meta.env.VITE_GATEWAY_URL}/api/youtube/latest?` +
    `lang=${encodeURIComponent(lang)}&` +
    `type=${encodeURIComponent(type)}`;
  const controller = new AbortController();
  const timeoutId = window.setTimeout(
    () => controller.abort(),
    opts?.timeoutMs ?? 10_000,
  );
  const { signal, cleanup } = mergeAbortSignals(opts?.signal, controller.signal);

  try {
    const res = await fetch(url, { signal });
    if (!res.ok) return null;
    return (await res.json()) as YoutubeLatestVideo | null;
  } finally {
    cleanup();
    window.clearTimeout(timeoutId);
  }
}

function mergeAbortSignals(a?: AbortSignal, b?: AbortSignal) {
  if (!a) return { signal: b, cleanup: () => undefined };
  if (!b) return { signal: a, cleanup: () => undefined };

  const controller = new AbortController();
  const cleanup = () => {
    a.removeEventListener("abort", onAbort);
    b.removeEventListener("abort", onAbort);
  };
  const onAbort = () => {
    cleanup();
    controller.abort();
  };

  if (a.aborted || b.aborted) {
    controller.abort();
    return { signal: controller.signal, cleanup: () => undefined };
  }

  a.addEventListener("abort", onAbort, { once: true });
  b.addEventListener("abort", onAbort, { once: true });

  return { signal: controller.signal, cleanup };
}

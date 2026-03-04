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
  opts?: { signal?: AbortSignal }
): Promise<YoutubeLatestVideo | null> {
  const url =
    `${import.meta.env.VITE_GATEWAY_URL}/api/youtube/latest?` +
    `lang=${encodeURIComponent(lang)}&` +
    `type=${encodeURIComponent(type)}`;
  const res = await fetch(url, { signal: opts?.signal });
  if (!res.ok) return null;
  return (await res.json()) as YoutubeLatestVideo | null;
}
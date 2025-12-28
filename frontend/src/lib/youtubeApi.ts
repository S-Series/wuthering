const API_KEY = import.meta.env.VITE_YT_API_KEY;

export type YoutubeLatestVideo = {
  videoId: string;
  title: string;
  thumbnail: string;
  publishedAt: string;
};

export async function fetchLatestFromPlaylist(
  playlistId: string
): Promise<YoutubeLatestVideo | null> {
  try {
    const res = await fetch(
      `https://www.googleapis.com/youtube/v3/playlistItems?` +
        `part=snippet&playlistId=${playlistId}&maxResults=1&key=${API_KEY}`
    );

    if (!res.ok) {
      console.error("YouTube API error:", res.status);
      return null;
    }

    const data = await res.json();

    if (!data.items || data.items.length === 0) {
      return null;
    }

    const snippet = data.items[0].snippet;

    return {
      videoId: snippet.resourceId.videoId,
      title: snippet.title,
      thumbnail:
        snippet.thumbnails?.high?.url ??
        snippet.thumbnails?.medium?.url ??
        snippet.thumbnails?.default?.url ??
        "",
      publishedAt: snippet.publishedAt,
    };
  } catch (err) {
    console.error("fetchLatestFromPlaylist failed:", err);
    return null;
  }
}

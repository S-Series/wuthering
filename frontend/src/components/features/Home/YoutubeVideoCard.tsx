import { useState } from "react";
import { useAppStore } from "@/stores/appStore";
import type { YoutubeLatestVideo } from "@/api/youtube.api";

import "./YoutubeVideoCard.css"
import { useOverlay } from "@/contexts/PopupContext";
import { locale } from "@/locales/locale";


type Props = {
  video: YoutubeLatestVideo;
};

export default function YoutubeVideoCard({ video }: Props) {
  const { lang } = useAppStore();
  const {closeOverlay} = useOverlay();
  const [isPlaying, setIsPlaying] = useState(false);
  const localeText = locale(lang);

  return (
    <div className="youtube-card">
      <div className="youtube-meta">
        <p className="en-font">Publiched At. {video.publishedAt}</p>
      </div>
      {!isPlaying ? (
        <button
          type="button"
          className="youtube-thumb-button"
          onClick={() => setIsPlaying(true)}
        >
          <img src={video.thumbnail} alt={video.title} className="youtube-thumb" />
          <span className="youtube-play">▶</span>
        </button>
      ) : (
        <iframe
          className="youtube-iframe"
          src={`https://www.youtube.com/embed/${video.videoId}?autoplay=1`}
          title={video.title}
          allow="accelerometer; autoplay; clipboard-write; encrypted-media; gyroscope; picture-in-picture; web-share"
          referrerPolicy="strict-origin-when-cross-origin"
          allowFullScreen
        />
      )}
      <div className="youtube-panel-control">
        <button onClick={closeOverlay} className={`${lang}-font`}>
          {localeText.common.close}
        </button>
      </div>
    </div>
  );
}

import { useState, useEffect } from "react"

import { useAppStore } from "@/stores/appStore";

import { YOUTUBE_PLAYLISTS } from "@/lib/youtubePlaylists";
import { fetchLatestFromPlaylist } from "@/lib/youtubeApi";
import type { YoutubeLatestVideo } from "@/lib/youtubeApi";

import "@/pages/_Page.css"
import "@/pages/Home.css"


/* ================================================ */

export default function Home() {

  const { lang } = useAppStore();

  //const playlists = YOUTUBE_PLAYLISTS[lang];

  const [trailer, setTrailer] = useState<YoutubeLatestVideo | null>(null);
  const [intro, setIntro] = useState<YoutubeLatestVideo | null>(null);
  const [combat, setCombat] = useState<YoutubeLatestVideo | null>(null);

  useEffect(() => {
    let alive = true;

    async function load() {
      const playlists = YOUTUBE_PLAYLISTS[lang];

      const [t, i, c] = await Promise.all([
        fetchLatestFromPlaylist(playlists.officialTrailer),
        fetchLatestFromPlaylist(playlists.characterIntro),
        fetchLatestFromPlaylist(playlists.characterTrailer),
      ]);

      if (!alive) return;

      setTrailer(t);
      setIntro(i);
      setCombat(c);
    }

    load();

    return () => {
      alive = false;
    };
  }, [lang]);

  return (
    <div id="page-slot">

      <div className="article-slot">
        <h2 className="title en-font">Wuwa Dev News</h2>
        
      </div>

      <div className="article-slot">
        <h2 className="title en-font">In-Game News</h2>

        <div className="article trailer">
          {trailer ? (
            <a href={`https://www.youtube.com/watch?v=${trailer.videoId}`}
              target="_blank"
              rel="noopener noreferrer">
              <img src={trailer.thumbnail} alt={trailer.title} width={320} />
              <p>{trailer.title}</p>
            </a>
          ) : (<p>loading...</p>)}

          {combat ? (
            <a>
              <img src={combat.thumbnail} alt={combat.title} width={320} />
              <p>{combat.title}</p>
            </a>
          ) : (<p>loading...</p>)}

          {intro ? (
            <a>
              <img src={intro.thumbnail} alt={intro.title} width={320} />
              <p>{intro.title}</p>
            </a>
          ) : (<p>loading...</p>)}
        </div>
      </div>

      <div className="article-slot">
        <h2 className="title en-font">Character Showcase</h2>
      </div>
    </div>
  )
}
import { useState, useEffect } from "react"

import { useAppStore } from "@/stores/appStore";

import { fetchLatestYoutube, type YoutubeLatestVideo } from "@/api/youtube.api"

import HomePostCard from "@/components/features/Home/HomePostCard";
import { HOME_POSTS } from "@/posts/homePosts";

import "@/pages/_Page.css"
import "@/pages/Home.css"
import { locale } from "@/locales/locale";


/* ================================================ */

export default function Home() {
  const { lang } = useAppStore();

  const localeText = locale(lang).home;

  const [trailer, setTrailer] = useState<YoutubeLatestVideo | null>(null);
  const [intro, setIntro] = useState<YoutubeLatestVideo | null>(null);
  const [combat, setCombat] = useState<YoutubeLatestVideo | null>(null);

  useEffect(() => {
    const controller = new AbortController();

    (async () => {
      // lang 바뀌면 로딩 상태로 리셋
      setTrailer(null);
      setIntro(null);
      setCombat(null);

      const [t, i, c] = await Promise.all([
        fetchLatestYoutube(lang, "officialTrailer", { signal: controller.signal }),
        fetchLatestYoutube(lang, "characterIntro", { signal: controller.signal }),
        fetchLatestYoutube(lang, "characterTrailer", { signal: controller.signal }),
      ]);

      if (controller.signal.aborted) return;

      setTrailer(t);
      setIntro(i);
      setCombat(c);
    })();

    return () => controller.abort();
  }, [lang]);

  const sortedPosts = [...HOME_POSTS].sort((a, b) => {
    if (!!a.pinned !== !!b.pinned) return a.pinned ? -1 : 1;
    return new Date(b.date).getTime() - new Date(a.date).getTime();
  });

  return (
    <div id="page-slot" className="home-page-slot">
      <div className="page-body" style={{width: "37.5%"}}>
        <div className="article-slot">
          <h2 className={`title-text ${lang}-font`}>{localeText.title1}</h2>

          {sortedPosts.map((post) => (<>
            <HomePostCard key={post.id} post={post} lang={lang} />
            </>
          ))}
        </div>
      </div>

      <div className="page-body" style={{width: "60%"}}>
        <div className="article-slot">
          <h2 className={`title-text ${lang}-font`}>{localeText.title2}</h2>

          <div style={{ display: "flex", width: "100%", height: "auto", justifyContent: "space-between" }}>
            <div className="article trailer">
              <span className={`article-title ${lang}-font`}>{localeText.video1}</span>
              {trailer ? (
                <>
                  <img src={trailer.thumbnail} alt={trailer.title} />
                  <span className={`${lang}-font`}>{trailer.title}</span>
                  <span className={`${lang}-font click`}>{localeText.click}</span>
                </>
              ) : (<p className={`${lang}-font click`}>loading...</p>)}
            </div>

            <div className="article combat">
              <span className={`article-title ${lang}-font`}>{localeText.video2}</span>
              {combat ? (
                <>
                  <img src={combat.thumbnail} alt={combat.title} />
                  <span className={`${lang}-font`}>{combat.title}</span>
                  <span className={`${lang}-font click`}>{localeText.click}</span>
                </>
              ) : (<p>loading...</p>)}
            </div>

            <div className="article intro">
              <span className={`article-title ${lang}-font`}>{localeText.video3}</span>
              {intro ? (
                <>
                  <img src={intro.thumbnail} alt={intro.title} />
                  <span className={`${lang}-font`}>{intro.title}</span>
                  <span className={`${lang}-font click`}>{localeText.click}</span>
                </>
              ) : (<p>loading...</p>)}
            </div>
          </div>
        </div>

        <div className="article-slot">
          <h2 className={`title-text ${lang}-font`}>{localeText.title3}</h2>
        </div>
      </div>
    </div>
  )
}
import { useState, useEffect } from "react"

import { useAppStore } from "@/stores/appStore";
import { useOverlay } from "@/contexts/PopupContext";

import { fetchLatestYoutube, type YoutubeLatestVideo } from "@/api/youtube.api"

import { HOME_POSTS } from "@/posts/homePosts";
import HomePostCard from "@/components/features/Home/HomePostCard";
import YoutubeVideoCard from "@/components/features/Home/YoutubeVideoCard";

import "@/pages/_Page.css"
import "@/pages/Home.css"
import { locale } from "@/locales/locale";


/* ================================================ */

export default function Home() {
  const { lang } = useAppStore();
  const { openOverlay } = useOverlay();

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
      <div className="page-body small">
        <div className="article-slot">
          <h2 className={`title-text ${lang}-font`}>{localeText.title1}</h2>
          <div className="notice-slot">
          {sortedPosts.map((post) => (<>
            <HomePostCard key={post.id} post={post} lang={lang} />
            <HomePostCard key={post.id} post={post} lang={lang} />
            <HomePostCard key={post.id} post={post} lang={lang} />
            <HomePostCard key={post.id} post={post} lang={lang} />
            <HomePostCard key={post.id} post={post} lang={lang} />
            </>
          ))}
          </div>
        </div>
      </div>

      <div className="page-body large">
        <div className="article-slot">
          <h2 className={`title-text ${lang}-font`}>{localeText.title2}</h2>

          <div style={{ display: "flex", width: "100%", height: "auto", justifyContent: "space-between" }}>
            <div className="article-item trailer">
              <span className={`article-title ${lang}-font`}>{localeText.video1}</span>
              {trailer ? (
                <div className="article" onClick={() => openOverlay(
                  <YoutubeVideoCard video={trailer} />, { title: `${trailer.title}` }
                )}>
                  <img src={trailer.thumbnail} alt={trailer.title} />
                  <span className={`${lang}-font`}>{trailer.title}</span>
                  <span className={`${lang}-font click`}>{localeText.click}</span>
                </div>
              ) : (<p className={`${lang}-font click`}>loading...</p>)}
            </div>

            <div className="article-item combat">
              <span className={`article-title ${lang}-font`}>{localeText.video2}</span>
              {combat ? (
                <div className="article" onClick={() => openOverlay(
                  <YoutubeVideoCard video={combat} />, { title: `${combat.title}` }
                )}>
                  <img src={combat.thumbnail} alt={combat.title} />
                  <span className={`${lang}-font`}>{combat.title}</span>
                  <span className={`${lang}-font click`}>{localeText.click}</span>
                </div>
              ) : (<p>loading...</p>)}
            </div>

            <div className="article-item intro">
              <span className={`article-title ${lang}-font`}>{localeText.video3}</span>
              {intro ? (
                <div className="article" onClick={() => openOverlay(
                  <YoutubeVideoCard video={intro} />, { title: `${intro.title}` }
                )}>
                  <img src={intro.thumbnail} alt={intro.title} />
                  <span className={`${lang}-font`}>{intro.title}</span>
                  <span className={`${lang}-font click`}>{localeText.click}</span>
                </div>
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
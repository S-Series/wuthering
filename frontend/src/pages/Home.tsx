import { useEffect, useMemo, useState } from "react";

import { fetchLatestYoutube, type YoutubeLatestVideo } from "@/api/youtube.api";
import { useOverlay } from "@/contexts/PopupContext";
import CharacterSlot from "@/components/features/Characters/CharacterSlot";
import { characterList } from "@/datas/characters";
import type { HomePost } from "@/posts/homePosts.tsx";
import { loadSummaryStore } from "@/summaryData/storage";
import { useAppStore, type LangType } from "@/stores/appStore";
import { getCharacterRank } from "@/types/character.type";
import { locale } from "@/locales/locale";

import { periodicContents, type PeriodicContent } from "@/datas/periodic";
import { useSeasonRemainingTime } from "@/hooks/useSeasonRemainingTime";

import YoutubeVideoCard from "@/components/features/Home/YoutubeVideoCard";
import {
  AutoNoticeDismissControl,
  NoticeDetailSlot,
  getSortedHomePosts,
  textFromNode,
} from "@/components/features/Home/GlobalNoticePopup";

import "@/pages/_Page.css";
import "@/pages/Home.css";

const DISPLAY_LIMIT_MEDIUM_BREAKPOINT = 1071;
const DISPLAY_LIMIT_SMALL_BREAKPOINT = 572;

function GameInfoSlot({
  content,
  lang,
  resetLabel,
  waitingLabel,
}: {
  content: PeriodicContent;
  lang: LangType;
  resetLabel: string;
  waitingLabel: string;
}) {
  const remainingTime = useSeasonRemainingTime(content);

  return (
    <div className={`inner-slot ${content.className ?? content.id}`}>
      <span className={`${lang}-font title`}>{content.name[lang]}</span>
      <span className={`${lang}-font`}>
        {resetLabel}: <em>{remainingTime?.text ?? waitingLabel}</em>
      </span>
    </div>
  );
}

function compactDate(dateString: string) {
  const date = new Date(dateString);
  if (Number.isNaN(date.getTime())) return dateString;

  return `${date.getFullYear()}.${date.getMonth() + 1}.${date.getDate()}`;
}

function NoticeListSlot({ posts, lang }: { posts: HomePost[]; lang: LangType }) {
  return (
    <div className="notice-list-detail-slot">
      {posts.map((post) => (
        <article className="notice-list-detail-item" key={post.id}>
          <div className="notice-detail-head">
            <h3>{post.title[lang]}</h3>
            <time>{compactDate(post.date)}</time>
          </div>
          <div className="notice-detail-body">{post.data[lang]}</div>
        </article>
      ))}
    </div>
  );
}

function VideoSlot({
  trailer,
  combat,
  intro,
  lang,
}: {
  trailer: YoutubeLatestVideo | null;
  combat: YoutubeLatestVideo | null;
  intro: YoutubeLatestVideo | null;
  lang: LangType;
}) {
  const { openOverlay } = useOverlay();
  const localeText = locale(lang).home;
  const mainVideo = trailer ?? combat ?? intro;
  const subVideos = [
    { title: localeText.video2, video: combat },
    { title: localeText.video3, video: intro },
  ];

  return (
    <article className="summary-item video-slot">
      <h2>{localeText.officialVideos}</h2>
      <button
        className="video-main-item"
        type="button"
        onClick={() => {
          if (mainVideo) openOverlay(<YoutubeVideoCard video={mainVideo} />, { title: mainVideo.title });
        }}
      >
        <span>{mainVideo?.title ?? localeText.loadingVideos}</span>
        <img src={mainVideo?.thumbnail ?? "/gifs/02.gif"} alt="" />
      </button>

      <div className="video-button-slot">
        {subVideos.map((item) => (
          <button
            key={item.title}
            style={{
              backgroundImage: item.video?.thumbnail
                ? `linear-gradient(rgba(9, 12, 18, 0.58), rgba(9, 12, 18, 0.58)), url(${item.video.thumbnail})`
                : undefined,
            }}
            type="button"
            onClick={() => {
              if (item.video) openOverlay(<YoutubeVideoCard video={item.video} />, { title: item.video.title });
            }}
          >
            {item.title}
          </button>
        ))}
      </div>
    </article>
  );
}

export default function Home() {
  const { lang } = useAppStore();
  const localeText = locale(lang);
  const { openOverlay } = useOverlay();
  const summaryStore = useMemo(() => loadSummaryStore(), []);
  const [displayLimit, setDisplayLimit] = useState(() => {
    if (typeof window === "undefined") return 5;
    if (window.innerWidth <= DISPLAY_LIMIT_SMALL_BREAKPOINT) return 3;
    return window.innerWidth < DISPLAY_LIMIT_MEDIUM_BREAKPOINT ? 4 : 5;
  });

  const [trailer, setTrailer] = useState<YoutubeLatestVideo | null>(null);
  const [intro, setIntro] = useState<YoutubeLatestVideo | null>(null);
  const [combat, setCombat] = useState<YoutubeLatestVideo | null>(null);

  useEffect(() => {
    const controller = new AbortController();

    (async () => {
      setTrailer(null);
      setIntro(null);
      setCombat(null);

      const fetchLatestOrNull = async (
        type: "officialTrailer" | "characterIntro" | "characterTrailer",
      ) => {
        try {
          return await fetchLatestYoutube(lang, type, {
            signal: controller.signal,
          });
        } catch (error) {
          if (controller.signal.aborted) throw error;
          console.warn(`[youtube latest failed:${type}]`, error);
          return null;
        }
      };

      try {
        const [t, i, c] = await Promise.all([
          fetchLatestOrNull("officialTrailer"),
          fetchLatestOrNull("characterIntro"),
          fetchLatestOrNull("characterTrailer"),
        ]);

        if (controller.signal.aborted) return;

        setTrailer(t);
        setIntro(i);
        setCombat(c);
      } catch (error) {
        if (controller.signal.aborted) return;
        console.warn("[youtube latest failed]", error);
      }
    })();

    return () => controller.abort();
  }, [lang]);

  useEffect(() => {
    const updateDisplayLimit = () => {
      if (window.innerWidth <= DISPLAY_LIMIT_SMALL_BREAKPOINT) {
        setDisplayLimit(3);
        return;
      }

      setDisplayLimit(window.innerWidth < DISPLAY_LIMIT_MEDIUM_BREAKPOINT ? 4 : 5);
    };

    updateDisplayLimit();
    window.addEventListener("resize", updateDisplayLimit);

    return () => window.removeEventListener("resize", updateDisplayLimit);
  }, []);

  const sortedPosts = useMemo(() => {
    return getSortedHomePosts();
  }, []);

  const latestPosts = sortedPosts.slice(0, 4);

  const topCharacters = useMemo(() => {
    return characterList
      .map((item) => {
        const score = summaryStore.data[item.id]?.score ?? 0;

        return {
          ...item,
          score,
          rank: getCharacterRank(score),
        };
      })
      //.filter((item) => item.score > 0)
      .sort((a, b) => b.score - a.score)
      .slice(0, displayLimit);
  }, [displayLimit, summaryStore]);

  return (
    <div id="page-slot" className="home-slot">
      <section className="banner-slot">
        <h1>{localeText.navbar.title}</h1>
      </section>

      <section className="summary-slot">
        <article className="summary-item notice-slot">
          <h2>{localeText.home.latestNotices}</h2>
          <ul>
            {latestPosts.map((post) => (
              <li key={post.id}>
                <button
                  className="notice-item"
                  type="button"
                  onClick={() =>
                    openOverlay(<NoticeDetailSlot post={post} lang={lang} />, {
                      title: textFromNode(post.title[lang]),
                      headerAction: <AutoNoticeDismissControl postId={post.id} lang={lang} />,
                      width: "min(90vw, 54rem)",
                      height: "min(82vh, 42rem)",
                    })
                  }
                >
                  <span>[{localeText.home.noticePrefix}] {textFromNode(post.title[lang])}</span>
                  <time>{compactDate(post.date)}</time>
                </button>
              </li>
            ))}
          </ul>
          <button
            type="button"
            onClick={() =>
              openOverlay(<NoticeListSlot posts={sortedPosts} lang={lang} />, {
                title: localeText.home.title1,
                width: "min(90vw, 58rem)",
                height: "min(86vh, 46rem)",
              })
            }
          >
            {localeText.home.moreNotices}
          </button>
        </article>

        <VideoSlot
          trailer={trailer}
          combat={combat}
          intro={intro}
          lang={lang}
        />

        <article className="summary-item info-slot">
          <h2>{localeText.home.inGameInfo}</h2>
          {/*
          <div className="game-info-slot">
            <div className="inner-slot tower">
              <span className={`${lang}-font title`}>역경의 탑</span>
              <span className={`${lang}-font`}>초기화: <em>{" 000 : 00 : 00"}</em></span>
            </div>
            <div className="inner-slot wastes">
              <span className={`${lang}-font title`}>죽음의 노래와 바닷속 폐허</span>
              <span className={`${lang}-font`}>초기화: <em>{" 000 : 00 : 00"}</em></span>
            </div>
            <div className="inner-slot gateway">
              <span className={`${lang}-font title`}>주간 활약도</span>
              <span className={`${lang}-font`}>초기화: <em>{" 000 : 00 : 00"}</em></span>
            </div>
            <div className="inner-slot matrix">
              <span className={`${lang}-font title`}>종말 매트릭스</span>
              <span className={`${lang}-font`}>초기화: <em>{" 000 : 00 : 00"}</em></span>
            </div>
          </div>
           */}

          <div className="game-info-slot">
            {periodicContents.map((content) => (
              <GameInfoSlot
                key={content.id}
                content={content}
                lang={lang}
                resetLabel={localeText.home.reset}
                waitingLabel={localeText.home.seasonWaiting}
              />
            ))}
          </div>
        </article>
      </section>

      <section className="display-slot">
        <h2>{localeText.home.showcase}</h2>
        <div className="display-list-slot">
          {topCharacters.map((item) => (
            <CharacterSlot
              key={item.id}
              isGrid={true}
              prop={item}
            />
          ))}
        </div>
      </section>
    </div>
  );
}

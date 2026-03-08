import { useState, useEffect } from "react"

import { useAppStore } from "@/stores/appStore";

import { fetchLatestYoutube, type YoutubeLatestVideo } from "@/api/youtube.api"

import "@/pages/_Page.css"
import "@/pages/Home.css"


/* ================================================ */

export default function Home() {
  const { lang } = useAppStore();

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

  return (
    <div id="page-slot">

      <div className="article-slot">
        <h2 className="title en-font">Wuwa Dev News</h2>

        <div style={{fontSize: "16px", whiteSpace: "pre", fontWeight: 700, backgroundColor: "#ffffff66", padding: "16px"}}>
          {
`띵데브는 현재 공사중입니다! 정식 서비스가 아니니, 양해 바랍니다.
문의사항은 아래의 연락처로 연락 바랍니다.

WuWa DEV is currently under construction. Please note that this is not the official service yet.
For inquiries, please contact the information below.

鳴潮DEVは現在工事中です。正式サービスではありませんので、ご了承ください。
お問い合わせは、下記の連絡先までご連絡ください。

鸣潮DEV目前正在施工中！尚未正式上线，敬请谅解。
如有问题，请通过以下联系方式联系我们。
        
∮Contact SSeries
Discord: SSeries0923 || E-mail: SSeries000923@gmail.com`}
        </div>
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
import { renderToStaticMarkup } from "react-dom/server";
import { Link, StaticRouter } from "react-router-dom";
import { AboutPage, GuidePage, InformationPage, ScoringPage } from "@/pages/InformationPages";
import Privacy from "@/components/features/Profile/Privacy";
import Terms from "@/components/features/Profile/Terms";
import NotFound from "@/pages/NotFound";
import { character } from "@/datas/characters";
import { CardIntro, HomeIntro } from "./DiscoveryIntro";
import { getPageMetadata, publicPages, SITE_ORIGIN, type PageMetadata } from "./pages";

export const characterIds = Object.keys(character);
export const publicPaths = Object.keys(publicPages);

const escape = (text: string) => text.replace(/[&<>"']/g, value => ({ "&": "&amp;", "<": "&lt;", ">": "&gt;", '"': "&quot;", "'": "&#39;" }[value]!));

export function renderHead(page: PageMetadata) {
  const url = page.canonical === undefined ? undefined : `${SITE_ORIGIN}${page.canonical}`;
  return `<title>${escape(page.title)}</title>
<meta name="description" content="${escape(page.description)}" />
<meta name="robots" content="${page.noindex ? "noindex, follow" : "index, follow"}" />
${url ? `<link rel="canonical" href="${url}" /><meta property="og:url" content="${url}" />` : ""}
<meta property="og:type" content="website" />
<meta property="og:site_name" content="WuWa DEV" />
<meta property="og:title" content="${escape(page.title)}" />
<meta property="og:description" content="${escape(page.description)}" />
<meta property="og:image" content="${SITE_ORIGIN}/preview.jpg" />
<meta name="twitter:card" content="summary_large_image" />
<meta name="twitter:title" content="${escape(page.title)}" />
<meta name="twitter:description" content="${escape(page.description)}" />
<meta name="twitter:image" content="${SITE_ORIGIN}/preview.jpg" />`;
}

export function renderPage(path: string) {
  let body;
  switch (path) {
    case "/": body = <HomeIntro />; break;
    case "/card": body = <CardIntro />; break;
    case "/about": body = <AboutPage />; break;
    case "/guide": body = <GuidePage />; break;
    case "/guide/scoring": body = <ScoringPage />; break;
    case "/privacy": body = <InformationPage title="개인정보처리방침"><Privacy /></InformationPage>; break;
    case "/terms": body = <InformationPage title="이용약관"><Terms /></InformationPage>; break;
    case "/app":
    case "/private": body = <p>도구를 불러오는 중입니다.</p>; break;
    default: body = <NotFound />;
  }
  const metadata = path === "/app" || path === "/private"
    ? { title: "서비스 도구 | WuWa DEV", description: "명조 캐릭터 스펙과 에코 세팅을 관리하세요.", noindex: path === "/private" }
    : getPageMetadata(path);
  return {
    head: renderHead(metadata),
    body: renderToStaticMarkup(<StaticRouter location={path}>
      <main className="prerender-shell">
        <nav aria-label="주요 페이지"><Link to="/">WuWa DEV 홈</Link><Link to="/card">스펙카드 생성기</Link><Link to="/guide">사용법</Link></nav>
        {body}
        <noscript><p>스펙카드 편집과 OCR 기능을 사용하려면 JavaScript를 켜 주세요. 사용법과 점수 설명은 이 페이지에서 읽을 수 있습니다.</p></noscript>
      </main>
    </StaticRouter>),
  };
}

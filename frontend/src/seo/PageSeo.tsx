import { useEffect } from "react";
import { useLocation } from "react-router-dom";
import { useAppStore } from "@/stores/appStore";
import { getPageMetadata, SITE_ORIGIN } from "./pages";

export default function PageSeo() {
  const { pathname } = useLocation();
  const { lang } = useAppStore();
  useEffect(() => {
    const page = getPageMetadata(pathname);
    document.title = page.title;
    document.documentElement.lang = ["/about", "/guide", "/guide/scoring", "/privacy", "/terms"].includes(pathname.replace(/\/+$/, ""))
      ? "ko" : ({ kr: "ko", en: "en", jp: "ja", zh: "zh" }[lang]);
    const setMeta = (attribute: "name" | "property", key: string, content: string) => {
      let element = document.head.querySelector<HTMLMetaElement>(`meta[${attribute}="${key}"]`);
      if (!element) {
        element = document.createElement("meta");
        element.setAttribute(attribute, key);
        document.head.append(element);
      }
      element.content = content;
    };
    setMeta("name", "description", page.description);
    setMeta("name", "robots", page.noindex ? "noindex, follow" : "index, follow");
    for (const prefix of ["og", "twitter"] as const) {
      setMeta(prefix === "og" ? "property" : "name", `${prefix}:title`, page.title);
      setMeta(prefix === "og" ? "property" : "name", `${prefix}:description`, page.description);
    }
    const url = page.canonical ? `${SITE_ORIGIN}${page.canonical}` : undefined;
    let canonical = document.head.querySelector<HTMLLinkElement>('link[rel="canonical"]');
    if (url) {
      if (!canonical) {
        canonical = document.createElement("link");
        canonical.rel = "canonical";
        document.head.append(canonical);
      }
      canonical.href = url;
      setMeta("property", "og:url", url);
    } else {
      canonical?.remove();
      document.head.querySelector('meta[property="og:url"]')?.remove();
    }
  }, [pathname, lang]);
  return null;
}

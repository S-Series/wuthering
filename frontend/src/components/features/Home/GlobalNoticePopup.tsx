import { useEffect, useState, type ReactNode } from "react";

import { useOverlay } from "@/contexts/PopupContext";
import { HOME_POSTS, type HomePost } from "@/posts/homePosts";
import { useAppStore, type LangType } from "@/stores/appStore";

import "@/pages/Home.css";

const AUTO_NOTICE_SESSION_KEY = "wuthering.homeNotice.sessionShownIds";
const AUTO_NOTICE_LOCAL_KEY = "wuthering.homeNotice.dismissedIds";

const NOTICE_DISMISS_LABEL: Record<LangType, string> = {
  kr: "다시 보지 않기",
  en: "Do not show again",
  jp: "今後表示しない",
  zh: "不再显示",
};

function compactDate(dateString: string) {
  const date = new Date(dateString);
  if (Number.isNaN(date.getTime())) return dateString;

  return `${date.getFullYear()}.${date.getMonth() + 1}.${date.getDate()}`;
}

export function textFromNode(node: ReactNode): string {
  if (typeof node === "string" || typeof node === "number") return String(node);
  if (Array.isArray(node)) return node.map(textFromNode).join("");
  if (node && typeof node === "object" && "props" in node) {
    return textFromNode((node as { props?: { children?: ReactNode } }).props?.children);
  }

  return "";
}

function readNoticeIdSet(storage: Storage, key: string) {
  try {
    const raw = storage.getItem(key);
    const parsed = raw ? JSON.parse(raw) : [];

    if (!Array.isArray(parsed)) return new Set<number>();

    return new Set(parsed.filter((id): id is number => Number.isInteger(id)));
  } catch {
    return new Set<number>();
  }
}

function hasNoticeId(storage: Storage, key: string, id: number) {
  return readNoticeIdSet(storage, key).has(id);
}

function setNoticeId(storage: Storage, key: string, id: number, enabled: boolean) {
  const ids = readNoticeIdSet(storage, key);

  if (enabled) {
    ids.add(id);
  } else {
    ids.delete(id);
  }

  storage.setItem(key, JSON.stringify([...ids]));
}

export function NoticeDetailSlot({ post, lang }: { post: HomePost; lang: LangType }) {
  return (
    <article className="notice-detail-slot">
      <div className="notice-detail-head">
        <h3>{post.title[lang]}</h3>
        <time>{compactDate(post.date)}</time>
      </div>
      <div className="notice-detail-body">{post.data[lang]}</div>
    </article>
  );
}

export function AutoNoticeDismissControl({ postId, lang }: { postId: number; lang: LangType }) {
  const [dismissed, setDismissed] = useState(() => {
    if (typeof window === "undefined") return false;
    return hasNoticeId(window.localStorage, AUTO_NOTICE_LOCAL_KEY, postId);
  });

  const handleDismissChange = (checked: boolean) => {
    setDismissed(checked);

    if (typeof window === "undefined") return;
    setNoticeId(window.localStorage, AUTO_NOTICE_LOCAL_KEY, postId, checked);
  };

  return (
    <label className="notice-dismiss-option notice-dismiss-option--header">
      <input
        type="checkbox"
        checked={dismissed}
        onChange={(event) => handleDismissChange(event.currentTarget.checked)}
      />
      <span>{NOTICE_DISMISS_LABEL[lang]}</span>
    </label>
  );
}

export function getSortedHomePosts() {
  return [...HOME_POSTS].sort((a, b) => {
    if (!!a.pinned !== !!b.pinned) return a.pinned ? -1 : 1;
    return new Date(b.date).getTime() - new Date(a.date).getTime();
  });
}

export default function GlobalNoticePopup() {
  const { lang } = useAppStore();
  const { openOverlay } = useOverlay();

  useEffect(() => {
    if (typeof window === "undefined") return;

    const latestNotice = getSortedHomePosts()[0];
    if (!latestNotice) return;
    if (hasNoticeId(window.localStorage, AUTO_NOTICE_LOCAL_KEY, latestNotice.id)) return;
    if (hasNoticeId(window.sessionStorage, AUTO_NOTICE_SESSION_KEY, latestNotice.id)) return;

    setNoticeId(window.sessionStorage, AUTO_NOTICE_SESSION_KEY, latestNotice.id, true);
    openOverlay(<NoticeDetailSlot post={latestNotice} lang={lang} />, {
      title: textFromNode(latestNotice.title[lang]),
      headerAction: <AutoNoticeDismissControl postId={latestNotice.id} lang={lang} />,
      width: "min(90vw, 54rem)",
      height: "min(82vh, 42rem)",
    });
  }, [lang, openOverlay]);

  return null;
}

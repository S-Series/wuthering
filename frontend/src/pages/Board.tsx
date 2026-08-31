import { useEffect, useState, type FormEvent } from "react";
import { Link, useNavigate, useSearchParams } from "react-router-dom";

import { fetchBoardPosts } from "@/api/board.api";
import { locale } from "@/locales/locale";
import { useAppStore, type LangType } from "@/stores/appStore";
import { useAuthStore } from "@/stores/authStore";
import type {
  BoardCategory,
  BoardPostListResponse,
} from "@/types/board.type";

import "@/pages/Board.css";

const CATEGORY_OPTIONS = ["general", "question", "guide"] as const;

const DATE_LOCALE: Record<LangType, string> = {
  kr: "ko-KR",
  en: "en-US",
  jp: "ja-JP",
  zh: "zh-CN",
};

function isBoardCategory(value: string | null): value is BoardCategory {
  return CATEGORY_OPTIONS.some((category) => category === value);
}

function parsePage(value: string | null) {
  const parsed = Number(value);
  return Number.isSafeInteger(parsed) && parsed > 0 ? parsed : 1;
}

function formatPostDate(value: string, lang: LangType) {
  const date = new Date(value);

  if (Number.isNaN(date.getTime())) return "-";

  return new Intl.DateTimeFormat(DATE_LOCALE[lang], {
    year: "numeric",
    month: "2-digit",
    day: "2-digit",
  }).format(date);
}

export default function Board() {
  const { lang } = useAppStore();
  const user = useAuthStore((state) => state.user);
  const navigate = useNavigate();
  const text = locale(lang).board;
  const [searchParams, setSearchParams] = useSearchParams();
  const categoryParam = searchParams.get("category");
  const activeCategory = isBoardCategory(categoryParam)
    ? categoryParam
    : null;
  const activeSearch = searchParams.get("q")?.trim() ?? "";
  const page = parsePage(searchParams.get("page"));

  const [retryCount, setRetryCount] = useState(0);
  const requestKey = [activeCategory ?? "all", activeSearch, page, retryCount].join(":");
  const [requestState, setRequestState] = useState<{
    key: string;
    result: BoardPostListResponse | null;
    error: string | null;
  } | null>(null);
  const isLoading = requestState?.key !== requestKey;
  const result = requestState?.key === requestKey ? requestState.result : null;
  const error = requestState?.key === requestKey ? requestState.error : null;

  useEffect(() => {
    const controller = new AbortController();

    void fetchBoardPosts({
      page,
      category: activeCategory ?? undefined,
      search: activeSearch || undefined,
      signal: controller.signal,
    })
      .then((response) => {
        setRequestState({ key: requestKey, result: response, error: null });
      })
      .catch((requestError: unknown) => {
        if (requestError instanceof DOMException && requestError.name === "AbortError") {
          return;
        }

        setRequestState({
          key: requestKey,
          result: null,
          error: requestError instanceof Error ? requestError.message : "unknown error",
        });
      });

    return () => controller.abort();
  }, [activeCategory, activeSearch, page, requestKey]);

  const updateFilters = (updates: Record<string, string | null>) => {
    const nextParams = new URLSearchParams(searchParams);

    Object.entries(updates).forEach(([key, value]) => {
      if (value) nextParams.set(key, value);
      else nextParams.delete(key);
    });

    setSearchParams(nextParams);
  };

  const selectCategory = (category: BoardCategory | null) => {
    updateFilters({
      category,
      page: null,
    });
  };

  const submitSearch = (event: FormEvent<HTMLFormElement>) => {
    event.preventDefault();
    const formData = new FormData(event.currentTarget);
    const nextSearch = formData.get("search");

    updateFilters({
      q: typeof nextSearch === "string" ? nextSearch.trim() || null : null,
      page: null,
    });
  };

  const goToPage = (nextPage: number) => {
    if (nextPage < 1 || nextPage > (result?.totalPages ?? 1)) return;
    updateFilters({ page: nextPage === 1 ? null : String(nextPage) });
  };

  return (
    <section className={"board-page " + lang + "-font"}>
      <header className="board-hero">
        <div className="board-hero-copy">
          <span className="board-eyebrow en-font">{text.eyebrow}</span>
          <h1>{text.title}</h1>
          <p>{text.description}</p>
        </div>

        <div className="board-hero-actions">
          <div className="board-total-card" aria-live="polite">
            <span>{text.totalPosts}</span>
            <strong className="num-font">
              {isLoading && result === null ? "—" : (result?.total ?? 0).toLocaleString()}
            </strong>
          </div>
          <button
            className="board-write-button"
            type="button"
            title={user ? text.write : text.writeLoginRequired}
            onClick={() => navigate(user ? "/board/write" : "/profile")}
          >
            <span aria-hidden="true">＋</span>
            {text.write}
          </button>
        </div>
      </header>

      <div className="board-toolbar">
        <nav className="board-categories" aria-label={text.title}>
          <button
            type="button"
            className={activeCategory === null ? "active" : ""}
            aria-pressed={activeCategory === null}
            onClick={() => selectCategory(null)}
          >
            {text.all}
          </button>
          {CATEGORY_OPTIONS.map((category) => (
            <button
              key={category}
              type="button"
              className={activeCategory === category ? "active" : ""}
              aria-pressed={activeCategory === category}
              onClick={() => selectCategory(category)}
            >
              {text.categories[category]}
            </button>
          ))}
        </nav>

        <form className="board-search" role="search" onSubmit={submitSearch}>
          <label className="board-visually-hidden" htmlFor="board-search-input">
            {text.searchPlaceholder}
          </label>
          <input
            id="board-search-input"
            key={activeSearch}
            name="search"
            type="search"
            defaultValue={activeSearch}
            maxLength={80}
            placeholder={text.searchPlaceholder}
          />
          <button type="submit">{text.search}</button>
        </form>
      </div>

      <div className="board-list-panel">
        <div className="board-list-header" aria-hidden="true">
          <span>{text.columnTitle}</span>
          <span>{text.columnAuthor}</span>
          <span>{text.columnDate}</span>
          <span>{text.columnViews}</span>
        </div>

        {isLoading ? (
          <div className="board-loading" aria-label={text.loading} aria-live="polite">
            {Array.from({ length: 5 }, (_, index) => (
              <div className="board-skeleton-row" key={index}>
                <span />
                <span />
                <span />
              </div>
            ))}
          </div>
        ) : error ? (
          <div className="board-state board-error" role="alert">
            <span className="board-state-icon" aria-hidden="true">!</span>
            <strong>{text.error}</strong>
            <button type="button" onClick={() => setRetryCount((count) => count + 1)}>
              {text.retry}
            </button>
          </div>
        ) : result?.items.length ? (
          <div className="board-post-list">
            {result.items.map((post) => (
              <article className="board-post-row" key={post.id}>
                <Link className="board-post-main" to={"/board/" + post.id}>
                  <div className="board-post-badges">
                    {post.isPinned ? (
                      <span className="board-pin-badge">{text.notice}</span>
                    ) : null}
                    <span className={"board-category-badge board-category-" + post.category}>
                      {text.categories[post.category]}
                    </span>
                  </div>
                  <div className="board-post-title-line">
                    <h2>{post.title}</h2>
                    {post.commentCount > 0 ? (
                      <span
                        className="board-comment-count num-font"
                        aria-label={text.comments + " " + post.commentCount}
                      >
                        {post.commentCount}
                      </span>
                    ) : null}
                  </div>
                  <div className="board-post-mobile-meta">
                    <span>{post.authorName}</span>
                    <span>{formatPostDate(post.createdAt, lang)}</span>
                    <span>{text.columnViews} {post.viewCount.toLocaleString()}</span>
                  </div>
                </Link>
                <span className="board-post-author">{post.authorName}</span>
                <time dateTime={post.createdAt}>{formatPostDate(post.createdAt, lang)}</time>
                <span className="board-post-views num-font">
                  {post.viewCount.toLocaleString()}
                </span>
              </article>
            ))}
          </div>
        ) : (
          <div className="board-state board-empty">
            <span className="board-state-icon" aria-hidden="true">◇</span>
            <strong>{text.empty}</strong>
            <p>{text.emptyHint}</p>
          </div>
        )}
      </div>

      <nav className="board-pagination" aria-label={text.title}>
        <button
          type="button"
          disabled={page <= 1 || isLoading}
          onClick={() => goToPage(page - 1)}
        >
          <span aria-hidden="true">←</span>
          {text.previous}
        </button>
        <span className="num-font">
          <strong>{page}</strong>
          <span>/</span>
          <span>{result?.totalPages ?? 1}</span>
        </span>
        <button
          type="button"
          disabled={page >= (result?.totalPages ?? 1) || isLoading}
          onClick={() => goToPage(page + 1)}
        >
          {text.next}
          <span aria-hidden="true">→</span>
        </button>
      </nav>
    </section>
  );
}

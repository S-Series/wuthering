import { useEffect, useState } from "react";
import { Link, useNavigate, useParams } from "react-router-dom";

import { BoardApiError, deleteBoardPost, fetchBoardPost } from "@/api/board.api";
import { locale } from "@/locales/locale";
import { useAppStore, type LangType } from "@/stores/appStore";
import { useAuthStore } from "@/stores/authStore";
import type { BoardPostDetail as BoardPostDetailType } from "@/types/board.type";

import "@/pages/BoardCrud.css";

const DATE_LOCALE: Record<LangType, string> = {
  kr: "ko-KR",
  en: "en-US",
  jp: "ja-JP",
  zh: "zh-CN",
};

type DetailRequestState = {
  postId: string;
  post: BoardPostDetailType | null;
  errorStatus: number | null;
};

function formatPostDate(value: string, lang: LangType) {
  const date = new Date(value);

  if (Number.isNaN(date.getTime())) return "-";

  return new Intl.DateTimeFormat(DATE_LOCALE[lang], {
    year: "numeric",
    month: "2-digit",
    day: "2-digit",
    hour: "2-digit",
    minute: "2-digit",
  }).format(date);
}

export default function BoardDetail() {
  const { postId = "" } = useParams<{ postId: string }>();
  const navigate = useNavigate();
  const { lang } = useAppStore();
  const { user } = useAuthStore();
  const text = locale(lang).board;
  const detailText = text.detail;

  const [requestState, setRequestState] = useState<DetailRequestState | null>(null);
  const [isDeleteConfirmOpen, setIsDeleteConfirmOpen] = useState(false);
  const [isDeleting, setIsDeleting] = useState(false);
  const [deleteError, setDeleteError] = useState<string | null>(null);

  useEffect(() => {
    if (!postId) return;

    const controller = new AbortController();

    void fetchBoardPost(postId, controller.signal)
      .then((post) => {
        setRequestState({ postId, post, errorStatus: null });
      })
      .catch((error: unknown) => {
        if (error instanceof DOMException && error.name === "AbortError") return;
        setRequestState({
          postId,
          post: null,
          errorStatus: error instanceof BoardApiError ? error.status : 500,
        });
      });

    return () => controller.abort();
  }, [postId]);

  const currentState = requestState?.postId === postId ? requestState : null;
  const post = currentState?.post ?? null;
  const canManage = Boolean(
    user?.supabaseUid && post?.authorId && user.supabaseUid === post.authorId
  );

  const confirmDelete = async () => {
    if (!post || !canManage) return;

    setIsDeleting(true);
    setDeleteError(null);

    try {
      await deleteBoardPost(post.id);
      navigate("/board", { replace: true });
    } catch (error) {
      if (error instanceof BoardApiError && error.status === 401) {
        navigate("/profile", { replace: true });
        return;
      }

      setDeleteError(detailText.deleteError);
    } finally {
      setIsDeleting(false);
    }
  };

  if (!currentState) {
    return <BoardDetailState message={detailText.loading} />;
  }

  if (!post) {
    return (
      <BoardDetailState
        message={currentState.errorStatus === 404 ? detailText.notFound : detailText.loadError}
      />
    );
  }

  return (
    <section className={"board-crud-page " + lang + "-font"}>
      <div className="board-detail-topbar">
        <Link to="/board">← {detailText.back}</Link>
        {canManage ? (
          <div className="board-detail-owner-actions">
            <Link to={"/board/" + post.id + "/edit"}>{detailText.edit}</Link>
            <button type="button" onClick={() => setIsDeleteConfirmOpen(true)}>
              {detailText.delete}
            </button>
          </div>
        ) : null}
      </div>

      <article className="board-detail-panel">
        <header className="board-detail-header">
          <div className="board-detail-badges">
            {post.isPinned ? <span>{text.notice}</span> : null}
            <span>{text.categories[post.category]}</span>
          </div>
          <h1>{post.title}</h1>
          <dl className="board-detail-meta">
            <div>
              <dt>{detailText.author}</dt>
              <dd>{post.authorName}</dd>
            </div>
            <div>
              <dt>{detailText.date}</dt>
              <dd><time dateTime={post.createdAt}>{formatPostDate(post.createdAt, lang)}</time></dd>
            </div>
            <div>
              <dt>{detailText.views}</dt>
              <dd className="num-font">{post.viewCount.toLocaleString()}</dd>
            </div>
          </dl>
        </header>
        <div className="board-detail-content">{post.content}</div>
      </article>

      {isDeleteConfirmOpen ? (
        <div className="board-delete-confirm" role="alertdialog" aria-modal="true">
          <div className="board-delete-confirm-panel">
            <h2>{detailText.deleteConfirmTitle}</h2>
            <p>{detailText.deleteConfirmDescription}</p>
            {deleteError ? <p className="board-editor-message">{deleteError}</p> : null}
            <div>
              <button
                type="button"
                disabled={isDeleting}
                onClick={() => setIsDeleteConfirmOpen(false)}
              >
                {detailText.deleteCancel}
              </button>
              <button type="button" disabled={isDeleting} onClick={confirmDelete}>
                {isDeleting ? detailText.deleting : detailText.deleteConfirm}
              </button>
            </div>
          </div>
        </div>
      ) : null}
    </section>
  );
}

function BoardDetailState({ message }: { message: string }) {
  return (
    <section className="board-crud-page board-crud-state-page">
      <div className="board-crud-state">
        <span aria-hidden="true">◇</span>
        <p>{message}</p>
        <Link className="board-crud-primary-link" to="/board">
          ←
        </Link>
      </div>
    </section>
  );
}

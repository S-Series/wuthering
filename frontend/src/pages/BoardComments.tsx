import { useCallback, useEffect, useState, type FormEvent } from "react";
import { Link } from "react-router-dom";

import {
  BoardApiError,
  createBoardComment,
  deleteBoardComment,
  fetchBoardComments,
  updateBoardComment,
} from "@/api/board.api";
import { locale } from "@/locales/locale";
import { useAuthStore } from "@/stores/authStore";
import type { LangType } from "@/stores/appStore";
import type { BoardComment } from "@/types/board.type";

type Props = {
  postId: string;
  lang: LangType;
  onCountChange: (delta: number) => void;
};

const DATE_LOCALE: Record<LangType, string> = {
  kr: "ko-KR",
  en: "en-US",
  jp: "ja-JP",
  zh: "zh-CN",
};

function formatCommentDate(value: string, lang: LangType) {
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

export default function BoardComments({ postId, lang, onCountChange }: Props) {
  const { user } = useAuthStore();
  const text = locale(lang).board.detail;
  const [comments, setComments] = useState<BoardComment[] | null>(null);
  const [loadError, setLoadError] = useState(false);
  const [content, setContent] = useState("");
  const [editingId, setEditingId] = useState<string | null>(null);
  const [editingContent, setEditingContent] = useState("");
  const [deletingId, setDeletingId] = useState<string | null>(null);
  const [isSaving, setSaving] = useState(false);
  const [saveError, setSaveError] = useState<string | null>(null);

  const loadComments = useCallback(async (signal?: AbortSignal) => {
    const response = await fetchBoardComments(postId, signal);
    setComments(response.items);
    setLoadError(false);
  }, [postId]);

  useEffect(() => {
    const controller = new AbortController();
    void fetchBoardComments(postId, controller.signal)
      .then((response) => {
        setComments(response.items);
        setLoadError(false);
      })
      .catch((error: unknown) => {
        if (error instanceof DOMException && error.name === "AbortError") return;
        setLoadError(true);
        setComments([]);
      });
    return () => controller.abort();
  }, [postId]);

  const submitComment = async (event: FormEvent<HTMLFormElement>) => {
    event.preventDefault();
    const normalized = content.trim();
    if (!normalized || normalized.length > 2_000) return;

    setSaving(true);
    setSaveError(null);
    try {
      await createBoardComment(postId, normalized);
      setContent("");
      await loadComments();
      onCountChange(1);
    } catch (error) {
      setSaveError(
        error instanceof BoardApiError && error.status === 401
          ? text.commentLogin
          : text.commentSaveError,
      );
    } finally {
      setSaving(false);
    }
  };

  const saveEdit = async (commentId: string) => {
    const normalized = editingContent.trim();
    if (!normalized || normalized.length > 2_000) return;

    setSaving(true);
    setSaveError(null);
    try {
      await updateBoardComment(postId, commentId, normalized);
      setEditingId(null);
      setEditingContent("");
      await loadComments();
    } catch {
      setSaveError(text.commentSaveError);
    } finally {
      setSaving(false);
    }
  };

  const removeComment = async (commentId: string) => {
    setSaving(true);
    setSaveError(null);
    try {
      await deleteBoardComment(postId, commentId);
      setDeletingId(null);
      await loadComments();
      onCountChange(-1);
    } catch {
      setSaveError(text.commentSaveError);
    } finally {
      setSaving(false);
    }
  };

  return (
    <section className="board-comments-section">
      <header>
        <h2>{text.commentsTitle}</h2>
        <span className="num-font">{comments?.length ?? 0}</span>
      </header>

      {user ? (
        <form className="board-comment-form" onSubmit={submitComment}>
          <textarea
            value={content}
            maxLength={2_000}
            placeholder={text.commentPlaceholder}
            onChange={(event) => setContent(event.target.value)}
          />
          <div>
            <span className="num-font">{content.length} / 2,000</span>
            <button type="submit" disabled={isSaving || !content.trim()}>
              {isSaving ? text.commentSaving : text.commentSubmit}
            </button>
          </div>
        </form>
      ) : (
        <p className="board-comment-login">
          {text.commentLogin} <Link to="/profile">→</Link>
        </p>
      )}

      {saveError ? <p className="board-comment-error" role="alert">{saveError}</p> : null}

      {comments === null ? (
        <p className="board-comment-state">{locale(lang).board.loading}</p>
      ) : loadError ? (
        <p className="board-comment-state">{text.commentLoadError}</p>
      ) : comments.length === 0 ? (
        <p className="board-comment-state">{text.commentEmpty}</p>
      ) : (
        <div className="board-comment-list">
          {comments.map((comment) => {
            const canManage = Boolean(
              user?.role.toLowerCase() === "admin" ||
              (user?.supabaseUid && user.supabaseUid === comment.authorId),
            );
            const isEdited = comment.updatedAt !== comment.createdAt;

            return (
              <article className="board-comment-item" key={comment.id}>
                <header>
                  <strong>{comment.authorName}</strong>
                  <time dateTime={comment.createdAt}>
                    {formatCommentDate(comment.createdAt, lang)}
                  </time>
                  {isEdited ? <span>{text.commentEdited}</span> : null}
                  {canManage ? (
                    <div>
                      <button
                        type="button"
                        disabled={isSaving}
                        onClick={() => {
                          setEditingId(comment.id);
                          setEditingContent(comment.content);
                          setDeletingId(null);
                        }}
                      >
                        {text.commentEdit}
                      </button>
                      <button
                        type="button"
                        disabled={isSaving}
                        onClick={() => setDeletingId(comment.id)}
                      >
                        {text.commentDelete}
                      </button>
                    </div>
                  ) : null}
                </header>

                {editingId === comment.id ? (
                  <div className="board-comment-edit">
                    <textarea
                      value={editingContent}
                      maxLength={2_000}
                      onChange={(event) => setEditingContent(event.target.value)}
                    />
                    <div>
                      <button type="button" onClick={() => setEditingId(null)}>
                        {text.commentCancel}
                      </button>
                      <button
                        type="button"
                        disabled={isSaving || !editingContent.trim()}
                        onClick={() => void saveEdit(comment.id)}
                      >
                        {text.commentUpdate}
                      </button>
                    </div>
                  </div>
                ) : (
                  <p>{comment.content}</p>
                )}

                {deletingId === comment.id ? (
                  <div className="board-comment-delete-confirm">
                    <button type="button" onClick={() => setDeletingId(null)}>
                      {text.commentCancel}
                    </button>
                    <button
                      type="button"
                      disabled={isSaving}
                      onClick={() => void removeComment(comment.id)}
                    >
                      {text.commentDelete}
                    </button>
                  </div>
                ) : null}
              </article>
            );
          })}
        </div>
      )}
    </section>
  );
}

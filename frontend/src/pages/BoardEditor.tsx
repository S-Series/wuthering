import { useEffect, useState, type FormEvent } from "react";
import { Link, useNavigate, useParams } from "react-router-dom";

import {
  BoardApiError,
  createBoardPost,
  fetchBoardPost,
  updateBoardPost,
} from "@/api/board.api";
import { locale } from "@/locales/locale";
import { useAppStore } from "@/stores/appStore";
import { useAuthStore } from "@/stores/authStore";
import type { BoardCategory, BoardPostInput } from "@/types/board.type";

import "@/pages/BoardCrud.css";

const CATEGORY_OPTIONS: BoardCategory[] = ["general", "question", "guide"];

type EditLoadState = {
  postId: string;
  status: "ready" | "forbidden" | "error";
};

const EMPTY_FORM: BoardPostInput = {
  category: "general",
  title: "",
  content: "",
};

export default function BoardEditor() {
  const { postId } = useParams<{ postId: string }>();
  const navigate = useNavigate();
  const { lang } = useAppStore();
  const { user, isLoading: isAuthLoading } = useAuthStore();
  const text = locale(lang).board;
  const editorText = text.editor;
  const isEdit = Boolean(postId);

  const [form, setForm] = useState<BoardPostInput>(EMPTY_FORM);
  const [editLoadState, setEditLoadState] = useState<EditLoadState | null>(null);
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [message, setMessage] = useState<string | null>(null);

  useEffect(() => {
    if (!postId || !user) return;

    const controller = new AbortController();

    void fetchBoardPost(postId, controller.signal)
      .then((post) => {
        if (post.authorId !== user.supabaseUid) {
          setEditLoadState({ postId, status: "forbidden" });
          return;
        }

        setForm({
          category: post.category,
          title: post.title,
          content: post.content,
        });
        setEditLoadState({ postId, status: "ready" });
      })
      .catch((error: unknown) => {
        if (error instanceof DOMException && error.name === "AbortError") return;
        setEditLoadState({ postId, status: "error" });
      });

    return () => controller.abort();
  }, [postId, user]);

  const updateField = <Key extends keyof BoardPostInput>(
    key: Key,
    value: BoardPostInput[Key]
  ) => {
    setForm((current) => ({ ...current, [key]: value }));
  };

  const submit = async (event: FormEvent<HTMLFormElement>) => {
    event.preventDefault();

    const title = form.title.trim();
    const content = form.content.trim();

    if (title.length < 1 || title.length > 120) {
      setMessage(editorText.validationTitle);
      return;
    }

    if (content.length < 1 || content.length > 20_000) {
      setMessage(editorText.validationContent);
      return;
    }

    setIsSubmitting(true);
    setMessage(null);

    try {
      const input: BoardPostInput = {
        category: form.category,
        title,
        content,
      };
      const response = postId
        ? await updateBoardPost(postId, input)
        : await createBoardPost(input);

      navigate("/board/" + response.id, { replace: true });
    } catch (error) {
      if (error instanceof BoardApiError && error.status === 401) {
        navigate("/profile", { replace: true });
        return;
      }

      setMessage(editorText.saveError);
    } finally {
      setIsSubmitting(false);
    }
  };

  if (isAuthLoading) {
    return <BoardEditorState message={editorText.loading} />;
  }

  if (!user) {
    return (
      <BoardEditorState
        title={editorText.loginTitle}
        message={editorText.loginDescription}
      >
        <Link className="board-crud-primary-link" to="/profile">
          {editorText.loginAction}
        </Link>
        <Link className="board-crud-secondary-link" to="/board">
          {text.detail.back}
        </Link>
      </BoardEditorState>
    );
  }

  const currentEditState = postId && editLoadState?.postId === postId
    ? editLoadState.status
    : null;

  if (isEdit && currentEditState === null) {
    return <BoardEditorState message={editorText.loading} />;
  }

  if (currentEditState === "forbidden") {
    return (
      <BoardEditorState
        title={editorText.forbiddenTitle}
        message={editorText.forbiddenDescription}
      >
        <Link className="board-crud-primary-link" to="/board">
          {text.detail.back}
        </Link>
      </BoardEditorState>
    );
  }

  if (currentEditState === "error") {
    return (
      <BoardEditorState message={editorText.loadError}>
        <Link className="board-crud-primary-link" to="/board">
          {text.detail.back}
        </Link>
      </BoardEditorState>
    );
  }

  return (
    <section className={"board-crud-page " + lang + "-font"}>
      <header className="board-crud-header">
        <span className="board-crud-eyebrow en-font">{editorText.eyebrow}</span>
        <h1>{isEdit ? editorText.editTitle : editorText.createTitle}</h1>
        <p>{isEdit ? editorText.editDescription : editorText.createDescription}</p>
      </header>

      <form className="board-editor-form" onSubmit={submit}>
        <div className="board-editor-field board-editor-category-field">
          <label htmlFor="board-editor-category">{editorText.categoryLabel}</label>
          <select
            id="board-editor-category"
            value={form.category}
            onChange={(event) => updateField("category", event.target.value as BoardCategory)}
          >
            {CATEGORY_OPTIONS.map((category) => (
              <option key={category} value={category}>
                {text.categories[category]}
              </option>
            ))}
          </select>
        </div>

        <div className="board-editor-field">
          <div className="board-editor-label-row">
            <label htmlFor="board-editor-title">{editorText.titleLabel}</label>
            <span className="num-font">{form.title.length} / 120</span>
          </div>
          <input
            id="board-editor-title"
            type="text"
            maxLength={120}
            value={form.title}
            placeholder={editorText.titlePlaceholder}
            onChange={(event) => updateField("title", event.target.value)}
          />
        </div>

        <div className="board-editor-field">
          <div className="board-editor-label-row">
            <label htmlFor="board-editor-content">{editorText.contentLabel}</label>
            <span className="num-font">{form.content.length.toLocaleString()} / 20,000</span>
          </div>
          <textarea
            id="board-editor-content"
            maxLength={20_000}
            value={form.content}
            placeholder={editorText.contentPlaceholder}
            onChange={(event) => updateField("content", event.target.value)}
          />
        </div>

        {message ? <p className="board-editor-message" role="alert">{message}</p> : null}

        <div className="board-editor-actions">
          <Link
            className="board-crud-secondary-link"
            to={postId ? "/board/" + postId : "/board"}
          >
            {editorText.cancel}
          </Link>
          <button type="submit" disabled={isSubmitting}>
            {isSubmitting
              ? editorText.submitting
              : isEdit
                ? editorText.updateSubmit
                : editorText.createSubmit}
          </button>
        </div>
      </form>
    </section>
  );
}

function BoardEditorState({
  title,
  message,
  children,
}: {
  title?: string;
  message: string;
  children?: React.ReactNode;
}) {
  return (
    <section className="board-crud-page board-crud-state-page">
      <div className="board-crud-state">
        <span aria-hidden="true">◇</span>
        {title ? <h1>{title}</h1> : null}
        <p>{message}</p>
        {children ? <div className="board-crud-state-actions">{children}</div> : null}
      </div>
    </section>
  );
}

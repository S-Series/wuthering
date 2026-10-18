import type { FastifyInstance, FastifyReply } from "fastify";
import { supabaseAdmin } from "../lib/supabaseAdmin.js";
import { getRequiredSupabaseUser } from "../services/supabaseUsers.js";
import { ReadThroughCache } from "../services/readThroughCache.js";

const BOARD_CATEGORIES = ["general", "report", "question", "guide"] as const;
const DEFAULT_PAGE_SIZE = 20;
const MAX_PAGE_SIZE = 50;

type BoardCategory = (typeof BOARD_CATEGORIES)[number];

type BoardListQuery = {
  page?: string;
  limit?: string;
  category?: string;
  search?: string;
};

type BoardPostParams = {
  postId?: string;
  commentId?: string;
};

type BoardPostDetailQuery = {
  view?: string;
};

type BoardPostBody = {
  category?: unknown;
  title?: unknown;
  content?: unknown;
};

type BoardCommentBody = {
  content?: unknown;
};

type BoardResolutionBody = {
  isResolved?: unknown;
};

type BoardPostRow = {
  id: string;
  author_id: string;
  category: BoardCategory;
  title: string;
  view_count: number;
  comment_count: number;
  is_pinned: boolean;
  is_resolved: boolean;
  created_at: string;
  updated_at: string;
  author: BoardAuthor;
};

type BoardPostDetailRow = BoardPostRow & {
  content: string;
};

type BoardCommentRow = {
  id: string;
  post_id: string;
  author_id: string;
  content: string;
  created_at: string;
  updated_at: string;
  author: BoardAuthor;
};

type BoardAuthor = { memberships: { nickname: string | null } | null } | null;

// Both board tables reference users; memberships.user_id is unique. Embed only
// the public nickname, avoiding a second network round trip and private fields.
const POST_COLUMNS = "id, author_id, category, title, view_count, comment_count, is_pinned, is_resolved, created_at, updated_at, author:users!board_posts_author_id_fkey(memberships(nickname))";
const COMMENT_COLUMNS = "id, post_id, author_id, content, created_at, updated_at, author:users!board_comments_author_id_fkey(memberships(nickname))";

function getAuthorName(author: BoardAuthor) {
  return author?.memberships?.nickname?.trim() || "Anonymous";
}

class BoardReadError extends Error {
  constructor(readonly statusCode: number, message: string) {
    super(message);
  }
}

type ValidBoardPostInput = {
  category: BoardCategory;
  title: string;
  content: string;
};

const UUID_PATTERN =
  /^[0-9a-f]{8}-[0-9a-f]{4}-[1-5][0-9a-f]{3}-[89ab][0-9a-f]{3}-[0-9a-f]{12}$/i;

function toPositiveInteger(value: string | undefined, fallback: number) {
  const parsed = Number(value);

  if (!Number.isSafeInteger(parsed) || parsed < 1) {
    return fallback;
  }

  return parsed;
}

function normalizeCategory(value: string | undefined) {
  return BOARD_CATEGORIES.includes(value as BoardCategory)
    ? (value as BoardCategory)
    : null;
}

function normalizeSearch(value: string | undefined) {
  if (typeof value !== "string") return null;

  const normalized = value.trim().replace(/[%,_]/g, "");
  return normalized ? normalized.slice(0, 80) : null;
}

function validatePostId(value: string | undefined) {
  const normalized = value?.trim() ?? "";
  return UUID_PATTERN.test(normalized) ? normalized : null;
}

function validateCommentBody(body: BoardCommentBody) {
  const content = typeof body.content === "string" ? body.content.trim() : "";

  if (content.length < 1 || content.length > 2_000) {
    return { ok: false as const, error: "comment must be between 1 and 2000 characters" };
  }

  return { ok: true as const, value: { content } };
}

function validatePostBody(body: BoardPostBody):
  | { ok: true; value: ValidBoardPostInput }
  | { ok: false; error: string } {
  const category = typeof body.category === "string"
    ? normalizeCategory(body.category)
    : null;
  const title = typeof body.title === "string" ? body.title.trim() : "";
  const content = typeof body.content === "string" ? body.content.trim() : "";

  if (!category) {
    return { ok: false, error: "invalid category" };
  }

  if (title.length < 1 || title.length > 120) {
    return { ok: false, error: "title must be between 1 and 120 characters" };
  }

  if (content.length < 1 || content.length > 20_000) {
    return { ok: false, error: "content must be between 1 and 20000 characters" };
  }

  return {
    ok: true,
    value: { category, title, content },
  };
}

async function getActiveUser(req: Parameters<typeof getRequiredSupabaseUser>[0]) {
  const user = await getRequiredSupabaseUser(req);

  if (user.status.toLowerCase() !== "active") {
    throw new Error("inactive user");
  }

  return user;
}

export async function registerBoardRoutes(app: FastifyInstance) {
  // Server-side only: browsers must revalidate so writes immediately become visible.
  // TTL also bounds staleness from other gateway replicas and direct DB changes.
  const reads = new ReadThroughCache(10_000, 256);
  app.addHook("onSend", async (req, reply, payload) => {
    const route = req.routeOptions.url ?? "";
    if (route.startsWith("/api/board/posts")) {
      reply.header("cache-control", "no-store");
    }
    if (req.method !== "GET" && req.method !== "HEAD" &&
        reply.statusCode >= 200 && reply.statusCode < 300 &&
        route.startsWith("/api/board/posts")) {
      reads.clear();
    }
    return payload;
  });

  async function read<T>(reply: FastifyReply, key: string, load: () => Promise<T>) {
    const start = performance.now();
    const result = await reads.getOrLoad(key, load);
    reply.header("x-cache", result.status);
    reply.header("server-timing", `board_read;dur=${(performance.now() - start).toFixed(1)}`);
    return result.value;
  }

  function readError(req: { log: FastifyInstance["log"] }, reply: FastifyReply, error: unknown) {
    if (error instanceof BoardReadError) {
      return reply.code(error.statusCode).send({ error: error.message });
    }
    req.log.error(error);
    return reply.code(500).send({ error: "board load failed" });
  }

  app.get("/api/board/posts", async (req, reply) => {
    const requestQuery = (req.query ?? {}) as BoardListQuery;
    const page = toPositiveInteger(requestQuery.page, 1);
    const limit = Math.min(toPositiveInteger(requestQuery.limit, DEFAULT_PAGE_SIZE), MAX_PAGE_SIZE);
    const category = normalizeCategory(requestQuery.category);
    const search = normalizeSearch(requestQuery.search);
    const from = (page - 1) * limit;
    if (!Number.isSafeInteger(from + limit)) {
      return reply.code(400).send({ error: "invalid page" });
    }

    try {
      return reply.send(await read(reply, JSON.stringify(["list", page, limit, category, search]), async () => {
        let postsQuery = supabaseAdmin
          .from("board_posts")
          .select(POST_COLUMNS, { count: "exact" })
          .eq("status", "published")
          .order("is_pinned", { ascending: false })
          .order("created_at", { ascending: false })
          .order("id", { ascending: false })
          .range(from, from + limit - 1);

        if (category) postsQuery = postsQuery.eq("category", category);
        if (search) postsQuery = postsQuery.ilike("title", "%" + search + "%");

        const { data, error, count } = await postsQuery;
        if (error) throw error;
        const posts = (data ?? []) as unknown as BoardPostRow[];
        const total = count ?? 0;
        return {
          items: posts.map((post) => ({
            id: post.id,
            category: post.category,
            title: post.title,
            authorName: getAuthorName(post.author),
            viewCount: post.view_count,
            commentCount: post.comment_count,
            isPinned: post.is_pinned,
            isResolved: post.is_resolved,
            createdAt: post.created_at,
            updatedAt: post.updated_at,
          })),
          page, limit, total,
          totalPages: Math.max(1, Math.ceil(total / limit)),
        };
      }));
    } catch (error) {
      return readError(req, reply, error);
    }
  });

  app.get("/api/board/posts/:postId", async (req, reply) => {
    const params = (req.params ?? {}) as BoardPostParams;
    const query = (req.query ?? {}) as BoardPostDetailQuery;
    const postId = validatePostId(params.postId);
    if (!postId) return reply.code(400).send({ error: "invalid post id" });

    // Each view remains a separate atomic increment, even when reads coalesce.
    // Run it alongside the read so it does not add another sequential DB wait.
    const viewStart = performance.now();
    const view = query.view === "1"
      ? Promise.resolve(supabaseAdmin.rpc("increment_board_post_view", { target_post_id: postId }))
          .then(({ data, error }) => {
            if (error) req.log.warn(error);
            return typeof data === "number" ? data : null;
          }).catch((error: unknown) => { req.log.warn(error); return null; })
      : Promise.resolve(null);

    try {
      const [post, viewCount] = await Promise.all([
        read(reply, "post:" + postId, async () => {
          const { data, error } = await supabaseAdmin
            .from("board_posts")
            .select(POST_COLUMNS + ", content")
            .eq("id", postId)
            .eq("status", "published")
            .maybeSingle();
          if (error) throw error;
          if (!data) throw new BoardReadError(404, "board post not found");
          const post = data as unknown as BoardPostDetailRow;
          return {
            id: post.id,
            authorId: post.author_id,
            authorName: getAuthorName(post.author),
            category: post.category,
            title: post.title,
            content: post.content,
            viewCount: post.view_count,
            commentCount: post.comment_count,
            isPinned: post.is_pinned,
            isResolved: post.is_resolved,
            createdAt: post.created_at,
            updatedAt: post.updated_at,
          };
        }),
        view,
      ]);
      if (query.view === "1") {
        reply.header("server-timing", `${reply.getHeader("server-timing")}, board_total;dur=${(performance.now() - viewStart).toFixed(1)}`);
      }
      // Never mutate the cached object with a per-request view result.
      return reply.send(viewCount === null ? post : { ...post, viewCount: Math.max(post.viewCount, viewCount) });
    } catch (error) {
      return readError(req, reply, error);
    }
  });

  app.get("/api/board/posts/:postId/comments", async (req, reply) => {
    const params = (req.params ?? {}) as BoardPostParams;
    const postId = validatePostId(params.postId);
    if (!postId) return reply.code(400).send({ error: "invalid post id" });

    try {
      return reply.send(await read(reply, "comments:" + postId, async () => {
        const [postResult, commentsResult] = await Promise.all([
          supabaseAdmin.from("board_posts").select("id")
            .eq("id", postId).eq("status", "published").maybeSingle(),
          supabaseAdmin.from("board_comments").select(COMMENT_COLUMNS)
            .eq("post_id", postId).eq("status", "published")
            .order("created_at", { ascending: true }).order("id", { ascending: true }),
        ]);
        if (postResult.error) throw postResult.error;
        if (!postResult.data) throw new BoardReadError(404, "board post not found");
        if (commentsResult.error) throw commentsResult.error;
        const comments = (commentsResult.data ?? []) as unknown as BoardCommentRow[];
        return {
          items: comments.map((comment) => ({
            id: comment.id,
            postId: comment.post_id,
            authorId: comment.author_id,
            authorName: getAuthorName(comment.author),
            content: comment.content,
            createdAt: comment.created_at,
            updatedAt: comment.updated_at,
          })),
        };
      }));
    } catch (error) {
      return readError(req, reply, error);
    }
  });

  app.post("/api/board/posts/:postId/comments", async (req, reply) => {
    let user;

    try {
      user = await getActiveUser(req);
    } catch {
      return reply.code(401).send({ error: "unauthorized" });
    }

    const params = (req.params ?? {}) as BoardPostParams;
    const postId = validatePostId(params.postId);
    if (!postId) return reply.code(400).send({ error: "invalid post id" });

    const validated = validateCommentBody((req.body ?? {}) as BoardCommentBody);
    if (!validated.ok) return reply.code(400).send({ error: validated.error });

    const { data: post, error: postError } = await supabaseAdmin
      .from("board_posts")
      .select("id")
      .eq("id", postId)
      .eq("status", "published")
      .maybeSingle();

    if (postError) {
      req.log.error(postError);
      return reply.code(500).send({ error: "board post load failed" });
    }
    if (!post) return reply.code(404).send({ error: "board post not found" });

    const now = new Date().toISOString();
    const { data, error } = await supabaseAdmin
      .from("board_comments")
      .insert({
        post_id: postId,
        author_id: user.id,
        content: validated.value.content,
        status: "published",
        created_at: now,
        updated_at: now,
      })
      .select("id")
      .single();

    if (error) {
      req.log.error(error);
      return reply.code(500).send({ error: "board comment create failed" });
    }

    return reply.code(201).send({ id: data.id });
  });

  app.put("/api/board/posts/:postId/comments/:commentId", async (req, reply) => {
    let user;

    try {
      user = await getActiveUser(req);
    } catch {
      return reply.code(401).send({ error: "unauthorized" });
    }

    const params = (req.params ?? {}) as BoardPostParams;
    const postId = validatePostId(params.postId);
    const commentId = validatePostId(params.commentId);
    if (!postId || !commentId) {
      return reply.code(400).send({ error: "invalid comment id" });
    }

    const validated = validateCommentBody((req.body ?? {}) as BoardCommentBody);
    if (!validated.ok) return reply.code(400).send({ error: validated.error });

    const { data: comment, error: loadError } = await supabaseAdmin
      .from("board_comments")
      .select("id, author_id")
      .eq("id", commentId)
      .eq("post_id", postId)
      .eq("status", "published")
      .maybeSingle();

    if (loadError) {
      req.log.error(loadError);
      return reply.code(500).send({ error: "board comment load failed" });
    }
    if (!comment) return reply.code(404).send({ error: "board comment not found" });
    if (comment.author_id !== user.id && user.role.toLowerCase() !== "admin") {
      return reply.code(403).send({ error: "forbidden" });
    }

    const { error } = await supabaseAdmin
      .from("board_comments")
      .update({
        content: validated.value.content,
        updated_at: new Date().toISOString(),
      })
      .eq("id", commentId);

    if (error) {
      req.log.error(error);
      return reply.code(500).send({ error: "board comment update failed" });
    }

    return reply.send({ id: commentId });
  });

  app.delete("/api/board/posts/:postId/comments/:commentId", async (req, reply) => {
    let user;

    try {
      user = await getActiveUser(req);
    } catch {
      return reply.code(401).send({ error: "unauthorized" });
    }

    const params = (req.params ?? {}) as BoardPostParams;
    const postId = validatePostId(params.postId);
    const commentId = validatePostId(params.commentId);
    if (!postId || !commentId) {
      return reply.code(400).send({ error: "invalid comment id" });
    }

    const { data: comment, error: loadError } = await supabaseAdmin
      .from("board_comments")
      .select("id, author_id")
      .eq("id", commentId)
      .eq("post_id", postId)
      .eq("status", "published")
      .maybeSingle();

    if (loadError) {
      req.log.error(loadError);
      return reply.code(500).send({ error: "board comment load failed" });
    }
    if (!comment) return reply.code(404).send({ error: "board comment not found" });
    if (comment.author_id !== user.id && user.role.toLowerCase() !== "admin") {
      return reply.code(403).send({ error: "forbidden" });
    }

    const { error } = await supabaseAdmin
      .from("board_comments")
      .update({
        status: "hidden",
        updated_at: new Date().toISOString(),
      })
      .eq("id", commentId);

    if (error) {
      req.log.error(error);
      return reply.code(500).send({ error: "board comment delete failed" });
    }

    return reply.code(204).send();
  });

  app.patch("/api/board/posts/:postId/resolution", async (req, reply) => {
    let user;

    try {
      user = await getActiveUser(req);
    } catch {
      return reply.code(401).send({ error: "unauthorized" });
    }

    if (user.role.toLowerCase() !== "admin") {
      return reply.code(403).send({ error: "forbidden" });
    }

    const params = (req.params ?? {}) as BoardPostParams;
    const postId = validatePostId(params.postId);
    const body = (req.body ?? {}) as BoardResolutionBody;
    if (!postId || typeof body.isResolved !== "boolean") {
      return reply.code(400).send({ error: "invalid resolution state" });
    }

    const { data, error } = await supabaseAdmin
      .from("board_posts")
      .update({
        is_resolved: body.isResolved,
        updated_at: new Date().toISOString(),
      })
      .eq("id", postId)
      .eq("category", "report")
      .eq("status", "published")
      .select("id, is_resolved")
      .maybeSingle();

    if (error) {
      req.log.error(error);
      return reply.code(500).send({ error: "board resolution update failed" });
    }
    if (!data) return reply.code(404).send({ error: "board post not found" });

    return reply.send({ id: data.id, isResolved: data.is_resolved });
  });

  app.post("/api/board/posts", async (req, reply) => {
    let user;

    try {
      user = await getActiveUser(req);
    } catch {
      return reply.code(401).send({ error: "unauthorized" });
    }

    const validated = validatePostBody((req.body ?? {}) as BoardPostBody);

    if (!validated.ok) {
      return reply.code(400).send({ error: validated.error });
    }

    const now = new Date().toISOString();
    const { data, error } = await supabaseAdmin
      .from("board_posts")
      .insert({
        author_id: user.id,
        category: validated.value.category,
        title: validated.value.title,
        content: validated.value.content,
        status: "published",
        created_at: now,
        updated_at: now,
      })
      .select("id")
      .single();

    if (error) {
      req.log.error(error);
      return reply.code(500).send({ error: "board post create failed" });
    }

    return reply.code(201).send({ id: data.id });
  });

  app.put("/api/board/posts/:postId", async (req, reply) => {
    let user;

    try {
      user = await getActiveUser(req);
    } catch {
      return reply.code(401).send({ error: "unauthorized" });
    }

    const params = (req.params ?? {}) as BoardPostParams;
    const postId = validatePostId(params.postId);

    if (!postId) {
      return reply.code(400).send({ error: "invalid post id" });
    }

    const validated = validatePostBody((req.body ?? {}) as BoardPostBody);

    if (!validated.ok) {
      return reply.code(400).send({ error: validated.error });
    }

    const { data, error } = await supabaseAdmin
      .from("board_posts")
      .update({
        category: validated.value.category,
        title: validated.value.title,
        content: validated.value.content,
        ...(validated.value.category === "report" ? {} : { is_resolved: false }),
        updated_at: new Date().toISOString(),
      })
      .eq("id", postId)
      .eq("author_id", user.id)
      .eq("status", "published")
      .select("id")
      .maybeSingle();

    if (error) {
      req.log.error(error);
      return reply.code(500).send({ error: "board post update failed" });
    }

    if (!data) {
      return reply.code(404).send({ error: "board post not found" });
    }

    return reply.send({ id: data.id });
  });

  app.delete("/api/board/posts/:postId", async (req, reply) => {
    let user;

    try {
      user = await getActiveUser(req);
    } catch {
      return reply.code(401).send({ error: "unauthorized" });
    }

    const params = (req.params ?? {}) as BoardPostParams;
    const postId = validatePostId(params.postId);

    if (!postId) {
      return reply.code(400).send({ error: "invalid post id" });
    }

    const { data, error } = await supabaseAdmin
      .from("board_posts")
      .update({
        status: "hidden",
        updated_at: new Date().toISOString(),
      })
      .eq("id", postId)
      .eq("author_id", user.id)
      .eq("status", "published")
      .select("id")
      .maybeSingle();

    if (error) {
      req.log.error(error);
      return reply.code(500).send({ error: "board post delete failed" });
    }

    if (!data) {
      return reply.code(404).send({ error: "board post not found" });
    }

    return reply.code(204).send();
  });
}

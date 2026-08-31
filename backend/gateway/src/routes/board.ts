import type { FastifyInstance } from "fastify";
import { supabaseAdmin } from "../lib/supabaseAdmin.js";
import { getRequiredSupabaseUser } from "../services/supabaseUsers.js";

const BOARD_CATEGORIES = ["general", "question", "guide"] as const;
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
};

type BoardPostBody = {
  category?: unknown;
  title?: unknown;
  content?: unknown;
};

type BoardPostRow = {
  id: string;
  author_id: string;
  category: BoardCategory;
  title: string;
  view_count: number;
  comment_count: number;
  is_pinned: boolean;
  created_at: string;
  updated_at: string;
};

type BoardPostDetailRow = BoardPostRow & {
  content: string;
};

type MembershipNicknameRow = {
  user_id: string;
  nickname: string | null;
};

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

async function getAuthorName(authorId: string) {
  const { data, error } = await supabaseAdmin
    .from("memberships")
    .select("nickname")
    .eq("user_id", authorId)
    .maybeSingle();

  if (error) return "Anonymous";

  return typeof data?.nickname === "string" && data.nickname.trim()
    ? data.nickname.trim()
    : "Anonymous";
}

async function getActiveUser(req: Parameters<typeof getRequiredSupabaseUser>[0]) {
  const user = await getRequiredSupabaseUser(req);

  if (user.status.toLowerCase() !== "active") {
    throw new Error("inactive user");
  }

  return user;
}

export async function registerBoardRoutes(app: FastifyInstance) {
  app.get("/api/board/posts", async (req, reply) => {
    const requestQuery = (req.query ?? {}) as BoardListQuery;
    const page = toPositiveInteger(requestQuery.page, 1);
    const limit = Math.min(
      toPositiveInteger(requestQuery.limit, DEFAULT_PAGE_SIZE),
      MAX_PAGE_SIZE
    );
    const category = normalizeCategory(requestQuery.category);
    const search = normalizeSearch(requestQuery.search);
    const from = (page - 1) * limit;
    const to = from + limit - 1;

    let postsQuery = supabaseAdmin
      .from("board_posts")
      .select(
        "id, author_id, category, title, view_count, comment_count, is_pinned, created_at, updated_at",
        { count: "exact" }
      )
      .eq("status", "published")
      .order("is_pinned", { ascending: false })
      .order("created_at", { ascending: false })
      .range(from, to);

    if (category) {
      postsQuery = postsQuery.eq("category", category);
    }

    if (search) {
      postsQuery = postsQuery.ilike("title", "%" + search + "%");
    }

    const { data, error, count } = await postsQuery;

    if (error) {
      req.log.error(error);
      return reply.code(500).send({ error: "board posts load failed" });
    }

    const posts = (data ?? []) as BoardPostRow[];
    const authorIds = [...new Set(posts.map((post) => post.author_id))];
    const nicknameByUserId = new Map<string, string>();

    if (authorIds.length > 0) {
      const { data: memberships, error: membershipError } = await supabaseAdmin
        .from("memberships")
        .select("user_id, nickname")
        .in("user_id", authorIds);

      if (membershipError) {
        req.log.warn(membershipError);
      } else {
        for (const membership of (memberships ?? []) as MembershipNicknameRow[]) {
          const nickname = membership.nickname?.trim();
          if (nickname) nicknameByUserId.set(membership.user_id, nickname);
        }
      }
    }

    const total = count ?? 0;

    return reply.send({
      items: posts.map((post) => ({
        id: post.id,
        category: post.category,
        title: post.title,
        authorName: nicknameByUserId.get(post.author_id) ?? "Anonymous",
        viewCount: post.view_count,
        commentCount: post.comment_count,
        isPinned: post.is_pinned,
        createdAt: post.created_at,
        updatedAt: post.updated_at,
      })),
      page,
      limit,
      total,
      totalPages: Math.max(1, Math.ceil(total / limit)),
    });
  });

  app.get("/api/board/posts/:postId", async (req, reply) => {
    const params = (req.params ?? {}) as BoardPostParams;
    const postId = validatePostId(params.postId);

    if (!postId) {
      return reply.code(400).send({ error: "invalid post id" });
    }

    const { data, error } = await supabaseAdmin
      .from("board_posts")
      .select(
        "id, author_id, category, title, content, view_count, comment_count, is_pinned, created_at, updated_at"
      )
      .eq("id", postId)
      .eq("status", "published")
      .maybeSingle();

    if (error) {
      req.log.error(error);
      return reply.code(500).send({ error: "board post load failed" });
    }

    if (!data) {
      return reply.code(404).send({ error: "board post not found" });
    }

    const post = data as BoardPostDetailRow;
    const authorName = await getAuthorName(post.author_id);

    return reply.send({
      id: post.id,
      authorId: post.author_id,
      authorName,
      category: post.category,
      title: post.title,
      content: post.content,
      viewCount: post.view_count,
      commentCount: post.comment_count,
      isPinned: post.is_pinned,
      createdAt: post.created_at,
      updatedAt: post.updated_at,
    });
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

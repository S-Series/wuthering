import type { FastifyInstance } from "fastify";
import { supabaseAdmin } from "../lib/supabaseAdmin.js";

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

type MembershipNicknameRow = {
  user_id: string;
  nickname: string | null;
};

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
}

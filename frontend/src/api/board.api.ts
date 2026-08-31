import type {
  BoardCategory,
  BoardPostListResponse,
} from "@/types/board.type";

type FetchBoardPostsInput = {
  page?: number;
  limit?: number;
  category?: BoardCategory;
  search?: string;
  signal?: AbortSignal;
};

export async function fetchBoardPosts({
  page = 1,
  limit = 20,
  category,
  search,
  signal,
}: FetchBoardPostsInput = {}): Promise<BoardPostListResponse> {
  const gatewayUrl = import.meta.env.VITE_GATEWAY_URL;

  if (!gatewayUrl) {
    throw new Error("VITE_GATEWAY_URL is missing");
  }

  const url = new URL(
    gatewayUrl.replace(/\/$/, "") + "/api/board/posts"
  );
  url.searchParams.set("page", String(page));
  url.searchParams.set("limit", String(limit));

  if (category) url.searchParams.set("category", category);
  if (search?.trim()) url.searchParams.set("search", search.trim());

  const response = await fetch(url, { signal });

  if (!response.ok) {
    throw new Error("Failed to load board posts: " + response.status);
  }

  return (await response.json()) as BoardPostListResponse;
}

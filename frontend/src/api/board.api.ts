import type {
  BoardCategory,
  BoardPostDetail,
  BoardPostInput,
  BoardPostListResponse,
} from "@/types/board.type";
import { auth } from "@/firebase/firebase";

type FetchBoardPostsInput = {
  page?: number;
  limit?: number;
  category?: BoardCategory;
  search?: string;
  signal?: AbortSignal;
};

export class BoardApiError extends Error {
  status: number;

  constructor(message: string, status: number) {
    super(message);
    this.name = "BoardApiError";
    this.status = status;
  }
}

function getGatewayUrl() {
  const gatewayUrl = import.meta.env.VITE_GATEWAY_URL;

  if (!gatewayUrl) {
    throw new Error("VITE_GATEWAY_URL is missing");
  }

  return gatewayUrl.replace(/\/$/, "");
}

async function getAuthorizationHeader() {
  const user = auth?.currentUser ?? null;

  if (!user) {
    throw new BoardApiError("login required", 401);
  }

  return "Bearer " + await user.getIdToken();
}

async function throwApiError(response: Response, fallback: string): Promise<never> {
  let message = fallback;

  try {
    const body = (await response.json()) as { error?: unknown };
    if (typeof body.error === "string") message = body.error;
  } catch {
    // Keep the fallback message when the response is not JSON.
  }

  throw new BoardApiError(message, response.status);
}

export async function fetchBoardPosts({
  page = 1,
  limit = 20,
  category,
  search,
  signal,
}: FetchBoardPostsInput = {}): Promise<BoardPostListResponse> {
  const url = new URL(
    getGatewayUrl() + "/api/board/posts"
  );
  url.searchParams.set("page", String(page));
  url.searchParams.set("limit", String(limit));

  if (category) url.searchParams.set("category", category);
  if (search?.trim()) url.searchParams.set("search", search.trim());

  const response = await fetch(url, { signal });

  if (!response.ok) {
    return throwApiError(response, "Failed to load board posts");
  }

  return (await response.json()) as BoardPostListResponse;
}

export async function fetchBoardPost(
  postId: string,
  signal?: AbortSignal
): Promise<BoardPostDetail> {
  const response = await fetch(
    getGatewayUrl() + "/api/board/posts/" + encodeURIComponent(postId),
    { signal }
  );

  if (!response.ok) {
    return throwApiError(response, "Failed to load board post");
  }

  return (await response.json()) as BoardPostDetail;
}

export async function createBoardPost(input: BoardPostInput) {
  const authorization = await getAuthorizationHeader();
  const response = await fetch(getGatewayUrl() + "/api/board/posts", {
    method: "POST",
    headers: {
      "Content-Type": "application/json",
      Authorization: authorization,
    },
    body: JSON.stringify(input),
  });

  if (!response.ok) {
    return throwApiError(response, "Failed to create board post");
  }

  return (await response.json()) as { id: string };
}

export async function updateBoardPost(postId: string, input: BoardPostInput) {
  const authorization = await getAuthorizationHeader();
  const response = await fetch(
    getGatewayUrl() + "/api/board/posts/" + encodeURIComponent(postId),
    {
      method: "PUT",
      headers: {
        "Content-Type": "application/json",
        Authorization: authorization,
      },
      body: JSON.stringify(input),
    }
  );

  if (!response.ok) {
    return throwApiError(response, "Failed to update board post");
  }

  return (await response.json()) as { id: string };
}

export async function deleteBoardPost(postId: string) {
  const authorization = await getAuthorizationHeader();
  const response = await fetch(
    getGatewayUrl() + "/api/board/posts/" + encodeURIComponent(postId),
    {
      method: "DELETE",
      headers: { Authorization: authorization },
    }
  );

  if (!response.ok) {
    return throwApiError(response, "Failed to delete board post");
  }
}

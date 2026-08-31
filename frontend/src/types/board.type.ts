export type BoardCategory = "general" | "question" | "guide";

export type BoardPostListItem = {
  id: string;
  category: BoardCategory;
  title: string;
  authorName: string;
  viewCount: number;
  commentCount: number;
  isPinned: boolean;
  createdAt: string;
  updatedAt: string;
};

export type BoardPostListResponse = {
  items: BoardPostListItem[];
  page: number;
  limit: number;
  total: number;
  totalPages: number;
};

export type BoardPostDetail = BoardPostListItem & {
  authorId: string;
  content: string;
};

export type BoardPostInput = {
  category: BoardCategory;
  title: string;
  content: string;
};

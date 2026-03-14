import type { HomePost } from "@/posts/homePosts";
import type { LangType } from "@/stores/appStore";

import "./HomePostCard.css"

type HomePostCardProps = {
  post: HomePost;
  lang: LangType;
};

function formatHomePostDate(dateString: string) {
  const date = new Date(dateString);
  if (Number.isNaN(date.getTime())) return dateString;

  const yyyy = date.getFullYear();
  const mm = String(date.getMonth() + 1).padStart(2, "0");
  const dd = String(date.getDate()).padStart(2, "0");
  const hh = String(date.getHours()).padStart(2, "0");
  const min = String(date.getMinutes()).padStart(2, "0");

  return `${yyyy}-${mm}-${dd} ${hh}:${min}`;
}

export default function HomePostCard({ post, lang }: HomePostCardProps) {
  return (
    <article className={`home-post-card ${post.pinned ? "pinned" : ""}`}>
      <h3 className={`home-post-title ${lang}-font`}>{post.title[lang]}</h3>
      <p className={`home-post-body ${lang}-font`}>{post.data[lang]}</p>
      <time className="home-post-date">{formatHomePostDate(post.date)}</time>
    </article>
  );
}
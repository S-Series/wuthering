import { Link } from "react-router-dom";
import "./InformationPages.css";

export default function NotFound() {
  return <article className="information-page site-document kr-font" lang="ko">
    <h1>페이지를 찾을 수 없습니다</h1>
    <p>주소가 올바른지 확인하거나 아래 링크로 이동해 주세요.</p>
    <p><Link to="/">홈</Link> · <Link to="/card">명조 스펙카드 만들기</Link> · <Link to="/guide">사용법</Link></p>
  </article>;
}

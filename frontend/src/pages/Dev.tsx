import { NavLink, Outlet, useMatch } from "react-router-dom";
import "./Dev.css";

export default function Dev() {
  const isIndex = useMatch("/dev");

  return (
    <div className="dev-page">
      <div className="dev-heading">
        <p className="dev-eyebrow">WUWA DEV / WORKSPACE</p>
        <h1>개발 도구</h1>
        <p>테스트 도구와 서비스 통계를 확인할 수 있습니다.</p>
      </div>
      <nav className="dev-nav" aria-label="개발 도구">
        <NavLink to="/dev" end>개요</NavLink>
        <NavLink to="/dev/ocr">OCR 테스트</NavLink>
        <NavLink to="/dev/analystic">통계</NavLink>
      </nav>
      {isIndex ? (
        <div className="dev-links">
          <NavLink to="/dev/ocr">
            <strong>OCR 테스트</strong>
            <span>이미지 전처리와 인식 결과를 확인합니다.</span>
          </NavLink>
          <NavLink to="/dev/analystic">
            <strong>Vercel 통계</strong>
            <span>방문자, 조회수, 인기 페이지를 확인합니다.</span>
          </NavLink>
        </div>
      ) : <Outlet />}
    </div>
  );
}

import { useEffect, useRef } from "react";
import { Outlet, useLocation } from "react-router-dom";
import { Analytics } from "@vercel/analytics/react";

import Navbar from "@/components/_Layout/Navbar";
import Footer from "@/components/_Layout/Footer";
import CloudSyncManager from "@/components/features/CloudSync/CloudSyncManager";
import GlobalNoticePopup from "@/components/features/Home/GlobalNoticePopup";
import { usePageEntryAnimations } from "@/components/common/usePageEntryAnimations";

import "@/components/_Layout/Layout.css";

export default function Layout() {
  const location = useLocation();
  const main = useRef<HTMLElement>(null);
  usePageEntryAnimations(main, location.pathname);

  useEffect(() => {
    document.body.classList.remove(
      "page-home",
      "page-characters",
      "page-card",
      "page-profile",
      "page-board"
    );

    switch (true) {
      case location.pathname === "/":
        document.body.classList.add("page-home");
        break;

      case location.pathname.startsWith("/characters"):
        document.body.classList.add("page-characters");
        break;

      case location.pathname.startsWith("/card"):
        document.body.classList.add("page-card");
        break;

      case location.pathname.startsWith("/profile"):
        document.body.classList.add("page-profile");
        break;

      case location.pathname.startsWith("/board"):
        document.body.classList.add("page-board");
        break;

      default:
        document.body.classList.add("page-home");
        break;
    }

    return () => {
      document.body.classList.remove(
        "page-home",
        "page-characters",
        "page-card",
        "page-profile",
        "page-board"
      );
    };
  }, [location.pathname]);

  return (
    <>
      <header>
        <Navbar />
      </header>

      <main id="main-container" ref={main}>
        <Outlet />
      </main>

      <footer>
        <Footer />
      </footer>

      <CloudSyncManager />
      <GlobalNoticePopup />
      <Analytics />
    </>
  );
}

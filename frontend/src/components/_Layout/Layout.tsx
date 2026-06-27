import { useEffect } from "react";
import { Outlet, useLocation } from "react-router-dom";
import { Analytics } from "@vercel/analytics/react";

import Navbar from "@/components/_Layout/Navbar";
import Footer from "@/components/_Layout/Footer";
import CloudSyncManager from "@/components/features/CloudSync/CloudSyncManager";
import GlobalNoticePopup from "@/components/features/Home/GlobalNoticePopup";

import "@/components/_Layout/Layout.css";

export default function Layout() {
  const location = useLocation();

  useEffect(() => {
    document.body.classList.remove(
      "page-home",
      "page-characters",
      "page-card",
      "page-profile"
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

      default:
        document.body.classList.add("page-home");
        break;
    }

    return () => {
      document.body.classList.remove(
        "page-home",
        "page-characters",
        "page-card",
        "page-profile"
      );
    };
  }, [location.pathname]);

  return (
    <>
      <header>
        <Navbar />
      </header>

      <main id="main-container">
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

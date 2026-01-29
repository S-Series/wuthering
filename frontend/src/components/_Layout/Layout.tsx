import { Outlet, useLocation } from "react-router-dom";
import { useEffect } from "react";

import Navbar from "@/components/_Layout/Navbar";
import Footer from "@/components/_Layout/Footer";

import "@/components/_Layout/Layout.css";

export default function Layout() {
  const location = useLocation();

  useEffect(() => {
    document.body.classList.remove(
      "page-home",
      "page-characters",
      "page-card"
    );

    switch (location.pathname) {
      case "/":
        document.body.classList.add("page-home");
        break;

      case "/characters":
        document.body.classList.add("page-characters");
        break;

      case "/card":
        document.body.classList.add("page-card");
        break;
    }

    return () => {
      document.body.classList.remove(
        "page-home",
        "page-characters",
        "page-card"
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
    </>
  );
}

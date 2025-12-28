import { Outlet } from "react-router-dom";
import Navbar from "@/components/_Layout/Navbar";
import Footer from "@/components/_Layout/Footer";

import "@/components/_Layout/Layout.css"

export default function Layout() {
  return (
    <>
      <header><Navbar/></header>
      <main id="main-container">
        <Outlet />
      </main>
      <footer><Footer/></footer>
    </>
  );
}

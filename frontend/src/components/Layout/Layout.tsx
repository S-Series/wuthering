import { Outlet } from "react-router-dom";
import Navbar from "@/components/Navbar";
import Footer from "@/components/Footer";

export default function Layout() {
  return (
    <>
      <header><Navbar/></header>
      <main>
        <Outlet />
      </main>
      <footer><Footer/></footer>
    </>
  );
}

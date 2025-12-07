import { Routes, Route } from "react-router-dom";
import Layout from "./components/Layout/Layout";
import Home from "@/pages/Home";

export default function App() {
  return (
    <Routes>
      <Route element={<Layout />}>
        <Route path="/" element={<Home />} />
      </Route>
    </Routes>
  );
}
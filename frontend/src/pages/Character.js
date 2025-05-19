import "./App.css";
import NavBar from "../components/NavBar";
import SideBar from "../components/SideBar";

import OCRSlot from "../components/OcrSlot";
import DropSlot from "../components/DropSlot";

function Character() {
  return (
    <div className="app-wrapper">
      <NavBar />
      <div className="viewport">
        <SideBar />
        <div className="main-content">
            <OCRSlot />
        </div>
            <DropSlot />
      </div>
    </div>
  );
}
export default Character;
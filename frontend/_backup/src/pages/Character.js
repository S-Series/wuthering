import "./App.css";
import NavBar from "../components/NavBar";
import SideBar from "../components/SideBar";

import OcrRequest from "../utils/OcrRequest";

function Character() {
  return (
    <div className="app-wrapper">
      <NavBar />
      <div className="viewport">
        <SideBar />
        <div className="main-content">
          <div style={{ width: "80%", height: "800px" }}>
            <OcrRequest isTesting={true} />
          </div>
        </div>
      </div>
    </div>
  );
}
export default Character;

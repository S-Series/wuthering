import "./App.css";
import NavBar from "../components/NavBar";
import SideBar from "../components/SideBar";

import ImageDrag from "../func/ImageDrag";

function Character() {
  return (
    <div className="app-wrapper">
      <NavBar />
      <div className="viewport">
        <SideBar />
        <div className="main-content">
          <div style={{ width: "80%", height: "800px" }}>
            <ImageDrag
              path="/bg.jpg"
              pos={{ x: 0, y: 0, s: 1 }}
              onChange={(v) => console.log(v)}
            />
          </div>
        </div>
      </div>
    </div>
  );
}
export default Character;

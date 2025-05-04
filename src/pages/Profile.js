import "./App.css";
import NavBar from "../components/NavBar";
import SideBar from "../components/SideBar";
import ProfileCard from "../components/ProfileCard";

function Home() {
  return (
    <div className="app-wrapper">
      <NavBar />
      <div className="viewport">
        <SideBar />
        <div className="main-content">
          <ProfileCard />
        </div>
      </div>
    </div>
  );
}

export default Home;

import "./SideBar.css";
import { useNavigate } from "react-router-dom";

function SideBar() {
    const navigate = useNavigate();

    return(
        <nav className="sidebar">
            <div className="sidebar-divider" />
            <button className="side-button" onClick={() => navigate("/")}>
                <span className="side-text">Home</span>
            </button>
            <div className="sidebar-divider" />
            <button className="side-button" onClick={() => navigate("/profile")}>
                <span className="side-text">Profile</span>
            </button>
            <div className="sidebar-divider" />
            <button className="side-button" onClick={() => navigate("/")}>
                <span className="side-text">Character</span>
            </button>
            <div className="sidebar-divider" />
            <button className="side-button" onClick={() => navigate("/")}>
                <span className="side-text">Weapon</span>
            </button>
            <div className="sidebar-divider" />
        </nav>
    );
}

export default SideBar;

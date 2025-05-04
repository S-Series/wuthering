import "./SideBar.css";
import { useNavigate } from "react-router-dom";

function SideBar() {
    const navigate = useNavigate();

    return(
        <nav className="sidebar">
            <button className="side-button" onClick={() => navigate("/")}>
                <span className="side-text">Home</span>
            </button>
            <button className="side-button" onClick={() => navigate("/profile")}>
                <span className="side-text">Profile</span>
            </button>
            <button className="side-button" onClick={() => navigate("/")}>
                <span className="side-text">Character</span>
            </button>
            <button className="side-button" onClick={() => navigate("/")}>
                <span className="side-text">Weapon</span>
            </button>
        </nav>
    );
}

export default SideBar;

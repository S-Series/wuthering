import "./NavBar.css";

function NavBar() {
  return (
    <nav className="navbar">
      <div className="nav-left">
        <button className="home-button">
          <img src="./gem.webp" alt="Home" className="main-icon"></img>
          띵조 DEV
        </button>
      </div>
      <div className="nav-right">
        <button className="nav-button">
          <img src="./info.png" className="icon"></img>
          <span className="nav-text">Help</span>
        </button>
        <button className="nav-button" onClick={() => window.open("", "_blank")}>
          <img src="./github.png" className="icon"></img>
          <span className="nav-text">Github</span>
        </button>
        <button className="nav-button" onClick={() => window.open("https://ko-fi.com/sseries", "_blank")}>
          <img src="./kofi.png" className="icon"></img>
          <span className="nav-text">Ko-Fi</span>
        </button>
      </div>
    </nav>
  );
}

export default NavBar;

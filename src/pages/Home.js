import './App.css';
import NavBar from '../components/NavBar';
import SideBar from '../components/SideBar';

function Home(){
    return (
        <div className="app-wrapper">
          <NavBar />
          <div className="main-content">
            <SideBar/>
          </div>
        </div>
      );
}

export default Home;
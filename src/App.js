import './App.css';
import NavBar from './components/NavBar';
import SideBar from './components/SideBar';

function App() {
  return (
    <div className="app-wrapper">
      <NavBar />
      <div className="main-content">
        <SideBar/>
      </div>
    </div>
  );
}

export default App;

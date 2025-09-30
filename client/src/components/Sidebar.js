import "../style/sidebar.css";
import { AiOutlineClose } from "react-icons/ai"; 
import { useTheme } from "../components/ThemeContext";

function Sidebar({ toggleSidebar, logout }) {
  return (
    <>
      {/* Overlay per chiudere la sidebar cliccando fuori */}
      <div className="sidebar-overlay" onClick={toggleSidebar}></div>
      <div className="sidebar open">
        <button type="button" className="close-btn" onClick={toggleSidebar}>
          <AiOutlineClose className="close-icon" />
        </button>

        <div className="sidebar-content">
          <ul className="nav flex-column w-100">
            <li className="nav-item"><a href="/home" className="nav-link btn btn-outline-secondary">Home</a></li>
            <li><a href="/Note" className="nav-link btn btn-outline-secondary">Note</a></li>
            <li><a href="/Calendario" className="nav-link btn btn-outline-secondary">Calendario</a></li>
            <li><a href="/settings" className="nav-link btn btn-outline-secondary">Impostazioni</a></li>
            <li><a href="/Pomodoro" className="nav-link btn btn-outline-secondary">Pomodoro</a></li>
          </ul>
          <button className="logout" onClick={logout}>Logout</button>
        </div>
      </div>
    </>
  );
}

export default Sidebar;
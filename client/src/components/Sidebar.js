import "../style/sidebar.css";

function Sidebar({ toggleSidebar, logout }) {
  return (
    <>
      <div className="sidebar-overlay" onClick={toggleSidebar}></div>
      <div className="sidebar open">
        <button type="button" className="btn-close close-btn" onClick={toggleSidebar}></button>

        <div className="sidebar-content">
          <ul className="nav flex-column w-100">
            <li className="nav-item"><a href="/home" className="nav-link btn btn-outline-secondary">Home</a></li>
            <li><a href="/Note" className="nav-link btn btn-outline-secondary">Note</a></li>
            <li><a href="/Calendario" className="nav-link btn btn-outline-secondary">Calendario</a></li>
            <li><a href="/settings" className="nav-link btn btn-outline-secondary">Impostazioni</a></li>
            <li><a href="/Pomodoro" className="nav-link btn btn-outline-secondary">Pomodoro</a></li>
          </ul>
          <button className="btn btn-danger logout" onClick={logout}>Logout</button>
        </div>
      </div>
    </>
  );
}

export default Sidebar;

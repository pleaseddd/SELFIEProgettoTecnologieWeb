// Sidebar.js
import "../style/sidebar.css";

function Sidebar({ toggleSidebar, logout }) {

  return (
    <div className="bg-light border-end position-fixed h-100" style={{ width: "220px", zIndex: 1000 }}>
      <div className="d-flex flex-column p-3">
        <button type="button" className="btn-close mb-4 align-self-end" onClick={toggleSidebar}></button>
        <ul className="nav nav-pills flex-column mb-auto">
          <li className="nav-item"><a href="/home" className="nav-link">Home</a></li>
          <li><a href="/Note" className="nav-link">Note</a></li>
          <li><a href="/Calendario" className="nav-link">Calendario</a></li>
          <li><a href="/settings" className="nav-link">Impostazioni</a></li>
        </ul>
        <hr />
        <button className="btn btn-danger mt-auto" onClick={logout}>Logout</button>
      </div>
    </div>
  );
}

export default Sidebar;

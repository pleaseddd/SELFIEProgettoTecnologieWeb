import { useState } from "react";
import Sidebar from "./Sidebar";

function MainLayout({ children, logout }) {
  const [showSidebar, setShowSidebar] = useState(false);
  const toggleSidebar = () => setShowSidebar(!showSidebar);

  return (
    <div>
      
      <button
        className="btn btn-outline-primary"
        style={{ position: "fixed", top: "15px", left: "15px", zIndex: 1100 }}
        onClick={toggleSidebar}
      >
        ☰
      </button>
      {showSidebar && <Sidebar logout={logout} toggleSidebar={toggleSidebar} />}
      <div style={{ marginLeft: showSidebar ? "220px" : "60px", transition: "margin 0.3s ease" }}>
        {children}
      </div>
    </div>
  );
}

export default MainLayout;

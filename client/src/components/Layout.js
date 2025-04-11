import { useState } from "react";
import Sidebar from "./Sidebar";

function MainLayout({ children, user, logout }) {
  const [showSidebar, setShowSidebar] = useState(false);
  const toggleSidebar = () => setShowSidebar(!showSidebar);

  return (
    <div>

			{/* Immagine profilo cliccabile */}
			<img
				src={user?.propic || "https://dummyimage.com/80x80/000/fff.jpg&text=404"}
				className="rounded-circle"
				style={{
					position: "fixed",
					top: "15px",
					left: "15px",
					zIndex: 1100,
					width: '40px',
					height:'40px',
					cursor: "pointer"
				}}
				alt="Foto profilo"
				onClick={toggleSidebar}
			/>

			{
				showSidebar
				&& <Sidebar logout={logout} toggleSidebar={toggleSidebar} />
			}

			<div
				style={{
					transition: "margin 0.3s ease"
				}}
			>
				{children}
			</div>
    </div>
  );
}

export default MainLayout;

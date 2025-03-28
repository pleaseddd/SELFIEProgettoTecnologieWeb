import React, { useEffect } from 'react';
import { useNavigate } from "react-router-dom";

function Home({ user, logout }) {
	const navigate = useNavigate();
	return (
		<div className="container-fluid p-0">
			<div className="mt-4 ps-3 pe-3">
				<div className="d-flex flex-column gap-2">

					{/* Note */}
					<button className="btn btn-primary" onClick={()=>navigate("/Note")}>
						Note
					</button>

					{/* Calendario */}
					<button className="btn btn-primary" onClick={()=>navigate("/Calendario")}>
						Calendario
					</button>

					{/* Logout */}
					<button onClick={logout} className="btn btn-danger">
						Logout
					</button>

				</div>
			</div>
		</div>
	);
}

export default Home;

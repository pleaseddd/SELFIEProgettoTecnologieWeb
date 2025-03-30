import React, { useEffect } from 'react';
import { useNavigate } from "react-router-dom";

function Home({ user, logout }) {
	const navigate = useNavigate();
	return (
		<div className="container-fluid p-3">
			<div className="card shadow-sm border-0 w-100 w-md-auto" style={{ width: '220px' }}>
				<div className="card-body p-2 p-sm-3">

					<div className="d-flex align-items-center mb-2">
						<span className="fs-4 me-2 me-sm-3">🌧️</span>
						<div>
							<h6 className="mb-0 fs-6 fs-sm-5">Bologna</h6>
							<small className="text-muted">20 | Pioggia</small>
						</div>
					</div>

					<hr className="my-1 my-sm-2" />

					<div className="d-flex align-items-center mt-2">
						<span className="fs-4 me-2 me-sm-3">☀️</span>
						<div>
							<h6 className="mb-0 fs-6 fs-sm-5">Napoli</h6>
							<small className="text-muted">30 | Soleggiato</small>
						</div>
					</div>
				</div>
			</div>
		</div>
	);
}

export default Home;

import React, { useEffect } from 'react';
import { useNavigate } from "react-router-dom";
import Weather from './components/home/Weather.js';

function Home({ user, logout }) {
	const navigate = useNavigate();
	return (
		<div className="container-fluid p-3">
			<Weather/>
		</div>
	);
}

export default Home;

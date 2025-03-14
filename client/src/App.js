import React, { useState } from 'react';
import { BrowserRouter as Router, Routes, Route, Navigate } from 'react-router-dom';
import Login from './Login';
import Home from './Home';

const App = () => {
	const [user, setUser] = useState(null);

	return (
		<Router>
	      <Routes>
	        <Route path="/" element={<Navigate to="/login" replace />} />
	        <Route path="/login" element={<Login setUser={setUser}/>} />
	        <Route path="/home" element={<Home user={user}/>} />
	      </Routes>
	    </Router>
	);
};

export default App;

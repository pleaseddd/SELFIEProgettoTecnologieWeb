import { BrowserRouter as Router, Routes, Route, Navigate } from "react-router-dom";
import { useState } from "react";

import MainLayout from "./components/Layout";

import Login from "./Login";

import Home from "./Home";
import NotesPage from "./NotesPage";
import CalendarPage from "./CalendarPage";
import Settings from "./Settings.js";
import Pomodoro from "./Pomodoro.js";

import 'bootstrap/dist/css/bootstrap.min.css';

const App = () => {
    const [user, setUser] = useState(() => {
        try {
            const savedUser = localStorage.getItem("user");
            return savedUser ? JSON.parse(savedUser) : null;
        } catch (error) {
            return null;
        }
    });
    // Funzione per aggiornare lo stato e salvare nel localStorage
    const handleSetUser = (userData) => {
        setUser(userData);
        localStorage.setItem("user", JSON.stringify(userData));
    };

    // Funzione per il logout
    const handleLogout = () => {
        setUser(null);
        localStorage.removeItem("user");
    };

    return (
        <Router>
            <Routes>
                <Route
	                path="/"
					element={
						<Navigate to={user ? "/home" : "/login"} replace />
					}
				/>

                <Route
	                path="/login"
					element={<Login setUser={handleSetUser}/>}
				/>

                <Route
	                path="/home"
					element={
						user ?
							<MainLayout user={user} logout={handleLogout}>
								<Home user={user} logout={handleLogout}/>
							</MainLayout>
							: <Navigate to="/login" />
					}
				/>

                <Route
	                path="/Note"
					element={
						user ?
							<MainLayout user={user} logout={handleLogout}>
								<NotesPage user={user}/>
							</MainLayout>
							: <Navigate to="/login"/>
					}
				/>

				<Route
	                path="/Pomodoro"
					element={
						user ?
							<MainLayout user={user} logout={handleLogout}>
								<Pomodoro user={user}/>
							</MainLayout>
							: <Navigate to="/login"/>
					}
				/>

                <Route
	                path="/Calendario"
					element={
						user ?
							<MainLayout user={user} logout={handleLogout}>
								<CalendarPage user={user} />
							</MainLayout>
							: <Navigate to="/login"/>
					}
				/>

				<Route
					path="/settings"
					element={
						user ?
							<MainLayout user={user} logout={handleLogout}>
								<Settings user={user} updateUser={handleSetUser}/>
							</MainLayout>
							: <Navigate to="/login"/>
					}
				/>
            </Routes>
        </Router>
    );
};

export default App;

import {
	BrowserRouter as Router,
	Routes,
	Route,
	Navigate,
} from "react-router-dom";

import { useState, useEffect } from "react";
import MainLayout from "./components/Layout";
import Login from "./Login";
import Home from "./Home";
import NotesPage from "./NotesPage";
import CalendarPage from "./CalendarPage";
import Settings from "./Settings.js";
import Pomodoro from "./Pomodoro.js";
import { ThemeProvider } from "./components/ThemeContext";
import axios from 'axios';

import "bootstrap/dist/css/bootstrap.min.css";

axios.defaults.withCredentials = true;

const App = () => {
	//GESTIONE DELLA SESSIONE
	const [user, setUser] = useState(null);
	const [loading, setLoading] = useState(true);

	useEffect(() => {
		const fetchUser = async () => {
			try {
				const response = await fetch("/userauth", {
					credentials: "include",
				});
				const data = await response.json();
				if (!response.ok) throw new Error(data);
				setUser(data);
			} catch (error) {
				setUser(null);
				console.error("Errore nel recupero dell'utente:", error);
			} finally {
				setLoading(false);
			}
		};

		fetchUser();
	}, []);

  //Se disconnetto l'utente, lo rimuovo dal token
  const handleLogout = async () => {
    await fetch("/api/user/logout", {
      method: "POST",
      credentials: "include",
    });
    setUser(null);
  };
	const handleLogout = async () => {
		await fetch("/userlogout", {
			method: "POST",
			credentials: "include",
		});
		setUser(null);
	};


  //Aggiorno lo stato user 
  const handleSetUser = (userData) => {
    setUser(userData);
  };
	const handleSetUser = (userData) => {
		setUser(userData);
	};

	if (loading) return <div>Caricamento...</div>;

	//GESTIONE SERVICE WORKER
	if ("serviceWorker" in navigator) {
		try {
			navigator.serviceWorker.register("./service-worker.js", { scope: "/" });
			console.log("service worker registrato!");
		} catch (error) {
			console.log("Errore nel service worker:", error);
		}
	}

	return (
		<ThemeProvider>
			<Router>
				<Routes>
					<Route
						path="/"
						element={<Navigate to={user ? "/home" : "/login"} replace />}
					/>

					<Route path="/login" element={<Login setUser={handleSetUser} />} />

					<Route
						path="/home"
						element={
							user ? (
								<MainLayout user={user} logout={handleLogout}>
									<Home user={user} logout={handleLogout} />
								</MainLayout>
							) : (
								<Navigate to="/login" />
							)
						}
					/>

					<Route
						path="/Note"
						element={
							user ? (
								<MainLayout user={user} logout={handleLogout}>
									<NotesPage user={user} />
								</MainLayout>
							) : (
								<Navigate to="/login" />
							)
						}
					/>

					<Route
						path="/Pomodoro"
						element={
							user ? (
								<MainLayout user={user} logout={handleLogout}>
									<Pomodoro user={user} />
								</MainLayout>
							) : (
								<Navigate to="/login" />
							)
						}
					/>

					<Route
						path="/Calendario"
						element={
							user ? (
								<MainLayout user={user} logout={handleLogout}>
									<CalendarPage user={user} />
								</MainLayout>
							) : (
								<Navigate to="/login" />
							)
						}
					/>

					<Route
						path="/settings"
						element={
							user ? (
								<MainLayout user={user} logout={handleLogout}>
									<Settings user={user} updateUser={handleSetUser} />
								</MainLayout>
							) : (
								<Navigate to="/login" />
							)
						}
					/>
				</Routes>
			</Router>
		</ThemeProvider>
	);
};

export default App;

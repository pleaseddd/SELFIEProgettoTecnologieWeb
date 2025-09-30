import {
  BrowserRouter as Router,
  Routes,
  Route,
  Navigate,
} from "react-router-dom";
import { useState, useEffect } from "react";
import { ToastContainer } from 'react-toastify';

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
  //Gestione dello stato dell'utente
  const [user, setUser] = useState(null);
  const [loading, setLoading] = useState(true);

  //Vedo se l'utente è autenticato nel token 
  useEffect(() => {
    const fetchUser = async () => {
      try {
        const response = await fetch("/api/user/auth", {
          credentials: "include",
        });
        const data = await response.json();
        if (!response.ok) throw new Error(data);
        setUser(data);
      } catch (error) {
        setUser(null);
      } finally {
        // Imposto lo stato di caricamento a false dopo aver verificato l'utente
        setLoading(false);
      }
    };

    fetchUser();
  }, []);

  //Se l'utente si disconnette, viene rimosso il token
  const handleLogout = async () => {
    await fetch("/api/user/logout", {
      method: "POST",
      credentials: "include",
    });
    setUser(null);
  };


  //Aggiorna lo stato dell'utente ogni modifica
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
			{/* Reindirizzamento alla pagina corretta in base all'autenticazione */}
	        <Route
	          path="/"
	          element={<Navigate to={user ? "/home" : "/login"} replace />}
	        />

	        <Route path="/login" element={<Login setUser={handleSetUser} />} />
			{/* Pagine accessibili solo se l'utente è autenticato, altrimenti reindirizzamento al login */}
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

	      <ToastContainer
		      position="bottom-right"
					pauseOnHover={false}
					newestOnTop={true}
	      />
	    </Router>
    </ThemeProvider>
  );
};

export default App;

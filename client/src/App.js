import { BrowserRouter as Router, Routes, Route, Navigate } from "react-router-dom";
import { useState, useEffect } from "react";
import Login from "./Login";
import Home from "./Home";
import NotesPage from "./NotesPage";

const App = () => {
    // Carica l'utente dal localStorage all'avvio
    const [user, setUser] = useState(() => {
        const savedUser = localStorage.getItem("user");
        return savedUser ? JSON.parse(savedUser) : null;
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
                <Route path="/" element={<Navigate to={user ? "/home" : "/login"} replace />} />
                <Route path="/login" element={<Login setUser={handleSetUser} />} />
                <Route path="/home" element={user ? <Home user={user} logout={handleLogout} /> : <Navigate to="/login" />} />
                <Route path='/Note' element={user ? <NotesPage user={user}/> : <Navigate to="/login" />} />
            </Routes>
        </Router>
    );
};

export default App;

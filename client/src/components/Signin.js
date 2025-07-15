import { useState } from "react";
import { useNavigate } from "react-router-dom";
import "bootstrap/dist/css/bootstrap.min.css";
import "bootstrap/dist/js/bootstrap.bundle.min.js";

function Signin({ change, setUser }) {
  const [error, setError] = useState("");
  const navigate = useNavigate();
  const handleLogin = async (event) => {
    event.preventDefault();
    const email = event.target.email.value;
    const password = event.target.password.value;

    try {
      // 1 Login
      const loginRes = await fetch("/api/user/login", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        credentials: "include",
        body: JSON.stringify({ email, password }),
      });

      if (!loginRes.ok) {
        setError("Email o Password errati!");
        alert("Email o Password errati!");
        return;
      }

      // 2 Recupera utente con cookie
      const meRes = await fetch("/api/user/auth", {
        method: "GET",
        credentials: "include",
      });

      if (!meRes.ok) {
        alert("Login effettuato, ma impossibile recuperare i dati utente.");
        return;
      }

      const userData = await meRes.json();
      setUser(userData);
      navigate("/home");
    } catch (error) {
      console.error("Errore di rete:", error);
      alert("Errore di connessione al server.");
    }
  };

  
  return (
    <div className="col-md-6 d-flex justify-content-center align-items-center mb-4 mb-md-0">
      <div className="card p-4 shadow-lg login-card">
        <h2 className="text-center mb-4">Login</h2>
        <form onSubmit={handleLogin}>
          <div className="mb-3">
            <label htmlFor="email" className="form-label">
              Email
            </label>
            <input
              type="email"
              className="form-control"
              id="email"
              name="email"
              placeholder="Email"
            />
          </div>
          <div className="mb-3">
            <label htmlFor="password" className="form-label">
              Password
            </label>
            <input
              type="password"
              className="form-control"
              id="password"
              name="password"
              placeholder="Password"
            />
          </div>
          <button type="submit" className="login-btn btn btn-primary w-100">
            Accedi
          </button>
        </form>
        <button
          className="register-btn btn btn-primary w-100 mt-2"
          onClick={change}
        >
          Registrati
        </button>
      </div>
    </div>
  );
}

export default Signin;

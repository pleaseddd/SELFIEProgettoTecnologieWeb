import { useState } from "react";
import { useNavigate } from "react-router-dom";
import "bootstrap/dist/css/bootstrap.min.css";
import "bootstrap/dist/js/bootstrap.bundle.min.js";

function Signin({ change, setUser }) {
  const [error, setError] = useState("");
  const navigate = useNavigate();

//Gestione del login
  const handleLogin = async (event) => {
    event.preventDefault();
    const email = event.target.email.value.trim();
    const password = event.target.password.value;

    setError(""); // reset

    try {
      //1 Controllo credenziali dell'user
      const loginRes = await fetch("/api/user/login", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        credentials: "include",
        body: JSON.stringify({ email, password }),
      });

      if (!loginRes.ok) {
        setError("Email o password errati.");
        return;
      }

      // 2 Recupera le impostazioni dell'utente dopo il login
      const meRes = await fetch("/api/user/auth", {
        method: "GET",
        credentials: "include",
      });

      if (!meRes.ok) {
        setError("Login effettuato, impossibile recuperare i dati utente.");
        return;
      }

      // 3 Imposta lo stato dell'utente e reindirizza alla home
      const userData = await meRes.json();
      setUser(userData);
      navigate("/home");
    } catch (err) {
      console.error("Errore di rete:", err);
      setError("Errore di connessione al server.");
    }
  };

  return (
    <div className="col-md-6 d-flex justify-content-center align-items-center mb-3 mb-md-0">
      {/* Form di login o registrazione */}
      <div className="card p-3 shadow-sm login-card" style={{ maxWidth: 420, width: "100%" }}>
        <h2 className="text-center mb-3" style={{ fontSize: "1.25rem" }}>Login</h2>

        {error && <div className="alert alert-danger py-1 mb-2" role="alert">{error}</div>}
        {/* Form di login */}
        <form onSubmit={handleLogin}>
          <div className="mb-2">
            <label htmlFor="email" className="form-label small">Email</label>
            <input
              type="email"
              className="form-control form-control-sm"
              id="email"
              name="email"
              placeholder="Email"
              required
            />
          </div>

          <div className="mb-2">
            <label htmlFor="password" className="form-label small">Password</label>
            <input
              type="password"
              className="form-control form-control-sm"
              id="password"
              name="password"
              placeholder="Password"
              required
            />
          </div>

          <button type="submit" className="login-btn btn btn-primary w-100 btn-sm mb-2">
            Accedi
          </button>
        </form>

        {/* Pulsante per passare al form di registrazione */}
        <button
          className="register-btn btn btn-outline-secondary w-100 btn-sm"
          onClick={change}
          type="button"
        >
          Registrati
        </button>
      </div>
    </div>
  );
}

export default Signin;

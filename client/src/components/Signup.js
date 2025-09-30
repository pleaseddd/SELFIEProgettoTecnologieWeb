import { useState, useEffect } from "react";
import "bootstrap/dist/css/bootstrap.min.css";
import "bootstrap/dist/js/bootstrap.bundle.min.js";

const updatetimezone = async () => {
  try {
    const geoRes = await fetch(
      "https://api.ipgeolocation.io/ipgeo?apiKey=ae48adddb3f64feb984decd7b4299e7b"
    );
    const geoData = await geoRes.json();
    return geoData.time_zone.name;
  } catch (err) {
    console.error("Errore geolocalizzazione:", err);
    return "Europe/Rome"; // fallback sicuro
  }
};

function Register({ change }) {
  const [name, setName] = useState("");
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [confirmPassword, setConfirmPassword] = useState("");
  const [timezone, setTimezone] = useState("");
  const [error, setError] = useState("");
  const [success, setSuccess] = useState("");

  const pwdRegex = /^(?=.{8,20}$)(?=.*[A-Za-z])(?=.*\d)[A-Za-z\d]+$/;
  const passwordValid = pwdRegex.test(password);
  const passwordsMatch = password === confirmPassword || confirmPassword === "";
  const timezone="";
  //PRESA DELLA POSIZIONE PER METTERE NELL'USER SETTINGS
  useEffect(() => {
    const prendiposizione = async () => {
      try {
        // Ottieni la posizione approssimativa
        const geoRes = await fetch(
          "https://api.ipgeolocation.io/ipgeo?apiKey=ae48adddb3f64feb984decd7b4299e7b"
        );
        const geoData = await geoRes.json();
        timezone = geoData.time_zone.name;
      } catch (err) {
        console.error("Errore geolocalizzazione:", err);
      }
    };

    prendiposizione();
  }, []);


  useEffect(() => {
    const fetchTz = async () => {
      const tz = await updatetimezone();
      setTimezone(tz);
    };
    fetchTz();
  }, []);

  const handleregister = async (e) => {
    e.preventDefault();
    setError("");
    setSuccess("");

    if (!passwordValid) {
      setError(
        "La password deve essere 8-20 caratteri, contenere lettere e numeri e non avere spazi o caratteri speciali."
      );
      return;
    }

    if (password !== confirmPassword) {
      setError("Le password non coincidono.");
      return;
    }

    try {
      const response = await fetch("/api/user/new", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          name: name.trim(),
          email: email.trim(),
          password,
          settings: { position: timezone },
        }),
      });

      const data = await response.json();
      if (response.ok) {
        setSuccess("Registrazione completata con successo!");
        setName("");
        setEmail("");
        setPassword("");
        setConfirmPassword("");
        change();
      } else {
        setError(data.message || "Errore durante la registrazione.");
      }
    } catch (err) {
      console.error(err);
      setError("Errore di connessione al server.");
    }
  };

  return (
    <div className="col-md-6 d-flex justify-content-center align-items-center mb-3 mb-md-0">
      <div
        className="card p-3 shadow-sm login-card"
        style={{ maxWidth: 420, width: "100%" }}
      >
        <h2 className="text-center mb-3" style={{ fontSize: "1.25rem" }}>
          Registrazione
        </h2>

        {error && (
          <div className="alert alert-danger py-1 mb-2" role="alert">
            {error}
          </div>
        )}
        {success && (
          <div className="alert alert-success py-1 mb-2" role="alert">
            {success}
          </div>
        )}

        <form onSubmit={handleregister}>
          {/* Nome Utente */}
          <div className="mb-2">
            <label htmlFor="name" className="form-label small">
              Nome Utente
            </label>
            <input
              type="text"
              id="name"
              className="form-control form-control-sm"
              placeholder="Nome Utente"
              value={name}
              onChange={(e) => setName(e.target.value)}
              required
            />
          </div>

          {/* Email */}
          <div className="mb-2">
            <label htmlFor="email" className="form-label small">
              Email
            </label>
            <input
              type="email"
              id="email"
              className="form-control form-control-sm"
              placeholder="Email"
              value={email}
              onChange={(e) => setEmail(e.target.value)}
              required
            />
          </div>

          {/* Password */}
          <div className="mb-2">
            <label htmlFor="password" className="form-label small">
              Password
            </label>
            <input
              type="password"
              id="password"
              className="form-control form-control-sm"
              placeholder="Password"
              value={password}
              onChange={(e) => setPassword(e.target.value)}
              required
            />
            {password.length > 0 && !passwordValid && (
              <div className="form-text text-danger">
                La password deve essere 8-20 caratteri, contenere lettere e
                numeri e non avere spazi o caratteri speciali.
              </div>
            )}
          </div>

          {/* Conferma Password */}
          <div className="mb-2">
            <label htmlFor="confirmPassword" className="form-label small">
              Conferma Password
            </label>
            <input
              type="password"
              id="confirmPassword"
              className="form-control form-control-sm"
              placeholder="Conferma Password"
              value={confirmPassword}
              onChange={(e) => setConfirmPassword(e.target.value)}
              required
            />
            {confirmPassword.length > 0 && !passwordsMatch && (
              <div className="form-text text-danger">
                Le password non coincidono.
              </div>
            )}
          </div>

          <button
            type="submit"
            className="btn btn-primary w-100 btn-sm mb-2"
            disabled={!timezone} // blocca se il timezone non è pronto
          >
            Registrati
          </button>
        </form>

        <button
          onClick={change}
          className="btn btn-outline-secondary w-100 btn-sm"
        >
          Indietro
        </button>

        <div className="text-muted mt-2" style={{ fontSize: 12 }}>
          Fuso rilevato: {timezone || "caricamento..."}
        </div>
      </div>
    </div>
  );
}

export default Register;

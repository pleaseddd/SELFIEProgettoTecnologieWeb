import { useState } from "react";
import "bootstrap/dist/css/bootstrap.min.css";
import "bootstrap/dist/js/bootstrap.bundle.min.js";

function Register({ change }) {
  // controlled inputs per validazione live
  const [name, setName] = useState("");
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [confirmPassword, setConfirmPassword] = useState("");

  const [error, setError] = useState("");
  const [success, setSuccess] = useState("");

  // regex: 8-20 chars, must include letters and numbers, only letters+digits (no spaces or symbols)
  const pwdRegex = /^(?=.{8,20}$)(?=.*[A-Za-z])(?=.*\d)[A-Za-z\d]+$/;

  const passwordValid = pwdRegex.test(password);
  const passwordsMatch = password === confirmPassword || confirmPassword === "";

  const handleregister = async (e) => {
    e.preventDefault();
    setError("");
    setSuccess("");

    if (!passwordValid) {
      setError("La password deve essere 8-20 caratteri, contenere lettere e numeri e non avere spazi o caratteri speciali.");
      return;
    }

    if (password !== confirmPassword) {
      setError("Le password non coincidono.");
      return;
    }

    try {
      const response = await fetch("/api/user/new", {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify({ name: name.trim(), email: email.trim(), password }),
      });

      const data = await response.json();
      if (response.ok) {
        setSuccess("Registrazione completata con successo!");
        setError("");
        // reset campi opzionale
        setName("");
        setEmail("");
        setPassword("");
        setConfirmPassword("");
        // passa alla view di login (o quello che fa `change`)
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
      <div className="card p-3 shadow-sm login-card" style={{ maxWidth: 420, width: "100%" }}>
        <h2 className="text-center mb-3" style={{ fontSize: "1.25rem" }}>Registrazione</h2>

        {error && <div className="alert alert-danger py-1 mb-2" role="alert">{error}</div>}
        {success && <div className="alert alert-success py-1 mb-2" role="alert">{success}</div>}

        <form onSubmit={handleregister}>
          {/* Nome Utente */}
          <div className="mb-2">
            <label htmlFor="name" className="form-label small">Nome Utente</label>
            <input
              type="text"
              name="name"
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
            <label htmlFor="email" className="form-label small">Email</label>
            <input
              type="email"
              name="email"
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
            <label htmlFor="password" className="form-label small">Password</label>
            <input
              type="password"
              name="password"
              id="password"
              className="form-control form-control-sm"
              placeholder="Password"
              value={password}
              onChange={(e) => setPassword(e.target.value)}
              required
            />
            {/* mostra il messaggio d'aiuto solo se la password è stata inserita e non valida */}
            {password.length > 0 && !passwordValid && (
              <div className="form-text text-danger">
                La password deve essere 8-20 caratteri, contenere lettere e numeri e non avere spazi o caratteri speciali.
              </div>
            )}
          </div>

          {/* Conferma Password */}
          <div className="mb-2">
            <label htmlFor="confirmPassword" className="form-label small">Conferma Password</label>
            <input
              type="password"
              name="confirmPassword"
              id="confirmPassword"
              className="form-control form-control-sm"
              placeholder="Conferma Password"
              value={confirmPassword}
              onChange={(e) => setConfirmPassword(e.target.value)}
              required
            />
            {/* messaggio se non coincidono */}
            {confirmPassword.length > 0 && !passwordsMatch && (
              <div className="form-text text-danger">
                Le password non coincidono.
              </div>
            )}
          </div>
          <button type="submit" className="btn btn-primary w-100 btn-sm mb-2">Registrati</button>
        </form>

        <button onClick={change} className="btn btn-outline-secondary w-100 btn-sm">Indietro</button>
      </div>
    </div>
  );
}

export default Register;

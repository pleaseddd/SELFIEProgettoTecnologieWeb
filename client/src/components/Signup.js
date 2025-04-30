import { useState } from "react";

import "bootstrap/dist/css/bootstrap.min.css";
import "bootstrap/dist/js/bootstrap.bundle.min.js";

const passwordRegex = /^(?=.*[A-Za-z])(?=.*\d)[A-Za-z\d]{8,20}$/;

function Register({change}) {
    const [error, setError] = useState("");
    const [success, setSuccess] = useState("");

    const handleregister = async (e) => {
        e.preventDefault();
        const name = e.target.name.value;
        const email = e.target.email.value;
        const password = e.target.password.value;
        const confirmPassword = e.target.confirmPassword.value;

        if (!passwordRegex.test(password)) {
          const msg = "La password deve essere lunga 8–20 caratteri, contenere almeno una lettera e un numero, e non contenere spazi o caratteri speciali.";
          setError(msg);
          alert(msg);
          return;
        }

        if (password !== confirmPassword) {
          const msg = "Le password non corrispondono!";
            setError(msg);
            alert(msg);
            return;
        }

        try {
            const response = await fetch("/newuser", {
                method: "POST",
                headers: {
                    "Content-Type": "application/json",
                },
                body: JSON.stringify({ name, email, password }),
            });

            const data = await response.json();
            if (response.ok) {
              const msg = "Registrazione avvenuta con successo!";
              setSuccess(msg);
              setError("");
              alert(msg);
              console.log(success);
				change();
            } else {
                alert(data.message || " Errore durante la registrazione");
                setError(data.message || "Errore durante la registrazione");
                console.log(error);
            }
        } catch (err) {
            setError("Errore di connessione al server");
        }
        
        
    };

    return (
        <div className="col-md-4 d-flex justify-content-center align-items-center mb-4 mb-md-0">
          <div className="card p-4 shadow-lg login-card">
            <h2 className="text-center mb-4">Registrazione</h2>
            <form onSubmit={handleregister}>
              {/* Nome Utente */}
              <div className="mb-3">
                <label htmlFor="name" className="form-label">Nome Utente</label>
                <input
                  type="text"
                  name="name"
                  id="name"
                  className="form-control"
                  placeholder="Nome Utente"
                />
              </div>
    
              {/* Email */}
              <div className="mb-3">
                <label htmlFor="email" className="form-label">Email</label>
                <input
                  type="email"
                  name="email"
                  id="email"
                  className="form-control"
                  placeholder="Email"
                />
              </div>
    
              {/* Password */}
              <div className="mb-3">
                <label htmlFor="password" className="form-label">Password</label>
                <input
                  type="password"
                  name="password"
                  id="password"
                  className="form-control"
                  placeholder="Password"
                />
              </div>
    
              {/* Conferma Password */}
              <div className="mb-3">
                <label htmlFor="confirmPassword" className="form-label">Conferma Password</label>
                <input
                  type="password"
                  name="confirmPassword"
                  id="confirmPassword"
                  className="form-control"
                  placeholder="Conferma Password"
                />
              </div>
    
              <button type="submit" className="btn btn-primary w-100 mb-2">Registrati</button>
            </form>
    
            <button onClick={change} className="btn btn-secondary w-100">Indietro</button>
          </div>
        </div>
      );
    }    

    export default Register;
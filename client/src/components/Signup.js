import { useEffect,useState } from "react";
import { useNavigate } from "react-router-dom";

import "bootstrap/dist/css/bootstrap.min.css";
import "bootstrap/dist/js/bootstrap.bundle.min.js";


function Register({change}) {
    const navigate = useNavigate();
    const [error, setError] = useState("");
    const [success, setSuccess] = useState("");

    const handleregister = async (e) => {
        e.preventDefault();
        const name = e.target.name.value;
        const email = e.target.email.value;
        const password = e.target.password.value;
        const confirmPassword = e.target.confirmPassword.value;

        if (password !== confirmPassword) {
            setError("Le password non corrispondono!");
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
                setSuccess("Registrazione completata con successo!");
                setError("");
            } else {
                setError(data.message || "Errore durante la registrazione");
            }
        } catch (err) {
            setError("Errore di connessione al server");
        }
        console.log(error);
        console.log(success);
        navigate('/login');
    };

  return (

            <div className="col-md-6 d-flex justify-content-center align-items-center mb-4 mb-md-0">
            <div className="card p-4 shadow-lg">
                <h2 className="text-center mb-4">Registrazione</h2>
                <form onSubmit={handleregister}>

		{/* Nome */}
                <div className="mb-3">
                    <label htmlFor="name" className="form-label">Nome Utente</label>
                    <input type="text" name="name" className="form-control" id="name" placeholder="Nome Utente" />
                </div>

		{/* Email */}
                <div className="mb-4">
                    <label htmlFor="email" className="form-label">Email</label>
                    <input type="email" name="email" className="form-control" id="email" placeholder="Email" />
                </div>

		{/* Password */}
		<div className="mb-4">
	                <label htmlFor="inputPassword5" className="form-label">Password</label>
        	        <input type="password" name="password" id="inputPassword5" className="form-control" aria-describedby="passwordHelpBlock" placeholder="Password"></input>

                   	 <label htmlFor="password" className="form-label">Conferma Password</label>
			<input type="password" className="form-control" id="confirmPassword" name="confirmPassword" placeholder="Password" />

			<div id="passwordHelpBlock" className="form-text">
	                    Your password must be 8-20 characters long, contain letters and numbers, and must not contain spaces, special characters, or emoji.
			</div>
                </div>
                <button type="submit" className="btn btn-primary w-100">Registrati</button>
                </form>
                <button onClick={change} className="btn btn-primary w-100 mt-2">Indietro</button>
            </div>
            </div>

  );
}

export default Register;

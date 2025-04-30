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
      const response = await fetch("/userlogin", {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify({ email, password }),
      });

      const data = await response.json();

      if (response.ok) {
        setUser(data.user);
        navigate("/home");
      } else {
        setError("Email o Password errati!");
        alert(error);
      }
    } catch (error) {
      console.error("Errore di rete:", error);
      alert("Errore di connessione al server.");
    }
    
  };
  return (
    <div className="col-md-4 d-flex justify-content-center align-items-center mb-4 mb-md-0">
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
        <button className="register-btn btn btn-primary w-100 mt-2" onClick={change}>
          Registrati
        </button>
      </div>
    </div>
  );
}

export default Signin;

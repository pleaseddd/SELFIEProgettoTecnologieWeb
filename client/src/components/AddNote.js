import { useEffect, useState } from "react";
import { useNavigate } from "react-router-dom";
import "bootstrap/dist/css/bootstrap.min.css";
import "bootstrap/dist/js/bootstrap.bundle.min.js";

function AddNote({ user }) {
  const [message, setMessage] = useState("");

  const handleSubmit = async (event) => {
    event.preventDefault();
    const title = event.target.title.value;
    const category = event.target.category.value;
    const text = event.target.text.value;
    const userid = user._id;
    try {
      const response = await fetch("/newnote", {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify({ title, category, text, userid }),
      });

      const data = await response.json();

      if (response.ok) {
        setMessage("Nota creata con successo!");
        event.target.reset();
        setTimeout(() => {
          window.location.reload();
        }, 200);
      } else {
        setMessage("Errore durante la creazione della nota" + data.message);
      }
    } catch (err) {
      setMessage("Errore di connessione al server");
    }
  };

  return (
    <div className="card p-4 shadow-lg">
      <h2 className="text-center mb-4">Aggiungi nota</h2>
      {message && <p className="text-center text-success">{message}</p>}
      <form onSubmit={handleSubmit}>
        <div className="mb-3">
          <label className="form-label">Titolo</label>
          <input type="text" className="form-control" name="title" required />
        </div>
        <div className="mb-3">
          <label className="form-label">Categoria</label>
          <input
            type="text"
            className="form-control"
            name="category"
            required
          />
        </div>
        <div className="mb-3">
          <label className="form-label">Corpo</label>
          <textarea id="text" className="form-control" name="text"></textarea>
        </div>
        <button type="submit" className="btn btn-primary w-100">
          Aggiungi
        </button>
      </form>
    </div>
  );
}

export default AddNote;

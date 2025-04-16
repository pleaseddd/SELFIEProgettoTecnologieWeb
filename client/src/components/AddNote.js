import { useEffect, useState } from "react";
import "bootstrap/dist/css/bootstrap.min.css";
import "bootstrap/dist/js/bootstrap.bundle.min.js";

function AddNote({ user, selectedNote, clearSelectedNote }) {
  const [form, setForm] = useState({ title: "", category: "", text: "" });
  const [message, setMessage] = useState("");
  const categories=user.settings.categoryNotes.split("/");
  useEffect(() => {
    if (selectedNote) {
      setForm({
        title: selectedNote.title,
        category: selectedNote.category,
        text: selectedNote.body,
      });
    } else {
      setForm({ title: "", category: "", text: "" });
    }
  }, [selectedNote]);

  const handleSubmit = async (event) => {
    event.preventDefault();
    const { title, category, text } = form;
    const userid = user._id;

    const nota = {
      title,
      category,
      body: text,
      userid,
      ...(selectedNote && { noteid: selectedNote._id }),
    };

    const endpoint = selectedNote ? "/updatenote" : "/newnote";

    try {
      const response = await fetch(endpoint, {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify(nota),
      });

      const data = await response.json();

      if (response.ok) {
        setMessage(
          selectedNote ? "Nota aggiornata!" : "Nota creata con successo!"
        );
        clearSelectedNote();
        setTimeout(() => window.location.reload(), 500);
      } else {
        setMessage("Errore: " + data.message);
      }
    } catch (err) {
      setMessage("Errore di connessione");
    }
  };

  return (
    <div className="card p-4 shadow-lg">
      <h2 className="text-center mb-4">
        {selectedNote ? "Modifica nota" : "Aggiungi nota"}
      </h2>
      {message && <p className="text-center text-success">{message}</p>}
      <form onSubmit={handleSubmit}>
        <div className="mb-3">
          <label className="form-label">Titolo</label>
          <input
            type="text"
            className="form-control"
            name="title"
            value={form.title}
            onChange={(e) => setForm({ ...form, title: e.target.value })}
            required
          />
        </div>
        <div className="mb-3">
          <label className="form-label">Categoria</label>
          <select
            type="select"
            className="form-control"
            name="category"
            value={form.category}
            onChange={(e) => setForm({ ...form, category: e.target.value })}
            required
          >
            {
              categories.map((category, index) => (
                <option key={index} value={category}>
                  {category}
                </option>
              ))
            }
          </select>
        </div>
        <div className="mb-3">
          <label className="form-label">Corpo</label>
          <textarea
            id="text"
            className="form-control"
            name="text"
            rows="4"
            value={form.text}
            onChange={(e) => setForm({ ...form, text: e.target.value })}
          />
        </div>
        <button type="submit" className="btn btn-primary w-100">
          {selectedNote ? "Modifica" : "Aggiungi"}
        </button>
        {selectedNote && (
          <button
            type="button"
            className="btn btn-secondary w-100 mt-2"
            onClick={clearSelectedNote}
          >
            Annulla modifica
          </button>
        )}
      </form>
    </div>
  );
}

export default AddNote;

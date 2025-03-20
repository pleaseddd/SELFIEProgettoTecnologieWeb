import { useState } from "react";

function RemoveNote({ noteId, onNoteRemoved }) {
  const [message, setMessage] = useState("");

  const handleRemove = async () => {
    if (!noteId) {
      setMessage("ID nota non valido.");
      return;
    }

    try {
      const response = await fetch(`/notes/${noteId}`, {
        method: "DELETE",
      });
      const data = await response.json();

      if (response.ok) {
        setMessage("Nota eliminata con successo!");
        if (onNoteRemoved) onNoteRemoved(noteId);
      } else {
        setMessage("Errore: " + data.message);
      }
    } catch (error) {
      setMessage("Errore di connessione al server.");
    }
  };

  return (
    <div className="d-flex align-items-center gap-2">
      <button onClick={handleRemove} className="btn btn-danger">
        Elimina Nota
      </button>
      {message && <p className="text-danger m-0">{message}</p>}
    </div>
  );
}

export default RemoveNote;

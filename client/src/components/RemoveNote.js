import React from "react";

function RemoveNote({ noteId, userId, onSuccess }) {
  const handleDelete = async () => {
    const conferma = window.confirm("Sei sicuro di voler eliminare questa nota?");
    if (!conferma) return;

    try {
      const response = await fetch("/deletenote", {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify({ noteid: noteId, userid: userId }),
      });

      if (response.ok) {
        onSuccess(noteId); 
      } else {
        const data = await response.json();
        alert("Errore durante l'eliminazione: " + data.message);
      }
    } catch (err) {
      console.error("Errore:", err);
      alert("Errore di rete durante l'eliminazione");
    }
  };

  return (
    <button className="btn btn-sm btn-outline-danger" onClick={handleDelete}>
      Elimina
    </button>
  );
}

export default RemoveNote;

import React, { useEffect, useState } from "react";
import "bootstrap/dist/css/bootstrap.min.css";
import "bootstrap/dist/js/bootstrap.bundle.min.js";
import AddNote from "./components/AddNote";
import RemoveNote  from "./components/RemoveNote";
import NoteView from "./components/NoteView";
import "./style/note.css";

function NotesPages({ user }) {
  const [notes, setNotes] = useState([]);
  const [selectedNote, setSelectedNote] = useState(null);
  const [showNoteView, setShowNoteView] = useState(false);
  useEffect(() => {
    const fetchNotes = async () => {
      try {
        const response = await fetch("/notes", {
          method: "POST",
          headers: {
            "Content-Type": "application/json",
          },
          body: JSON.stringify({ userid: user._id }),
        });
        const data = await response.json();
        if (response.ok) {
          setNotes(data);
        } else {
          alert("Errore durante il recupero delle note");
        }
      } catch (error) {
        console.error("Errore durante il recupero delle note:", error);
      }
    };

    fetchNotes();
  }, [user._id]);

  // Funzione per aprire la modale di visualizzazione della nota
  const openNoteView = (note) => {
    setSelectedNote(note);
    setShowNoteView(true);
  };

  // Funzione per chiudere la modale di visualizzazione
  const closeNoteView = () => {
    setSelectedNote(null);
    setShowNoteView(false);
  };

  const handleNoteRemoved = (id) => {
    setNotes(notes.filter((n) => n._id !== id));
    closeNoteView();
  };

  const handleDeleteModal = async () => {
    try {
      const response = await fetch(`/deletenote`, {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify({ 
          noteid: selectedNote._id, 
          userid: user._id 
        }),
      });
  
      if (response.ok) {
        handleNoteRemoved(selectedNote._id); // Aggiorna lo stato
        closeNoteView(); // Chiudi la modale
      } else {
        alert("Errore durante l'eliminazione");
      }
    } catch (error) {
      console.error("Errore:", error);
    }
  };

// Funzione per la modifica: chiude la modale e scrolla verso il form di editing
const handleEdit = (note) => {
  // Imposta la nota selezionata per la modifica
  setSelectedNote(note);
  // Chiude la modale
  setShowNoteView(false);

  // Effettua lo scroll verso il form di modifica dopo un breve ritardo
  setTimeout(() => {
    const editForm = document.getElementById("addNoteForm");
    if (editForm) {
      editForm.scrollIntoView({ behavior: "smooth" });
    }
  }, 300);
};

  return (
    <div className="container mt-4">
      <div className="row d-flex flex-column flex-md-row">
        <div className="col-md-4 mb-3">
          <div className="p-3 bg-light rounded shadow-sm">
            <AddNote
              user={user}
              selectedNote={selectedNote}
              clearSelectedNote={() => setSelectedNote(null)}
            />
          </div>
        </div>

        <div className="col-md-8">
          <div className="row">
            {notes.length > 0 ? (
              notes.map((note) => (
                <div key={note._id} className="col-lg-6 col-xl-4 mb-3">
                  <div
                    className="card shadow-sm h-100 d-flex flex-column"
                    style={{ cursor: "pointer" }}
                    onClick={() => openNoteView(note)}
                  >
                    <div className="card-body flex-grow-1">
                      <h5 className="card-title">{note.title}</h5>
                      <h6 className="card-subtitle mb-2 text-muted">
                        {note.category}
                      </h6>
                      <p className="card-text">{note.body}</p>
                    </div>
                    <div className="card-footer bg-transparent border-top-0 d-flex justify-content-between px-3 pb-3">
                      {/* MODIFICA: Impedisce la propagazione del click per non aprire la modale */}
                      <div onClick={(e) => e.stopPropagation()}>
                        <RemoveNote
                          noteId={note._id}
                          userId={user._id}
                          onSuccess={() => handleNoteRemoved(note._id)} // Corretto qui
                        />
                      </div>
                      <button
                        className="btn btn-sm btn-outline-primary"
                        onClick={(e) => {
                          e.stopPropagation(); // Evita l'apertura indesiderata della modale
                          openNoteView(note);
                        }}
                      >
                        Visualizza
                      </button>
                    </div>
                  </div>
                </div>
              ))
            ) : (
              <p className="text-center">Nessuna nota disponibile.</p>
            )}
          </div>
        </div>
      </div>

      {selectedNote && (
        <NoteView
          show={showNoteView}
          note={selectedNote}
          onClose={closeNoteView}
          onEdit={handleEdit}
          onDelete={handleDeleteModal} // Collegamento della funzione di eliminazione
        />
      )}
    </div>
  );
}

export default NotesPages;
import React, { useEffect, useState } from "react";
import "bootstrap/dist/css/bootstrap.min.css";
import "bootstrap/dist/js/bootstrap.bundle.min.js";
import AddNote from "./components/AddNote";
import RemoveNote from "./components/RemoveNote";
import NoteView from "./components/NoteView";
import "./style/note.css";
import { FaMagnifyingGlass } from "react-icons/fa6";
import { BsArrowsFullscreen } from "react-icons/bs";

function NotesPages({ user }) {
  const [notes, setNotes] = useState([]);
  const [selectedNote, setSelectedNote] = useState(null);
  const [showNoteView, setShowNoteView] = useState(false);
  const [selectedCategories, setSelectedCategories] = useState([]);
  const [showFilterPanel, setShowFilterPanel] = useState(false);

  // Fetch notes
  useEffect(() => {
    const fetchNotes = async () => {
      try {
        const response = await fetch("/notes", {
          method: "POST",
          headers: { "Content-Type": "application/json" },
          body: JSON.stringify({ userid: user._id }),
        });
        const data = await response.json();
        if (response.ok) setNotes(data);
        else alert("Errore durante il recupero delle note");
      } catch (error) {
        console.error("Errore durante il recupero delle note:", error);
      }
    };
    fetchNotes();
  }, [user._id]);

  // Categories list
  const categories = Array.from(
    new Set(notes.map((n) => n.category || "Senza categoria"))
  );

  // Handle checkbox toggle
  const handleCategoryChange = (e) => {
    const { value, checked } = e.target;
    setSelectedCategories((prev) =>
      checked ? [...prev, value] : prev.filter((c) => c !== value)
    );
  };

  // Filtered notes
  const displayedNotes = notes.filter((note) => {
    const cat = note.category || "Senza categoria";
    return selectedCategories.length === 0 || selectedCategories.includes(cat);
  });

  // Modal controls
  const openNoteView = (note) => {
    setSelectedNote(note);
    setShowNoteView(true);
  };
  const closeNoteView = () => {
    setSelectedNote(null);
    setShowNoteView(false);
  };

  // Remove after delete
  const handleNoteRemoved = (id) => {
    setNotes(notes.filter((n) => n._id !== id));
    closeNoteView();
  };

  const handleDeleteModal = async () => {
    try {
      const response = await fetch(`/deletenote`, {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ noteid: selectedNote._id, userid: user._id }),
      });
      if (response.ok) handleNoteRemoved(selectedNote._id);
      else alert("Errore durante l'eliminazione");
    } catch (error) {
      console.error("Errore:", error);
    }
  };

  const handleEdit = (note) => {
    setSelectedNote(note);
    setShowNoteView(false);
    setTimeout(() => {
      const editForm = document.getElementById("addNoteForm");
      if (editForm) editForm.scrollIntoView({ behavior: "smooth" });
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
            {displayedNotes.length > 0 ? (
              displayedNotes.map((note) => (
                <div key={note._id} className="col-lg-6 col-xl-4 mb-3">
                  <div
                    className="card shadow-sm h-100 d-flex flex-column"
                    style={{ cursor: "pointer" }}
                    onClick={() => openNoteView(note)}
                  >
                    <div className="card-body flex-grow-1">
                      <h5 className="card-title">{note.title}</h5>
                      <h6 className="card-subtitle mb-2 text-muted">
                        {note.category || "Senza categoria"}
                      </h6>
                      <p className="card-text">{note.body}</p>
                    </div>
                    <div className="card-footer bg-transparent border-top-0 d-flex justify-content-between px-3 pb-3">
                      <div onClick={(e) => e.stopPropagation()}>
                        <RemoveNote
                          noteId={note._id}
                          userId={user._id}
                          onSuccess={() => handleNoteRemoved(note._id)}
                        />
                      </div>
                      <button
                        className="btn btn-outline-primary d-flex align-items-center justify-content-center"
                        style={{
                          width: "40px",
                          height: "40px",
                          padding: 0,
                        }}
                        onClick={(e) => {
                          e.stopPropagation();
                          openNoteView(note);
                        }}
                      >
                        <BsArrowsFullscreen />
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
          onDelete={handleDeleteModal}
        />
      )}

      {/* Floating Filter Toggle */}
      <button
        className="btn btn-primary rounded-circle d-flex align-items-center justify-content-center"
        style={{
          position: "fixed",
          bottom: "20px",
          right: "20px",
          zIndex: 1000,
          width: "50px", // larghezza
          height: "50px", // altezza uguale alla larghezza
          padding: 0, // rimuove padding interno di default
        }}
        onClick={() => setShowFilterPanel((prev) => !prev)}
      >
        <FaMagnifyingGlass size={20} />
      </button>

      {/* Filter Panel Overlay */}
      {showFilterPanel && (
        <div
          style={{
            position: "fixed",
            bottom: "70px",
            right: "20px",
            width: "220px",
            maxHeight: "300px",
            overflowY: "auto",
            background: "#ffffff",
            border: "1px solid #ccc",
            borderRadius: "8px",
            padding: "10px",
            boxShadow: "0 2px 8px rgba(0,0,0,0.15)",
            zIndex: 1000,
          }}
        >
          <h6>Filtra categorie</h6>
          {categories.map((cat) => (
            <div className="form-check" key={cat}>
              <input
                className="form-check-input"
                type="checkbox"
                value={cat}
                id={`filter-${cat}`}
                onChange={handleCategoryChange}
                checked={selectedCategories.includes(cat)}
              />
              <label className="form-check-label" htmlFor={`filter-${cat}`}>
                {cat}
              </label>
            </div>
          ))}
          {categories.length > 0 && (
            <button
              className="btn btn-sm btn-link mt-2"
              onClick={() => setSelectedCategories([])}
            >
              Reset filtri
            </button>
          )}
        </div>
      )}
    </div>
  );
}

export default NotesPages;

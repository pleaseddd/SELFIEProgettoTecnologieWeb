import React, { useEffect, useState } from "react";
import { useNavigate } from "react-router-dom";
import "bootstrap/dist/css/bootstrap.min.css";
import "bootstrap/dist/js/bootstrap.bundle.min.js";
import RemoveNote from "./components/RemoveNote";
import AddNote from "./components/AddNote";

function NotesPages({ user }) {
  const [notes, setNotes] = useState([]);
  const navigate = useNavigate();
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
  }, []);
  return (
    <div className="container mt-4">
      <div className="row d-flex flex-column flex-md-row">
        <div className="col-md-4 mb-3">
          <div className="p-3 bg-light rounded shadow-sm">
            <AddNote user={user} />
          </div>
        </div>

        <div className="col-md-8">
          <h2 className="mb-3 text-md-start text-center">Le tue Note</h2>
          <div className="row">
            {notes.length > 0 ? (
              notes.map((note, index) => (
                <div key={index} className="col-lg-6 col-xl-4 mb-3">
                  <div className="card shadow-sm h-100">
                    <div className="card-body">
                      <h5 className="card-title">{note.title}</h5>
                      <h6 className="card-subtitle mb-2 text-muted">
                        {note.category}
                      </h6>
                      <p className="card-text">{note.body}</p>
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
    </div>
  );
}

export default NotesPages;

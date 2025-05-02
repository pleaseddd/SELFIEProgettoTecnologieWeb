import React, { useEffect, useState } from "react";
import "bootstrap/dist/css/bootstrap.min.css";
import "bootstrap/dist/js/bootstrap.bundle.min.js";
import { useNavigate } from "react-router-dom";
import { Carousel } from "bootstrap";
import "../../style/Notecarousel.css";

function NotesCarousel({ user }) {
  const [notes, setNotes] = useState([]);
  const navigate = useNavigate();

  useEffect(() => {
    const fetchNotes = async () => {
      try {
        const response = await fetch("/lastnotes", {
          method: "POST",
          headers: {
            "Content-Type": "application/json",
          },
          body: JSON.stringify({
            userid: user._id,
            limit: user.settings.homeNotes,
          }),
        });
        const data = await response.json();
        if (response.ok) {
          setNotes(data);
        } else {
          alert(data.message);
        }
      } catch (error) {
        console.error("Errore durante il recupero delle note:", error);
      }
    };

    fetchNotes();
  }, [user._id, user.settings.homeNotes]);

  useEffect(() => {
    const carouselElement = document.getElementById("noteCarousel");
    if (carouselElement) {
      new Carousel(carouselElement, {
        interval: 3000,
        ride: "carousel",
        pause: false,
      });
    }
  }, [notes]);
  return (
    <div
      className="container mt-5"
    >
      {notes.length > 0 ? (
        <div
          id="noteCarousel"
          className="carousel slide carousel-fade"
          data-bs-ride="carousel"
          data-bs-interval="3000"
        >
          <div className="carousel-inner">
            {notes.map((nota, index) => (
              <div
                key={nota._id}
                className={`carousel-item ${index === 0 ? "active" : ""}`}
              >
                <div className="d-flex justify-content-center note-card-wrapper">
                  <div
                    className="card text-start shadow p-4 note-card"
                    onClick={() => navigate("/Note")}
                    style={{
                      backgroundColor: "#324376",
                      color: "#f68e5f",
                      border: "none",
                      width: "100%",
                      maxWidth: "500px",
                      cursor: "pointer",
                    }}
                  >
                    <div className="mb-3">
                      <span
                        className="badge me-2"
                        style={{ backgroundColor: "#f5dd90", color: "#000" }}
                      >
                        {nota.category || "Senza categoria"}
                      </span>
                      <h5
                        className="card-title fw-bold text-center mb-0"
                        style={{ color: "#f5dd90" }}
                      >
                        {nota.title}
                      </h5>
                    </div>
                    <p className="card-text note-body text-truncate-multiline">
                      {nota.body}
                    </p>
                  </div>
                </div>
              </div>
            ))}
          </div>
        </div>
      ) : (
        <div
          className="card text-center p-5 shadow"
          style={{
            backgroundColor: "#f76c5e",
            color: "white",
            cursor: "pointer",
            maxWidth: "600px",
            margin: "0 auto",
          }}
          onClick={() => navigate("/Note")}
        >
          <h4>Non hai ancora note</h4>
          <p>Clicca qui per creare la tua prima nota!</p>
        </div>
      )}
    </div>
  );
}
export default NotesCarousel;

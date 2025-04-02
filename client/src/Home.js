import React, { useEffect, useState } from "react";
import { useNavigate } from "react-router-dom";
import Weather from "./components/home/Weather.js";
import "./style/home.css";
import "bootstrap/dist/css/bootstrap.min.css";
import "bootstrap/dist/js/bootstrap.bundle.min.js";
import { Carousel } from "bootstrap";
function Home({ user, logout }) {
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
          body: JSON.stringify({ userid: user._id, limit: 3 }),
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
  }, []);

  useEffect(() => {
    const carouselElement = document.getElementById("noteCarousel");
    if (carouselElement) {
      new Carousel(carouselElement, {
        interval: 3000,
        ride: "carousel",
        pause: false, // 👈 evita che si fermi al mouse hover
      });
    }
  }, [notes]);

  return (
    <div className="container mt-5">
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
                style={{
                  minHeight: "300px", // assicura spazio sufficiente
                  display: "flex",
                  alignItems: "center",
                  justifyContent: "center",
                }}
              >
                <div className="d-flex justify-content-center">
                  <div
                    className="card text-start shadow p-4"
                    style={{
                      width: "100%",
                      maxWidth: "600px", // 👈 larghezza massima della card
                      backgroundColor: "#ffffff",
                      borderRadius: "1rem",
                      cursor: "pointer",
                    }}
                    onClick={() => navigate("/Note")}
                  >
                    <div className="mb-3">
                      <span className="badge bg-primary me-2">
                        {nota.category || "Senza categoria"}
                      </span>
                      <h5 className="card-title fw-bold mb-0">{nota.title}</h5>
                    </div>
                    <p className="card-text mt-2">
                      {nota.body.length > 100
                        ? nota.body.substring(0, 100) + "..."
                        : nota.body}
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
          style={{ cursor: "pointer" }}
          onClick={() => navigate("/Note")}
        >
          <h4>Non hai ancora note</h4>
          <p>Clicca qui per creare la tua prima nota!</p>
        </div>
      )}

      <Weather />
    </div>
  );
}

export default Home;

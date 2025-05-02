import React, { useEffect, useState } from "react";
import "bootstrap/dist/css/bootstrap.min.css";
import "bootstrap/dist/js/bootstrap.bundle.min.js";
import { useNavigate } from "react-router-dom";
import { Carousel } from "bootstrap";

function CalendarCarousel({ user }) {
  const [events, setEvents] = useState([]);
  const [countdowns, setCountdowns] = useState([]);
  const navigate = useNavigate();
  useEffect(() => {
    const fetchEvents = async () => {
      try {
        const response = await fetch("/upcoming", {
          method: "POST",
          headers: {
            "Content-Type": "application/json",
          },
          body: JSON.stringify({
            userid: user._id,
          }),
        });
        const data = await response.json();
        if (response.ok) {
          setEvents(data);
        } else {
          alert(data.message);
        }
      } catch (error) {
        console.error("Errore durante il recupero degli eventi:", error);
      }
    };
    fetchEvents();
  }, [user._id]);
  useEffect(() => {
    const interval = setInterval(() => {
      const now = new Date();
      const updatedCountdowns = events.map((event) => {
        const begin = new Date(event.begin);
        const diff = begin - now;
        if (diff <= 0) return "In corso o concluso";
        const minutes = Math.floor(diff / 60000) % 60;
        const hours = Math.floor(diff / 3600000) % 24;
        const days = Math.floor(diff / 86400000);
        return `${days}g ${hours}h ${minutes}m`;
      });
      setCountdowns(updatedCountdowns);
    }, 1000);

    return () => clearInterval(interval);
  }, [events]);
  useEffect(() => {
    if (events.length > 0) {
      const carouselEl = document.getElementById("eventCarousel");
      const carousel = new Carousel(carouselEl, {
        interval: 5000,
        ride: "carousel",
        pause: false,
        wrap: true
      });
      carousel.cycle(); // forza l'inizio immediato
    }
  }, [events]);
  return (
    <div
      id="eventCarousel"
      className="carousel slide"
      data-bs-ride="carousel"
      data-bs-interval="5000" // auto slide ogni 5 secondi
    >
      <div className="carousel-inner">
        {events.map((event, index) => (
          <div
            key={event._id}
            className={`carousel-item ${index === 0 ? "active" : ""}`}
          >
            <div
              className="d-flex flex-column justify-content-center align-items-center p-4 shadow rounded bg-light mx-auto"
              style={{ maxWidth: "400px" }}
            >
              <h5 className="text-primary">{event.category}</h5>
              <h4 className="fw-bold">{event.title}</h4>
              <p className="mb-1">
                <strong>Inizio:</strong>{" "}
                {new Date(event.begin).toLocaleString(undefined, {
                  day: "2-digit",
                  month: "2-digit",
                  year: "numeric",
                  hour: "2-digit",
                  minute: "2-digit",
                })}
              </p>
              <p className="mb-2">
                <strong>Fine:</strong>{" "}
                {new Date(event.end).toLocaleString(undefined, {
                  day: "2-digit",
                  month: "2-digit",
                  year: "numeric",
                  hour: "2-digit",
                  minute: "2-digit",
                })}
              </p>
              <span className="badge bg-warning text-dark">
                ⏳ {countdowns[index]}
              </span>
            </div>
          </div>
        ))}
      </div>
    </div>
  );
}

export default CalendarCarousel;

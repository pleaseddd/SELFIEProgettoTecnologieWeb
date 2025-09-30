import React, { useState, useEffect, useRef } from "react";
import axios from "axios";
import Draggable from "react-draggable";
import useIsMobile from "../hooks/useIsMobile";
import "../style/timeMachine.css";

const TimeMachine = () => {
  const [isOpen, setIsOpen] = useState(false); // stato visibilità pannello
  const [dateTime, setDateTime] = useState(""); // stato input data/ora
  const nodeRef = useRef(null); // riferimento al pannello

  // al montaggio: recupera l'ora corrente dal server e la mette nell'input
  useEffect(() => {
    (async () => {
      try {
        const res = await axios.get("/api/server-time");
        const iso = res.data.now; // es. "2025-06-04T14:30:00.000Z"
        const dt = new Date(iso);
        // converto ISO in "YYYY-MM-DDTHH:mm" compatibile con datetime-local
        const local = new Date(dt.getTime() - dt.getTimezoneOffset() * 60000)
          .toISOString()
          .slice(0, 16);
        setDateTime(local);
      } catch (err) {
        console.error("Errore fetching server time:", err);
      }
    })();
  }, []);

  // apre/chiude il pannello
  const togglePanel = () => {
    setIsOpen((prev) => !prev);
  };

  // aggiorna stato input
  const handleChange = (e) => {
    setDateTime(e.target.value);
  };

  // invia la data selezionata al server
  const handleSubmit = async (e) => {
    e.preventDefault();
    if (!dateTime) return;

    try {
      const selected = new Date(dateTime).toISOString();
      await axios.post("/api/server-time/set", { datetime: selected });
      alert("Time Machine: data e ora impostati correttamente.");
      setIsOpen(false);
    } catch (err) {
      console.error("Errore impostazione Time Machine:", err);
      alert("Errore nell’impostazione della Time Machine.");
    }
  };

  // resetta la data sul server e riporta l’input all’ora reale
  const handleReset = async () => {
    try {
      await axios.post("/api/server-time/reset");
      alert("Time Machine resettata: ora torna reale.");
      const res = await axios.get("/api/server-time");
      const iso = res.data.now;
      const dt = new Date(iso);
      const local = new Date(dt.getTime() - dt.getTimezoneOffset() * 60000)
        .toISOString()
        .slice(0, 16);
      setDateTime(local);
      setIsOpen(false);
    } catch (err) {
      console.error("Errore reset Time Machine:", err);
      alert("Errore nel reset della Time Machine.");
    }
  };

  // chiude il pannello se si clicca fuori
  useEffect(() => {
    const handleClickOutside = (e) => {
      if (nodeRef.current && !nodeRef.current.contains(e.target)) {
        setIsOpen(false);
      }
    };
    if (isOpen) {
      document.addEventListener("mousedown", handleClickOutside);
    } else {
      document.removeEventListener("mousedown", handleClickOutside);
    }
    return () => {
      document.removeEventListener("mousedown", handleClickOutside);
    };
  }, [isOpen]);

  const isMobile = useIsMobile(); // hook che rileva se è mobile

  return (
    <>
      {/* Bottone visibile solo su mobile */}
      {isMobile && (
        <button
          className="tm-toggle-btn"
          onClick={togglePanel}
          aria-label="Apri Time Machine"
        >
          ⏳
        </button>
      )}

      {/* Mobile: pannello visibile solo se isOpen */}
      {isMobile && isOpen && (
        <div className="tm-panel" ref={nodeRef} role="dialog" aria-modal="true">
          <h5 className="tm-title">Time Machine</h5>
          <form onSubmit={handleSubmit} className="tm-form">
            <label htmlFor="tm-datetime" className="tm-label">
              Seleziona data e ora:
            </label>
            <input
              id="tm-datetime"
              type="datetime-local"
              value={dateTime}
              onChange={handleChange}
              className="tm-input"
              required
            />
            <div className="tm-buttons">
              <button type="submit" className="tm-btn tm-btn--primary tm-btn--large">
                Imposta
              </button>
              <button
                type="button"
                className="tm-btn tm-btn--muted"
                onClick={handleReset}
              >
                Reset
              </button>
            </div>
          </form>
        </div>
      )}

      {/* Desktop: pannello sempre visibile e trascinabile */}
      {!isMobile && (
        <Draggable handle=".tm-title" nodeRef={nodeRef}>
          <div className="tm-panel draggable-panel" ref={nodeRef} role="dialog">
            <h5 className="tm-title" style={{ cursor: "move" }}>
              Time Machine
            </h5>
            <form onSubmit={handleSubmit} className="tm-form">
              <label htmlFor="tm-datetime" className="tm-label">
                Seleziona data e ora:
              </label>
              <input
                id="tm-datetime"
                type="datetime-local"
                value={dateTime}
                onChange={handleChange}
                className="tm-input"
                required
              />
              <div className="tm-buttons">
                <button type="submit" className="tm-btn tm-btn--primary tm-btn--large">
                  Imposta
                </button>
                <button
                  type="button"
                  className="tm-btn tm-btn--muted"
                  onClick={handleReset}
                >
                  Reset
                </button>
              </div>
            </form>
          </div>
        </Draggable>
      )}
    </>
  );
};

export default TimeMachine;

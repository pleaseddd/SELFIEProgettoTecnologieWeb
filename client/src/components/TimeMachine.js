import React, { useState, useEffect, useRef } from "react";
import axios from "axios";
import Draggable from "react-draggable";
import useIsMobile from "../hooks/useIsMobile";
import "../style/timeMachine.css";

const TimeMachine = () => {
  const [isOpen, setIsOpen] = useState(false);
  const [dateTime, setDateTime] = useState("");
  const nodeRef = useRef(null);

  // Al montaggio, prendo l’ora corrente dal server per popolare l’input
  useEffect(() => {
    (async () => {
      try {
        const res = await axios.get("/api/server-time");
        const iso = res.data.now; // es. "2025-06-04T14:30:00.000Z"
        // Converto ISO in "YYYY-MM-DDTHH:mm" per <input type="datetime-local" />
        const dt = new Date(iso);
        const local = new Date(dt.getTime() - dt.getTimezoneOffset() * 60000)
          .toISOString()
          .slice(0, 16);
        setDateTime(local);
      } catch (err) {
        console.error("Errore fetching server time:", err);
      }
    })();
  }, []);

  const togglePanel = () => {
    setIsOpen((prev) => !prev);
  };

  const handleChange = (e) => {
    setDateTime(e.target.value);
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    if (!dateTime) return;

    try {
      const selected = new Date(dateTime).toISOString();

      await axios.post("/api/server-time/set", { datetime: selected });
      await axios.post("/api/server-time/flag/set");
      alert("Time Machine: data e ora impostati correttamente.");
      setIsOpen(false);
    } catch (err) {
      console.error("Errore impostazione Time Machine:", err);
      alert("Errore nell’impostazione della Time Machine.");
    }
  };

  const handleReset = async () => {
    try {
      await axios.post("/api/server-time/reset");
      await axios.post("/api/server-time/flag/set");
      alert("Time Machine resettata: ora torna reale.");
      // Resetto l’input all’ora reale
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

  const isMobile = useIsMobile();

  return (
    <>
      {isMobile && (
        <button className="tm-toggle-btn" onClick={togglePanel}>
          ⏳
        </button>
      )}

      {/* Mobile: pannello visibile solo se isOpen */}
      {isMobile && isOpen && (
        <div className="tm-panel" ref={nodeRef}>
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
              <button type="submit" className="btn btn-primary btn-sm tm-btn">
                Imposta
              </button>
              <button
                type="button"
                className="btn btn-secondary btn-sm tm-btn"
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
          <div className="tm-panel draggable-panel" ref={nodeRef}>
            <h5 className="tm-title" style={{ cursor: "move" }}>Time Machine</h5>
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
                <button type="submit" className="btn btn-primary btn-sm tm-btn">
                  Imposta
                </button>
                <button
                  type="button"
                  className="btn btn-secondary btn-sm tm-btn"
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

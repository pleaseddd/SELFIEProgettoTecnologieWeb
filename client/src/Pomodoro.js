import React, { useState, useEffect, useRef } from "react";
import "./style/pomodoro.css";
import "bootstrap/dist/css/bootstrap.min.css";
import { useLocation } from "react-router-dom";
import { FaPlay, FaPause, FaArrowsRotate, FaAnglesRight, FaAnglesLeft } from "react-icons/fa6";
//componente principale Pomodoro
export default function Pomodoro({ userId }) {
  const location = useLocation();
  //inizializzazione stato dal local storage
  const [totalMinutes, setTotalMinutes] = useState(
    () => location.state?.duration || 200
  );
  const [generatedCycles, setGeneratedCycles] = useState(
    () => JSON.parse(localStorage.getItem("pomodoroGeneratedCycles")) || []
  );
  const [activeConfig, setActiveConfig] = useState(
    () =>
      JSON.parse(localStorage.getItem("pomodoroActiveConfig")) || {
        work: 25,
        break: 5,
      }
  );
  const [currentCycle, setCurrentCycle] = useState(
    () => parseInt(localStorage.getItem("pomodoroCurrentCycle")) || 0
  );
  const [phase, setPhase] = useState(
    () => localStorage.getItem("pomodoroPhase") || "work"
  );
  const [timeLeft, setTimeLeft] = useState(
    () =>
      parseInt(localStorage.getItem("pomodoroTimeLeft")) ||
      activeConfig.work * 60
  );
  const [completedCycles, setCompletedCycles] = useState(0);
  const [running, setRunning] = useState(false);
  const [finished, setFinished] = useState(false);
  const [showConfig, setShowConfig] = useState(true);

  const [selectedWorkOptions, setSelectedWorkOptions] = useState(() =>
    location.state?.work
      ? [location.state.work]
      : JSON.parse(localStorage.getItem("selectedWorkOptions")) || []
  );
  const [selectedBreakOptions, setSelectedBreakOptions] = useState(() =>
    location.state?.break
      ? [location.state.break]
      : JSON.parse(localStorage.getItem("selectedBreakOptions")) || []
  );

  const intervalRef = useRef(null);
  const circleRef = useRef(null);
  const startTimeRef = useRef(null);

  const presetWorkOptions = [10, 20, 25, 30, 35];
  const presetBreakOptions = [5, 10, 15];

  const circle = circleRef.current;
  const tickCount = 120;

  useEffect(() => {
    if (location.state !== null) {
      generateCycles();
    }
  }, []); // Solo al primo render

  // --- SINCRONIZZA SU localStorage A CAMBIO DI generatedCycles ---
  useEffect(() => {
    localStorage.setItem(
      "pomodoroGeneratedCycles",
      JSON.stringify(generatedCycles)
    );
  }, [generatedCycles]);

  // --- SALVA LE SCELTE DELL’UTENTE SU localStorage ---
  useEffect(() => {
    localStorage.setItem(
      "selectedWorkOptions",
      JSON.stringify(selectedWorkOptions)
    );
    localStorage.setItem(
      "selectedBreakOptions",
      JSON.stringify(selectedBreakOptions)
    );
  }, [selectedWorkOptions, selectedBreakOptions]);

  // --- RIPRISTINO STATO DA localStorage ALLA MONTAGGIO COMPONENTE ---
  useEffect(() => {
    const saved = JSON.parse(localStorage.getItem("pomodoroState"));
    if (saved) {
      const elapsed = Math.floor((Date.now() - saved.startTime) / 1000);
      const rem = saved.timeLeft - elapsed;
      if (rem > 0) {
        setActiveConfig(saved.activeConfig);
        setCurrentCycle(saved.currentCycle);
        setPhase(saved.phase);
        setTimeLeft(rem);
        setRunning(true);
        startTimeRef.current = Date.now() - (saved.timeLeft - rem) * 1000;
      } else {
        localStorage.removeItem("pomodoroState");
      }
    }
  }, []);

  // --- TIMER E SALVATAGGIO STATO AD OGNI "tick" ---
  useEffect(() => {
    if (!running) {
      persistState();
      return;
    }

    startTimeRef.current = Date.now();
    const tick = () => {
      setTimeLeft((prev) => {
        if (prev <= 1) {
          nextPhase();
          return 0;
        }
        return prev - 1;
      });
      persistState();
    };

    intervalRef.current = setInterval(tick, 1000);
    return () => clearInterval(intervalRef.current);
  }, [running, phase, currentCycle, activeConfig]);

  useEffect(() => {
    // Calcola il numero totale di tick in base alla fase corrente
    const totalTicks =
      phase === "work" ? activeConfig.work * 60 : activeConfig.break * 60;

    // Genera array di tick con posizione angolare
    const newTicks = Array.from({ length: totalTicks }).map((_, i) => ({
      angle: (i / totalTicks) * 360,
      elapsed: i < totalTicks - timeLeft,
    }));

    // Salva i ticks nello state se necessario
  }, [phase, activeConfig, timeLeft]);

  useEffect(() => {
    // Forza un reflow all'inizio di ogni nuova fase
    if (circleRef.current) {
      void circleRef.current.offsetWidth;
    }
  }, [phase]);

  //salva dati essenziali nel localStorage
  function persistState() {
    const state = {
      activeConfig,
      currentCycle,
      phase,
      timeLeft,
      startTime: startTimeRef.current,
    };
    localStorage.setItem("pomodoroState", JSON.stringify(state));
    localStorage.setItem("pomodoroActiveConfig", JSON.stringify(activeConfig));
    localStorage.setItem("pomodoroCurrentCycle", String(currentCycle));
    localStorage.setItem("pomodoroPhase", phase);
    localStorage.setItem("pomodoroTimeLeft", String(timeLeft));
  }

  // -- GENERAZIONE SUGGERIMENTI CICLI --
  const generateCycles = () => {
    const total = Number(totalMinutes);
    const works = selectedWorkOptions.length
      ? selectedWorkOptions
      : presetWorkOptions;
    const breaks = selectedBreakOptions.length
      ? selectedBreakOptions
      : presetBreakOptions;
    const sugg = [];
    works.forEach((w) =>
      breaks.forEach((b) => {
        const maxC = Math.floor(total / (w + b));
        if (maxC > 0)
          sugg.push({ work: w, break: b, cycles: maxC, total: maxC * (w + b) });
      })
    );
    sugg.sort((a, b) => {
      const aIsLongBreak = a.break > a.work;
      const bIsLongBreak = b.break > b.work;
      if (aIsLongBreak !== bIsLongBreak) {
        return aIsLongBreak ? 1 : -1;
      }
      return b.cycles - a.cycles;
    });
    setGeneratedCycles(sugg);
    setFinished(false);
  };

  // -- AVVIO NUOVO CICLO --
  const startCycle = ({ work, break: brk }) => {
    setActiveConfig({ work, break: brk });
    setPhase("work");
    setTimeLeft(work * 60);
    setRunning(true);
    setFinished(false);
    setCurrentCycle(0);

    const circle = circleRef.current;
    circle.classList.add("working");
    circle.style.setProperty("--dur", `${work * 60}s`);
    persistState();
  };

  // -- GESTIONE PASSAGGIO FASI --
  const nextPhase = () => {
    const { work, break: brk } = activeConfig;

    if (phase === "work") {
      //dal work va in pausa
      setPhase("break");
      setTimeLeft(brk * 60);
      circle.classList.remove("working");
      circle.classList.add("onbreak");
      circle.style.setProperty("--dur", `${brk * 60}s`);
    } else {
      const max =
        generatedCycles.find((c) => c.work === work && c.break === brk)
          ?.cycles || 0;
      setCurrentCycle((prev) => {
        if (prev + 1 >= max) {
          setFinished(true);
          setRunning(false);
          setTimeLeft(work * 60);
          return prev;
        } else {
          // prosegue al work successivo
          setPhase("work");
          setTimeLeft(work * 60);
          circle.classList.remove("onbreak");
          circle.classList.add("working");
          circle.style.setProperty("--dur", `${work * 60}s`);
          return prev + 1;
        }
      });
    }
    circle.classList.add("pulse-once");
    setTimeout(() => {
      circle.classList.remove("pulse-once");
    }, 1000);
  };

  // -- FORMATTATORE ORE:MINUTI --
  const formatTime = (secs) =>
    `${String(Math.floor(secs / 60)).padStart(2, "0")}:${String(
      secs % 60
    ).padStart(2, "0")}`;

  return (
    <div className={`pomodoro-root ${showConfig ? "" : "config-closed"}`}>
      <button
        className={`gear-btn ${showConfig ? "" : "rotated"}`}
        onClick={() => setShowConfig(!showConfig)}
      >
        <i className="bi bi-gear-fill" />
      </button>
      {/* TIMER */}
      <div className="timer-container">
        <div className="timer-section">
          <div ref={circleRef} className="timer-circle">
            <span className="timer-text">{formatTime(timeLeft)}</span>

            {/* → CERCHIO DI 60 TICK */}
            <div className="ticks-container">
              {Array.from({ length: tickCount }).map((_, i) => {
                // totale secondi per la fase corrente
                const totalSeconds =
                  phase === "work"
                    ? activeConfig.work * 60
                    : activeConfig.break * 60;

                // quanti tick vanno considerati "consumati" dal progresso attuale
                // uso Math.floor per garantire step discreti coerenti con il numero di tick
                const progressCount = Math.floor(
                  ((totalSeconds - timeLeft) / totalSeconds) * tickCount
                );

                // angolo equispaziato (i = 0 ... tickCount-1)
                const angle = (i * 360) / tickCount;

                // visibilità: qui nascondiamo i tick "consumati" dall'inizio (i piccoli)
                const hidden = i < progressCount;

                return (
                  <div
                    key={i}
                    className={`tick ${hidden ? "hidden" : ""}`}
                    style={{
                      transform: `rotate(${angle}deg) translateY(-103px)`,
                    }}
                  />
                );
              })}
            </div>
          </div>
          <div className="phase-box">
            <strong>{phase === "work" ? "Studio" : "Pausa"}</strong> – Ciclo{" "}
            {currentCycle + 1}
          </div>
          <div className="controls">
            <button
              onClick={() => {
                if (finished && !running) {
                  //se la sessione è finita e viene premuto “▶️”, rilancia la configurazione
                  startCycle(activeConfig);
                  // startCycle() al suo interno resetta setFinished(false)
                } else {
                  //altrimenti  come prima (play/pause)
                  setRunning((r) => !r);
                }
              }}
            >
              {running ? <FaPause /> : <FaPlay />}
            </button>
            <button
              onClick={() =>
                setTimeLeft(
                  (phase === "work" ? activeConfig.work : activeConfig.break) *
                  60
                )
              }
            >
              <FaArrowsRotate />
            </button>
            <button
              onClick={() => {
                if (finished) {
                  if (running) {
                    setFinished(false);
                  } else {
                    startCycle(activeConfig);
                  }
                } else {
                  nextPhase();
                }
              }}
            >
              {" "}
              {finished ? (running ? <FaAnglesRight /> : <FaAnglesLeft />) : <FaAnglesRight />}
            </button>
          </div>
        </div>
      </div>

      {/* CONFIGURAZIONE */}
      <div className={`config-wrapper ${showConfig ? "" : "collapsed"}`}>
        <div className="config-body container-fluid">
          {/* Titolo */}
          <div className="text-center mb-4">
            <h2 className="m-0">Configurazione</h2>
          </div>

          {/* Tempo Totale */}
          <div className="row align-items-center mb-4">
            <div className="col-auto">
              <label className="form-label fw-semibold">Tempo totale</label>
            </div>
            <div className="col">
              <input
                type="number"
                className="form-control"
                value={totalMinutes}
                onChange={(e) =>
                  setTotalMinutes(e.target.value.replace(/\D/g, ""))
                }
              />
            </div>
          </div>

          {/* Opzioni lavoro */}
          <div className="mb-3">
            <div className="fw-semibold mb-1">Durata sessioni di lavoro</div>
            <div className="d-flex flex-wrap gap-2">
              {presetWorkOptions.map((w) => {
                const id = `work-${w}`;
                return (
                  <React.Fragment key={w}>
                    <input
                      type="checkbox"
                      className="btn-check"
                      id={id}
                      autoComplete="off"
                      checked={selectedWorkOptions.includes(w)}
                      onChange={() =>
                        setSelectedWorkOptions((prev) =>
                          prev.includes(w)
                            ? prev.filter((x) => x !== w)
                            : [...prev, w]
                        )
                      }
                    />
                    <label
                      className="btn btn-outline-primary btn-sm"
                      htmlFor={id}
                    >
                      {w} min
                    </label>
                  </React.Fragment>
                );
              })}
            </div>
          </div>

          {/* Opzioni pausa */}
          <div className="mb-4">
            <div className="fw-semibold mb-1">Durata pause</div>
            <div className="d-flex flex-wrap gap-2">
              {presetBreakOptions.map((b) => {
                const id = `break-${b}`;
                return (
                  <React.Fragment key={b}>
                    <input
                      type="checkbox"
                      className="btn-check"
                      id={id}
                      autoComplete="off"
                      checked={selectedBreakOptions.includes(b)}
                      onChange={() =>
                        setSelectedBreakOptions((prev) =>
                          prev.includes(b)
                            ? prev.filter((x) => x !== b)
                            : [...prev, b]
                        )
                      }
                    />
                    <label
                      className="btn btn-outline-secondary btn-sm"
                      htmlFor={id}
                    >
                      {b} min
                    </label>
                  </React.Fragment>
                );
              })}
            </div>
          </div>

          {/* Bottone Genera */}
          <div className="d-grid mb-4">
            <button className="btn btn-primary btn-lg" onClick={generateCycles}>
              Genera
            </button>
          </div>

          {/* Titolo Proposte */}
          <div className="text-center mb-2">
            <h5 className="fw-bold">Proposte cicli</h5>
          </div>

          {/* Cicli suggeriti */}
          {generatedCycles.length > 0 && (
            <div className="row gy-2">
              {generatedCycles.map((c, i) => (
                <div key={i} className="col-12">
                  <div className="cycle-suggestion">
                    <p className="mb-0">
                      {c.cycles} cicli da{" "}
                      <strong>
                        {c.work}+{c.break}
                      </strong>{" "}
                      min →{" "}
                      <span className="text-muted">{c.total} minuti</span>
                    </p>
                    <button
                      className="btn btn-sm btn-outline-success"
                      onClick={() =>
                        startCycle({ work: c.work, break: c.break })
                      }
                    >
                      <FaPlay />
                    </button>
                  </div>
                </div>
              ))}
            </div>
          )}
        </div>
      </div>
    </div>
  );
}

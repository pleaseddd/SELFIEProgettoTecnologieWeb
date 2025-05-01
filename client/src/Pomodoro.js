import React, { useState, useEffect, useRef } from 'react';
import './style/pomodoro.css';
import 'bootstrap/dist/css/bootstrap.min.css';
import "bootstrap/dist/js/bootstrap.bundle.min.js";
// componente principale Pomodoro
export default function Pomodoro({ userId }) {
  // stato iniziale
  const [totalMinutes, setTotalMinutes] = useState(200);
  const [generatedCycles, setGeneratedCycles] = useState([]);
  const [activeConfig, setActiveConfig] = useState({ work: 25, break: 5 });
  const [currentCycle, setCurrentCycle] = useState(0);
  const [completedCycles, setCompletedCycles] = useState(0);
  const [selectedWorkOptions, setSelectedWorkOptions] = useState([]);
  const [selectedBreakOptions, setSelectedBreakOptions] = useState([]);
  const [phase, setPhase] = useState('work');
  const [timeLeft, setTimeLeft] = useState(0);
  const [running, setRunning] = useState(false);
  const [finished, setFinished] = useState(false);
  const [showConfig, setShowConfig] = useState(true);

  const intervalRef = useRef(null);
  const circleRef = useRef(null);

  const presetWorkOptions = [10, 20, 25, 30, 35];
  const presetBreakOptions = [5, 10, 15];

  // genera cicli suggeriti
  const generateCycles = () => {
    const total = Number(totalMinutes);
    const works = selectedWorkOptions.length ? selectedWorkOptions : presetWorkOptions;
    const breaks = selectedBreakOptions.length ? selectedBreakOptions : presetBreakOptions;
    const sugg = [];
    works.forEach(w => breaks.forEach(b => {
      const maxC = Math.floor(total / (w + b));
      if (maxC > 0) sugg.push({ work: w, break: b, cycles: maxC, total: maxC * (w + b) });
    }));
    sugg.sort((a, b) => b.cycles - a.cycles);
    setGeneratedCycles(sugg.slice(0, 3));
    setFinished(false);
  };

  // avvia un nuovo ciclo con configurazione scelta
  const startCycle = ({ work, break: brk }) => {
    // salva la configurazione attiva
    setActiveConfig({ work, break: brk });
    setCurrentCycle(0);
    setCompletedCycles(0);
    setPhase('work');
    setTimeLeft(work * 60);
    setRunning(true);
    setFinished(false);

    // reset animazione
    const el = circleRef.current;
    el.style.animation = 'none';
    void el.offsetWidth;
    el.style.animation = `workGradient ${work * 60}s linear forwards`;
  };

  // gestione cambio fase work/break
  const nextPhase = () => {
    const { work, break: brk } = activeConfig;
    const dur = ((phase === 'work') ? brk : work) * 60;
    const el = circleRef.current;

    // reset animazione
    el.style.animation = 'none';
    void el.offsetWidth;
    // scegli animazione in base alla fase successiva
    if (phase === 'work') {
      el.style.animation = `breakGradient ${dur}s linear forwards`;
      setPhase('break');
      setTimeLeft(brk * 60);
    } else {
      el.style.animation = `workGradient ${dur}s linear forwards`;
      setCurrentCycle(c => c + 1);
      setCompletedCycles(c => c + 1);
      setPhase('work');
      setTimeLeft(work * 60);
    }

    // controlla fine sessione
    if (currentCycle + 1 >= (generatedCycles.find(c => c.work === work && c.break === brk)?.cycles || 0)) {
      setFinished(true);
      setRunning(false);
    }
  };

  // gestione countdown
  useEffect(() => {
    if (!running) return;
    const tick = () => setTimeLeft(prev => {
      if (prev <= 1) { nextPhase(); return 0; }
      return prev - 1;
    });
    intervalRef.current = setInterval(tick, 1000);
    return () => clearInterval(intervalRef.current);
  }, [running, phase, currentCycle, activeConfig]);

  // formato tempo
  const formatTime = secs =>
    `${String(Math.floor(secs / 60)).padStart(2, '0')}:${String(secs % 60).padStart(2, '0')}`;

  return (
    <div className={`pomodoro-root ${showConfig ? '' : 'config-closed'}`}>
      {/* timer */}
      <div className="timer-container">
        <button
          className={`gear-btn ${showConfig ? '' : 'rotated'}`}
          onClick={() => setShowConfig(!showConfig)}
        >
          <i className="bi bi-gear-fill" />
        </button>

        <div className="timer-section">
          <div ref={circleRef} className="timer-circle">
            <span className="timer-text">{formatTime(timeLeft)}</span>
          </div>
          <div className="phase-box">
            <strong>{phase === 'work' ? 'Studio' : 'Pausa'}</strong> – Ciclo {currentCycle + 1}
          </div>
          <div className="controls">
            <button onClick={() => setRunning(r => !r)}>{running ? '⏸️' : '▶️'}</button>
            <button onClick={() => setTimeLeft((phase === 'work' ? activeConfig.work : activeConfig.break) * 60)}>🔄</button>
            <button onClick={finished ? () => startCycle(activeConfig) : nextPhase}>
              {finished ? '⏮️' : '⏭️'}
            </button>
          </div>
        </div>
      </div>

      {/* configurazione */}
      <div className={`config-wrapper ${showConfig ? '' : 'collapsed'}`}>
        <div className="config-header">
          <h2>Configurazione Manuale</h2>
        </div>
        <div className="config-body">
          {/* input tempo totale */}
          <form className="row gx-2 align-items-center">
            <div className="col-auto">
              <label className="form-label mb-0">Tempo Totale</label>
              <input
                type="number"
                className="form-control form-control-sm"
                value={totalMinutes}
                onChange={e => setTotalMinutes(e.target.value.replace(/\D/g, ''))}
              />
            </div>
            <div className="col-auto">
              <button
                type="button"
                className="btn btn-sm btn-primary"
                onClick={generateCycles}
              >Genera</button>
            </div>
          </form>

          {/* opzioni lavoro */}
          <div className="mt-2">
            <div className="btn-group" role="group">
              {presetWorkOptions.map(w => {
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
                        setSelectedWorkOptions(prev =>
                          prev.includes(w)
                            ? prev.filter(x => x !== w)
                            : [...prev, w]
                        )
                      }
                    />
                    <label className="btn btn-sm btn-outline-primary" htmlFor={id}>{w}′</label>
                  </React.Fragment>
                );
              })}
            </div>
          </div>

          {/* opzioni pausa */}
          <div className="mt-2">
            <div className="btn-group" role="group">
              {presetBreakOptions.map(b => {
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
                        setSelectedBreakOptions(prev =>
                          prev.includes(b)
                            ? prev.filter(x => x !== b)
                            : [...prev, b]
                        )
                      }
                    />
                    <label className="btn btn-sm btn-outline-secondary" htmlFor={id}>{b}′</label>
                  </React.Fragment>
                );
              })}
            </div>
          </div>

          {/* suggerimenti generati */}
          {generatedCycles.length > 0 && (
            <div className="mt-3">
              {generatedCycles.map((c, i) => (
                <div key={i} className="cycle-suggestion">
                  <p>{c.cycles} cicli da: {c.work} minuti + {c.break} minuti = {c.total} minuti</p>
                  <button
                    className="btn btn-sm btn-outline-success"
                    onClick={() => startCycle({ work: c.work, break: c.break })}
                  >▶️</button>
                </div>
              ))}
            </div>
          )}
        </div>
      </div>
    </div>
  );
}

// EventModal.js completo con supporto completo a tutte le opzioni RRule (DAILY, WEEKLY, MONTHLY, YEARLY)

import { useState, useEffect } from "react";
import { RRule } from "rrule";

function EventModal({ show, onClose, onSave, onDelete, initialData, user }) {
  const [title, setTitle] = useState("");
  const [category, setCategory] = useState("");
  const [location, setLocation] = useState("");
  const [urgency, setUrgency] = useState("non urgente");
  const [start, setStart] = useState("");
  const [end, setEnd] = useState("");
  const [isRecurring, setIsRecurring] = useState(false);
  const [freq, setFreq] = useState("");
  const [interval, setInterval] = useState(1);
  const [byweekday, setByweekday] = useState([]);
  const [until, setUntil] = useState("");
  const [count, setCount] = useState("");
  const [monthlyMode, setMonthlyMode] = useState("bymonthday");
  const [bymonthday, setBymonthday] = useState("");
  const [bysetpos, setBysetpos] = useState("");
  const [byday, setByday] = useState("MO");
  const [bymonth, setBymonth] = useState("1");
  const [bymonthdayYearly, setBymonthdayYearly] = useState("1");
  const [color, setColor] = useState("#3788d8");
  const categories = user.settings.categoryEvents.split("/");

  useEffect(() => {
    if (initialData) {
      setTitle(initialData.title || "");
      setCategory(initialData.category || "");
      setLocation(initialData.location || "");
      setUrgency(initialData.urgency || "non urgente");
      setStart(initialData.begin || "");
      setEnd(initialData.end || "");
      setIsRecurring(initialData.isRecurring || false);
      setColor(initialData.color || "#3788d8");

      if (initialData.rruleStr) {
        const rule = RRule.fromString(initialData.rruleStr);
        const options = rule.origOptions;

        if (options.freq !== undefined)
          setFreq(RRule.FREQUENCIES[options.freq].toUpperCase());
        if (options.interval) setInterval(options.interval);
        if (options.until) setUntil(options.until.toISOString().split("T")[0]);
        if (options.count) setCount(options.count);

        if (options.byweekday) {
          const days = Array.isArray(options.byweekday)
            ? options.byweekday.map((d) => d.toString())
            : [options.byweekday.toString()];
          setByweekday(days);
          if (options.bysetpos) {
            setMonthlyMode("bysetpos");
            setBysetpos(options.bysetpos);
            setByday(days[0]);
          }
        }

        if (options.bymonthday && options.freq === RRule.MONTHLY) {
          setMonthlyMode("bymonthday");
          setBymonthday(options.bymonthday);
        }

        if (
          options.bymonth &&
          options.bymonthday &&
          options.freq === RRule.YEARLY
        ) {
          setBymonth(options.bymonth);
          setBymonthdayYearly(options.bymonthday);
        }
      }
    }
  }, [initialData]);

  const handleCheckboxChange = (day) => {
    setByweekday((prev) =>
      prev.includes(day) ? prev.filter((d) => d !== day) : [...prev, day]
    );
  };

  const buildRRuleString = () => {
    if (!freq) return null;
    const options = {
      freq: RRule[freq],
      interval: parseInt(interval),
      dtstart: new Date(start),
    };
    if (until) options.until = new Date(until);
    if (count) options.count = parseInt(count);

    if (freq === "WEEKLY" && byweekday.length > 0) {
      options.byweekday = byweekday.map((d) => RRule[d]);
    }

    if (freq === "MONTHLY") {
      if (monthlyMode === "bymonthday") {
        options.bymonthday = parseInt(bymonthday);
      } else if (monthlyMode === "bysetpos") {
        options.bysetpos = parseInt(bysetpos);
        options.byweekday = [RRule[byday]];
      }
    }

    if (freq === "YEARLY") {
      options.bymonth = parseInt(bymonth);
      options.bymonthday = parseInt(bymonthdayYearly);
    }

    const rule = new RRule(options);
    return rule.toString();
  };

  const handleSubmit = () => {
    const event = {
      title,
      category,
      location,
      urgency,
      begin: start,
      end: end,
      isRecurring,
      rruleStr: isRecurring ? buildRRuleString() : null,
      color,
    };
    onSave(event);
  };

  const confirmDelete = () => {
    if (window.confirm("Sei sicuro di voler eliminare questo evento?")) {
      onDelete();
    }
  };

  if (!show) return null;

  return (
    <div className="modal d-block" tabIndex="-1">
      <div className="modal-dialog">
        <div className="modal-content">
          <div className="modal-header">
            <h5 className="modal-title">
              {initialData?._id ? "Modifica Evento" : "Nuovo Evento"}
            </h5>
            <button
              type="button"
              className="btn-close"
              onClick={onClose}
            ></button>
          </div>
          <div className="modal-body">
            <div className="mb-3">
              <label className="form-label">Titolo</label>
              <input
                className="form-control"
                value={title}
                onChange={(e) => setTitle(e.target.value)}
              />
            </div>
            <div className="mb-3">
              <label className="form-label">Categoria</label>
              <select
                className="form-control"
                value={category}
                onChange={(e) => setCategory(e.target.value)}
              >
                {categories.map((category, index) => (
                  <option key={index} value={category}>
                    {category}
                  </option>
                ))}
              </select>
            </div>
            <div className="mb-3">
              <label className="form-label">Luogo</label>
              <input
                className="form-control"
                value={location}
                onChange={(e) => setLocation(e.target.value)}
              />
            </div>
            <div className="mb-3">
              <label className="form-label">Urgenza</label>
              <select
                className="form-select"
                value={urgency}
                onChange={(e) => setUrgency(e.target.value)}
              >
                <option value="urgente">Urgente</option>
                <option value="non troppo urgente">Non troppo urgente</option>
                <option value="non urgente">Non urgente</option>
              </select>
            </div>
            <div className="mb-3">
              <label className="form-label">Inizio</label>
              <input
                type="datetime-local"
                className="form-control"
                value={start}
                onChange={(e) => setStart(e.target.value)}
              />
            </div>
            <div className="mb-3">
              <label className="form-label">Fine</label>
              <input
                type="datetime-local"
                className="form-control"
                value={end}
                onChange={(e) => setEnd(e.target.value)}
              />
            </div>
            <div className="mb-3">
              <label className="form-label">Colore</label>
              <input
                type="color"
                className="form-control form-control-color"
                value={color}
                onChange={(e) => setColor(e.target.value)}
                title="Scegli il colore dell'evento"
              />
            </div>

            <div className="form-check mb-3">
              <input
                className="form-check-input"
                type="checkbox"
                checked={isRecurring}
                onChange={() => setIsRecurring(!isRecurring)}
                id="recurringCheck"
              />
              <label className="form-check-label" htmlFor="recurringCheck">
                Evento ricorrente
              </label>
            </div>

            {isRecurring && (
              <div className="border p-2">
                <div className="mb-2">
                  <label className="form-label">Frequenza</label>
                  <select
                    className="form-select"
                    value={freq}
                    onChange={(e) => setFreq(e.target.value)}
                  >
                    <option value="">Seleziona...</option>
                    <option value="DAILY">Giornaliera</option>
                    <option value="WEEKLY">Settimanale</option>
                    <option value="MONTHLY">Mensile</option>
                    <option value="YEARLY">Annuale</option>
                  </select>
                </div>

                <div className="mb-2">
                  <label className="form-label">
                    Ogni quanti {freq.toLowerCase()}?
                  </label>
                  <input
                    type="number"
                    min="1"
                    className="form-control"
                    value={interval}
                    onChange={(e) => setInterval(e.target.value)}
                  />
                </div>

                {freq === "WEEKLY" && (
                  <div className="mb-2">
                    <label className="form-label">Giorni della settimana</label>
                    <div className="d-flex flex-wrap gap-2">
                      {["MO", "TU", "WE", "TH", "FR", "SA", "SU"].map((day) => (
                        <div className="form-check" key={day}>
                          <input
                            className="form-check-input"
                            type="checkbox"
                            id={day}
                            checked={byweekday.includes(day)}
                            onChange={() => handleCheckboxChange(day)}
                          />
                          <label className="form-check-label" htmlFor={day}>
                            {day}
                          </label>
                        </div>
                      ))}
                    </div>
                  </div>
                )}

                {freq === "MONTHLY" && (
                  <div className="mb-2">
                    <label className="form-label">
                      Tipo di ricorrenza mensile
                    </label>
                    <select
                      className="form-select"
                      value={monthlyMode}
                      onChange={(e) => setMonthlyMode(e.target.value)}
                    >
                      <option value="bymonthday">
                        Giorno del mese (es. 15)
                      </option>
                      <option value="bysetpos">
                        Posizione nella settimana (es. 3º lunedì)
                      </option>
                    </select>
                  </div>
                )}

                {freq === "MONTHLY" && monthlyMode === "bymonthday" && (
                  <div className="mb-2">
                    <label className="form-label">Giorno del mese</label>
                    <input
                      type="number"
                      min="1"
                      max="31"
                      className="form-control"
                      value={bymonthday}
                      onChange={(e) => setBymonthday(e.target.value)}
                    />
                  </div>
                )}

                {freq === "MONTHLY" && monthlyMode === "bysetpos" && (
                  <div className="mb-2">
                    <label className="form-label">Settimana</label>
                    <input
                      type="number"
                      className="form-control"
                      value={bysetpos}
                      onChange={(e) => setBysetpos(e.target.value)}
                    />
                    <label className="form-label mt-2">
                      Giorno della settimana
                    </label>
                    <select
                      className="form-select"
                      value={byday}
                      onChange={(e) => setByday(e.target.value)}
                    >
                      {["MO", "TU", "WE", "TH", "FR", "SA", "SU"].map((d) => (
                        <option key={d} value={d}>
                          {d}
                        </option>
                      ))}
                    </select>
                  </div>
                )}

                {freq === "YEARLY" && (
                  <div className="mb-2">
                    <label className="form-label">Mese</label>
                    <select
                      className="form-select"
                      value={bymonth}
                      onChange={(e) => setBymonth(e.target.value)}
                    >
                      {[...Array(12)].map((_, i) => (
                        <option key={i + 1} value={i + 1}>
                          {i + 1}
                        </option>
                      ))}
                    </select>
                    <label className="form-label mt-2">Giorno del mese</label>
                    <input
                      type="number"
                      min="1"
                      max="31"
                      className="form-control"
                      value={bymonthdayYearly}
                      onChange={(e) => setBymonthdayYearly(e.target.value)}
                    />
                  </div>
                )}

                <div className="mb-2">
                  <label className="form-label">Fino al (opzionale)</label>
                  <input
                    type="date"
                    className="form-control"
                    value={until}
                    onChange={(e) => setUntil(e.target.value)}
                  />
                </div>
                <div className="mb-2">
                  <label className="form-label">Oppure dopo N occorrenze</label>
                  <input
                    type="number"
                    min="1"
                    className="form-control"
                    value={count}
                    onChange={(e) => setCount(e.target.value)}
                  />
                </div>
              </div>
            )}
          </div>
          <div className="modal-footer d-flex justify-content-between">
            <button
              type="button"
              className="btn btn-danger me-auto"
              onClick={confirmDelete}
              style={{ display: initialData?._id ? "inline-block" : "none" }}
            >
              Elimina
            </button>
            <div>
              <button
                type="button"
                className="btn btn-secondary me-2"
                onClick={onClose}
              >
                Annulla
              </button>
              <button
                type="button"
                className="btn btn-primary"
                onClick={handleSubmit}
              >
                Salva
              </button>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}

export default EventModal;

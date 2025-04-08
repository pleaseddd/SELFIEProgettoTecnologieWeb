import React, { useState, useEffect, use } from "react";
import { Temporal } from "@js-temporal/polyfill";
import "bootstrap/dist/css/bootstrap.min.css";
import EventModal from "./components/EventModal";
import EventView from "./components/EventView";

function Calendar({ user }) {
  const [today, setToday] = useState(null);
  const [currentMonth, setCurrentMonth] = useState(null);
  const [showModal, setShowModal] = useState(false);
  const [selectedDate, setSelectedDate] = useState(null);
  const [events, setEvents] = useState([]);
  const [selectedEvent, setSelectedEvent] = useState(null);
  const [showViewModal, setShowViewModal] = useState(false);
  const [editingEvent, setEditingEvent] = useState(null);

  const userId = user._id;

  useEffect(() => {
    const fetchServerTime = async () => {
      const res = await fetch("/api/server-time");
      const data = await res.json();
      const serverNow = Temporal.Instant.from(data.now);
      const serverDate = serverNow.toZonedDateTimeISO("UTC").toPlainDate();

      setToday(serverDate);
      setCurrentMonth(serverDate.with({ day: 1 }));
    };

    fetchServerTime();
  }, []);

  useEffect(() => {
    const fetchEvents = async () => {
      try {
        const res = await fetch("/events", {
          method: "POST",
          headers: { "Content-Type": "application/json" },
          body: JSON.stringify({ userid: userId }),
        });

        if (res.ok) {
          const data = await res.json();
          setEvents(data);
        } else {
          console.error("Errore nel caricamento eventi");
        }
      } catch (err) {
        console.error(err);
      }
    };

    if (userId) fetchEvents();
  }, [userId]);

  const openModal = (date) => {
    setSelectedDate(date);
    setShowModal(true);
  };

  // Crea evento
  const handleSave = async (formData) => {
    const payload = {
      ...formData,
      repetition: {
        frequency: formData.repetition?.frequency || undefined,
        until: formData.repetition?.until || undefined,
      },
      userid: userId,
    };

    const endpoint = formData._id ? "/updateevent" : "/newevent";

    try {
      const response = await fetch(endpoint, {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify(payload),
      });

      const data = await response.json();

      if (response.ok) {
        alert(
          formData._id ? "Evento aggiornato!" : "Evento creato con successo!"
        );
        setShowModal(false);

        if (formData._id) {
          // aggiorna evento modificato
          setEvents((prev) =>
            prev.map((e) => (e._id === formData._id ? data : e))
          );
        } else {
          // aggiungi nuovo evento
          setEvents((prev) => [...prev, data]);
        }
      } else {
        alert("Errore: " + data.message);
      }
    } catch (err) {
      alert("Errore di connessione");
    }
  };

  //Elimina evento
  const handleDelete = async (event) => {
    try {
      const response = await fetch("/deleteevent", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ _id: event._id, author: userId }),
      });

      const data = await response.json();

      if (response.ok) {
        alert("Evento eliminato");
        setEvents((prev) => prev.filter((e) => e._id !== event._id));
        setShowViewModal(false);
      } else {
        alert("Errore: " + data.message);
      }
    } catch (err) {
      alert("Errore di connessione");
    }
  };

  // Modifica evento
  const handleEdit = (event) => {
    const dateBegin = Temporal.Instant.from(event.begin).toZonedDateTimeISO(
      "UTC"
    );
    const dateEnd = Temporal.Instant.from(event.end).toZonedDateTimeISO("UTC");

    const initialData = {
      ...event,
      begin: dateBegin.toPlainDateTime().toString().slice(0, 16),
      end: dateEnd.toPlainDateTime().toString().slice(0, 16),
      repetition: {
        frequency: event.repetition?.frequency || "",
        until: event.repetition?.until
          ? event.repetition.until.slice(0, 10)
          : "",
      },
    };

    setShowViewModal(false);
    setTimeout(() => {
      setSelectedDate(dateBegin.toPlainDate().toString());
      setShowModal(true);
      setEditingEvent(initialData);
    }, 200);
  };

  const getCalendarDays = () => {
    const startDay = currentMonth;
    const endDay = currentMonth
      .add({ months: 1 })
      .with({ day: 1 })
      .subtract({ days: 1 });
    const startWeekDay = startDay.dayOfWeek % 7;
    const days = [];

    for (let i = 0; i < startWeekDay; i++) {
      days.push(null);
    }

    for (let d = 1; d <= endDay.day; d++) {
      days.push(currentMonth.with({ day: d }));
    }

    return days;
  };

  const prevMonth = () => setCurrentMonth(currentMonth.subtract({ months: 1 }));
  const nextMonth = () => setCurrentMonth(currentMonth.add({ months: 1 }));

  if (!currentMonth || !today)
    return <div className="text-center mt-5">Caricamento calendario...</div>;

  const days = getCalendarDays();
  const weeks = [];
  const filteredEvents = events.filter((e) => {
    const eventDate = Temporal.Instant.from(e.begin)
      .toZonedDateTimeISO("UTC")
      .toPlainDate();
    return (
      eventDate.month === currentMonth.month &&
      eventDate.year === currentMonth.year
    );
  });

  for (let i = 0; i < days.length; i += 7) {
    weeks.push(days.slice(i, i + 7));
  }

  return (
    <div className="container mt-5">
      <h3 className="text-center mb-3">
        {currentMonth.toLocaleString("it-IT", { month: "long" })}{" "}
        {currentMonth.year}
      </h3>

      <div className="d-flex justify-content-between mb-2">
        <button className="btn btn-outline-primary" onClick={prevMonth}>
          ← Mese Precedente
        </button>
        <button className="btn btn-outline-primary" onClick={nextMonth}>
          Mese Successivo →
        </button>
      </div>

      <table className="table table-bordered text-center">
        <thead>
          <tr>
            {["Dom", "Lun", "Mar", "Mer", "Gio", "Ven", "Sab"].map((d) => (
              <th key={d}>{d}</th>
            ))}
          </tr>
        </thead>
        <tbody>
          {weeks.map((week, idx) => (
            <tr key={idx}>
              {week.map((day, i) => (
                <td
                  key={i}
                  className={
                    day && day.equals(today)
                      ? "bg-info text-white fw-bold align-top"
                      : "align-top"
                  }
                  style={{
                    height: "100px",
                    verticalAlign: "top",
                    overflow: "hidden",
                    fontSize: "0.8rem",
                    padding: "4px",
                    cursor: day ? "pointer" : "default",
                  }}
                  onClick={() => day && openModal(day.toString())}
                >
                  <div className="fw-bold">{day ? day.day : ""}</div>
                  {day &&
                    filteredEvents
                      .filter((ev) =>
                        Temporal.Instant.from(ev.begin)
                          .toZonedDateTimeISO("UTC")
                          .toPlainDate()
                          .equals(day)
                      )
                      .map((ev, idx) => (
                        <div
                          key={idx}
                          className="badge bg-primary text-truncate d-block w-100 mt-1"
                          title={ev.title}
                          onClick={(e) => {
                            e.stopPropagation();
                            setSelectedEvent(ev);
                            setShowViewModal(true);
                          }}
                        >
                          {ev.title.length > 20 ? ev.title.slice(0, 17) + "..." : ev.title}
                        </div>
                      ))}
                </td>
              ))}
            </tr>
          ))}
        </tbody>
      </table>

      <EventModal
        show={showModal}
        handleClose={() => {
          setShowModal(false);
          setEditingEvent(null);
        }}
        onSave={handleSave}
        initialData={
          editingEvent || {
            title: "",
            category: "",
            location: "",
            begin: selectedDate ? `${selectedDate}T09:00` : "",
            end: selectedDate ? `${selectedDate}T10:00` : "",
            repetition: { frequency: "", until: "" },
          }
        }
      />

      <EventView
        show={showViewModal}
        event={selectedEvent}
        onClose={() => setShowViewModal(false)}
        onEdit={handleEdit}
        onDelete={handleDelete}
      />
    </div>
  );
}

export default Calendar;

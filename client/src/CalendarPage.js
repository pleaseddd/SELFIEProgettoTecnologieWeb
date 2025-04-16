import { useState, useEffect, useMemo, useCallback } from "react";
import { Calendar, dateFnsLocalizer } from "react-big-calendar";
import "react-big-calendar/lib/css/react-big-calendar.css";
import "bootstrap/dist/css/bootstrap.min.css";
import { RRule } from "rrule";
import { Temporal } from "@js-temporal/polyfill";
import EventModal from "./components/EventModal";

import { format, parse, startOfWeek, getDay } from "date-fns";
import it from "date-fns/locale/it";

const locales = {
  "it-IT": it,
};

const localizer = dateFnsLocalizer({
  format,
  parse,
  startOfWeek,
  getDay,
  locales,
});

function toLocalInput(date) {
  const local = new Date(date);
  local.setMinutes(local.getMinutes() - local.getTimezoneOffset());
  return local.toISOString().slice(0, 16);
}




function CalendarPage({ user }) {
  const [events, setEvents] = useState([]);
  const [serverTime, setServerTime] = useState(null);
  const [modalOpen, setModalOpen] = useState(false);
  const [modalData, setModalData] = useState(null);
  const [isEditing, setIsEditing] = useState(false);

  useEffect(() => {
    fetch("/api/server-time")
      .then((res) => res.json())
      .then((data) => {
        const serverNow = Temporal.Instant.from(data.now);
        setServerTime(serverNow);
      })
      .catch((err) => {
        console.error("Errore nel recupero orario dal server:", err);
      });
  }, []);
  const loadEvents = async () => {
    try {
      const response = await fetch("/events", {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify({ userid: user._id }),
      });
      const data = await response.json();
      if (response.ok) {
        const allEvents = [];
        if (!serverTime) return; 
        const now = serverTime.toZonedDateTimeISO("UTC");
        const oneYearLater = now.add({ years: 1 });

        data.forEach((event) => {
          if (!event.begin || !event.end) return;

          if (event.rruleStr) {
            const rule = RRule.fromString(event.rruleStr);
            const dates = rule.between(
              new Date(now.toInstant().epochMilliseconds),
              new Date(oneYearLater.toInstant().epochMilliseconds),
              true
            );
            dates.forEach((date) => {
              const begin = Temporal.Instant.from(date.toISOString());
              const originalBegin = Temporal.Instant.from(event.begin);
              const originalEnd = Temporal.Instant.from(event.end);
              const duration = originalEnd.since(originalBegin);
              const end = begin.add(duration);
              allEvents.push({
                ...event,
                start: new Date(begin.epochMilliseconds),
                end: new Date(end.epochMilliseconds),
              });
            });
          } else {
            allEvents.push({
              ...event,
              start: new Date(
                Temporal.Instant.from(event.begin).epochMilliseconds
              ),
              end: new Date(Temporal.Instant.from(event.end).epochMilliseconds),
            });
          }
        });
        setEvents(allEvents);
      } else {
        alert("Errore durante il recupero degli eventi");
      }
    } catch (error) {
      console.error("Errore durante il recupero degli eventi:", error);
    }
  };

  
  useEffect(() => {
    if (serverTime) {
      loadEvents();
    }
  }, [serverTime]);
  
  const handleSelectSlot = useCallback((slotInfo) => {
    const start = new Date(slotInfo.start);
    const end = new Date(slotInfo.end - 1);

    if (start.toDateString() === end.toDateString() && (end.getTime()-start.getTime()) > 23 * 60 * 60 * 1000) {
      start.setHours(9, 0, 0, 0);
      end.setHours(10, 0, 0, 0);
    }else if (start.toDateString() === end.toDateString()) {
      end.setTime(end.getTime() +1);
    }

    setModalData({
      begin: toLocalInput(start),
      end: toLocalInput(end),
    });
    setIsEditing(false);
    setModalOpen(true);
  }, []);

  const handleSelectEvent = useCallback((event) => {
    const beginDate = new Date(event.start);
    const endDate = new Date(event.end);

    setModalData({
      ...event,
      begin: toLocalInput(beginDate),
      end: toLocalInput(endDate),
    });
    setIsEditing(true);
    setModalOpen(true);
  }, []);

  const handleModalSave = async (eventData) => {
    const localBegin = new Date(eventData.begin);
    const localEnd = new Date(eventData.end);
    try {
      const payload = {
        ...eventData,
        begin: localBegin.toISOString(),
        end: localEnd.toISOString(),
        _id: modalData?._id,
        userid: user._id,
      };

      const url = isEditing ? "/updateevent" : "/newevent";

      const response = await fetch(url, {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify(payload),
      });
      const data = await response.json();

      if (response.ok) {
        setModalOpen(false);
        loadEvents();
      } else {
        alert("Errore durante il salvataggio dell'evento");
        console.error(data);
      }
    } catch (error) {
      console.error("Errore nella richiesta di salvataggio:", error);
    }
  };

  const handleModalDelete = async () => {
    try {
      const response = await fetch("/deleteevent", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ _id: modalData._id, author: user._id }),
      });
      const data = await response.json();

      if (response.ok) {
        setModalOpen(false);
        loadEvents();
      } else {
        alert("Errore durante l'eliminazione dell'evento");
        console.error(data);
      }
    } catch (error) {
      console.error("Errore durante l'eliminazione:", error);
    }
  };

  return (
    <div className="container mt-3">
      <h2 className="text-center">Calendario</h2>
      <Calendar
        localizer={localizer}
        events={events}
        startAccessor="start"
        endAccessor="end"
        selectable
        style={{ height: "80vh" }}
        onSelectSlot={handleSelectSlot}
        onSelectEvent={handleSelectEvent}
        views={["month", "week", "day"]}
        popup
        timeslots={2}
        step={30}
        culture="it-IT"
        formats={{ timeGutterFormat: "HH:mm" }}
        eventPropGetter={(event) => ({
          style: {
            backgroundColor: event.color || "#3788d8",
            color: "white",
            borderRadius: "5px",
          },
        })}
      />
      <EventModal
        show={modalOpen}
        user={user}
        onClose={() => setModalOpen(false)}
        onSave={handleModalSave}
        onDelete={handleModalDelete}
        initialData={modalData}
      />
    </div>
  );
}

export default CalendarPage;

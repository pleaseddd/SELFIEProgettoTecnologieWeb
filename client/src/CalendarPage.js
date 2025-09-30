import { useState, useEffect, useCallback, useMemo } from "react";
import { Calendar, dateFnsLocalizer } from "react-big-calendar";
import "react-big-calendar/lib/css/react-big-calendar.css";
import "bootstrap/dist/css/bootstrap.min.css";
import { RRule } from "rrule";
import { Temporal } from "@js-temporal/polyfill";
import EventModal from "./components/EventModal";
import { useNavigate } from "react-router-dom";
import { format, parse, startOfWeek, getDay } from "date-fns";
import it from "date-fns/locale/it";
import ConfirmModal from "./components/ConfirmModal";

const locales = { "it-IT": it };

// Funzione per convertire le date in input locale
function toLocalInput(date) {
  const local = new Date(date);
  local.setMinutes(local.getMinutes() - local.getTimezoneOffset());
  return local.toISOString().slice(0, 16);
}


function CalendarPage({ user }) {
  // Fuso orario utente 
  const userTz = user.settings.position || "Europe/Rome";

  // Configurazione del localizzatore per react-big-calendar
  const localizer = useMemo(() => {
    return dateFnsLocalizer({
      format,
      parse,
      getDay,
      locales,
      startOfWeek: (date, options) => {
        const weekStartsOn = user.settings.startDay ? 0 : 1;
        return startOfWeek(date, { ...options, weekStartsOn });
      },
    });
  }, [user.settings.startDay]);
  // Navigazione tra le pagine
  const navigate = useNavigate();

  //State per le varie funzionalità
  const [currentDate, setCurrentDate] = useState(new Date());
  const [events, setEvents] = useState([]);
  const [serverTime, setServerTime] = useState(null);
  const [modalOpen, setModalOpen] = useState(false);
  const [modalData, setModalData] = useState(null);
  const [isEditing, setIsEditing] = useState(false);
  const [showPomodoroConfirm, setShowPomodoroConfirm] = useState(false);
  const [pomodoroData, setPomodoroData] = useState(null);
  const [selectedEvent, setSelectedEvent] = useState(null);
  // Flag per il controllo delle modifiche dell'orario server (time machine)
  const [timeMachineFlag, setTimeMachineFlag] = useState(0);

  // Recupera l'orario del server ogni volta che cambia il flag (time machine)
  useEffect(() => {
    fetch("/api/server-time")
      .then((res) => res.json())
      .then((data) => {
        const serverNow = Temporal.Instant.from(data.now);
        setServerTime(serverNow);
        setCurrentDate(new Date(serverNow.epochMilliseconds));
      })
      .catch((err) => {
        console.error("Errore nel recupero orario dal server:", err);
      });
  }, [timeMachineFlag]);

  //Gestione per vedere modifiche orario server (time machine)
  useEffect(() => {
    const checkForServerTimeUpdate = async () => {
      try {
        const res = await fetch("/api/server-time/flag");
        const data = await res.json();
        if (data.flag !== timeMachineFlag) {
          setTimeMachineFlag(data.flag);
        }
      } catch (err) {
        console.error("Errore nel controllo aggiornamento orario:", err);
      }
    };
    //controllo ogni secondo se c'è stato un cambiamento e nel caso aggiorno
    const interval = setInterval(checkForServerTimeUpdate, 1000);
    checkForServerTimeUpdate();
    return () => clearInterval(interval);
  }, []);

  // Carica gli eventi dal server
  const loadEvents = useCallback(async () => {
    try {
      const response = await fetch("/api/events/list", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ userid: user._id }),
      });
      const data = await response.json();
      // Converto gli orari in Date oggetti nel fuso orario utente
      if (response.ok) {
        const allEvents = [];
        if (!serverTime) return;
        const now = serverTime.toZonedDateTimeISO("UTC");
        const oneYearLater = now.add({ years: 1 });

        data.forEach((event) => {
          if (!event.begin || !event.end) return;
          //Mostro le ricorrenze fino all'anno successivo prendeno i dati dalla RRULE string 
          if (event.rruleStr) {
            const rule = RRule.fromString(event.rruleStr);
            const dates = rule.between(
              new Date(now.toInstant().epochMilliseconds),
              new Date(oneYearLater.toInstant().epochMilliseconds),
              true
            );
            // Aggiungo gli eventi ricorrenti all'array
            dates.forEach((date) => {
              const beginInstant = Temporal.Instant.from(date.toISOString());
              const originalBegin = Temporal.Instant.from(event.begin);
              const originalEnd = Temporal.Instant.from(event.end);
              const duration = originalEnd.since(originalBegin);
              const endInstant = beginInstant.add(duration);

              const zonedBegin = beginInstant.toZonedDateTimeISO(userTz);
              const zonedEnd = endInstant.toZonedDateTimeISO(userTz);

              allEvents.push({
                ...event,
                start: new Date(zonedBegin.epochMilliseconds),
                end: new Date(zonedEnd.epochMilliseconds),
              });
            });
          } else {
            const begin = Temporal.Instant.from(event.begin).toZonedDateTimeISO(userTz);
            const end = Temporal.Instant.from(event.end).toZonedDateTimeISO(userTz);
            allEvents.push({
              ...event,
              start: new Date(begin.epochMilliseconds),
              end: new Date(end.epochMilliseconds),
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
  }, [serverTime, user._id, userTz]);

  // Ricarica gli eventi quando il serverTime viene impostato
  useEffect(() => {
    if (serverTime) {
      loadEvents();
    }
  }, [serverTime, loadEvents]);

  // Gestione selezione slot per creare un nuovo evento
  const handleSelectSlot = useCallback((slotInfo) => {
    const start = new Date(slotInfo.start);
    const end = new Date(slotInfo.end - 1);

    if (
      // controllo se l'evento dura meno di un giorno ma inizia e finisce lo stesso giorno
      start.toDateString() === end.toDateString() &&
      end.getTime() - start.getTime() > 23 * 60 * 60 * 1000
    ) {
      //evento che dura meno di un giorno ma inizia e finisce lo stesso giorno
      start.setHours(9, 0, 0, 0);
      end.setHours(10, 0, 0, 0);
    } else if (start.toDateString() === end.toDateString()) {
      //evento che inizia e finisce lo stesso giorno ma dura tutto il giorno
      end.setTime(end.getTime() + 1);
    }

    setModalData({
      begin: toLocalInput(start),
      end: toLocalInput(end),
    });
    setIsEditing(false);
    setModalOpen(true);
  }, []);

  // Gestione per il redirect alla pagina pomodoro nel caso sia un evento pomodoro
  const handlePomodoroRedirect = () => {
    setShowPomodoroConfirm(false);
    navigate("/pomodoro", {
      state: {
        work: pomodoroData.work,
        break: pomodoroData.break,
        duration: pomodoroData.duration,
      },
    });
  };

  // Gestione selezione evento per modifica o avvio pomodoro nel caso sia un evento pomodoro
  const handleSelectEvent = useCallback((event) => {
    if (event.pomodoro?.on === true) {
      setPomodoroData({
        work: event.pomodoro.workoption,
        break: event.pomodoro.breakoption,
        duration: event.pomodoro.duration,
      });
      setSelectedEvent(event);
      setShowPomodoroConfirm(true);
    } else {
      const beginDate = new Date(event.start);
      const endDate = new Date(event.end);
      setModalData({
        ...event,
        begin: toLocalInput(beginDate),
        end: toLocalInput(endDate),
      });
      setIsEditing(true);
      setModalOpen(true);
    }
  }, []);

  // Gestione salvataggio evento (nuovo o modificato)
  const handleModalSave = async (eventData) => {
    try {
      const localBegin = new Date(eventData.begin);
      const localEnd = new Date(eventData.end);

      // Interpreta come orari nel timezone utente
      const zonedBegin = Temporal.ZonedDateTime.from({
        timeZone: userTz,
        year: localBegin.getFullYear(),
        month: localBegin.getMonth() + 1,
        day: localBegin.getDate(),
        hour: localBegin.getHours(),
        minute: localBegin.getMinutes(),
      });
      const zonedEnd = Temporal.ZonedDateTime.from({
        timeZone: userTz,
        year: localEnd.getFullYear(),
        month: localEnd.getMonth() + 1,
        day: localEnd.getDate(),
        hour: localEnd.getHours(),
        minute: localEnd.getMinutes(),
      });

      const payload = {
        ...eventData,
        begin: zonedBegin.toInstant().toString(), // UTC coerente con fuso utente
        end: zonedEnd.toInstant().toString(),
        _id: modalData?._id,
        author: user._id,
      };

      // Determina l'endpoint in base a se è una modifica o un nuovo evento
      const url = "/api/events" + (isEditing ? "/update" : "/new");

      const response = await fetch(url, {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify(payload),
      });
      const data = await response.json();

      if (response.ok) {
        setModalOpen(false);
        // Ricarico gli eventi dopo il salvataggio
        loadEvents();
      } else {
        alert("Errore durante il salvataggio dell'evento");
        console.error(data);
      }
    } catch (error) {
      console.error("Errore nella richiesta di salvataggio:", error);
    }
  };

  //Gestione eliminazione evento 
  const handleModalDelete = async () => {
    try {
      const response = await fetch("/api/events/delete", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ _id: modalData._id, author: user._id }),
      });
      const data = await response.json();

      if (response.ok) {
        setModalOpen(false);
        // Ricarico gli eventi dopo l'eliminazione
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
      {/* Mostra il calendario solo quando l'orario del server è stato caricato così da renderlo coerente con la time machine */}
      {serverTime ? (
        <Calendar
          localizer={localizer}
          events={events}
          startAccessor="start"
          endAccessor="end"
          selectable
          date={currentDate}
          onNavigate={(newDate) => setCurrentDate(newDate)}
          getNow={() => new Date(serverTime.epochMilliseconds)}
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
      ) : (
        <div>Caricamento orario dal server...</div>
      )}

      {/* Modale per creare/modificare eventi */}
      <EventModal
        show={modalOpen}
        user={user}
        onClose={() => setModalOpen(false)}
        onSave={handleModalSave}
        onDelete={handleModalDelete}
        initialData={modalData}
      />
      {/* Modale di conferma per evento pomodoro o modifica*/}
      <ConfirmModal
        show={showPomodoroConfirm}
        title="Evento Pomodoro"
        body="Vuoi avviare il timer Pomodoro o modificare l'evento?"
        confirmText="Vai al Pomodoro"
        cancelText="Modifica Evento"
        onConfirm={handlePomodoroRedirect}
        onCancel={() => {
          setShowPomodoroConfirm(false);
          if (!selectedEvent) return;

          setModalData({
            ...selectedEvent,
            begin: toLocalInput(new Date(selectedEvent.start)),
            end: toLocalInput(new Date(selectedEvent.end)),
          });
          setIsEditing(true);
          setModalOpen(true);
        }}
        onClose={() => {
          setShowPomodoroConfirm(false);
          if (!selectedEvent) return;
        }}
      />
    </div>
  );
}

export default CalendarPage;

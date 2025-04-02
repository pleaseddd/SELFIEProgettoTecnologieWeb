/* import { BrowserRouter as Router, Routes, Route, Navigate } from "react-router-dom";
import "bootstrap/dist/css/bootstrap.min.css";
import "bootstrap/dist/js/bootstrap.bundle.min.js";
import { useState } from "react";




function CalendarPage (){

    return (
        <div>
            <h1>Calendar</h1>
        </div>
    );
}

export default CalendarPage;

 */

import React, { useState, useEffect } from 'react';
import { Temporal } from '@js-temporal/polyfill';
import 'bootstrap/dist/css/bootstrap.min.css';

function Calendar() {
  const [today, setToday] = useState(null);
  const [currentMonth, setCurrentMonth] = useState(null);

  useEffect(() => {
    const fetchServerTime = async () => {
      const res = await fetch('/api/server-time');
      const data = await res.json();
      const serverNow = Temporal.Instant.from(data.now);
      const serverDate = serverNow.toZonedDateTimeISO('UTC').toPlainDate();

      setToday(serverDate);
      setCurrentMonth(serverDate.with({ day: 1 }));
    };

    fetchServerTime();
  }, []);

  if (!currentMonth || !today) return <div className="text-center mt-5">Caricamento calendario...</div>;

  const getCalendarDays = () => {
    const startDay = currentMonth;
    const endDay = currentMonth.add({ months: 1 }).with({ day: 1 }).subtract({ days: 1 });
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

  const days = getCalendarDays();
  const weeks = [];

  for (let i = 0; i < days.length; i += 7) {
    weeks.push(days.slice(i, i + 7));
  }

  return (
    <div className="container mt-5">
      <h3 className="text-center mb-3">
        {currentMonth.toLocaleString('it-IT', { month: 'long' })} {currentMonth.year}
      </h3>
      <div className="d-flex justify-content-between mb-2">
        <button className="btn btn-outline-primary" onClick={prevMonth}>← Mese Precedente</button>
        <button className="btn btn-outline-primary" onClick={nextMonth}>Mese Successivo →</button>
      </div>
      <table className="table table-bordered text-center">
        <thead>
          <tr>
            {['Dom', 'Lun', 'Mar', 'Mer', 'Gio', 'Ven', 'Sab'].map(d => <th key={d}>{d}</th>)}
          </tr>
        </thead>
        <tbody>
          {weeks.map((week, idx) => (
            <tr key={idx}>
              {week.map((day, i) => (
                <td
                  key={i}
                  className={day && day.equals(today) ? 'bg-info text-white fw-bold' : ''}
                >
                  {day ? day.day : ''}
                </td>
              ))}
            </tr>
          ))}
        </tbody>
      </table>
    </div>
  );
}

export default Calendar;

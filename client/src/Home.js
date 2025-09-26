import React from "react";
import "./style/home.css";
import NotesCarousel from "./components/home/NotesCarousel.js";
import Weather from "./components/home/Weather.js";
import CalendarCarousel from "./components/home/CalendarCarousel.js";
import LastPomodoro from "./components/home/LastPomodoro.js";

function Home({ user }) {
  return (
    <div className="home-root">
      <CalendarCarousel user={user} />
      <Weather />
      <NotesCarousel user={user} />
      <LastPomodoro user={user} />
    </div>
  );
}

export default Home;

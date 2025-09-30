import "./style/home.css";
import NotesCarousel from "./components/home/NotesCarousel.js";
import Weather from "./components/home/Weather.js";
import CalendarCarousel from "./components/home/CalendarCarousel.js";
import LastPomodoro from "./components/home/LastPomodoro.js";

function Home({ user }) {
  return (
    <div className="home-root">
      <div className="parent">
        <div className="div2">
          <Weather user={user} />
        </div>
        <div className="div1">
          <NotesCarousel user={user} />
        </div>
        <div className="div4">
          <CalendarCarousel user={user} />
        </div>
        <div className="div3">
          <LastPomodoro user={user} />
        </div>
      </div>
    </div>
  );
}

export default Home;

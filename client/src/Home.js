import NotesCarousel from "./components/home/NotesCarousel.js";
import Weather from "./components/home/Weather.js";
import CalendarCarousel from "./components/home/CalendarCarousel.js";

function Home({ user }) {
  return (
	<div
      style={{
        margin: 0,
        padding: 0,
        backgroundColor: "#586ba4",
        minHeight: "100vh",
        width: "100%",
        overflowX: "hidden",
      }}
    >
      <CalendarCarousel user={user} />
      <Weather />
      <NotesCarousel user={user} />
	</div>
  );
}

export default Home;

import { useState } from 'react';
import NotesCarousel from "./components/home/NotesCarousel.js";
import Weather from "./components/home/Weather.js";
import CalendarCarousel from "./components/home/CalendarCarousel.js";

function Home({ user }) {
	const [gevents, setGevents] = useState([]);

	const handleGetEvents = async () => {
		const resp = await fetch('/google/events', {
			method: 'POST',
			headers: { 'content-type': 'application/json' },
			body: JSON.stringify({ googleTokens: user.google.tokens })
		}).then(resp => resp.json());
		setGevents(resp);
	};

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

      <button onClick={handleGetEvents}>
	      Mostra eventi
      </button>

	<div>
		{
			gevents.map(event => (
				<div key={event.id}>{event.summary}</div>
			))
		}
		</div>

    </div>
  );
}

export default Home;

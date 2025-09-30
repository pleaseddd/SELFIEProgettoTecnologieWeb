import { useEffect, useState } from "react";
import { Card, Spinner } from "react-bootstrap";
import {
  WiDaySunny, WiDayCloudy, WiCloud, WiFog, WiShowers,
  WiRain, WiSnow, WiThunderstorm, WiNa
} from "react-icons/wi";

function Weather() {
  const [weather, setWeather] = useState(null);
  const [error, setError] = useState("");

  useEffect(() => {
    const fetchWeather = async () => {
      try {
        // Ottieni la posizione approssimativa
        const geoRes = await fetch("https://api.ipgeolocation.io/ipgeo?apiKey=ae48adddb3f64feb984decd7b4299e7b");
        const geoData = await geoRes.json();
        const { latitude, longitude } = geoData;

        // Chiede all'API del meteo le condizioni attuali a seconda di latitudine e longitudine
        const weatherRes = await fetch(
			`https://api.open-meteo.com/v1/forecast?latitude=${latitude}&longitude=${longitude}&current_weather=true&daily=temperature_2m_max,temperature_2m_min&timezone=Europe%2FRome`
		  );
        const weatherData = await weatherRes.json();
        setWeather({
          now: weatherData.current_weather,
        });
      } catch (err) {
        console.error("Errore meteo:", err);
        setError("Meteo non disponibile.");
      }
    };

    fetchWeather();
  }, []);

  const getWeatherIcon = (code) => {
    // Mappa i codici meteo alle icone corrispondenti
    switch (code) {
      case 0: return <WiDaySunny size={48} />;
      case 1:
      case 2: return <WiDayCloudy size={48} />;
      case 3: return <WiCloud size={48} />;
      case 45:
      case 48: return <WiFog size={48} />;
      case 51:
      case 53:
      case 55: return <WiShowers size={48} />;
      case 61:
      case 63:
      case 65: return <WiRain size={48} />;
      case 71:
      case 73:
      case 75: return <WiSnow size={48} />;
      case 95:
      case 96:
      case 99: return <WiThunderstorm size={48} />;
      default: return <WiNa size={48} />;
    }
  };

  return (
    <Card className="text-center shadow-sm mx-auto" style={{ maxWidth: "300px" }}>
      <Card.Body>
        {error ? (
          <Card.Text>{error}</Card.Text>
        ) : weather ? (
          <>
            <div>{getWeatherIcon(weather.now.weathercode)}</div>
            <Card.Text className="mb-1 fs-4">{weather.now.temperature}°C</Card.Text>
          </>
        ) : (
          <Spinner animation="border" variant="primary" />
        )}
      </Card.Body>
    </Card>
  );
}

export default Weather;

import { Card } from "react-bootstrap";
import { useState, useEffect } from "react";
import { useNavigate } from "react-router-dom";
function LastPomodoro({ user }) {
  const navigate = useNavigate();
  const [ultimoPomodoro, setUltimoPomodoro] = useState({
    total: 0,
    work: 0,
    break: 0,
    date: null,
  });

  useEffect(() => {
    const fetchNotes = async () => {
      try {
        const response = await fetch("/api/user/info", {
          method: "POST",
          headers: {
            "Content-Type": "application/json",
          },
          body: JSON.stringify({ id: user._id }),
        });
        const data = await response.json();
        if (response.ok) {
          setUltimoPomodoro({
            total: data.lastPomodoroSession.total,
            work: data.lastPomodoroSession.work,
            break: data.lastPomodoroSession.break,
            date: new Date(
              data.lastPomodoroSession.updatedAt
            ).toLocaleDateString("it-IT", {
              day: "2-digit",
              month: "2-digit",
              year: "numeric",
            }),
          });
        } else {
          alert(data.message);
        }
      } catch (error) {
        console.error("Errore durante il recupero:", error);
      }
    };

    fetchNotes();
  }, [user._id]);

  return (
    <div
      className="d-flex justify-content-center align-items-center w-100 mt-4"
      onClick={() => navigate("/Pomodoro")}
      style={{ cursor: "pointer" }}
    >
      <Card
        className="shadow-sm rounded-3 border-0"
        style={{ width: "100%", maxWidth: "400px" }}
      >
        <Card.Body>
          <Card.Title className="text-center mb-3">
            Ultimo Pomodoro {ultimoPomodoro.date}
          </Card.Title>
          <Card.Text className="text-center">
            <strong>Minuti totali:</strong> {ultimoPomodoro.total} <br />
            <strong>Sessione di lavoro:</strong> {ultimoPomodoro.work} <br />
            <strong>Minuti di pausa:</strong> {ultimoPomodoro.break}
          </Card.Text>
        </Card.Body>
      </Card>
    </div>
  );
}

export default LastPomodoro;

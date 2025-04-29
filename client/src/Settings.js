import { useState, useEffect } from "react";
import {
  Container,
  Row,
  Col,
  Form,
  Button,
  Card,
  Image,
} from "react-bootstrap";
import ConfirmModal from "./components/ConfirmModal";

function Settings({ user, updateUser }) {
  const [form, setForm] = useState({
    name: user.name,
    email: user.email,
    eventCategories: user.settings.categoryEvents.split("/") || [],
    noteCategories: user.settings.categoryNotes.split("/") || [],
    language: user.settings.language,
    weekStart: user.settings.startDay ? "sunday" : "monday",
    location: user.settings.position,
    notesInHome: user.settings.homeNotes,
  });

  const [newEventCat, setNewEventCat] = useState("");
  const [newNoteCat, setNewNoteCat] = useState("");

  const [notifDevices, setNotifDevices] = useState(null);

  useEffect(() => {
	async function getNotifDevices() {
		const devices = await fetch('/listsubs', {
			method: 'POST',
			headers: { 'content-type': 'application/json' },
			body: JSON.stringify({ user_id: user._id })
		}).then(resp => resp.json());
		setNotifDevices(devices);
	}
	getNotifDevices();
   }, []);

  // Modal per conferma
  const [showConfirm, setShowConfirm] = useState(false);
  const [loading, setLoading] = useState(false);
  const openConfirm = () => setShowConfirm(true);
  const closeConfirm = () => setShowConfirm(false);

  const handleSingleChange = (name, value) => {
    setForm((prev) => ({ ...prev, [name]: value }));
  };

  const addEventCategory = () => {
    if (!newEventCat.trim()) return;
    const updated = [...form.eventCategories, newEventCat.trim()];
    setForm((prev) => ({ ...prev, eventCategories: updated }));
    setNewEventCat("");
  };

  const removeEventCategory = (index) => {
    const updated = [...form.eventCategories];
    updated.splice(index, 1);
    setForm((prev) => ({ ...prev, eventCategories: updated }));
  };

  const addNoteCategory = () => {
    if (!newNoteCat.trim()) return;
    const updated = [...form.noteCategories, newNoteCat.trim()];
    setForm((prev) => ({ ...prev, noteCategories: updated }));
    setNewNoteCat("");
  };

  const removeNoteCategory = (index) => {
    const updated = [...form.noteCategories];
    updated.splice(index, 1);
    setForm((prev) => ({ ...prev, noteCategories: updated }));
  };

  const handleSaveSettings = async () => {
    setLoading(true);
    const payload = {
      user: {
        id: user._id,
        name: form.name,
        email: form.email,
        settings: {
          categoryEvents: form.eventCategories.join("/"),
          categoryNotes: form.noteCategories.join("/"),
          language: form.language,
          startDay: form.weekStart === "sunday",
          position: form.location,
          homeNotes: form.notesInHome,
        },
      },
    };

    try {
      const res = await fetch("/updatesettings", {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify(payload),
      });

      const data = await res.json();
      console.log("Risposta server:", data);

      const updatedUser = {
        ...user,
        name: form.name,
        email: form.email,
        settings: payload.user.settings,
      };

      updateUser(updatedUser);
      closeConfirm();
      alert("Impostazioni salvate!");
    } catch (error) {
      console.error("Errore salvataggio:", error);
      alert("Errore durante il salvataggio.");
    }finally {
      setLoading(false);
    }
  };

  return (
    <Container className="mt-4">
      <Card className="p-4 shadow-sm">
        <h3 className="mb-4">Impostazioni Utente</h3>

        <Row className="mb-4">
          <Col md={4} className="text-center">
            <div className="position-relative d-inline-block">
              <Image
                src={user.propic}
                roundedCircle
                width={100}
                height={100}
                alt="Profilo"
              />
              <Button
                variant="dark"
                size="sm"
                className="position-absolute top-50 start-50 translate-middle opacity-75"
                style={{ display: "none" }}
                id="avatar-btn"
              >
                Cambia
              </Button>
            </div>
          </Col>
          <Col md={8}>
            <Row className="mb-3">
              <Col md={6}>
                <Form.Label>Nome</Form.Label>
                <Form.Control
                  type="text"
                  value={form.name}
                  onChange={(e) => handleSingleChange("name", e.target.value)}
                />
              </Col>
              <Col md={6}>
                <Form.Label>Email</Form.Label>
                <Form.Control
                  type="email"
                  value={form.email}
                  onChange={(e) => handleSingleChange("email", e.target.value)}
                />
              </Col>
            </Row>
          </Col>
        </Row>

        {/* Categorie eventi */}
        <Form.Group className="mb-3">
          <Form.Label>Categorie eventi</Form.Label>
          <div className="d-flex mb-2">
            <Form.Control
              type="text"
              placeholder="Aggiungi categoria..."
              value={newEventCat}
              onChange={(e) => setNewEventCat(e.target.value)}
            />
            <Button
              variant="success"
              className="ms-2"
              onClick={addEventCategory}
            >
              Aggiungi
            </Button>
          </div>
          <div
            style={{
              maxHeight: "120px",
              overflowY: "auto",
              border: "1px solid #ccc",
              borderRadius: "5px",
              padding: "0.5rem",
            }}
          >
            {form.eventCategories.map((cat, i) => (
              <div key={i} className="d-flex justify-content-between mb-1">
                <span>{cat}</span>
                <Button
                  variant="outline-danger"
                  size="sm"
                  onClick={() => removeEventCategory(i)}
                >
                  Elimina
                </Button>
              </div>
            ))}
          </div>
        </Form.Group>

        {/* Categorie note */}
        <Form.Group className="mb-3">
          <Form.Label>Categorie note</Form.Label>
          <div className="d-flex mb-2">
            <Form.Control
              type="text"
              placeholder="Aggiungi categoria..."
              value={newNoteCat}
              onChange={(e) => setNewNoteCat(e.target.value)}
            />
            <Button
              variant="success"
              className="ms-2"
              onClick={addNoteCategory}
            >
              Aggiungi
            </Button>
          </div>
          <div
            style={{
              maxHeight: "120px",
              overflowY: "auto",
              border: "1px solid #ccc",
              borderRadius: "5px",
              padding: "0.5rem",
            }}
          >
            {form.noteCategories.map((cat, i) => (
              <div key={i} className="d-flex justify-content-between mb-1">
                <span>{cat}</span>
                <Button
                  variant="outline-danger"
                  size="sm"
                  onClick={() => removeNoteCategory(i)}
                >
                  Elimina
                </Button>
              </div>
            ))}
          </div>
        </Form.Group>

        {/* Altre impostazioni */}
        <Form.Group className="mb-3">
          <Form.Label>Lingua</Form.Label>
          <Form.Select
            name="language"
            value={form.language}
            onChange={(e) => handleSingleChange("language", e.target.value)}
          >
            <option value="it">Italiano</option>
            <option value="en">Inglese</option>
          </Form.Select>
        </Form.Group>

        <Form.Group className="mb-3">
          <Form.Label>Inizio della settimana</Form.Label>
          <Form.Select
            name="weekStart"
            value={form.weekStart}
            onChange={(e) => handleSingleChange("weekStart", e.target.value)}
          >
            <option value="sunday">Domenica</option>
            <option value="monday">Lunedì</option>
          </Form.Select>
        </Form.Group>

        <Form.Group className="mb-3">
          <Form.Label>Posizione</Form.Label>
          <Form.Control
            type="text"
            name="location"
            value={form.location}
            onChange={(e) => handleSingleChange("location", e.target.value)}
            placeholder="es. Milano, Roma"
          />
        </Form.Group>

        <Form.Group className="mb-4">
          <Form.Label>Note visibili nella home</Form.Label>
          <Form.Control
            type="number"
            name="notesInHome"
            min={1}
            value={form.notesInHome}
            onChange={(e) => handleSingleChange("notesInHome", e.target.value)}
          />
        </Form.Group>

        {/* Dispositivi delle notifiche */}
        <Form.Group className="mb-3">
          <Form.Label>Dispositivi registrati per le notifiche</Form.Label>
          <div
            style={{
              maxHeight: "120px",
              overflowY: "auto",
              border: "1px solid #ccc",
              borderRadius: "5px",
              padding: "0.5rem",
            }}
          >
            {
				/*
				notifDevices.map((device, i) => (
	              <div key={i} className="d-flex justify-content-between mb-1">
	                <span>{device.name}</span>
	                <Button
	                  variant="outline-danger"
	                  size="sm"
	                  //onClick={() => removeEventCategory(i)}
	                >
	                  Elimina
	                </Button>
	              </div>
	            ))
				*/
				JSON.stringify(notifDevices)
			}
          </div>
        </Form.Group>


        {/* Pulsante Salva */}
        <div className="d-grid">
          <Button variant="primary" size="lg" onClick={openConfirm}>
            Salva tutte le impostazioni
          </Button>
          <ConfirmModal
            show={showConfirm}
            title="Conferma"
            body="Sei sicuro di voler salvare le impostazioni?"
            confirmText="Salva"
            cancelText="Annulla"
            loading={loading}
            onConfirm={handleSaveSettings}
            onCancel={closeConfirm}
          />
        </div>
      </Card>

      <style>{`
        .position-relative:hover #avatar-btn {
          display: block !important;
        }
      `}</style>
    </Container>
  );
}

export default Settings;

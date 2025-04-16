import { useState } from "react";
import {
  Container,
  Row,
  Col,
  Form,
  Button,
  Card,
  Image,
} from "react-bootstrap";

function Settings({user}) {
  console.log(user);
  const [form, setForm] = useState({
    eventCategories: "",
    noteCategories: "",
    language: "Italiano",
    theme: "chiaro",
    weekStart: "monday",
    location: "",
    notesInHome: 5,
  });

  const handleChange = (e) => {
    const { name, value } = e.target;
    setForm({ ...form, [name]: value });
  };

  const handleSubmit = (e) => {
    e.preventDefault();
	//CHIAMATA API DA FARE 	BISOGNA PRIMA MODIFICA IL BACKEND
  };

  return (
    <Container className="mt-4">
      <Card className="p-4 shadow-sm">
        <h3 className="mb-4">Impostazioni Utente</h3>

        <Row className="mb-4">
          <Col md={4} className="text-center">
            <Image
              src={user.propic}
              roundedCircle
              width={100}
              height={100}
              alt="Profilo"
            />
            <div className="mt-2">
              <Button variant="outline-primary" size="sm">
                Cambia
              </Button>
            </div>
          </Col>
          <Col md={8}>
            <Row className="mb-3">
              <Col md={6}>
                <strong>Nome:</strong> 
              </Col>
              <Col md={6}>
                <Button variant="outline-primary" size="sm">
                  Cambia
                </Button>
              </Col>
            </Row>
            <Row>
              <Col md={6}>
                <strong>Email:</strong> 
              </Col>
              <Col md={6}>
                <Button variant="outline-primary" size="sm">
                  Cambia
                </Button>
              </Col>
            </Row>
          </Col>
        </Row>

        <Form onSubmit={handleSubmit}>
          <Form.Group className="mb-3">
            <Form.Label>Categorie eventi (separate da virgola)</Form.Label>
            <Form.Control
              type="text"
              name="eventCategories"
              value={form.eventCategories}
              onChange={handleChange}
              placeholder="es. lavoro, studio, sport"
            />
          </Form.Group>

          <Form.Group className="mb-3">
            <Form.Label>Categorie note (separate da virgola)</Form.Label>
            <Form.Control
              type="text"
              name="noteCategories"
              value={form.noteCategories}
              onChange={handleChange}
              placeholder="es. idee, cose da fare"
            />
          </Form.Group>

          <Form.Group className="mb-3">
            <Form.Label>Lingua</Form.Label>
            <Form.Select
              name="language"
              value={form.language}
              onChange={handleChange}
            >
              <option value="it">Italiano</option>
              <option value="en">Inglese</option>
            </Form.Select>
          </Form.Group>

          <Form.Group className="mb-3">
            <Form.Label>Tema</Form.Label>
            <Form.Select
              name="theme"
              value={form.theme}
              onChange={handleChange}
            >
              <option value="light">Chiaro</option>
              <option value="dark">Scuro</option>
            </Form.Select>
          </Form.Group>

          <Form.Group className="mb-3">
            <Form.Label>Inizio della settimana</Form.Label>
            <Form.Select
              name="weekStart"
              value={form.weekStart}
              onChange={handleChange}
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
              onChange={handleChange}
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
              onChange={handleChange}
            />
          </Form.Group>

          <Button variant="primary" type="submit" className="w-100">
            Salva impostazioni
          </Button>
        </Form>
      </Card>
    </Container>
  );
}

export default Settings;

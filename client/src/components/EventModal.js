// src/components/EventModal.js
import React, { useState, useEffect } from "react";
import { Modal, Button, Form } from "react-bootstrap";
import 'bootstrap/dist/css/bootstrap.min.css';

function EventModal({ show, handleClose, onSave, initialData }) {
  const [formData, setFormData] = useState({
    title: "",
    category: "",
    location: "",
    begin: "",
    end: "",
    repetition: {
      frequency: "",
      until: "",
    },
  });

  useEffect(() => {
    if (initialData) {
      setFormData(initialData);
    }
  }, [initialData]);

  const handleChange = (e) => {
    const { name, value } = e.target;

    if (name === "frequency" || name === "until") {
      setFormData((prev) => ({
        ...prev,
        repetition: {
          ...prev.repetition,
          [name]: value,
        },
      }));
    } else {
      setFormData((prev) => ({
        ...prev,
        [name]: value,
      }));
    }
  };

  const handleSubmit = () => {
    onSave(formData); 
    handleClose();
  };

  return (
    <Modal show={show} onHide={handleClose} centered>
      <Modal.Header closeButton>
        <Modal.Title>{initialData ? "Modifica Evento" : "Crea Evento"}</Modal.Title>
      </Modal.Header>
      <Modal.Body>
        <Form>
          <Form.Group className="mb-2">
            <Form.Label>Titolo</Form.Label>
            <Form.Control
              type="text"
              name="title"
              value={formData.title}
              onChange={handleChange}
            />
          </Form.Group>

          <Form.Group className="mb-2">
            <Form.Label>Categoria</Form.Label>
            <Form.Control
              type="text"
              name="category"
              value={formData.category}
              onChange={handleChange}
            />
          </Form.Group>

          <Form.Group className="mb-2">
            <Form.Label>Luogo</Form.Label>
            <Form.Control
              type="text"
              name="location"
              value={formData.location}
              onChange={handleChange}
            />
          </Form.Group>

          <Form.Group className="mb-2">
            <Form.Label>Inizio</Form.Label>
            <Form.Control
              type="datetime-local"
              name="begin"
              value={formData.begin}
              onChange={handleChange}
            />
          </Form.Group>

          <Form.Group className="mb-2">
            <Form.Label>Fine</Form.Label>
            <Form.Control
              type="datetime-local"
              name="end"
              value={formData.end}
              onChange={handleChange}
            />
          </Form.Group>

          <Form.Group className="mb-2">
            <Form.Label>Frequenza (opzionale)</Form.Label>
            <Form.Select
              name="frequency"
              value={formData.repetition.frequency}
              onChange={handleChange}
            >
              <option value="">Nessuna</option>
              <option value="daily">Giornaliera</option>
              <option value="weekly">Settimanale</option>
              <option value="monthly">Mensile</option>
              <option value="yearly">Annuale</option>
            </Form.Select>
          </Form.Group>

          <Form.Group className="mb-2">
            <Form.Label>Fino al (se ricorrente)</Form.Label>
            <Form.Control
              type="date"
              name="until"
              value={formData.repetition.until}
              onChange={handleChange}
            />
          </Form.Group>
        </Form>
      </Modal.Body>
      <Modal.Footer>
        <Button variant="secondary" onClick={handleClose}>
          Annulla
        </Button>
        <Button variant="primary" onClick={handleSubmit}>
          Salva Evento
        </Button>
      </Modal.Footer>
    </Modal>
  );
}

export default EventModal;

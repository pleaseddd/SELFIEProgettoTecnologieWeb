import React from "react";
import { Modal, Button } from "react-bootstrap";

function EventView({ show, onClose, onEdit, onDelete, event }) {
  if (!event) return null;

  return (
    <Modal show={show} onHide={onClose} centered>
      <Modal.Header closeButton>
        <Modal.Title>Evento</Modal.Title>
      </Modal.Header>
      <Modal.Body>
        <h5 className="text-center">{event.title}</h5>
        <hr />
        <p>
          <strong>Categoria:</strong> {event.category}
        </p>
        <p>
          <strong>Luogo:</strong> {event.location}
        </p>
        <p>
          <strong>Inizio:</strong> {new Date(event.begin).toLocaleString()}
        </p>
        <p>
          <strong>Fine:</strong> {new Date(event.end).toLocaleString()}
        </p>
        {event.repetition?.frequency && (
          <>
            <p>
              <strong>Ripetizione:</strong> {event.repetition.frequency}
            </p>
            {event.repetition.until && (
              <p>
                <strong>Fino al:</strong>{" "}
                {new Date(event.repetition.until).toLocaleDateString()}
              </p>
            )}
          </>
        )}
      </Modal.Body>

      <Modal.Footer className="d-flex justify-content-between">
        <Button variant="secondary" onClick={onClose}>
          Chiudi
        </Button>
        <Button variant="danger" onClick={() => onDelete(event)}>
          Elimina
        </Button>
        <Button variant="primary" onClick={() => onEdit(event)}>
          Modifica
        </Button>
      </Modal.Footer>
    </Modal>
  );
}

export default EventView;

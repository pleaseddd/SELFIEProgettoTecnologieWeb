import React from "react";
import { Modal, Button } from "react-bootstrap";

function NoteView({ show, onClose, note, onEdit, onDelete }) {
  if (!note) return null;

  return (
    <Modal show={show} onHide={onClose} centered size="xl">
      <Modal.Header closeButton>
        <Modal.Title>Nota</Modal.Title>
      </Modal.Header>
      <Modal.Body>
        <h5 className="text-center">{note.title}</h5>
        <hr />
        <p>
          <strong>Categoria:</strong> {note.category}
        </p>
        <p style={{ whiteSpace: "pre-wrap", wordWrap: "break-word" }}>
          {note.body}
        </p>
      </Modal.Body>
      <Modal.Footer className="d-flex justify-content-between">
        <Button variant="danger" 
          onClick={() => {
            if (window.confirm("Sei sicuro di voler eliminare questa nota?")) {
              onDelete();
            }
          }}
        >
          Elimina
        </Button>
        <Button variant="primary" onClick={() => {
          onEdit(note);
        }}>
          Modifica
        </Button>
      </Modal.Footer>
    </Modal>
  );
}

export default NoteView;

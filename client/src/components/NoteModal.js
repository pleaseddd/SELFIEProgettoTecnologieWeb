import React from "react";
import { Modal, Button } from "react-bootstrap";

function NoteModal({ show, note, handleClose, handleEdit, handleDelete }) {
  return (
    <Modal show={show} onHide={handleClose} size="lg" centered>
      <Modal.Header closeButton>
        <Modal.Title>{note?.title}</Modal.Title>
      </Modal.Header>
      <Modal.Body>
        <h6 className="text-muted">{note?.category}</h6>
        <p>{note?.body}</p>
      </Modal.Body>
      <Modal.Footer>
        <Button variant="danger" onClick={() => handleDelete(note._id)}>
          Elimina
        </Button>
        <Button variant="primary" onClick={() => handleEdit(note)}>
          Modifica
        </Button>
      </Modal.Footer>
    </Modal>
  );
}

export default NoteModal;
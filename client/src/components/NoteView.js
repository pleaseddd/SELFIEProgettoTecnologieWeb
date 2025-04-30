import {React, useState}from "react";
import { Modal, Button } from "react-bootstrap";
import ConfirmModal from "./ConfirmModal";


function NoteView({ show, onClose, note, onEdit, onDelete }) {
  const [showConfirm, setShowConfirm] = useState(false);
  const [loading, setLoading] = useState(false);
  if (!note) return null;
  const openConfirm = () => setShowConfirm(true);
  const closeConfirm = () => setShowConfirm(false);

  const confirmDelete = () => {
    setLoading(true);
    closeConfirm();
    onDelete();
    setLoading(false);
  };

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
        <Button variant="danger" onClick={openConfirm}>
          Elimina
        </Button>

        <Button
          variant="primary"
          onClick={() => {
            onEdit(note);
          }}
        >
          Modifica
        </Button>
      </Modal.Footer>
      <ConfirmModal
        show={showConfirm}
        title="Elimina nota"
        body="Sei sicuro di voler eliminare questa nota?"
        confirmText="Elimina"
        cancelText="Annulla"
        loading={loading}
        onConfirm={confirmDelete}
        onCancel={closeConfirm}
      />
    </Modal>
  );
}

export default NoteView;

import {React, useState}from "react";
import { Modal, Button } from "react-bootstrap";
import ConfirmModal from "./ConfirmModal";
import { FaRegTrashCan,FaPencil  } from "react-icons/fa6";

//Componente per visualizzare una nota in una modale
function NoteView({ show, onClose, note, onEdit, onDelete }) {
  //Gestione della modale di conferma per l'eliminazione della nota
  const [showConfirm, setShowConfirm] = useState(false);
  const [loading, setLoading] = useState(false);
  if (!note) return null;
  const openConfirm = () => setShowConfirm(true);
  const closeConfirm = () => setShowConfirm(false);

  //Conferma l'eliminazione della nota e chiude la modale di conferma
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
        {/* Visualizza il titolo, la categoria e il corpo della nota */}
        <h5 className="text-center">{note.title}</h5>
        <hr />
        <p>
          <strong>Categoria:</strong> {note.category}
        </p>
        <p style={{ whiteSpace: "pre-wrap", wordWrap: "break-word" }}>
          <div dangerouslySetInnerHTML={{ __html: note.body }} />
        </p>
      </Modal.Body>
      <Modal.Footer className="d-flex justify-content-between">
        <Button variant="danger" onClick={openConfirm}>
          <FaRegTrashCan />
        </Button>

        <Button
          variant="primary"
          onClick={() => {
            onEdit(note);
          }}
        >
          <FaPencil />
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
        onClose={closeConfirm}
      />
    </Modal>
  );
}

export default NoteView;

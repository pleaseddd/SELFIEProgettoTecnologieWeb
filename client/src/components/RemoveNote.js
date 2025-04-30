import React, { useState } from "react";
import { Button } from "react-bootstrap";
import ConfirmModal from "./ConfirmModal";
import { FaRegTrashCan } from "react-icons/fa6";

function RemoveNote({ noteId, userId, onSuccess }) {
  const [showConfirm, setShowConfirm] = useState(false);
  const [loading, setLoading] = useState(false);

  const openConfirm = () => setShowConfirm(true);
  const closeConfirm = () => setShowConfirm(false);

  const handleConfirm = async () => {
    setLoading(true);
    try {
      const response = await fetch("/deletenote", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ noteid: noteId, userid: userId }),
      });
      if (response.ok) {
        onSuccess(noteId);
        closeConfirm();
      } else {
        const data = await response.json();
        alert("Errore durante l'eliminazione: " + data.message);
      }
    } catch (err) {
      console.error(err);
      alert("Errore di rete durante l'eliminazione");
    } finally {
      setLoading(false);
    }
  };

  return (
    <>
      <Button
        className="btn btn-outline-danger bg-transparent  d-flex align-items-center justify-content-center"
        style={{
          width: "40px",
          height: "40px",
          padding: 0,
        }}
        onClick={openConfirm}
      >
        <FaRegTrashCan />
      </Button>

      <ConfirmModal
        show={showConfirm}
        title="Elimina nota"
        body="Sei sicuro di voler eliminare questa nota?"
        confirmText="Elimina"
        cancelText="Annulla"
        loading={loading}
        onConfirm={handleConfirm}
        onCancel={closeConfirm}
      />
    </>
  );
}

export default RemoveNote;

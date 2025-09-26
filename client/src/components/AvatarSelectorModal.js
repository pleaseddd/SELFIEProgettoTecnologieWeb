// src/components/AvatarSelectorModal.jsx
import React from "react";
import { Modal, Row, Col, Image } from "react-bootstrap";
import { themes } from "../Themes";

export default function AvatarSelectorModal({ show, onHide, onSelect, currentKey }) {
  return (
    <Modal show={show} onHide={onHide} size="lg" centered>
      <Modal.Header closeButton>
        <Modal.Title>Seleziona avatar</Modal.Title>
      </Modal.Header>
      <Modal.Body>
        <Row>
          {Object.keys(themes).map((key) => (
            <Col key={key} xs={4} className="mb-3 text-center">
              <Image
                src={`/pfp/${key}.png`}
                roundedCircle
                alt={key}
                style={{
                  cursor: "pointer",
                  width: 80,
                  height: 80,
                  boxShadow: currentKey === key ? "0 8px 22px rgba(0,0,0,0.12)" : undefined,
                  transform: currentKey === key ? "translateY(-4px) scale(1.02)" : undefined,
                  transition: "transform .12s ease, box-shadow .12s ease",
                }}
                onClick={() => {
                  // NON applicare il tema qui — solo notificare la selezione
                  if (typeof onSelect === "function") onSelect(key);
                }}
              />
            </Col>
          ))}
        </Row>
      </Modal.Body>
    </Modal>
  );
}

import React from "react";
import { Modal, Row, Col, Image } from "react-bootstrap";
import { themes } from "../Themes";
import "../style/settings/avatarModal.css";

export default function AvatarSelectorModal({ show, onHide, onSelect, currentKey }) {
  return (
    <Modal show={show} onHide={onHide} size="lg" centered className="avatar-selector-modal">
      <Modal.Header closeButton>
        <Modal.Title>Seleziona avatar</Modal.Title>
      </Modal.Header>
      <Modal.Body>
        <Row className="avatar-selector-grid">
          {Object.keys(themes).map((key) => (
            <Col key={key} xs={4} className="mb-3 text-center">
              <div
                role="button"
                tabIndex={0}
                className={`avatar-item ${currentKey === key ? "selected" : ""}`}
                onClick={() => typeof onSelect === "function" && onSelect(key)}
                onKeyDown={(e) => { if (e.key === "Enter" || e.key === " ") onSelect(key); }}
              >
                <Image
                  src={`/pfp/${key}.png`}
                  roundedCircle
                  alt={key}
                  className="avatar-img"
                />
              </div>
            </Col>
          ))}
        </Row>
      </Modal.Body>
    </Modal>
  );
}
import React from "react";
import { Modal, Row, Col, Image } from "react-bootstrap";
import { themes } from "../Themes";
import { useTheme } from "./ThemeContext";
import axios from "axios";

export default function AvatarSelectorModal({ show, onHide, onSelect }) {
  const { setThemeKey } = useTheme();

  const handleSelect = (key) => {
    setThemeKey(key);
    onSelect(key);
    onHide();
  };

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
                style={{ cursor: "pointer", width: 80, height: 80 }}
                onClick={() => handleSelect(key)}
              />
            </Col>
          ))}
        </Row>
      </Modal.Body>
    </Modal>
  );
}

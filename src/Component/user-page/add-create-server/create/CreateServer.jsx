import React from "react";
import { Modal, Button } from "react-bootstrap";

function CreateServer(props) {
  return (
    <Modal show={props.showModal} onHide={() => props.setShowModal(false)}>
      <Modal.Header closeButton>
        <Modal.Title>Join/Create a Server</Modal.Title>
      </Modal.Header>

      <Modal.Body>Create Server From</Modal.Body>
    </Modal>
  );
}

export default CreateServer;

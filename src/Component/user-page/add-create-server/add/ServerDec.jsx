import React from "react";
import { Modal, Button } from "react-bootstrap";
import api from "../../../../app/api";

function ServerDec(props) {
  async function joinServer() {
    await api.put(`/connect/server/${props.selectedServer.id}`);
  }

  return (
    <Modal show={props.showModal} onHide={() => props.setShowModal(false)}>
      <Modal.Header closeButton>
        <Modal.Title></Modal.Title>
      </Modal.Header>

      <Modal.Body
        style={{
          display: "flex",
          flexDirection: "column",
          justifyContent: "center",
          alignItems: "center",
          gap: "20px",
        }}
      >
        <img src={props.selectedServer.image} width={"80%"} height={"40%"} />
        <p>{props.selectedServer.description}</p>
        <Button variant="primary" onClick={joinServer}>
          Join
        </Button>
      </Modal.Body>
    </Modal>
  );
}

export default ServerDec;

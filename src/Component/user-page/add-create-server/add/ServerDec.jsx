import React from "react";
import { Modal, Button } from "react-bootstrap";
import api from "../../../../app/api";
import { useSelector } from "react-redux";

function ServerDec(props) {
  const userInfo = useSelector((state) => state.auth.user);

  async function joinServer() {
    // console.log("join server");
    await api.put(`/connect/server/${props.selectedServer.id}`);
  }

  return (
    <Modal
      show={props.showModal}
      onHide={() => props.setShowModal(false)}
      className="serverModal"
    >
      <Modal.Header closeButton>
        <Modal.Title>{props.selectedServer.name}</Modal.Title>
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
        {props.selectedServer.user_id === userInfo.id && (
          <Button variant="primary">Server Settings</Button>
        )}
      </Modal.Body>
    </Modal>
  );
}

export default ServerDec;

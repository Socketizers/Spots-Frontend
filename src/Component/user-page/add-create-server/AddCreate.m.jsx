import React, { useState } from "react";
import { Modal, Button } from "react-bootstrap";
import ServerCategory from "./add/ServerCategory";
import CreateServer from "./create/CreateServer";

function AddCreate(props) {
  const [showJoinServerModal, setShowJoinServerModal] = useState(false);
  const [showCreateServerModal, setShowCreateServerModal] = useState(false);

  return (
    <div>
      <Modal show={props.showModal} onHide={() => props.setShowModal(false)}>
        <Modal.Header closeButton>
          <Modal.Title>Join/Create a Server</Modal.Title>
        </Modal.Header>

        <Modal.Body>
          <Button
            variant="primary"
            onClick={() => {
              setShowJoinServerModal(true);
              props.setShowModal(false);
            }}
          >
            Join Server
          </Button>
          <br />
          <br />
          <Button
            variant="primary"
            onClick={() => {
              setShowCreateServerModal(true);
              props.setShowModal(false);
            }}
          >
            Create Server
          </Button>
        </Modal.Body>
      </Modal>

      <ServerCategory
        showModal={showJoinServerModal}
        setShowModal={setShowJoinServerModal}
      />

      <CreateServer
        showModal={showCreateServerModal}
        setShowModal={setShowCreateServerModal}
      />
    </div>
  );
}

export default AddCreate;

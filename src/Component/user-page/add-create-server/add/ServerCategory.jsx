import React, { useState } from "react";
import { Modal, Button } from "react-bootstrap";
import RenderServers from "./RenderServers";

function ServerCategory(props) {
  const [selectedCategory, setSelectedCategory] = useState("");
  const [showRenderServersModal, setShowRenderServersModal] = useState(false);

  return (
    <>
      <Modal show={props.showModal} onHide={() => props.setShowModal(false)}>
        <Modal.Header closeButton>
          <Modal.Title>Categories</Modal.Title>
        </Modal.Header>

        <Modal.Body
          style={{
            display: "flex",
            flexDirection: "column",
            justifyContent: "center",
            gap: "20px",
          }}
        >
          <Button
            variant="primary"
            onClick={() => {
              setSelectedCategory("Education");
              setShowRenderServersModal(true);
              props.setShowModal(false);
            }}
          >
            Education
          </Button>
          <Button
            variant="primary"
            onClick={() => {
              setSelectedCategory("Entertainment");
              setShowRenderServersModal(true);
              props.setShowModal(false);
            }}
          >
            Entertainment
          </Button>
          <Button
            variant="primary"
            onClick={() => {
              setSelectedCategory("Sport");
              setShowRenderServersModal(true);
              props.setShowModal(false);
            }}
          >
            Sport
          </Button>
          <Button
            variant="primary"
            onClick={() => {
              setSelectedCategory("Career");
              setShowRenderServersModal(true);
              props.setShowModal(false);
            }}
          >
            Career
          </Button>
          <Button
            variant="primary"
            onClick={() => {
              setSelectedCategory("Financial");
              setShowRenderServersModal(true);
              props.setShowModal(false);
            }}
          >
            Financial
          </Button>
          <Button
            variant="primary"
            onClick={() => {
              setSelectedCategory("General");
              setShowRenderServersModal(true);
              props.setShowModal(false);
            }}
          >
            General
          </Button>
        </Modal.Body>
      </Modal>

      <RenderServers
        setShowModal={setShowRenderServersModal}
        showModal={showRenderServersModal}
        selectedCategory={selectedCategory}
      />
    </>
  );
}

export default ServerCategory;

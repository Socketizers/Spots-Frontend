import React, { useEffect, useState } from "react";
import { Modal } from "react-bootstrap";
import { useSelector, useDispatch } from "react-redux";
import { getAllServers } from "../../../../features/server/serverSlice";
import cookie from "react-cookies";
import ServerDec from "./ServerDec";

function RenderServers(props) {
  const [selectedServer, setSelectedServer] = useState({});
  const [showServerDescriptionModal, setShowServerDescriptionModal] =
    useState(false);
  const servers = useSelector((state) => state.server.servers);
  const dispatcher = useDispatch();

  useEffect(() => {
    if (cookie.load("token")) dispatcher(getAllServers());
  }, []);

  return (
    <>
      <Modal show={props.showModal} onHide={() => props.setShowModal(false)}>
        <Modal.Header closeButton>
          <Modal.Title>{props.selectedCategory} Servers</Modal.Title>
        </Modal.Header>

        <Modal.Body>
          {servers
            .filter((server) => server.category === props.selectedCategory)
            .map((server, index) => {
              return (
                <div
                  key={index}
                  style={{
                    backgroundColor: "black",
                    color: "white",
                    width: "fit-content",
                    padding: "20px",
                    margin: "20px",
                  }}
                  onClick={() => {
                    setSelectedServer(server);
                    setShowServerDescriptionModal(true);
                    props.setShowModal(false);
                  }}
                >
                  <h3>{server.name}</h3>
                  <img
                    src={server.image}
                    width={"100px"}
                    height={"100px"}
                    style={{ borderRadius: "50%" }}
                  />
                </div>
              );
            })}
        </Modal.Body>
      </Modal>

      <ServerDec
        setShowModal={setShowServerDescriptionModal}
        showModal={showServerDescriptionModal}
        selectedServer={selectedServer}
      />
    </>
  );
}

export default RenderServers;

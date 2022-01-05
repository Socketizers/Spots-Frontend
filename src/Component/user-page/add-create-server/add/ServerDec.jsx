import React from "react";
import { Modal, Button } from "react-bootstrap";
import api from "../../../../app/api";
import { useSelector, useDispatch } from "react-redux";
import { getAllServers } from "../../../../features/server/serverSlice";

/**
 * IMPORTANT NOTE 📓 :
 *
 *  THIS Modal Styling IN ServersArea.css
 *
 */

function ServerDec(props) {
  const userInfo = useSelector((state) => state.auth.user);
  const dispatcher = useDispatch();

  async function joinServer() {
    // console.log("join server");
    await api.put(`/connect/server/${props.selectedServer.id}`);
    dispatcher(getAllServers());
  }

  return (
    <Modal
      show={props.showModal}
      onHide={() => props.setShowModal(false)}
      className="serverModal"
    >
      <Modal.Body
        style={{
          display: "flex",
          flexDirection: "column",
          justifyContent: "center",
          alignItems: "center",
          gap: "20px",
        }}
        className="modalBody"
      >
        <h1>{props.selectedServer.name}</h1>
        <img src={props.selectedServer.image} width={"80%"} height={"40%"} />
        <p>{props.selectedServer.description}</p>
        {props.selectedServer.users?.includes(userInfo.id) ? (
          <Button
            className="server-dec-btn"
            style={{ backgroundColor: "#0A95B6", border: "none" }}
            onClick={joinServer}
          >
            Go to Server
          </Button>
        ) : (
          <Button
            className="server-dec-btn"
            style={{
              backgroundColor: "#0A95B6",
              border: "none",
              marginBottom: "1em",
            }}
            onClick={joinServer}
          >
            Join
          </Button>
        )}
        {/* <Button variant="primary" onClick={joinServer}>
          Join
        </Button> */}
        {props.selectedServer.user_id === userInfo.id && (
          <Button
            className="server-dec-btn"
            style={{
              backgroundColor: "#0A95B6",
              border: "none",
              marginBottom: "1em",
            }}
          >
            Server Settings
          </Button>
        )}
      </Modal.Body>
    </Modal>
  );
}

export default ServerDec;

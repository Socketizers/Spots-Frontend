import React, { useState } from "react";
import { Modal, Row } from "react-bootstrap";
import CreateRooms from "../add-create-server/create/CreateRooms";
import logo from "../../../assets/SPOTSLOGO-PP.png";

function ServerInfo(props) {
  
  const [openRoomModal, setRoomModal] = useState(false);

  const addRoomModalOpen = () => setRoomModal(true);
  const addRoomModalClose = () => setRoomModal(false);

  return (
    <Modal show={props.open} onHide={props.handleClose} size="lg">
      <Modal.Header closeButton>
        <img src={logo} width="60" style={{ marginRight: "1em" }} alt="" />
        <Modal.Title>
          {props.server.name} <span>{props.server.id}</span>
        </Modal.Title>
      </Modal.Header>
      <Modal.Body>

  {/* ************************ Server's Rooms ************************* */}
        <Row style={{ margin: "2vh 5vh", height: "30vh" }}>
          <div className="rooms">
            <h2>Rooms</h2>

            {!!props.rooms.length ? (
              <>
                {props.rooms.map((room, i) => {
                  return (
                    <>
                      <div className="server-room">
                        <h4>{room.name}</h4>
                        <h6>{room.type}</h6>
                        <i class="far fa-edit"></i>
                      </div>
                    </>
                  );
                })}
                <button onClick={addRoomModalOpen}>
                  <i class="fas fa-plus-circle add-room"></i>
                </button>
              </>
            ) : (
              <button onClick={addRoomModalOpen}>
                <i class="fas fa-plus-circle add-room"></i>
              </button>
            )}
            <CreateRooms
              id={props.server.id}
              open={openRoomModal}
              handleClose={addRoomModalClose}
              closeServerModal={props.handleClose}
            />
          </div>
        </Row>

  {/* ************************ Server's Users ************************* */}
        <Row style={{ margin: "2vh 5vh", height: "25vh" }}>
          <div className="server-users">
            <h2>Users</h2>
            {!props.users.length
              ? "Add Friends"
              : props.users.map((user, i) => {
                  return (
                    <div className="friend" key={i}>
                      <img src={user.image} className="img" alt="" />
                      <h4>{user.username}</h4>
                    </div>
                  );
                })}
          </div>
        </Row>
      </Modal.Body>
    </Modal>
  );
}

export default ServerInfo;

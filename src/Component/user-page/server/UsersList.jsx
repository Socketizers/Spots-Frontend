import React, { useState } from "react";
import { Row, Col, Popover, OverlayTrigger, Button } from "react-bootstrap";
import Avatar from "@mui/material/Avatar";
import { useNavigate } from "react-router-dom";
import { useSelector, useDispatch } from "react-redux";
import { updateReceiver } from "../../../features/private-chat/privateChat";
import api from "../../../app/api";
import Swal from "sweetalert2";
import "./UsersList.scss";

function UsersList(props) {
  const [open, setOpen] = useState(false);
  const userInfo = useSelector((state) => state.auth.user);

  const handleOpen = () => setOpen(true);
  const handleClose = () => setOpen(false);

  const dispatcher = useDispatch();

  const navigator = useNavigate();

  return (
    <>
      <div className="list">
        <h2>Connected Users</h2>
        {props.users &&
          props.users.map((user, i) => {
            return (
              <OverlayTrigger
                trigger="click"
                key={i}
                placement="left"
                overlay={
                  <Popover id={`popover-positioned-left`}>
                    <Popover.Body>
                      
                      
                      <Button
                        style={{
                          background: "white !important",
                          color: "#0a94b6",
                          border: "1px solid #0a94b6",
                          borderRadius: "10px",
                          width: "fir-content",
                          fontSize: "large"
                        }}
                        onClick={() => {
                          dispatcher(updateReceiver(user));
                          navigator("/private-chat");
                          props.updateCurrentChat(user);
                        }}
                      >
                        Send Message
                      </Button>
                      <br />
                      {!userInfo.friends.includes(user.id) &&
                        user.id !== userInfo.id && (
                          <Button
                          style={{
                            background: "white !important",
                            color: "#0a94b6",
                            border: "1px solid #0a94b6",
                            borderRadius: "10px",
                            width: "fir-content",
                            fontSize: "large"
                          }}
                            className="sendRequest"
                            onClick={async () => {
                              
                                await api.post("/friends", {
                                  user2_id: user.id,
                                });

                                props.ioConnection.emit(
                                  "new-friendRequest",
                                  user.id
                                );

                                Swal.fire({
                                  position: "center",
                                  icon: "success",
                                  title: "Request Sent Successfully",
                                  showConfirmButton: false,
                                  timer: 1500,
                                });
                              
                            }}
                          >
                            Add Friend
                          </Button>
                        )}
                    </Popover.Body>
                  </Popover>
                }
              >
                <Row
                  key={i}
                  style={{ marginBottom: ".5em", cursor: "pointer" }}
                  // onClick={() => {
                  //   props.updateCurrentChat(user);
                  // }}
                >
                  <Col md={2} style={{ position: "relative" }}>
                    <Avatar
                      alt={user.username}
                      src={user.image}
                      sx={{ bgcolor: "#24464e" }}
                    />
                  </Col>
                  <Col
                    md={8}
                    style={{ marginLeft: "1.5em", position: "relative" }}
                  >
                    <h6 style={{ marginTop: ".8em" }}>{user.username}</h6>
                  </Col>
                </Row>
              </OverlayTrigger>
            );
          })}
      </div>
    </>
  );
}

export default UsersList;

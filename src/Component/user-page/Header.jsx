import React, { useState, useEffect } from "react";
import { useNavigate } from "react-router-dom";
import { useDispatch, useSelector } from "react-redux";
import io from "socket.io-client";
import cookie from "react-cookies";
import MyStory from "./profile/MyStory";
import Requests from "./friends/Requests";
import { logOut } from "../../features/auth/authSlice";
import {getFriendsRequest,reqSeen} from "../../features/friends/friendsReqSlice";
import { Dropdown, Button, Row, Col } from "react-bootstrap";
import Avatar from "@mui/material/Avatar";
import logo1 from "../../assets/images/SPOTSLOGO00.png";


function UserHeader() {
    
  const user = useSelector((state) => state.auth.user);
  const requests = useSelector((state) => state.friendsRequest.users);
  const seenReq = useSelector((state) => state.friendsRequest.seen);

  const [open, setOpen] = useState(false);
  const [ioConnection, setIoConnection] = useState(null);

  const dispatcher = useDispatch();
  const navigate = useNavigate();

  // ************************ Handle Story Modal *************************
  const handleOpen = () => setOpen(true);
  const handleClose = () => setOpen(false);


  useEffect(() => {
    const connection = io.connect("socketizers.herokuapp.com");
    setIoConnection(connection);

    connection.emit("join-request-room", user.id);

    if (cookie.load("token")) {
      dispatcher(getFriendsRequest());
    }
  }, [cookie.load("token")]);

  ioConnection?.on("new-friendRequest", () => {
    dispatcher(getFriendsRequest());
  });

  return (
    <header>
      <a href="/">
        <img src={logo1} className="logo" width="200" />
      </a>

      <div>
  {/* ************************ Add Story Btn ************************* */}
        <Button className="story-btn" onClick={handleOpen}>
          <i className="fas fa-plus"></i>
        </Button>

  {/* ************************ Direct Message Btn ************************* */}
        <Button className="private-btn" href="/private-chat">
          <i className="fas fa-inbox"></i>
        </Button>

  {/* ************************ Friend Requests List ************************* */}
        <Dropdown onClick={() => dispatcher(reqSeen())}>
          <Dropdown.Toggle
            variant="Secondary"
            id="dropdown-basic"
            className="notification-btn"
          >
            <i className="fas fa-bell"></i>
            <div
              style={{
                visibility: !seenReq && requests.length ? "visible" : "hidden",
              }}
            >
              {" "}
            </div>
          </Dropdown.Toggle>

          <Dropdown.Menu style={{ width: "20em" }}>
            {requests.length ? (
              requests.map((req, i) => {
                return (
                  <Dropdown.Item as="div" key={i}>
                    <Requests req={req} />
                  </Dropdown.Item>
                );
              })
            ) : (
              <Dropdown.Item as="div">No New Requests!</Dropdown.Item>
            )}
          </Dropdown.Menu>
        </Dropdown>

  {/* ************************ Profile Card ************************* */}
        <div className="profile-card">
          <Row style={{ marginRight: "0" }}>
            <Col>
              <Avatar
                alt={user.username}
                src={user.image}
                sx={{ bgcolor: "#24464e" }}
                style={{
                  width: "3.5em",
                  height: "3.3em",
                  borderRadius: "26px 0 0 26px",
                  display: user.image ? "inherit" : "flex",
                }}
              />
            </Col>
            <Col>
              <h3>{user.username}</h3>
              <h4>ID: {user.id}</h4>
            </Col>
            <Col>
              <Dropdown>
                <Dropdown.Toggle variant="Secondary" id="dropdown-basic">
                  <i className="fas fa-chevron-down"></i>
                </Dropdown.Toggle>

                <Dropdown.Menu>
                  <Dropdown.Item href="/profile">
                    <button className="d-btn">My Profile</button>
                    <i className="fas fa-user-cog"></i>
                  </Dropdown.Item>
                  <Dropdown.Item
                    onClick={() => {
                      navigate("/");
                      dispatcher(logOut());
                    }}
                  >
                    <button className="d-btn">Logout</button>
                    <i className="fas fa-sign-out-alt"></i>
                  </Dropdown.Item>
                </Dropdown.Menu>
              </Dropdown>
            </Col>
          </Row>
        </div>
      </div>

  {/* ************************ Story Modal************************* */}
      <MyStory open={open} handleClose={handleClose} />
    </header>
  );
}

export default UserHeader;

import { useEffect, useRef, useState } from "react";
import Chat from "./Chat";
import Podcast from "./Podcast";
import api from "../../../app/api";
import io from "socket.io-client";
import RenderRoom from "../friends/RenderRoom";
import { useNavigate, useParams } from "react-router-dom";
import { Dropdown, Button, Row, Col } from "react-bootstrap";
import { useSelector, useDispatch } from "react-redux";
import Avatar from "@mui/material/Avatar";
import logo1 from "../../../assets/images/SPOTSLOGO00.png";
import Requests from "../friends/Requests";
import { logOut } from "../../../features/auth/authSlice";
import {
  reqSeen,
  getFriendsRequest,
} from "../../../features/friends/friendsReqSlice";
import { getFriendsList } from "../../../features/friends/friendsSlice";

import cookie from "react-cookies";
import Peer from "peerjs";
import bgImg from "../../../assets/chatBG.png";
import UsersList from "./UsersList";
import Footer from "./../profile/Footer";

function RoomsList() {
  const user = useSelector((state) => state.auth.user);
  const requests = useSelector((state) => state.friendsRequest.users);
  const seenReq = useSelector((state) => state.friendsRequest.seen);
  const [open, setOpen] = useState(false);
  const p = useParams();
  const dispatcher = useDispatch();

  const [comp, setComp] = useState(<></>);
  const [rooms, setRooms] = useState([]);
  const [userConnectedToServer, setUserConnectedToServer] = useState();
  const [server, setServer] = useState();
  const ioConnection = useRef(null);
  const peer = useRef(null);
  const navigation = useNavigate();
  const setComponent = (comp) => {
    setComp(comp);
  };

  const handleOpen = () => setOpen(true);
  const handleClose = () => setOpen(false);

  useEffect(() => {
    // const connection = io.connect("http://localhost:8000");
    const connection = io.connect("socketizers.herokuapp.com");
    ioConnection.current = connection;
    peer.current = new Peer(undefined, {
      secure: true,
      host: "spotspeer.herokuapp.com",
    });
    peer.current.on("open", (myId) => console.log(myId));
    peer.current?.on("disconnected", (peerId) => {
      console.log("disconnected", peerId);
      ioConnection.current?.emit("peer-disconnect", peerId);
    });

    if (cookie.load("token")) {
      dispatcher(getFriendsList());
      dispatcher(getFriendsRequest());
      // dispatcher(getAllServers());
    }
    return () => {
      connection.close();
      peer.current.destroy();
    };
  }, []);

  useEffect(() => {
    (async () => {
      const roomsRes = await api(`/rooms/server/${p.serverId}`);
      setRooms(roomsRes.data);
      const { data: getUsersConnectedToServer } = await api.get(
        `/connected/server/${p.serverId}`
      );
      const { data: serverInfo } = await api.get(
        `/server/${p.serverId}`
      );
      setServer(serverInfo)
      setUserConnectedToServer(getUsersConnectedToServer);
    })();
  }, [p.serverId]);
  return (
    <>
      <div className="body" style={{width :"99vw"}}>
        <header>
          <div onClick={() => navigation("/")} className="logo">
            <img src={logo1} className="logo" width="200" />
          </div>

          <div>
            <Button className="story-btn" onClick={handleOpen}>
              <i className="fas fa-plus"></i>
            </Button>
            <Button className="private-btn" href="/private-chat">
              <i className="fas fa-inbox"></i>
            </Button>

            <Dropdown onClick={() => dispatcher(reqSeen())}>
              <Dropdown.Toggle
                variant="Secondary"
                id="dropdown-basic"
                className="notification-btn"
              >
                <i className="fas fa-bell"></i>
                <div
                  style={{
                    visibility:
                      !seenReq && requests.length ? "visible" : "hidden",
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
                      <Dropdown.Item onClick={() => dispatcher(logOut())}>
                        <button className="d-btn">Logout</button>
                        <i className="fas fa-sign-out-alt"></i>
                      </Dropdown.Item>
                    </Dropdown.Menu>
                  </Dropdown>
                </Col>
              </Row>
            </div>
          </div>
        </header>

        <img src={bgImg} className="bg-image" />

        <Row>
          <Col xs={10} style={{ height: "76vh", marginBottom:'2vh' }}>
            <div className="roomList">
           
              <div className="roomsCont">
              <h3 style={{margin:"0 10px", color:"#27333a"}}>{server?.name}</h3>
                <h4>Chat</h4>
                {rooms
                  ?.filter((room) => room.type === "text")
                  ?.map((room, index) => {
                    return (
                      <RenderRoom
                        setComponent={setComponent}
                        key={index}
                        onClick={() => {
                          navigation(`rooms/${room.name}${room.id}`);
                          setComponent(
                            <Chat
                              ioConnection={ioConnection.current}
                              room={room}
                            />
                          );
                        }}
                        room={room}
                      />
                    );
                  })}
                <h4>Media</h4>
                {rooms
                  ?.filter((room) => room.type === "voice")
                  ?.map((room, index) => {
                    return (
                      <RenderRoom
                        key={index}
                        setComponent={setComponent}
                        ioConnection={ioConnection.current}
                        onClick={() => {
                          navigation(`rooms/${room.name}${room.id}`);
                        }}
                        room={room}
                      />
                    );
                  })}
                <h4>Podcast</h4>

                {rooms
                  ?.filter((room) => room.type === "podcast")
                  ?.map((room, index) => {
                    return (
                      <RenderRoom
                        setComponent={setComponent}
                        key={index}
                        onClick={() => {
                          navigation(`rooms/${room.name}${room.id}`);
                          setComponent(
                            <Podcast
                              peer={peer.current}
                              room={room}
                              ioConnection={ioConnection.current}
                              style={{ height: "100%" }}
                            />
                          );
                        }}
                        room={room}
                      />
                    );
                  })}
              </div>
              <div className="roomsArray">{comp}</div>
            </div>
          </Col>
          <Col xs={2} className="friend-list">
            <UsersList
              users={userConnectedToServer}
              ioConnection={ioConnection}
            />
          </Col>
        </Row>
      </div>
      <Footer />
    </>
  );
}

export default RoomsList;

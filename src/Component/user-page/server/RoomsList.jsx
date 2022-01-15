import { useEffect, useRef, useState } from "react";
import Chat from "./Chat";
import Podcast from "./Podcast";
import api from "../../../app/api";
import io from "socket.io-client";
import RenderRoom from "../friends/RenderRoom";
import { useNavigate, useParams } from "react-router-dom";
import { Row, Col } from "react-bootstrap";
import Peer from "peerjs";
import bgImg from "../../../assets/chatBG.png";
import UsersList from "./UsersList";
import Footer from "../Footer";
import Header from "../Header";

function RoomsList() {
  const p = useParams();

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

  useEffect(() => {
    const connection = io.connect("spotspeer.herokuapp.com");
    ioConnection.current = connection;
    peer.current = new Peer(undefined, {
      secure: true,
      host: process.env.REACT_APP_PEER_API,
    });
    peer.current.on("open", (myId) => console.log(myId));
    peer.current?.on("disconnected", (peerId) => {
      console.log("disconnected", peerId);
      ioConnection.current?.emit("peer-disconnect", peerId);
    });

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
      const { data: serverInfo } = await api.get(`/server/${p.serverId}`);
      setServer(serverInfo);
      setUserConnectedToServer(getUsersConnectedToServer);
    })();
  }, [p.serverId]);
  return (
    <>
      <div className="body" style={{ width: "99vw" }}>
        <Header />

        <img src={bgImg} className="bg-image" alt="" />

        <Row>
          <Col xs={10} style={{ height: "76vh", marginBottom: "2vh" }}>
            <div className="roomList">
              <div className="roomsCont">
                <h3 style={{ margin: "0 10px", color: "#27333a" }}>
                  {server?.name}
                </h3>
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

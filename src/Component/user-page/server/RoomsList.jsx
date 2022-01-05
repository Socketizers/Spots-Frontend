import { useEffect, useRef, useState } from "react";
import Chat from "./Chat";
import Media1 from "./Media1";
import Podcast from "./Podcast";
import api from "../../../app/api";
import io from "socket.io-client";
import RenderRoom from "../friends/RenderRoom";
import { useNavigate, useParams } from "react-router-dom";
import { If, Then, When } from "react-if";
import Peer from "peerjs";

function RoomsList() {
  const [rooms, setRooms] = useState([]);
  const ioConnection = useRef(null);
  const peer = useRef(null);
  const params = useParams();
  const navigation = useNavigate();
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
    return () => {
      connection.close();
      peer.current.destroy();
    };
  }, []);

  useEffect(() => {
    (async () => {
      const roomsRes = await api(`/rooms/server/1`);
      setRooms(roomsRes.data);
    })();
  }, []);
  return (
    <div className="roomList">
      <div className="roomsCont">
        <h4>chat</h4>
        {rooms
          ?.filter((room) => room.type === "text")
          ?.map((room, index) => {
            return (
              <RenderRoom
                key={index}
                onClick={() => {
                  navigation(`/rooms/${room.name}${room.id}`);
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
                ioConnection={ioConnection.current}
                onClick={() => {
                  navigation(`/rooms/${room.name}${room.id}`);
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
                key={index}
                onClick={() => {
                  navigation(`/rooms/${room.name}${room.id}`);
                }}
                room={room}
              />
            );
          })}
      </div>
      {/* {rooms.map((room, i) => (
        <Row key={i} style={{ marginBottom: ".5em" }}>
          {room.type === "text" && (
            <Chat rooms={room} ioConnection={ioConnection} />
          )}
          {room.type === "podcast" && (
            <Podcast rooms={room} ioConnection={ioConnection} />
          )}
          {room.type === "voice" && (
            <Media1 rooms={room} ioConnection={ioConnection} />
          )}
        </Row>
      ))} */}
      <div className="roomsArray">
        {rooms?.map((room) => (
          <div key={room.id}>
            <When condition={room.type === "text"}>
              <Chat ioConnection={ioConnection.current} room={room} />
            </When>
            <When condition={room.type === "voice"}>
              <Media1 room={room} ioConnection={ioConnection.current} />
            </When>
            <If condition={room.type === "podcast"} style={{ height: "100%" }}>
              <Then>
                <Podcast
                  peer={peer.current}
                  room={room}
                  ioConnection={ioConnection.current}
                  style={{ height: "100%" }}
                />
              </Then>
            </If>
          </div>
        ))}
      </div>
    </div>
  );
}

export default RoomsList;

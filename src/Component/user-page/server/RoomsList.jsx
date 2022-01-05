import { useEffect, useRef, useState } from "react";
import Chat from "./Chat";
import Podcast from "./Podcast";
import api from "../../../app/api";
import io from "socket.io-client";
import RenderRoom from "../friends/RenderRoom";
import { useNavigate } from "react-router-dom";

import Peer from "peerjs";

function RoomsList() {
  const [comp, setComp] = useState(<></>);
  const [rooms, setRooms] = useState([]);
  const ioConnection = useRef(null);
  const peer = useRef(null);
  const navigation = useNavigate();
  const setComponent = (comp) => {
    setComp(comp);
  };
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
                setComponent={setComponent}
                key={index}
                onClick={() => {
                  navigation(`/rooms/${room.name}${room.id}`);
                  setComponent(
                    <Chat ioConnection={ioConnection.current} room={room} />
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
                setComponent={setComponent}
                key={index}
                onClick={() => {
                  navigation(`/rooms/${room.name}${room.id}`);
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
  );
}

export default RoomsList;

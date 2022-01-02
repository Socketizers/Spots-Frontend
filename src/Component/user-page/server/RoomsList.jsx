import { useEffect, useState } from "react";
import Chat from "./Chat";
import Media from "./Media";
import Podcast from "./Podcast";
import api from "../../../app/api";
import io from "socket.io-client";

function RoomsList() {
  const [rooms, setRooms] = useState([]);
  const [ioConnection, setIoConnection] = useState(null);

  useEffect(() => {
    const connection = io.connect("socketizers.herokuapp.com");
    setIoConnection(connection);
    return () => connection.close();
  }, []);

  useEffect(() => {
    (async () => {
      const roomsRes = await api(`/rooms/server/1`);

      setRooms(roomsRes.data);
    })();
  }, []);
  return (
    <div>
      <Podcast
        rooms={rooms.filter((room) => room.type === "podcast")}
        ioConnection={ioConnection}
      />
      <Media
        rooms={rooms.filter((room) => room.type === "voice")}
        ioConnection={ioConnection}
      />
      <Chat
        rooms={rooms.filter((room) => room.type === "text")}
        ioConnection={ioConnection}
      />
    </div>
  );
}

export default RoomsList;

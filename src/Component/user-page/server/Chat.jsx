import React, { useState, useEffect } from "react";
import { useSelector } from "react-redux";
import api from "../../../app/api";
import io from "socket.io-client";
import axios from "axios";
function Chat() {
  const userInfo = useSelector((state) => state.auth.user);
  const [ioConnection, setIoConnection] = useState(null);
  const [rooms, setRooms] = useState([]);
  const [selectedRoom, setSelectedRoom] = useState(null);
  const [messages, setMessages] = useState([]);
  useEffect(async () => {
    (async () => {
      const roomsRes = await fetch(
        `https://socketizers.herokuapp.com/rooms/server/1`
      );
      const allRooms = await roomsRes.json();
      setRooms(allRooms);
    })();
    const connection = io.connect("socketizers.herokuapp.com");
    setIoConnection(connection);
    return () => ioConnection.close();
  }, []);

  useEffect(async () => {
    (async () => {
      setMessages([]);
      if (selectedRoom) {
        let h = await api.get("/message/room/" + selectedRoom.id);
        setMessages(h.data);
      }
    })();
  }, [selectedRoom]);

  ioConnection?.on("new_message", (msg, username) => {
    if (messages?.message === "Start a conversation!")
      setMessages([{ message: msg, username }]);
    else setMessages([...messages, { message: msg, username }]);
    console.log("new_message");
  });
  return (
    <div>
      <ul>
        {rooms.map((room, index) => {
          return (
            <li
              style={{ margin: "20px 0" }}
              key={index}
              onClick={() => {
                if (selectedRoom)
                  ioConnection.emit(
                    "leave",
                    selectedRoom.name + selectedRoom.id
                  );
                ioConnection.emit(
                  "join_text",
                  userInfo.username,
                  room.name + room.id
                );
                setSelectedRoom({ name: room.name, id: room.id });
              }}
            >
              {room.name}
            </li>
          );
        })}
      </ul>

      <form
        onSubmit={async (e) => {
          e.preventDefault();
          ioConnection.emit(
            "new_message",
            e.target.message.value,
            userInfo.username,
            selectedRoom.name + selectedRoom.id
          );
          console.log(e.target.message.value);
          await api.put(`/message/room/${selectedRoom.id}`, {
            message: e.target.message.value,
          });
        }}
      >
        <label>message</label>
        <input type="text" id="message" />
        <button>Submit</button>
      </form>

      <div>
        {messages?.map
          ? messages?.map((msg, i) => (
              <li key={i}>
                {msg.username} : {msg.message}
              </li>
            ))
          : null}
      </div>
    </div>
  );
}

export default Chat;

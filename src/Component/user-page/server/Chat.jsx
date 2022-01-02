import React, { useState, useEffect } from "react";
import { useSelector } from "react-redux";
import api from "../../../app/api";
function Chat({ rooms, ioConnection }) {
  const userInfo = useSelector((state) => state.auth.user);

  const [selectedRoom, setSelectedRoom] = useState(null);
  const [messages, setMessages] = useState([]);

  useEffect(() => {
    (async () => {
      setMessages([]);
      if (selectedRoom) {
        let roomHistory = await api.get("/message/room/" + selectedRoom.id);
        setMessages(roomHistory.data);
      }
    })();
  }, [selectedRoom]);

  ioConnection?.on("new_message", (msg, username) => {
    if (messages?.message === "Start a conversation!")
      setMessages([{ message: msg, username }]);
    else setMessages([...messages, { message: msg, username }]);
  });

  return (
    <div>
      <ul>
        {rooms?.map((room, index) => {
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

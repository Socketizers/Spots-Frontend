import React, { useState, useEffect } from "react";
import api from "../../../app/api";
import MsgList from "./MsgList";
import io from "socket.io-client";
import { useSelector } from "react-redux";

function PrivateChat() {
  const userInfo = useSelector((state) => state.auth.user);
  const [currentChat, setCurrentChat] = useState({});
  const [users, setUsers] = useState([]);
  const [currentReceiver, setCurrentReceiver] = useState(null);
  const [ioConnection, setIoConnection] = useState(null);

  useEffect(() => {
    const connection = io.connect("socketizers.herokuapp.com");
    setIoConnection(connection);
    (async () => {
      const response = await api.get("/users");
      setUsers(response.data);
    })();
    connection.emit("join-private-room", userInfo.id);
  }, [userInfo.id]);

  async function updateCurrentChat(receiver) {
    try {
      setCurrentReceiver(receiver);
      const chat = await api.get(`/private-room/users/${receiver.id}`);
      setCurrentChat(chat.data.message_history);
    } catch (e) {
      console.log(e);
    }
  }

  function getUser(userId) {
    return users.map((user) => {
      if (user.id === userId) return user;
    })[0];
  }

  return (
    <div>
      <ul>
        {users.map((user, index) => {
          return (
            <li
              key={index}
              onClick={() => {
                setCurrentChat({});
                updateCurrentChat(user);
              }}
            >
              {user.username}
            </li>
          );
        })}
      </ul>
      <MsgList
        updateCurrentChat={updateCurrentChat}
        currentReceiver={currentReceiver}
        currentChat={currentChat}
        ioConnection={ioConnection}
        userInfo={userInfo}
        getUser={getUser}
      />
    </div>
  );
}

export default PrivateChat;

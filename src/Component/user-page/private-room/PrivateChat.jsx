import React, { useState, useEffect } from "react";
import { Col, Row } from "react-bootstrap";
import api from "../../../app/api";
import { useSelector } from "react-redux";
import MsgList from "./MsgList";
import io from "socket.io-client";
import "./PrivateChat.scss";
import Avatar from "@mui/material/Avatar";


function PrivateChat(props) {
  const [directMessages, setDirectMessages] = useState([]);
  const userInfo = useSelector((state) => state.auth.user);
  const receiver = useSelector((state) => state.receiver.receiver);

  const [ioConnection, setIoConnection] = useState(null);

  let messagesListArr = [];

  useEffect(() => {
    const connection = io.connect("socketizers.herokuapp.com");
    setIoConnection(connection);

    (async () => {
      if (userInfo.id) {
        const messagesList = await api.get(`/user/private-room/${userInfo.id}`);
        await messagesList.data[0].map(async (chat) => {
          if (chat.user1_id === userInfo.id) {
            let response = await api.get(`/users/one-user/${chat.user2_id}`);
            let user = response.data;

            messagesListArr.push({
              id: user.id,
              fullName: user.fullName,
              username: user.username,
              image: user.image,
              lastMessage: Object.values(chat.message_history)[
                Object.values(chat.message_history).length - 1
              ].message,
            });
          } else {
            let response = await api.get(`/users/one-user/${chat.user1_id}`);
            let user = response.data;
            messagesListArr.push({
              id: user.id,
              fullName: user.fullName,
              username: user.username,
              image: user.image,
              lastMessage: Object.values(chat.message_history)[
                Object.values(chat.message_history).length - 1
              ].message,
            });
          }
        });
      }

      setTimeout(() => {
       if(!receiver) props.updateCurrentChat(messagesListArr[0]);
        setDirectMessages(messagesListArr);
      }, 500);
    })();
    connection.emit("join-private-room", userInfo.id);
  }, [userInfo]);

  useEffect(() => {
    if(receiver) {
      props.updateCurrentChat(receiver)
    }
  }, [receiver])

  return (
    <Row>
      <Col xs={2} id="directMessagesCol">
        <h2>Direct Messages</h2>

        <div id="directChatContainer">
          {directMessages?.length > 0 &&
            directMessages.map((userChat, index) => {
              return (
                <div
                  className="directChatDiv"
                  key={index}
                  onClick={() => props.updateCurrentChat(userChat)}
                >
                  <Row>
                    <Col md={2}>
                   <Avatar
                  alt={userChat.username}
                  src={userChat.image}
                  sx={{ bgcolor: "#24464e" }}
                  style={{width: '35px',
                   height:'35px'
                  }}
                />
                </Col>
                  <Col>
                  <h4>{userChat.fullName}</h4>
                  <p>{userChat.lastMessage}</p>
                  </Col>
                  </Row>
                </div>
              );
            })}
        </div>
      </Col>
      <Col xs={10}>
        <MsgList
          updateCurrentChat={props.updateCurrentChat}
          currentReceiver={props.currentReceiver}
          currentChat={props.currentChat}
          ioConnection={ioConnection}
          userInfo={userInfo}
        />
      </Col>
    </Row>
  );
}

export default PrivateChat;

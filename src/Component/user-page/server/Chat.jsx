import React, { useState, useEffect } from "react";
import { If, Then } from "react-if";
import { useSelector } from "react-redux";
import { useParams } from "react-router-dom";
import api from "../../../app/api";
import "./roomsStyle.css";
import "./chat.scss";

function Chat({ room, ioConnection }) {
  const userInfo = useSelector((state) => state.auth.user);
  const params = useParams();
  const messagesEnd = React.useRef();
  const [messages, setMessages] = useState([]);
  const scrollToBottom = () => {
    messagesEnd.current?.scrollIntoView({ behavior: "smooth" });
  };
  useEffect(() => {
    (async () => {
      setMessages([]);
      if (room.name + room.id === params.id) {
        let roomHistory = await api.get(`/message/room/${room.id}`);
        if (roomHistory.message === "Start a conversation!") setMessages([]);
        else setMessages(roomHistory.data);
      }
    })();
    return () => console.log("clear");
  }, [
    ioConnection,
    params,
    room.id,
    room.length,
    room.name,
    userInfo.username,
  ]);
  useEffect(() => scrollToBottom());
  ioConnection?.on("new_message", (msg, username) => {
    if (messages?.message === "Start a conversation!")
      setMessages([{ message: msg, username }]);
    else setMessages([...messages, { message: msg, username }]);
  });

  return (
    <If condition={room.name + room.id === params.id}>
      <Then>
        <div className="chat">
          <div className="container clearfix">
            <div className="chat-history">
              {messages?.map
                ? messages?.map((msg, i) => (
                    <li key={i}>
                      <div className="message-data">
                        <span className="message-data-name">
                          <i className="fa fa-circle online"></i> {msg.username}
                        </span>
                        <span className="message-data-time">{msg.time}</span>
                      </div>
                      <div className="message my-message">{msg.message}</div>
                    </li>
                  ))
                : null}
              <div
                style={{ float: "left", clear: "both" }}
                ref={messagesEnd}
              ></div>
            </div>
          </div>
        </div>
        <div className="write">
          <form
            onSubmit={async (e) => {
              e.preventDefault();
              ioConnection.emit(
                "new_message",
                e.target.message.value,
                userInfo.username,
                params
              );
              const messages = await api.put(`/message/room/${room.id}`, {
                message: e.target.message.value,
              });
              let m = messages.data.message_history;
              setMessages((prev) => [...prev, m[m.length - 1]]);
              e.target.message.value = "";
            }}
          >
            <input type="text" id="message" />
            <button className="button-chat">
              <i className="far fa-paper-plane"></i>
            </button>
          </form>
        </div>
      </Then>
    </If>
  );
}

export default Chat;

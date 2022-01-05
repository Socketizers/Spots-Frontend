import React, { useState, useEffect } from "react";
import { If, Then } from "react-if";
import { useSelector } from "react-redux";
import { useParams } from "react-router-dom";
import api from "../../../app/api";
import "./roomsStyle.css";
import "./chat.scss";
import { Picker } from "emoji-mart";
import EmojiEmotionsSharpIcon from "@mui/icons-material/EmojiEmotionsSharp";
import SendSharpIcon from "@mui/icons-material/SendSharp";
import { OverlayTrigger, Form, Popover } from "react-bootstrap";

function Chat({ room, ioConnection }) {
  const userInfo = useSelector((state) => state.auth.user);
  const params = useParams();
  const messagesEnd = React.useRef();
  const [messages, setMessages] = useState([]);
  const [text, setText] = useState("");
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
      console.log(room.name + room.id);
      ioConnection.emit("join_text", userInfo.username, room.name + room.id);
    })();
  }, [params]);
  useEffect(() => scrollToBottom());

  ioConnection?.on("new_message", (msg, username) => {
    if (messages?.message === "Start a conversation!")
      setMessages([{ message: msg, username }]);
    else setMessages([...messages, { message: msg, username }]);
  });

  function handleTextChange(e) {
    setText(e.target.value);
  }

  function addEmoji(e) {
    let emoji = e.native;
    setText(text + emoji);
  }

  const popover = (
    <Popover id="popover-basic">
      <Popover.Body>
        <Picker onSelect={addEmoji} style={{ width: "100%", height: "100%" }} />
      </Popover.Body>
    </Popover>
  );

  return (
    <If condition={room.name + room.id === params.id}>
      <Then>
        <div id="serverChatDiv">
          <div className="chat">
            <div className="container clearfix">
              <div className="chat-history">
                {messages?.map
                  ? messages?.map((msg, i) => (
                      <li key={i}>
                        <div className="message-data">
                          <span className="message-data-name">
                            <i className="fa fa-circle online"></i>{" "}
                            {msg.username}
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
            <Form id="sendMessageForm" onSubmit={(e) => e.preventDefault()}>
              <Form.Control
                type="text"
                placeholder="send a message"
                id="newMessage"
                value={text}
                onChange={handleTextChange}
              />

              <OverlayTrigger trigger="click" placement="top" overlay={popover}>
                <EmojiEmotionsSharpIcon
                  style={{ color: "#38798a", cursor: "pointer" }}
                />
              </OverlayTrigger>
              <SendSharpIcon
                onClick={async () => {
                  ioConnection.emit(
                    "new_message",
                    text,
                    userInfo.username,
                    params.id
                  );
                  const messages = await api.put(`/message/room/${room.id}`, {
                    message: text,
                  });
                  let m = messages.data.message_history;
                  if (m.message === "Start a conversation!") setMessages([]);
                  else setMessages((prev) => [...prev, m[m.length - 1]]);
                  setText("");
                }}
                id="sendMessageBtn"
              />
            </Form>
            {/* <form
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
          </form> */}
          </div>
        </div>
      </Then>
    </If>
  );
}

export default Chat;

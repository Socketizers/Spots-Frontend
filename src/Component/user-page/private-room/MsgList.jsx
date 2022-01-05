import React, { useState, useEffect } from "react";
import "emoji-mart/css/emoji-mart.css";
import { Picker } from "emoji-mart";
import { Form, OverlayTrigger, Popover } from "react-bootstrap";
import EmojiEmotionsSharpIcon from "@mui/icons-material/EmojiEmotionsSharp";
import SendSharpIcon from "@mui/icons-material/SendSharp";
import api from "../../../app/api";

function MsgList(props) {
  const [text, setText] = useState("");

  props.ioConnection?.on(
    "new_private_message",
    async (sender, receiver, message) => {
      console.log("new message");
      const senderInfo = await api.get(`/users/one-user/${parseInt(sender)}`);
      props.updateCurrentChat(senderInfo.data);
    }
  );

  useEffect(() => {
    let newMessages = document.getElementById("messagesDev");

    newMessages.scrollTo({
      top: newMessages.scrollHeight,
    });
  }, [props.currentChat]);

  function sendMessage(message) {
    // console.log("send message");
    props.ioConnection.emit(
      "new_private_message",
      `${props.userInfo.id}`,
      `${props.currentReceiver.id}`,
      message
    );
    props.updateCurrentChat(props.currentReceiver);
    setText("");
  }

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
    <div id="chatAreaDiv">
      <div id="currentChatHeader">
        <img src={props.currentReceiver?.image} />
        <h3>
          {props.currentReceiver?.username}{" "}
          <span style={{ fontSize: "small" }}>Online</span>{" "}
        </h3>
      </div>
      <div id="messagesDev">
        {Object.entries(props.currentChat).map(([key, value]) => {
          return (
            <div
              key={key}
              className={
                key.split("|")[0] === `${props.userInfo.id}`
                  ? "myMessage"
                  : "userMessage"
              }
            >
              <p>
                {value.time.split("T")[0]} at{" "}
                {value.time.split("T")[1].split(":")[0]}:
                {value.time.split("T")[1].split(":")[1]}
              </p>

              <span>{value.message}</span>
            </div>
          );
        })}
      </div>
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
        <SendSharpIcon onClick={() => sendMessage(text)} id="sendMessageBtn" />
      </Form>
    </div>
  );
}

export default MsgList;

import React, { useState } from "react";
import "emoji-mart/css/emoji-mart.css";
import { Picker } from "emoji-mart";

function MsgList(props) {
  const [text, setText] = useState("");

  props.ioConnection?.on("new_private_message", (sender, receiver, message) => {
    const senderInfo = props.getUser(parseInt(sender));
    props.updateCurrentChat(senderInfo);
  });

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

  return (
    <div>
      <form
        onSubmit={(e) => {
          e.preventDefault();
          sendMessage(text);
        }}
      >
        <label>New Message</label>
        <input
          placeholder="send a message"
          type="text"
          id="newMessage"
          value={text}
          onChange={handleTextChange}
        />
        <button>Send</button>
        <Picker onSelect={addEmoji} />
      </form>
      {Object.entries(props.currentChat).map(([key, value]) => {
        return (
          <p key={key}>
            {key.split("|")[0] === `${props.userInfo.id}`
              ? props.userInfo.username
              : props.currentReceiver.username}{" "}
            : {value.message}
          </p>
        );
      })}
    </div>
  );
}

export default MsgList;

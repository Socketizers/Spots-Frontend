import React from "react";
import { useSelector } from "react-redux";
import { useParams } from "react-router-dom";
const iconsStyle = {
  fontSize: "1.5rem",
  width: "1.5rem",
};
export default function RenderRoom({ onClick, room, ioConnection }) {
  const userInfo = useSelector((state) => state.auth.user);
  const { id } = useParams();
  if (room.type === "voice") {
    return (
      <div
        className={`selectRoom ${
          id === room.name + room.id ? "activeRoom" : ""
        }`}
        onClick={onClick}
        lg={2}
      >
        <i
          className={`fas fa-microphone-alt ${
            id === room.name + room.id ? "activeRoom" : ""
          }`}
          style={iconsStyle}
        ></i>{" "}
        {room.name}
      </div>
    );
  }
  if (room.type === "text") {
    return (
      <div
        className={`selectRoom ${
          id === room.name + room.id ? "activeRoom" : ""
        }`}
        onClick={() => {
          onClick();
          ioConnection?.emit(
            "join_text",
            userInfo.username,
            room.name + room.id
          );
        }}
      >
        <i
          className={`fas fa-keyboard ${
            id === room.name + room.id ? "activeRoom" : ""
          }`}
          style={iconsStyle}
        ></i>{" "}
        {room.name}
      </div>
    );
  }
  if (room.type === "podcast") {
    return (
      <div
        onClick={onClick}
        className={`selectRoom ${
          id === room.name + room.id ? "activeRoom" : ""
        }`}
      >
        <i
          style={iconsStyle}
          className={`fas fa-podcast ${
            id === room.name + room.id ? "activeRoom" : ""
          }`}
        ></i>
        {room.name}
      </div>
    );
  }
}

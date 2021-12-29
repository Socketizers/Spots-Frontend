import React from "react";
import Chat from "./Chat";
import Media from "./Media";
import Podcast from "./Podcast";

function RoomsList() {
  return (
    <div>
      <Podcast />
      <Media />
      <Chat />
    </div>
  );
}

export default RoomsList;

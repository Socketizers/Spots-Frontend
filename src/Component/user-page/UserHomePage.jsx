import React, { useState, useEffect } from "react";
import { useDispatch, useSelector } from "react-redux";
import { getFriendsList } from "../../features/friends/friendsSlice";
import { getFriendsRequest } from "../../features/friends/friendsReqSlice";
import cookie from "react-cookies";
import { getAllServers } from "../../features/server/serverSlice";
import "./ServersArea.css";
import SettingsIcon from "@mui/icons-material/Settings";
import AddCircleIcon from "@mui/icons-material/AddCircle";

import FriendList from "./friends/FriendList";
import MyStory from "./profile/MyStory";
import Button from "@mui/material/Button";
import { Col, Row } from "react-bootstrap";
import RenderServers from "./add-create-server/add/RenderServers";
import ServerDec from "./add-create-server/add/ServerDec";
import CreateServer from "./add-create-server/create/CreateServer";

function UserHomePage() {
  const servers = useSelector((state) => state.server.servers);
  const userInfo = useSelector((state) => state.auth.user);
  const [open, setOpen] = useState(false);
  const [showServerDescriptionModal, setShowServerDescriptionModal] =
    useState(false);
  const [showCreateServerModal, setShowCreateServerModal] = useState(false);
  const [selectedServer, setSelectedServer] = useState({});

  const dispatcher = useDispatch();

  const handleOpen = () => setOpen(true);
  const handleClose = () => setOpen(false);

  useEffect(() => {
    dispatcher(getFriendsList());
    dispatcher(getFriendsRequest());
    if (cookie.load("token")) dispatcher(getAllServers());
  }, []);

  return (
    <div>
      <h2>User Home Page</h2>
      <div>
        <Button onClick={handleOpen}>Add Story</Button>
        <MyStory open={open} handleClose={handleClose} />
      </div>
      <Col xs={10} className="serversCol">
        <RenderServers
          category={"General"}
          servers={servers.filter((server) => server.category === "General")}
        />
        <RenderServers
          category={"Financial"}
          servers={servers.filter((server) => server.category === "Financial")}
        />
        <RenderServers
          category={"Career"}
          servers={servers.filter((server) => server.category === "Career")}
        />
        <RenderServers
          category={"Sport"}
          servers={servers.filter((server) => server.category === "Career")}
        />
        <RenderServers
          category={"Entertainment"}
          servers={servers.filter((server) => server.category === "Career")}
        />
      </Col>

      <div id="footerRow">
        <div id="ownedServer">
          <AddCircleIcon
            id="createServerIcon"
            onClick={() => setShowCreateServerModal(true)}
          />
          {servers
            .filter((server) => server.user_id === userInfo.id)
            .map((server, index) => (
              <span
                key={index}
                className="serverSpan"
                onClick={() => {
                  setSelectedServer(server);
                  setShowServerDescriptionModal(true);
                }}
              >
                <img src={server.image} className="footerServerListImg" />
                <SettingsIcon className="settingsIcon" />
              </span>
            ))}
        </div>
        <div id="notOwnedServers">
          {servers
            .filter((server) => server.user_id !== userInfo.id)
            .map((server, index) => (
              <span
                key={index}
                className="serverSpan"
                onClick={() => {
                  setSelectedServer(server);
                  setShowServerDescriptionModal(true);
                }}
              >
                <img src={server.image} className="footerServerListImg" />
              </span>
            ))}
        </div>
        <CreateServer
          setShowModal={setShowCreateServerModal}
          showModal={showCreateServerModal}
        />
        <ServerDec
          setShowModal={setShowServerDescriptionModal}
          showModal={showServerDescriptionModal}
          selectedServer={selectedServer}
        />
      </div>

      <FriendList />
    </div>
  );
}

export default UserHomePage;

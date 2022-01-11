import React, { useState, useEffect } from "react";
import { useDispatch, useSelector } from "react-redux";
import { getFriendsList } from "../../features/friends/friendsSlice";
import { Row, Col } from "react-bootstrap";
import "./UserPage.scss";
import cookie from "react-cookies";
import "./ServersArea.css";
import FriendList from "./friends/FriendList";
import RenderServers from "./add-create-server/add/RenderServers";
import bgImg from "../../assets/chatBG.png";
import api from "../../app/api";
import io from "socket.io-client";
import Footer from "./Footer";
import Header from "./Header";


function UserHomePage() {
  const servers = useSelector((state) => state.server.servers);
  const user = useSelector((state) => state.auth.user);

  const [showServerDescriptionModal, setShowServerDescriptionModal] = useState(false);
  const [showCreateServerModal, setShowCreateServerModal] = useState(false);
  const [selectedServer, setSelectedServer] = useState({});

  const [ioConnection, setIoConnection] = useState(null);

  const dispatcher = useDispatch();




  /******************** for private chat ********************* */

  const [currentChat, setCurrentChat] = useState({});
  const [currentReceiver, setCurrentReceiver] = useState(null);

  async function updateCurrentChat(receiver) {
    try {
      console.log(receiver);
      setCurrentReceiver(receiver);
      const chat = await api.get(`/private-room/users/${receiver.id}`);
      setCurrentChat(chat.data ? chat.data.message_history : {});
    } catch (e) {
      console.log(e);
    }
  }

  /************************************************************ */

  useEffect(() => {
    const connection = io.connect("socketizers.herokuapp.com");
    setIoConnection(connection);

    connection.emit("join-request-room", user.id);

    if (cookie.load("token")) {
      dispatcher(getFriendsList());
    }
  }, [cookie.load("token")]);


  return (
    <div className="body">
      <Header/>

      <img src={bgImg} className="bg-image" alt="backgroundImage"/>

      <Row style={{ margin: "2vh 0", height: "74vh", width: "100%" }}>
        <Col xs={10} className="serversCol">
          <RenderServers
            category={"General"}
            servers={servers.filter((server) => server.category === "General")}
          />
          <RenderServers
            category={"Financial"}
            servers={servers.filter(
              (server) => server.category === "Financial"
            )}
          />
          <RenderServers
            category={"Career"}
            servers={servers.filter((server) => server.category === "Career")}
          />
          <RenderServers
            category={"Sport"}
            servers={servers.filter((server) => server.category === "Sport")}
          />
          <RenderServers
            category={"Entertainment"}
            servers={servers.filter((server) => server.category === "Entertainment")}
          />
        </Col>

        <Col xs={2} className="friend-list">
          <FriendList />
        </Col>
      </Row>

      <Footer />
  
    </div>
  );
}

export default UserHomePage;

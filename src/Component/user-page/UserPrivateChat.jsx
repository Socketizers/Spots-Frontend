import React, { useState } from "react";
import api from "../../app/api";
import Header from "./Header";
import Footer from "./Footer";
import PrivateChat from "./private-room/PrivateChat";
import FriendList from "./friends/FriendList";
import { Row, Col } from "react-bootstrap";
import bgImg from "../../assets/chatBG.png";


function UserPrivateChat() {

  /******************** for private chat ********************* */
  const [currentChat, setCurrentChat] = useState({});
  const [currentReceiver, setCurrentReceiver] = useState(null);

  async function updateCurrentChat(receiver) {
    try {
      setCurrentReceiver(receiver);
      const chat = await api.get(`/private-room/users/${receiver.id}`);
      setCurrentChat(chat.data ? chat.data.message_history : {});
    } catch (e) {
      console.log(e);
    }
  }


  return (
    <div className="body">
  {/* ************************ Header ************************* */}
      <Header/>

  {/* ************************ Background Image ************************* */}
      <img src={bgImg} className="bg-image" alt=""/>

      <Row style={{ width: "100%", height: "76vh", margin: "1vh 0" }}>
        <Col xs={10}>

  {/* ************************ Chat List & Chat Area************************* */}
          <PrivateChat
            updateCurrentChat={updateCurrentChat}
            currentReceiver={currentReceiver}
            currentChat={currentChat}
          />
        </Col>
  {/* ************************ Friends List ************************* */}
        <Col xs={2} className="friend-list">
          <FriendList updateCurrentChat={updateCurrentChat} />
        </Col>
      </Row>

  {/* ************************ Footer ************************* */}
      <Footer />

    </div>
  );
}

export default UserPrivateChat;

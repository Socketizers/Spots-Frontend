import React, { useState, useEffect } from "react";
import { useDispatch, useSelector } from "react-redux";
import { logOut } from "../../features/auth/authSlice";
import { getFriendsList } from "../../features/friends/friendsSlice";
import { getFriendsRequest, reqSeen } from "../../features/friends/friendsReqSlice";
import { Dropdown, Container, Button, Row, Col } from "react-bootstrap";
import logo1 from "../../assets/images/SPOTSLOGO00.png";
import "./UserPage.scss";
import cookie from "react-cookies";
import { getAllServers } from "../../features/server/serverSlice";
import "./ServersArea.css";
import SettingsIcon from "@mui/icons-material/Settings";
import AddCircleIcon from "@mui/icons-material/AddCircle";
import FriendList from "./friends/FriendList";
import MyStory from "./profile/MyStory";
import Requests from "./friends/Requests";
import RenderServers from "./add-create-server/add/RenderServers";
import ServerDec from "./add-create-server/add/ServerDec";
import CreateServer from "./add-create-server/create/CreateServer";
import bgImg from "../../assets/chatBG.png";





function UserHomePage() {
  const servers = useSelector((state) => state.server.servers);
  const user = useSelector((state) => state.auth.user);
  const [open, setOpen] = useState(false);
  const requests = useSelector((state) => state.friendsRequest.users);
  const seenReq = useSelector((state) => state.friendsRequest.seen);
  
  const [showServerDescriptionModal, setShowServerDescriptionModal] =
    useState(false);
  const [showCreateServerModal, setShowCreateServerModal] = useState(false);
  const [selectedServer, setSelectedServer] = useState({});

  const dispatcher = useDispatch();

  const handleOpen = () => setOpen(true);
  const handleClose = () => setOpen(false);

  useEffect(() => {
    if(cookie.load('token')){
    dispatcher(getFriendsList());
    dispatcher(getFriendsRequest());
    dispatcher(getAllServers());
    }
  }, [cookie.load('token')]);

  return (
    <div className="body">
      <header>
        <a href="/"><img src={logo1} className="logo" width="200" /></a>
        <Button className="story-btn" onClick={handleOpen}><i class="fas fa-plus"></i></Button>
        <Button className="story-btn" onClick={handleOpen}><i class="fas fa-inbox"></i></Button>

        <Dropdown   onClick={()=>dispatcher(reqSeen())}>
          <Dropdown.Toggle
            variant="Secondary"
            id="dropdown-basic"
            className="notification-btn"
          
          >
            <i class="fas fa-bell"></i>
            <div style={{visibility: !seenReq&&requests.length? 'visible':'hidden' }}> </div>
          </Dropdown.Toggle>

          <Dropdown.Menu style={{ width: "20em" }}>

            {requests.length ? 
            requests.map((req,i)=> {
            return (<Dropdown.Item as='div' key={i}>
             <Requests req={req} />
            </Dropdown.Item>)}) :
              <Dropdown.Item as='div'>
             No New Requests!
            </Dropdown.Item>}
            
          </Dropdown.Menu>
        </Dropdown>

        <div className="profile-card">
          <Row>
            <Col>
              <img src={user.image} width="200" />
            </Col>
            <Col>
              <h3>{user.username}</h3>
              <h4>ID: {user.id}</h4>
            </Col>
            <Col>
              <Dropdown>
                <Dropdown.Toggle variant="Secondary" id="dropdown-basic">
                  <i class="fas fa-chevron-down"></i>
                </Dropdown.Toggle>

                <Dropdown.Menu>
                  <Dropdown.Item href="/profile">
                    <button
                      className="d-btn"
                    >
                      My Profile
                    </button>
                    <i class="fas fa-user-cog"></i>
                  </Dropdown.Item>
                  <Dropdown.Item>
                    <button
                      className="d-btn"
                      onClick={() => dispatcher(logOut())}
                    >
                      Logout
                    </button>
                    <i class="fas fa-sign-out-alt"></i>
                  </Dropdown.Item>
                </Dropdown.Menu>
              </Dropdown>
            </Col>
          </Row>
        </div>
      </header>
      <img src={bgImg} className="bg-image" />

      <Row style={{margin: "2vh 0", height: "74vh", width:'100%'}}>
        
        <Col xs={9} className="serversCol" style={{width:'77%'}}>
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

        <Col md={2} className="friend-list">
      <FriendList />
      </Col>
      </Row>
     

      <div id="footerRow">
        <div id="ownedServer">
          <AddCircleIcon
            id="createServerIcon"
            onClick={() => setShowCreateServerModal(true)}
          />
          {servers
            .filter((server) => server.user_id === user.id)
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
            .filter((server) => server.user_id !== user.id)
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
        <MyStory open={open} handleClose={handleClose} />
        </div>
  );
}

export default UserHomePage;

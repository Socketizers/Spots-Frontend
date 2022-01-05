import React, { useState, useEffect } from "react";
import { useDispatch, useSelector } from "react-redux";
import { logOut } from "../../../features/auth/authSlice";
import { getFriendsList } from "../../../features/friends/friendsSlice";
import {
  getFriendsRequest,
  reqSeen,
} from "../../../features/friends/friendsReqSlice";
import { Dropdown, Container, Button, Row, Col, Form } from "react-bootstrap";
import logo1 from "../../../assets/images/SPOTSLOGO00.png";
import logo from "../../../assets/SPOTSLOGO-PPS.png";
import "./ProfilePage.scss";
import cookie from "react-cookies";
import { getAllServers } from "../../../features/server/serverSlice";
import SettingsIcon from "@mui/icons-material/Settings";
import AddCircleIcon from "@mui/icons-material/AddCircle";
import FriendList from "../friends/FriendList";
import MyStory from "./MyStory";
import Requests from "../friends/Requests";
import RenderServers from "../add-create-server/add/RenderServers";
import ServerDec from "../add-create-server/add/ServerDec";
import CreateServer from "../add-create-server/create/CreateServer";
import bgImg from "../../../assets/chatBG.png";
import ServerInfo from "./ServerInfo";
import api from "../../../app/api";
import org from "../../../assets/neon-orange.png";
import LeftArrow from "../../../assets/left-arrow.svg";
import RightArrow from "../../../assets/right-arrow.svg";
import "../../../../node_modules/slick-carousel/slick/slick.css";
import "../../../../node_modules/slick-carousel/slick/slick-theme.css";
import Slider from "react-slick";
import Avatar from "@mui/material/Avatar";
import {useNavigate} from "react-router-dom";
import Footer from "./Footer";





function ProfilePage() {
  const servers = useSelector((state) => state.userServers.servers);
  const user = useSelector((state) => state.auth.user);
  const [serverRooms, setServerRooms] = useState([]);
  const [serverUsers, setServerUsers] = useState([]);
  const [serverState, setServerState] = useState({});
  const navigate = useNavigate()
  const SlickArrowLeft = ({ currentSlide, slideCount, ...props }) => (
    <img src={LeftArrow} alt="prevArrow" {...props} />
  );

  const SlickArrowRight = ({ currentSlide, slideCount, ...props }) => (
    <img src={RightArrow} alt="nextArrow" {...props} />
  );
  const settings = {
    dots: false,
    infinite: false,
    speed: 500,
    slidesToShow: 5,
    slidesToScroll: 1,
    initialSlide: 0,
    prevArrow: <SlickArrowLeft />,
    nextArrow: <SlickArrowRight />,
  };
  const friendsSettings = {
    dots: false,
    infinite: false,
    speed: 500,
    slidesToShow: 8,
    slidesToScroll: 1,
    initialSlide: 0,
    prevArrow: <SlickArrowLeft />,
    nextArrow: <SlickArrowRight />,
  };
  const footerSettings = {
    dots: false,
    infinite: false,
    speed: 500,
    slidesToShow: 9,
    slidesToScroll: 1,
    initialSlide: 0,
    prevArrow: <SlickArrowLeft />,
    nextArrow: <SlickArrowRight />,
  };

  const [open, setOpen] = useState(false);
  const [openInfo, setOpenInfo] = useState(false);

  const userFriends = useSelector((state) => state.friendsList.users);
  const requests = useSelector((state) => state.friendsRequest.users);
  const seenReq = useSelector((state) => state.friendsRequest.seen);

  const [showServerDescriptionModal, setShowServerDescriptionModal] =
    useState(false);
  const [showCreateServerModal, setShowCreateServerModal] = useState(false);
  const [selectedServer, setSelectedServer] = useState({});

  const dispatcher = useDispatch();

  const handleOpen = () => setOpen(true);
  const handleClose = () => setOpen(false);

  const openServerInfo = (id, server) => {
    setOpenInfo(true);
    setServerState(server);
    api.get(`/rooms/server/${id}`).then((data) => {
      console.log("rooms", data.data);
      setServerRooms(data.data);
    });
    api.get(`/connected/server/${id}`).then((data) => {
      console.log("users", data.data);
      setServerUsers(data.data);
    });
  };
  const closeServerInfo = () => setOpenInfo(false);

  useEffect(() => {
    if (cookie.load("token")) {
      dispatcher(getFriendsList());
      dispatcher(getFriendsRequest());
      dispatcher(getAllServers());
    }
  }, [cookie.load("token")]);

  return (
    <div className="body">
      <header>
        <a href="/">
          <img src={logo1} className="logo" width="200" />
        </a>

        <div>
          <Button className="story-btn" onClick={handleOpen}>
            <i className="fas fa-plus"></i>
          </Button>
          <Button className="private-btn" href="/private-chat">
            <i className="fas fa-inbox"></i>
          </Button>

          <Dropdown onClick={() => dispatcher(reqSeen())}>
            <Dropdown.Toggle
              variant="Secondary"
              id="dropdown-basic"
              className="notification-btn"
            >
              <i className="fas fa-bell"></i>
              <div
                style={{
                  visibility:
                    !seenReq && requests.length ? "visible" : "hidden",
                }}
              >
                {" "}
              </div>
            </Dropdown.Toggle>

            <Dropdown.Menu style={{ width: "20em" }}>
              {requests.length ? (
                requests.map((req, i) => {
                  return (
                    <Dropdown.Item as="div" key={i}>
                      <Requests req={req} />
                    </Dropdown.Item>
                  );
                })
              ) : (
                <Dropdown.Item as="div">No New Requests!</Dropdown.Item>
              )}
            </Dropdown.Menu>
          </Dropdown>

          <div className="profile-card">
            <Row style={{ marginRight: "0" }}>
              <Col>
              <Avatar
                  alt={user.username}
                  src={user.image}
                  sx={{ bgcolor: "#24464e" }}
                  style={{width: '3.5em',
                    height: '3.3em',
                    borderRadius: '26px 0 0 26px',
                    display: user.image ?'inherit':'flex'
                  }}
                />
              </Col>
              <Col>
                <h3>{user.username}</h3>
                <h4>ID: {user.id}</h4>
              </Col>
              <Col>
                <Dropdown>
                  <Dropdown.Toggle variant="Secondary" id="dropdown-basic">
                    <i className="fas fa-chevron-down"></i>
                  </Dropdown.Toggle>

                  <Dropdown.Menu>
                    <Dropdown.Item href="/profile">
                      <button className="d-btn">My Profile</button>
                      <i className="fas fa-user-cog"></i>
                    </Dropdown.Item>
                    <Dropdown.Item onClick={() => dispatcher(logOut())}>
                      <button
                        className="d-btn"
                      >
                        Logout
                      </button>
                      <i className="fas fa-sign-out-alt"></i>
                    </Dropdown.Item>
                  </Dropdown.Menu>
                </Dropdown>
              </Col>
            </Row>
          </div>
        </div>
      </header>
      <img src={bgImg} className="bg-image" />
      <Row style={{ width: "100%", backgroundColor: "#ffffff61" }}>
        <Col md={9}>
          <Row style={{ margin: "2vh 5vh", height: "36vh" }}>
            <div className="profile-servers" style={{ padding: "0 3em" }}>
              <h2>My Groups</h2>
              <img src={org} className="spots img" />
              <Slider {...settings} style={{ width: "100%" }}>
                {servers?.map((server, i) => {
                  return (
                    <>
                      <div
                        key={i}
                        className="server"
                        onClick={() => openServerInfo(server.id, server)}
                      >
                        <h4>{server.name}</h4>
                        <i class="far fa-edit"></i>
                        <img src={server.image ? server.image : logo} className="img" />
                      </div>
                      <ServerInfo
                        open={openInfo}
                        handleClose={closeServerInfo}
                        server={serverState}
                        rooms={serverRooms}
                        users={serverUsers}
                      />
                    </>
                  );
                })}

                <button onClick={() => setShowCreateServerModal(true)}>
                  <i class="fas fa-plus-circle add-room"></i>
                </button>
              </Slider>
            </div>
          </Row>
          <Row style={{ margin: "2vh 5vh", height: "36vh" }}>
            <div className="profile-friends" style={{ padding: "0 3em" }}>
              <h2>My Friends</h2>
              <img src={org} className="spots" />
              <Slider {...friendsSettings} style={{ width: "100%" }}>
                {userFriends?.map((friend, i) => {
                  return (
                    <>
                      <div className="friend div" key={i}>
                        <Avatar
                          alt={friend.username}
                          src={friend.image}
                          sx={{ bgcolor:'#24464e'}}
                          className="img"
                          style={{fontSize:'2.25rem'}}
                  
                        />
                        <h4>{friend.username}</h4>
                      </div>
                    </>
                  );
                })}
              </Slider>
            </div>
          </Row>
        </Col>
        <Col md={3}>
          <div className="profile-edit">
            <Row>
              <Col md={3}>
                <img src={user.image} className="img" />
              </Col>
              <Col>
                <h4>
                  {user.fullName}
                  <br />
                  <span>#{user.id}</span>
                </h4>
              </Col>
            </Row>

            <Form>
              <Form.Group className="mb-3" controlId="formBasicEmail">
                <Form.Control type="email" placeholder={user.fullName} />
              </Form.Group>
              <Form.Group className="mb-3" controlId="formBasicEmail">
                <Form.Control type="email" placeholder={user.email} />
              </Form.Group>
              <Form.Group className="mb-3" controlId="formBasicPassword">
                <Form.Control type="password" placeholder="******" />
              </Form.Group>
              <Button
                type="submit"
                style={{
                  margin: "1em 0",
                  backgroundColor: "#0A95B6",
                  width: "8em",
                  borderColor: "#0A95B6",
                }}
              >
                Edit
              </Button>
            </Form>
          </div>
        </Col>
      </Row>

    <Footer/>
    
      <MyStory open={open} handleClose={handleClose} />
    </div>

  );
}

export default ProfilePage;

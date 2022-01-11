import React, { useState, useEffect } from "react";
import { useDispatch, useSelector } from "react-redux";
import Slider from "react-slick";
import cookie from "react-cookies";
import Footer from "../Footer";
import Header from "../Header";
import api from "../../../app/api";
import CreateServer from "../add-create-server/create/CreateServer";
import ServerInfo from "./ServerInfo";
import { getFriendsList } from "../../../features/friends/friendsSlice";
import { Button, Row, Col, Form } from "react-bootstrap";
import Avatar from "@mui/material/Avatar";
import logo from "../../../assets/SPOTSLOGO-PPS.png";
import org from "../../../assets/neon-orange.png";
import bgImg from "../../../assets/chatBG.png";
import LeftArrow from "../../../assets/left-arrow.svg";
import RightArrow from "../../../assets/right-arrow.svg";
import "../../../../node_modules/slick-carousel/slick/slick.css";
import "../../../../node_modules/slick-carousel/slick/slick-theme.css";

function ProfilePage() {
  const user = useSelector((state) => state.auth.user);
  const servers = useSelector((state) => state.userServers.servers);
  const userFriends = useSelector((state) => state.friendsList.users);

  const [serverRooms, setServerRooms] = useState([]);
  const [serverUsers, setServerUsers] = useState([]);
  const [serverState, setServerState] = useState({});
  const [openInfo, setOpenInfo] = useState(false);
  // const [showServerDescriptionModal, setShowServerDescriptionModal] = useState(false);
  const [showCreateServerModal, setShowCreateServerModal] = useState(false);
  // const [selectedServer, setSelectedServer] = useState({});

  const dispatcher = useDispatch();

// ************************ Slider Arrows*************************
  const SlickArrowLeft = ({ currentSlide, slideCount, ...props }) => (
    <img src={LeftArrow} alt="prevArrow" {...props} />
  );
  const SlickArrowRight = ({ currentSlide, slideCount, ...props }) => (
    <img src={RightArrow} alt="nextArrow" {...props} />
  );

// ************************ Slider Settings *************************
  const serversSettings = {
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

// ************************ Handle Server Modal *************************
  const openServerInfo = (id, server) => {
    setOpenInfo(true);
    setServerState(server);

    // Get server rooms & put them in a state
    api.get(`/rooms/server/${id}`).then((data) => {
      console.log("rooms", data.data);
      setServerRooms(data.data);
    });

    // Get server connected users & put them in a state
    api.get(`/connected/server/${id}`).then((data) => {
      console.log("users", data.data);
      setServerUsers(data.data);
    });
  };
  const closeServerInfo = () => setOpenInfo(false);

  useEffect(() => {
    if (cookie.load("token")) {
      dispatcher(getFriendsList());
    }
  }, [cookie.load("token")]);

  return (
    <div className="body">
  {/* ************************ Header ************************* */}
      <Header />

  {/* ************************ Background Image ************************* */}
      <img src={bgImg} className="bg-image" alt=""/>


  {/* ************************ Servers & Friends ************************* */}
      <Row style={{ width: "100%", backgroundColor: "#ffffff61" }}>
        <Col md={9}>
  {/* ************************ Servers List ************************* */}
          <Row style={{ margin: "2vh 5vh", height: "36vh" }}>
            <div className="profile-servers" style={{ padding: "0 3em" }}>
              <h2>My Groups</h2>
              <img src={org} className="spots img" alt=""/>

              {servers?.length > 0 ? (
                <Slider {...serversSettings} style={{ width: "100%" }}>
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
                          <img
                            src={server.image ? server.image : logo}
                            className="img"
                            alt=""
                          />
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
                  <i class="fas fa-plus-circle add-server"></i>
                </button>
                </Slider>
              ) : (
                <button onClick={() => setShowCreateServerModal(true)}>
                  <i class="fas fa-plus-circle add-server"></i>
                </button>
              )}
            </div>
          </Row>

  {/* ************************ Friends List ************************* */}
          <Row style={{ margin: "2vh 5vh", height: "36vh" }}>
            <div className="profile-friends" style={{ padding: "0 3em" }}>
              <h2>My Friends</h2>
              <img src={org} className="spots" alt=""/>

              <Slider {...friendsSettings} style={{ width: "100%" }}>
                {userFriends?.map((friend, i) => {
                  return (
                    <>
                      <div className="friend div" key={i}>
                        <Avatar
                          alt={friend.username}
                          src={`https://socketizers.herokuapp.com/${friend.image}`}
                          sx={{ bgcolor: "#24464e" }}
                          className="img"
                          style={{ fontSize: "2.25rem" }}
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

  {/* ************************ User Info ************************* */}
        <Col md={3}>
          <div className="profile-edit">
            <Row>
              <Col md={3}>
                <img src={user.image} className="img" alt=""/>
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

  {/* ************************ Create Server Modal ************************* */}
      <CreateServer
        setShowModal={setShowCreateServerModal}
        showModal={showCreateServerModal}
      />

  {/* ************************ Footer ************************* */}
      <Footer />
    </div>
  );
}

export default ProfilePage;

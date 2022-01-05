// import React, { useState, useEffect } from "react";
// import { useDispatch, useSelector } from "react-redux";
// import { logOut } from "../../features/auth/authSlice";
// import { getFriendsList } from "../../features/friends/friendsSlice";
// import {
//   getFriendsRequest,
//   reqSeen,
// } from "../../features/friends/friendsReqSlice";
// import { Dropdown, Button, Row, Col } from "react-bootstrap";
// import logo1 from "../../assets/images/SPOTSLOGO00.png";
// import logo from "../../assets/SPOTSLOGO-PPS.png";
// import "./UserPage.scss";
// import cookie from "react-cookies";
// import { getAllServers } from "../../features/server/serverSlice";
// import "./ServersArea.css";
// import SettingsIcon from "@mui/icons-material/Settings";
// import AddCircleIcon from "@mui/icons-material/AddCircle";
// import FriendList from "./friends/FriendList";
// import MyStory from "./profile/MyStory";
// import Requests from "./friends/Requests";
// import RenderServers from "./add-create-server/add/RenderServers";
// import ServerDec from "./add-create-server/add/ServerDec";
// import CreateServer from "./add-create-server/create/CreateServer";
// import bgImg from "../../assets/chatBG.png";
// // import "../../../node_modules/slick-carousel/slick/slick.css";
// // import "../../../node_modules/slick-carousel/slick/slick-theme.css";
// import PrivateChat from "./private-room/PrivateChat";
// import api from "../../app/api";
// import io from "socket.io-client";
// import Avatar from "@mui/material/Avatar";

// function UserHeader() {
//   const user = useSelector((state) => state.auth.user);
//   const [open, setOpen] = useState(false);
//   const requests = useSelector((state) => state.friendsRequest.users);
//   const seenReq = useSelector((state) => state.friendsRequest.seen);

//   const [ioConnection, setIoConnection] = useState(null);

//   const dispatcher = useDispatch();

//   const handleOpen = () => setOpen(true);
//   const handleClose = () => setOpen(false);


//   useEffect(() => {
//     const connection = io.connect("socketizers.herokuapp.com");
//     setIoConnection(connection);

//     connection.emit("join-request-room", user.id);

//     if (cookie.load("token")) {
//       dispatcher(getFriendsRequest());
//     }
//   }, [cookie.load("token")]);

//   ioConnection?.on("new-friendRequest", () => {
//     dispatcher(getFriendsRequest());
//   });


//   return (
//       <header>
//         <a href="/">
//           <img src={logo1} className="logo" width="200" />
//         </a>

//         <div>
//           <Button className="story-btn" onClick={props.handleOpen}>
//             <i className="fas fa-plus"></i>
//           </Button>
//           <Button className="private-btn" href="/private-chat">
//             <i className="fas fa-inbox"></i>
//           </Button>

//           <Dropdown onClick={() => dispatcher(reqSeen())}>
//             <Dropdown.Toggle
//               variant="Secondary"
//               id="dropdown-basic"
//               className="notification-btn"
//             >
//               <i className="fas fa-bell"></i>
//               <div
//                 style={{
//                   visibility:
//                     !seenReq && requests.length ? "visible" : "hidden",
//                 }}
//               >
//                 {" "}
//               </div>
//             </Dropdown.Toggle>

//             <Dropdown.Menu style={{ width: "20em" }}>
//               {requests.length ? (
//                 requests.map((req, i) => {
//                   return (
//                     <Dropdown.Item as="div" key={i}>
//                       <Requests req={req} />
//                     </Dropdown.Item>
//                   );
//                 })
//               ) : (
//                 <Dropdown.Item as="div">No New Requests!</Dropdown.Item>
//               )}
//             </Dropdown.Menu>
//           </Dropdown>

//           <div className="profile-card">
//             <Row style={{ marginRight: "0" }}>
//               <Col>
//                 <Avatar
//                   alt={user.username}
//                   src={user.image}
//                   sx={{ bgcolor: "#24464e" }}
//                   style={{
//                     width: "3.5em",
//                     height: "3.3em",
//                     borderRadius: "26px 0 0 26px",
//                     display: user.image ? "inherit" : "flex",
//                   }}
//                 />
//                 {/* <img src={user.image} width="200" /> */}
//               </Col>
//               <Col>
//                 <h3>{user.username}</h3>
//                 <h4>ID: {user.id}</h4>
//               </Col>
//               <Col>
//                 <Dropdown>
//                   <Dropdown.Toggle variant="Secondary" id="dropdown-basic">
//                     <i className="fas fa-chevron-down"></i>
//                   </Dropdown.Toggle>

//                   <Dropdown.Menu>
//                     <Dropdown.Item href="/profile">
//                       <button className="d-btn">My Profile</button>
//                       <i className="fas fa-user-cog"></i>
//                     </Dropdown.Item>
//                     <Dropdown.Item onClick={() => dispatcher(logOut())}>
//                       <button className="d-btn">Logout</button>
//                       <i className="fas fa-sign-out-alt"></i>
//                     </Dropdown.Item>
//                   </Dropdown.Menu>
//                 </Dropdown>
//               </Col>
//             </Row>
//           </div>
//         </div>
//       </header>
//       )
//       };

//       export default UserHeader;
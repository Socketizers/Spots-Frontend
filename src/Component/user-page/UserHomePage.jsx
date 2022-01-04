import React, { useState, useEffect } from "react";
import { useDispatch, useSelector } from "react-redux";
import { logOut } from "../../features/auth/authSlice";
import { getFriendsList } from "../../features/friends/friendsSlice";
import { getFriendsRequest, reqSeen } from "../../features/friends/friendsReqSlice";
import { Dropdown, Container, Button, Row, Col } from "react-bootstrap";
import logo1 from "../../assets/images/SPOTSLOGO00.png";
import "./UserPage.scss";

import FriendList from "./friends/FriendList";
import MyStory from "./profile/MyStory";
import Requests from "./friends/Requests";

function UserHomePage() {
  const [open, setOpen] = useState(false);
  const user = useSelector((state) => state.auth.user);
  const requests = useSelector((state) => state.friendsRequest.users);
  const seenReq = useSelector((state) => state.friendsRequest.seen);
  
  const dispatcher = useDispatch();

  const handleOpen = () => setOpen(true);
  const handleClose = () => setOpen(false);

  useEffect(() => {
    dispatcher(getFriendsList());
    dispatcher(getFriendsRequest());
  }, []);

  return (
    <>
      <header>
        <img src={logo1} className="logo" width="200" />
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
                  <Dropdown.Item href="#/action-1">
                    <button
                      className="d-btn"
                      onClick={() => dispatcher(logOut())}
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

      <Row style={{marginTop:'2vh'}}>
        <Col md={10}></Col>
        <Col md={2} className="friend-list">
      <FriendList />
      </Col>
      </Row>
      
      <h2>User Home Page</h2>
      
        <MyStory open={open} handleClose={handleClose} />
      
    </>

    
  );
}

export default UserHomePage;

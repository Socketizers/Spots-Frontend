import React, { useState } from "react";
import { useSelector } from "react-redux";
import Story from "./Story";
import { Row, Col } from "react-bootstrap";
import Avatar from "@mui/material/Avatar";

function FriendList() {
  const userFriends = useSelector((state) => state.friendsList.users);
  const [open, setOpen] = useState(false);

  const handleOpen = () => setOpen(true);
  const handleClose = () => setOpen(false);

  return (
    <>
      <div className="list">
         { !userFriends.length ? 'Add Friends' : userFriends.map((friend, i) => {
          return (
            <Row key={i} style={{ marginBottom: ".5em" }}>
              <Col md={2} style={{ position: "relative" }}>
                <Avatar
                  alt={friend.username}
                  src={friend.image}
                  sx={{ bgcolor:'#24464e'}}
                  style={{
                    border: friend.story ? "6px solid #8EFCBA" : "6px solid  #b9b8b8",
                    width: "2.5em",
                    height: "2.5em",
                  }}
                />
                {/* <div className="online"></div> */}
                {friend.story && (
                  <>
                    <button className="story-btn" onClick={handleOpen}></button>
                    <Story
                      open={open}
                      handleClose={handleClose}
                      story={friend.story}
                      name={friend.username}
                    />
                  </>
                )}
              </Col>
              <Col md={8}  style={{ marginLeft: "1.5em", position: "relative" }}>
                <h6 style={{ marginTop: ".8em" }}>{friend.username}</h6>
              </Col>
            </Row>
          );
        })}
      </div>
    </>
  );
}

export default FriendList;

import React, { useState, useEffect } from "react";
import { useDispatch } from "react-redux";
import { getFriendsList} from "../../features/friends/friendsSlice";
import { getFriendsRequest} from "../../features/friends/friendsReqSlice";

import FriendList from "./friends/FriendList";
import MyStory from "./profile/MyStory";
import Button from "@mui/material/Button";

function UserHomePage() {
  const [open, setOpen] = useState(false);

  const dispatcher = useDispatch();

  const handleOpen = () => setOpen(true);
  const handleClose = () => setOpen(false);

  useEffect(() => {
    dispatcher(getFriendsList());
    dispatcher(getFriendsRequest());
  }, []);

  return (
    <div>
      <h2>User Home Page</h2>
      <div>
        <Button onClick={handleOpen}>Add Story</Button>
        <MyStory open={open} handleClose={handleClose} />
      </div>
      <FriendList />

    </div>
  );
}

export default UserHomePage;

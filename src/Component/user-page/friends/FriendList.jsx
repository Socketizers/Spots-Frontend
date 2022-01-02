import React, { useState } from "react";
import { useSelector } from "react-redux";
import List from "@mui/material/List";
import ListItem from "@mui/material/ListItem";
import Story from "./Story";
import Divider from "@mui/material/Divider";
import ListItemText from "@mui/material/ListItemText";
import ListItemAvatar from "@mui/material/ListItemAvatar";
import Avatar from "@mui/material/Avatar";
import Typography from "@mui/material/Typography";
import Button from "@mui/material/Button";

function FriendList() {
  const userFriends = useSelector((state) => state.friendsList.users);
  const status = useSelector((state) => state.friendsList.status);
  const [open, setOpen] = useState(false);

  const handleOpen = () => setOpen(true);
  const handleClose = () => setOpen(false);

  return (
    <div>
      FriendList {status}
      <List
        sx={{ width: "100%", maxWidth: 360, bgcolor: "background.paper" }}
        style={{ marginTop: "3em" }}
      >
        {userFriends.map((friend, i) => {
          return (
            <ListItem
              alignItems="flex-start"
              key={i}
              style={{ borderBottom: "1px solid #dadada" }}
            >
              <ListItemAvatar>
                <Avatar alt={friend.username} src={friend.image} />
              </ListItemAvatar>
              <ListItemText
                primary={friend.username}
                secondary={
                  <React.Fragment>
                    <Typography
                      sx={{ display: "inline" }}
                      component="span"
                      variant="body2"
                      color="text.primary"
                    >
                      {friend.onlineStatus ? "Online" : "Offline"}
                    </Typography>
                    {friend.story && (
                      <>
                        <Button onClick={handleOpen}>View Story</Button>
                         <Story open={open} handleClose={handleClose} story={friend.story} />
                      </>
                    )}
                  </React.Fragment>
                }
              />
            </ListItem>
          );
        })}
      </List>
    </div>
  );
}

export default FriendList;

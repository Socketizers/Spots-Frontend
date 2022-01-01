import React from "react";
import {useSelector} from "react-redux";
import List from "@mui/material/List";
import ListItem from "@mui/material/ListItem";
import Divider from "@mui/material/Divider";
import ListItemText from "@mui/material/ListItemText";
import ListItemAvatar from "@mui/material/ListItemAvatar";
import Avatar from "@mui/material/Avatar";
import Typography from "@mui/material/Typography";




function FriendList() {

const userFriends = useSelector(state => state.friendsList.users);
const status = useSelector(state => state.friendsList.status);


  return <div>
    FriendList {status} 
     <List
      sx={{ width: "100%", maxWidth: 360, bgcolor: "background.paper" }}
      style={{ marginTop: "3em" }}
    >
      { userFriends.map(friend =>{
        return (
          <>
            <Divider variant="inset" component="li" />

            <ListItem alignItems="flex-start">
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
                  </React.Fragment>
                }
              />
            </ListItem>
          </>
        );
      })}

    
    </List>
  </div>;
}

export default FriendList;

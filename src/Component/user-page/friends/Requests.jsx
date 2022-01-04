import React from "react";
import ListItem from "@mui/material/ListItem";
import ListItemText from "@mui/material/ListItemText";
import ListItemAvatar from "@mui/material/ListItemAvatar";
import Avatar from "@mui/material/Avatar";
import api from "../../../app/api";
import { getFriendsRequest } from "../../../features/friends/friendsReqSlice";
import { getFriendsList } from "../../../features/friends/friendsSlice";
import { useDispatch } from "react-redux";

function Requests(props) {
  const dispatcher = useDispatch();
  const acceptReq = (res) => {
    let body = {
      response: res,
    };
    api.put(`/friends/${props.req.reqId}`, body).then(()=>{
        dispatcher(getFriendsRequest());
        dispatcher(getFriendsList());
    });
  };

  return (
    <ListItem
      alignItems="flex-start"
      style={{ borderBottom: "1px solid #dadada" }}
    >
      <ListItemAvatar>
        <Avatar
          style={{ width: "3em", height: "3em", marginRight: ".6em" }}
          alt={props.req.username}
          src={props.req.username}
        />
      </ListItemAvatar>
      <ListItemText
        primary={props.req.username}
        secondary={
          <React.Fragment>
            <button className="res-btn" onClick={()=>acceptReq("yes")}>Accept</button>
            <button className="res-btn reject" onClick={()=>acceptReq("no")}>Ignore</button>
          </React.Fragment>
        }
      />
    </ListItem>
  );
}

export default Requests;

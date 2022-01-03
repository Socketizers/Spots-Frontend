import React, { useState, useEffect } from "react";
import { useDispatch, useSelector } from "react-redux";
import api from "../../../app/api";
import Box from "@mui/material/Box";
import Button from "@mui/material/Button";
import Typography from "@mui/material/Typography";
import Modal from "@mui/material/Modal";

const style = {
  position: "absolute",
  top: "50%",
  left: "50%",
  transform: "translate(-50%, -50%)",
  width: 700,
  bgcolor: "background.paper",
  border: "0px solid #000",
  boxShadow: 24,
  p: 4,
};

function Story(props) {
  const storyArr = Object.values(JSON.parse(props.story));
  const [counter1, setCounter1] = useState(null);
  const [type, setType] = useState("img");
  // let type = "img";
  // let counter = 0;
  var timeout;

  function renderStory(counter) {
    if (counter < storyArr.length) {
      if (storyArr[counter].includes("video")) {
        setType("video");
      } else {
        setType("img");
      }
      setCounter1(storyArr[counter]);
      console.log("counter====>", counter, type);

      setInterval(() => {
        renderStory(counter + 1);
      }, 5000);
    } else {
      onClose();
    }
  }

  function onClose() {
    props.handleClose();
    console.log("closed");
  }
  const view = () => {
    renderStory(0);
  };

  return (
    <Modal
      open={props.open}
      onClose={onClose}
      aria-labelledby="modal-modal-title"
      aria-describedby="modal-modal-description"
    >
      <Box sx={style}>
        <Typography id="modal-modal-title" variant="h6" component="h2">
          View Story
        </Typography>
        <button onClick={view}>View</button>
        {type === "img" ? (
          <img
            src={counter1}
            alt="kk"
            style={{ width: "600px", height: "500px" }}
          />
        ) : (
          //   <Player
          //   autoPlay="true"
          //   src={counter1}
          // />
          <video src={counter1} width="600" height="500" autoPlay={true}>
            Your browser does not support HTML video.
          </video>
        )}

        <Typography id="modal-modal-description" sx={{ mt: 2 }}></Typography>
      </Box>
    </Modal>
  );
}

export default Story;

<<<<<<< HEAD
import React, { useState } from "react";
import { Carousel, Modal } from "react-bootstrap";
=======
import React, { useState, useEffect } from "react";
import { useDispatch, useSelector } from "react-redux";
import api from "../../../app/api";
import Box from "@mui/material/Box";
import Button from "@mui/material/Button";
import Typography from "@mui/material/Typography";
import Modal from "@mui/material/Modal";
>>>>>>> user-page-servers


function Story(props) {
<<<<<<< HEAD
  const [index, setIndex] = useState(0);

  const handleSelect = (selectedIndex, e) => {
    setIndex(selectedIndex);
=======
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
>>>>>>> user-page-servers
  };

  const storyArr = Object.values(JSON.parse(props.story));

  return (
    <Modal show={props.open} onHide={props.handleClose} size="lg">
      <Modal.Header closeButton>
        <Modal.Title>{props.name}'s Story</Modal.Title>
      </Modal.Header>
      <Modal.Body>
        <Carousel activeIndex={index} onSelect={handleSelect}>
          {storyArr.map((story) => {
            if (!story.includes("video")) {
              return (
                <Carousel.Item interval={3000}>
                  {" "}
                  <img
                    src={story}
                    alt="kk"
                    style={{ width: "47.7em", height: "35em" }}
                  />
                </Carousel.Item>
              );
            } else {
              return (
                <Carousel.Item>
                  <video src={story} style={{ width: "47.7em", height: "35em" }} autoPlay={true}>
                    Your browser does not support HTML video.
                  </video>
                </Carousel.Item>
              );
            }
          })}
        </Carousel>
      </Modal.Body>
    </Modal>
  
  );
}

export default Story;

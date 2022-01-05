import React, { useState } from "react";
import { Carousel, Modal } from "react-bootstrap";


function Story(props) {
  const [index, setIndex] = useState(0);

  const handleSelect = (selectedIndex, e) => {
    setIndex(selectedIndex);
  };

  const storyArr = Object.values(JSON.parse(props.story));

  return (
    <Modal show={props.open} onHide={props.handleClose} size="lg">
     
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

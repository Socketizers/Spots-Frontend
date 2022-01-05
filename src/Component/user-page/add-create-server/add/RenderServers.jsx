import React, { useState } from "react";
import "../../../../../node_modules/slick-carousel/slick/slick.css";
import "../../../../../node_modules/slick-carousel/slick/slick-theme.css";
import Slider from "react-slick";
import ServerDec from "./ServerDec";

/**
 * IMPORTANT NOTE 📓 :
 *
 *  THIS Component Styling IN ServersArea.css
 *
 */

function RenderServers(props) {
  const [showServerDescriptionModal, setShowServerDescriptionModal] =
    useState(false);
  const [selectedServer, setSelectedServer] = useState({});

  const settings = {
    dots: true,
    infinite: true,
    speed: 500,
    slidesToShow: 4,
    slidesToScroll: 4,
  };
  return (
    <div style={{ padding: "0 5%" }}>
      <h2>{props.category}</h2>
      <div className="sliderDiv">
        <Slider {...settings} className="slider">
          {props.servers?.map((server, index) => (
            <div
              className="sliderImgContainer"
              onClick={() => {
                setSelectedServer(server);
                setShowServerDescriptionModal(true);
              }}
              key={index}
            >
              <img src={server.image} className="sliderImg" />
              <div className="sliderOverlay">
                <div className="sliderText">{server.name}</div>
              </div>
            </div>
          ))}
        </Slider>
      </div>
      <ServerDec
        setShowModal={setShowServerDescriptionModal}
        showModal={showServerDescriptionModal}
        selectedServer={selectedServer}
      />
    </div>
  );
}

export default RenderServers;

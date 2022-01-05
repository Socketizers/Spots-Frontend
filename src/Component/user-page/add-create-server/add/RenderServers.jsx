import React, { useState } from "react";
import "../../../../../node_modules/slick-carousel/slick/slick.css";
import "../../../../../node_modules/slick-carousel/slick/slick-theme.css";
import Slider from "react-slick";
import ServerDec from "./ServerDec";
import LeftArrow from "../../../../assets/left-arrow.svg";
import RightArrow from "../../../../assets/right-arrow.svg";
import dots from "../../../../assets/SPOTS-spots.png";

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

  const SlickArrowLeft = ({ currentSlide, slideCount, ...props }) => (
    <img src={LeftArrow} alt="prevArrow" {...props} />
  );

  const SlickArrowRight = ({ currentSlide, slideCount, ...props }) => (
    <img src={RightArrow} alt="nextArrow" {...props} />
  );

  const settings = {
    
    dots: false,
      infinite: false,
      speed: 500,
      slidesToShow: 6,
      slidesToScroll: 1,
      initialSlide: 0,
      prevArrow: <SlickArrowLeft />,
    nextArrow: <SlickArrowRight />,
  };
  return (
    <div >

      <h2>{props.category} </h2>
    
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

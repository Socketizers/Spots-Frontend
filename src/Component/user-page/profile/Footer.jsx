import Slider from "react-slick";
import { useState } from "react";
import ServerDec from "../add-create-server/add/ServerDec";
import {useNavigate} from 'react-router-dom'
import CreateServer from "../add-create-server/create/CreateServer";
import { useSelector } from "react-redux";
import LeftArrow from "../../../assets/left-arrow.svg";
import RightArrow from "../../../assets/right-arrow.svg";
import logo2 from "../../../assets/SPOTSLOGO-PPS2.png"
const SlickArrowLeft = ({ currentSlide, slideCount, ...props }) => (
  <img src={LeftArrow} alt="prevArrow" {...props} />
);
const SlickArrowRight = ({ currentSlide, slideCount, ...props }) => (
  <img src={RightArrow} alt="nextArrow" {...props} />
);
const footerSettings = {
  dots: false,
  infinite: false,
  speed: 500,
  slidesToShow: 9,
  slidesToScroll: 1,
  initialSlide: 0,
  prevArrow: <SlickArrowLeft />,
  nextArrow: <SlickArrowRight />,
};

const Footer = () => {
  const servers = useSelector((state) => state.userServers.servers);
  const allServers = useSelector(state => state.server.servers)
  const [selectedServer, setSelectedServer] = useState({});
  const [showServerDescriptionModal, setShowServerDescriptionModal] =
    useState(false);
  const [showCreateServerModal, setShowCreateServerModal] = useState(false);
  const navigate = useNavigate(); 
  const user = useSelector((state) => state.auth.user);
  return (
    <div id="footerRow">
      <div id="notOwnedServers">
        <Slider {...footerSettings} style={{ width: "100%" }}>
          {allServers
            .filter((server) => server.users?.includes(user.id) )
            .map((server, index) => (
              <span
                key={index}
                className="serverSpan"
                onClick={() => {  
                  navigate(`/server/${server.id}`)
                }}
              >
                <img src={server.image ? server.image : logo2} className="footerServerListImg" />
                {/* <SettingsIcon className="settingsIcon" /> */}
              </span>
            ))}
          
        </Slider>
      </div>

      <div id="ownedServer">
        <Slider {...footerSettings} style={{ width: "100%" }}>
          {servers
            .filter((server) => server.user_id === user.id)
            .map((server, index) => (
              <span
                key={index}
                className="serverSpan"
                onClick={() => {
                  
                  
                  navigate(`/server/${server.id}`)

                }}
              >
                <img src={server.image ? server.image : logo2} className="footerServerListImg" />
                {/* <SettingsIcon className="settingsIcon" /> */}
              </span>
            ))}
          <div onClick={() => setShowCreateServerModal(true)}>
            <i class="fas fa-plus-circle add-server-footer"> </i>
          </div>
        </Slider>
      </div>

      <CreateServer
        setShowModal={setShowCreateServerModal}
        showModal={showCreateServerModal}
      />
      <ServerDec
        setShowModal={setShowServerDescriptionModal}
        showModal={showServerDescriptionModal}
        selectedServer={selectedServer}
      />
    </div>
  );
};

export default Footer;

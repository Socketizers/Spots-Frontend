import React from "react";
import { useSelector } from "react-redux";
import "./HomePage.css";
import { Nav, Navbar, Container, Button, Row, Col } from "react-bootstrap";
import logo from "../../assets/images/SPOTSLOGO00.png";
import logo1 from "../../assets/SPOTSLOGO.png";
import p1 from "../../assets/images/Sports.png";
import p2 from "../../assets/images/Education.jpg";
import p3 from "../../assets/images/Finance3.jpg";
import p4 from "../../assets/images/General.jpg";
import p5 from "../../assets/images/happy.jpg";
import p6 from "../../assets/images/CareerSwitch.jpg";
import f2 from "../../assets/images/customize.png";
import f3 from "../../assets/images/Entertainment3.jpg";
import f4 from "../../assets/images/02.png";
import f5 from "../../assets/images/AboutSpots.png";
import f6 from "../../assets/images/aboutl.png";
import f7 from "../../assets/images/land.png";
import dots from "../../assets/SPOTS-spots.png";
import dots2 from "../../assets/neon-orange.png";



import Masonry from "react-masonry-css";
import Footer from "../Footer";

export const HomePage = (props) => {
  const user = useSelector((state) => state.user);
  const [navBar, setNavBar] = React.useState(false);

  const breakpoints = {
    default: 3,
    1100: 4,
    700: 3,
  };

  function changeHeader() {
    if (window.scrollY >= 100) {
      setNavBar(true);
    } else {
      setNavBar(false);
    }
  }
  window.addEventListener("scroll", changeHeader);
  return (
    <>
      <Navbar className={navBar ? "NavBar  active" : "NavBar"} sticky="top">
        <Navbar.Brand
          className="mr-lg-5"
          href="/"
          style={{ visibility: navBar ? "visible" : "hidden" }}
        >
          <img src={logo1} className="logo" width="200" />
        </Navbar.Brand>

        <Navbar.Collapse
          id="basic-navbar-nav links"
          style={{ marginLeft: navBar ? "2%" : "30%" }}
        >
          <Nav.Link style={{ color: "white", fontSize: "1.1em" }} href="/">
            Home
          </Nav.Link>
          <Nav.Link style={{ color: "white", fontSize: "1.1em" }} href="#about">
            About Us
          </Nav.Link>
          <Nav.Link
            className="signUp"
            style={{
              color: "#0A95B6",
              fontSize: "1.1em",
              marginLeft: navBar ? "65%" : "40%",
              paddingTop: "4px",
            }}
            href="/sign-up"
          >
            Sign Up
          </Nav.Link>
          <Nav.Link
            style={{ color: "white", fontSize: "1.1em" }}
            href="/sign-in"
          >
            Login
          </Nav.Link>
        </Navbar.Collapse>
      </Navbar>

      <div className="landing">
        <div className="landing-header">
          <img
            src={logo}
            width="400"
            height="90"
            className="d-inline-block align-top"
            alt="React Bootstrap logo"
          />
          <h1>CONNECT AND SHARE.</h1>
          <h2>FIND YOUR SPOT IN THE WORLD!</h2>
          <button>Get Started </button>
        </div>
      </div>
      <div style={{ position: "relative", marginTop: "50em" }}>
        <Row style={{ margin: "10em 8em 6em" }}>
          <Col className="feature-1">
            <h1>CHOOSE YOUR COMMUNITY</h1>
            <img src={dots} className="dots-main" />
            <p>
            Spots offers you the chance to explore and connect to different communities and get
             the chance to find a place where you feel welcomed understood and fit, you can also 
             experience diversity from all around the world the sky is your limit with spots,
              you can also give back to spots, where you can start creating your own communities 
              and help other people feel fit and understood.

            </p>
            <button>Explore for more</button>
          </Col>
          <Col style={{ padding: "0 5em", width: "30%" }}>
            <Masonry
              breakpointCols={breakpoints}
              className="my-masonry-grid"
              columnClassName="my-masonry-grid_column"
            >
              <img
                className="featureImg"
                style={{ width: "13rem", marginBottom: "20px" }}
                src={p1}
              />
              <img
                className="featureImg"
                style={{ width: "13rem", marginBottom: "20px" }}
                src={p2}
              />
              <img
                className="featureImg"
                style={{ width: "13rem", marginBottom: "20px" }}
                src={p3}
              />
              <img
                className="featureImg"
                style={{ width: "13rem", marginBottom: "20px" }}
                src={p4}
              />
              <img
                className="featureImg"
                style={{ width: "13rem", height: "14em", marginBottom: "20px" }}
                src={p5}
              />
              <img
                className="featureImg"
                style={{ width: "13rem", marginBottom: "20px" }}
                src={p6}
              />
              <img
                className="featureImg"
                style={{ width: "13rem", marginBottom: "20px" }}
                src={p3}
              />
              <img
                className="featureImg"
                style={{ width: "13rem", marginBottom: "20px" }}
                src={p4}
              />
              <img
                className="featureImg"
                style={{ width: "13rem", marginBottom: "20px" }}
                src={p5}
              />
            </Masonry>
          </Col>
        </Row>

        <Row
          style={{
            margin: "0 0 7em",
            backgroundColor: "#F9F9F98F",
            padding: "0 8em",
          }}
        >
          <Col style={{ paddingRight: "5em", width: "30%" }}>
            <img style={{ width: "40rem", marginBottom: "20px" }} src={f2} />
          </Col>
          <Col className="feature-1">
            <h1>
              <span style={{ color: "#FF9000" }}>Customize</span>
              <br /> your Server!
            </h1>
            <p>
            Once you feel like your ready to start sharing with the world, and give back to spots communities, 
            you can create your own community within a certain category you can create rooms, and set capacity 
            and type of communication, text, voice, video share, within that room, where people can join and enjoy the experience.
            </p>
          </Col>
        </Row>

        <Row style={{ margin: "0 8em 7em" }}>
          <Col className="feature-1" style={{position:'relative'}}>
            <h1>Express Yourself!</h1>
            <img src={dots2} className="express-img"/>
            <p>
            Spots wants you to express yourself on a daily basis, wants you to share your 
            experiences with the world, you never know who you might inspire and help 
            change their life, that why spots offer user stories feature, upload or 
            capture your moments with pictures or videos for the day.
            </p>
          </Col>
          <Col style={{ paddingRight: "5em", width: "30%" }}>
            <img style={{ width: "37rem", marginBottom: "20px" }} src={f3} />
          </Col>
        </Row>

        {/* <Row
        style={{
          margin: "0 0 7em",
          backgroundColor: "#F9F9F98F",
          padding: "0 8em",
        }}
      >
        <img
          style={{ width: "100%", marginBottom: "20px", height: "50em" }}
          src={f4}
        />
      </Row> */}

        <Row style={{ margin: "10em 8em 0" }} id="about">
          <Col style={{ paddingRight: "5em", width: "30%" }}>
            <img style={{ width: "35rem", marginBottom: "20px" }} src={f5} />
          </Col>
          <Col className="feature-1" style={{ position: "relative" }}>
            <img
              style={{
                width: "15rem",
                marginBottom: "20px",
                position: "absolute",
                top: "2em",
                left: "6em",
                zIndex: "-1",
              }}
              src={f6}
            />

            <h1>About</h1>
            <p>
            Spots is a customizable App the brings people together, by allowing them to 
            find their spot in the world where they can connect with each other, 
            share diverse experiences and express themselves daily, 
              <br /> <br />
            Spots wants you to give back once you feel prepared to inspire, by giving you the control 
            you need to create communities and rooms within them where you connect with 
            people via text, audio or video, while you have control and setting option for 
            the communities you own!
            </p>
            <button type="submit" className="button">
              <i className="fab fa-apple" style={{ fontSize: "2.3em" }}></i>{" "}
              <p>Download</p>
            </button>
            <button type="submit" className="button">
              <i
                className="fab fa-google-play"
                style={{ fontSize: "2.3em" }}
              ></i>{" "}
              <p>Download</p>
            </button>
          </Col>
        </Row>
<Footer/>
        <img
          style={{
            width: "100%",
            marginBottom: "20px",
            height: "55em",
            position: "absolute",
            top: "125em",
            zIndex: "-2",
          }}
          src={f7}
        />
      </div>
    </>
  );
};

export default HomePage;

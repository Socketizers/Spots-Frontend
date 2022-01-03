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

import Masonry from "react-masonry-css";

export const HomePage = (props) => {
  const user = useSelector((state) => state.user);
  const [navBar, setNavBar] = React.useState(false);

  const breakpoints = {
    default: 3,
    1100: 4,
    700: 3,
  };

function changeHeader() {
  if(window.scrollY >= 100){
    setNavBar(true);
  }else{
    setNavBar(false);
  }
}
  window.addEventListener('scroll', changeHeader);
  return (
    <>
     <Navbar className={navBar?"NavBar  active":"NavBar"} sticky="top">
          <Navbar.Brand className="mr-lg-5" href="/" style={{visibility:navBar?'visible':'hidden'}}>
            <img src={logo1} className="logo" width="200" />
          </Navbar.Brand>

          <Navbar.Collapse id="basic-navbar-nav links" style={{marginLeft:navBar?'2%':'30%'}}>
            <Nav.Link style={{ color: "white",fontSize:'1.1em' }}  href="/">
              Home
            </Nav.Link>
            <Nav.Link style={{ color: "white",fontSize:'1.1em' }} href="#about">
              About Us
            </Nav.Link>
            <Nav.Link className="signUp" style={{ color: "#0A95B6",fontSize:'1.1em', marginLeft:navBar?'65%':'40%', paddingTop: '4px' }} href="/sign-in">
             Sign Up
            </Nav.Link>
            <Nav.Link style={{ color: "white",fontSize:'1.1em'}} href="/sign-up">
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
      <div style={{ position: "relative", marginTop:'50em' }}>
        <Row style={{ margin: "10em 8em 6em" }}>
          <Col className="feature-1">
            <h1>CHOOSE YOUR COMMUNITY</h1>
            <p>
              SPOTS brings together diverse experiences from around the
              world.Lorem ipsum dolor sit amet, consectetur adipiscing elit, sed
              do eiusmod tempor incididunt ut labore et dolore magna aliqua. Ut
              enim ad minim veniam, quis nostrud exercitation ullamco laboris
              nisi ut aliquip ex ea commodo consequat.
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
              SPOTS brings together diverse experiences from around the
              world.Lorem ipsum dolor sit amet, consectetur adipiscing elit, sed
              do eiusmod tempor incididunt ut labore et dolore magna aliqua. Ut
              enim ad minim veniam, quis nostrud exercitation ullamco laboris
              nisi ut aliquip ex ea commodo consequat.
            </p>
          </Col>
        </Row>

        <Row style={{ margin: "0 8em 7em" }}>
          <Col className="feature-1">
            <h1>Express Yourself!</h1>
            <p>
              SPOTS brings together diverse experiences from around the
              world.Lorem ipsum dolor sit amet, consectetur adipiscing elit, sed
              do eiusmod tempor incididunt ut labore et dolore magna aliqua. Ut
              enim ad minim veniam, quis nostrud exercitation ullamco laboris
              nisi ut aliquip ex ea commodo consequat.
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
              SPOTS brings together diverse experiences from around the
              world.Lorem ipsum dolor sit amet, consectetur adipiscing elit, sed
              do eiusmod tempor incididunt ut labore et dolore magna aliqua.
              <br /> <br />
              Utenim ad minim veniam, quis nostrud exercitation ullamco laboris
              nisi ut aliquip ex ea commodo consequat.
            </p>
            <button type="submit" className="button">
              <i class="fab fa-apple" style={{ fontSize: "2.3em" }}></i>{" "}
              <p>Download</p>
            </button>
            <button type="submit" className="button">
              <i class="fab fa-google-play" style={{ fontSize: "2.3em" }}></i>{" "}
              <p>Download</p>
            </button>
          </Col>
        </Row>

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

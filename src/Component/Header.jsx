import React from "react";
import { Nav, Navbar, Col } from "react-bootstrap";
import "./Header.css";
import logo from "../assets/images/SPOTSLOGO00.png";
function Header() {
  return (
    <div>
      <Navbar className="Nav">
        <Col xs={4}>
          <img
            src={logo}
            className="d-inline-block align-top"
            alt="logo"
            href="/"
            id="logoImg"
          />
        </Col>
        <Col xs={4} className="headerLinks">
          <Nav.Link href="/" className="link">
            Home
          </Nav.Link>
          <Nav.Link to="/about-us" className="link">
            About Us
          </Nav.Link>
        </Col>
        <Col xs={4} className="headerLinks">
          <Nav.Link href="/sign-up" id="sign_up">
            Sign Up
          </Nav.Link>
          <Nav.Link href="/sign-in" className="link">
            Sign In
          </Nav.Link>
          {/* <Nav.Link to="/servers">Servers list</Nav.Link> */}
          {/* <Nav.Link to="/chat">Chat</Nav.Link> */}
        </Col>
      </Navbar>
    </div>
  );
}

export default Header;

import React from "react";
import { Link } from "react-router-dom";
import { Nav, Navbar, Container } from 'react-bootstrap';
import "./Header.css"
import logo from "../assets/images/SPOTSLOGO00.png"
function Header() {
  return (
    <div>
      <Navbar className="Nav" >
  <Container>
  <img
        src= {logo}
        width="200"
        height="200"
        className="d-inline-block align-top"
        alt="React Bootstrap logo"
      />
    <Navbar.Toggle aria-controls="basic-navbar-nav" />
    <Navbar.Collapse id="basic-navbar-nav">
      <Nav className="me-auto">
        <Nav.Link href="/">Home</Nav.Link>
      <Nav.Link href="/sign-in">Sign-In</Nav.Link>
      <Nav.Link to="/about-us">About Us</Nav.Link>
      <Nav.Link to="/servers">Servers list</Nav.Link>
      <Nav.Link to="/chat">Chat</Nav.Link>
      </Nav>
    </Navbar.Collapse>
  </Container>
</Navbar>
    </div>
  );
}

export default Header;


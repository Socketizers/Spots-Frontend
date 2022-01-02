import React from "react";
import { useSelector } from "react-redux";
import './HomePage.css';
import { Nav, Navbar, Container, Button } from 'react-bootstrap';
import landing from "../../assets/images/landinsize.jpg";
import logo from "../../assets/images/SPOTSLOGO00.png"


export const HomePage = (props) => {
  const user = useSelector((state) => state.user);
  return <>
    <div className='landing'>
    <Navbar className="NavBar" >
  <Container>
  
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

<div className="landing-header">
<img
        src= {logo}
        width="450"
        height="100"
        className="d-inline-block align-top"
        alt="React Bootstrap logo"
      />
<h1>CONNECT AND SHARE.</h1>
<h2>FIND YOUR SPOT IN THE WORLD!</h2>
<Button/>
</div>



    </div>
    
    </>;
};

export default HomePage;

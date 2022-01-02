import React from "react";
import { Link } from "react-router-dom";

function Header() {
  return (
    <div>
      <div>logo</div>
      <div>Spots</div>
      <Link to="/">Home</Link>
      <Link to="/sign-in">Sign IN</Link>
      <Link to="/about-us">About Us</Link>
      <Link to="/servers">Servers list</Link>
      <Link to="/rooms">Chat</Link>
      <Link to="/private-chat">Private Chat</Link>
    </div>
  );
}

export default Header;

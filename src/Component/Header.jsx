import React from "react";
import { Link } from "react-router-dom";

function Header() {
  return (
    <div>
      <div>logo</div>
      <div>Spots</div>
      <Link to="/sign-in">Sign IN</Link>
      <Link to="/about-us">About Us</Link>
    </div>
  );
}

export default Header;

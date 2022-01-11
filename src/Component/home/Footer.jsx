
import React from "react";
import "./Footer.css";
import logo from '../../assets/SPOTSLOGOWHITE.png';

function Footer() {
  return <div>
    <div className="container-footer" style={{padding:'0', marginTop:'8em'}} >
	<div className="row" style={{textAlign:'center'}}>
	</div>

    <footer className="footer-bs">
        <div className="row">
        	<div className="col-md-4 footer-brand animated fadeInLeft">
          <img
        src= {logo}
        width="195"
        height="45"
        className="d-inline-block align-top"
        alt="Spots-logo"
      />
                <p>Spots is a chat app for people to connect together and share their stories, inspirations, ideas, hobbies and talents. The app is for people on work groups, language groups, gaming clans, school groups, and anything like that.</p>
                <h5>© 2022 Spots, All rights reserved</h5>
            </div>
        
            <div className="col-md-2 footer-social animated fadeInDown">
            	<h4>Links</h4>
            	<ul>
                	<li><a href="#about">About Us</a></li>
                	<li><a href="#">Contacts</a></li>
                	<li><a href="#">Terms & Conditions</a></li>
                	<li><a href="#">Privacy Policy</a></li>
                </ul>
            </div>
        	<div className="col-md-2 footer-social animated fadeInDown">
            	<h4>Follow Us</h4>
            	<ul>
                	<li><a href="#">Facebook</a></li>
                	<li><a href="#">Twitter</a></li>
                	<li><a href="#">Instagram</a></li>
                	<li><a href="#">Email</a></li>
                </ul>
            </div>
        	<div className="col-md-3 footer-ns animated fadeInRight">
            	<h4>Newsletter</h4>
                <h6 className="para">Find Your Spot In The World & Explore Others, Get Inpired !</h6>
                <p>
                    <div className="input-group">
                    </div>
                 </p>
            </div>
        </div>
    </footer>
</div>
  </div>;
}

export default Footer;

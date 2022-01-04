import React from "react";
import { signUp } from "../../features/auth/authSlice";
import { useDispatch } from "react-redux";
import { Form, Button, Image } from "react-bootstrap";
import signUpImg from "../../assets/images/signup.png";
import logo from "../../assets/SPOTSLOGO-PP.png";
import "./SignUp.css";
import { Link } from "react-router-dom";

function SignUp() {
  const dispatcher = useDispatch();

  const handleSubmit = (e) => {
    e.preventDefault();
    const file = document.getElementById("files").files[0];
    const body = new FormData();
    body.append("username", e.target.username.value);
    body.append("fullName", e.target.fullName.value);
    body.append("email", e.target.email.value);
    body.append("password", e.target.password.value);
    if (file) body.append("image", file);
    // console.log(body);
    dispatcher(signUp(body));
  };

  return (
    <div id="signUpContainer">
      <div id="signUpDiv">
        <div id="signUpFormDiv">
          <Form onSubmit={handleSubmit} id="signUpForm">
            <h2>
              SignUp <br /> <img src={logo} id="logo" />
            </h2>
            <Form.Group>
              <Form.Label className="labels">Username</Form.Label>
              <Form.Control
                type="text"
                placeholder="Enter Your Username"
                id="username"
              />
            </Form.Group>

            <Form.Group>
              <Form.Label className="labels">Full Name</Form.Label>
              <Form.Control
                type="text"
                placeholder="Enter Your Full Name"
                id="fullName"
              />
            </Form.Group>

            <Form.Group>
              <Form.Label className="labels">Email</Form.Label>
              <Form.Control
                type="email"
                placeholder="Enter Your Email"
                id="email"
              />
            </Form.Group>

            <Form.Group>
              <Form.Label className="labels">Pick Your Image</Form.Label>
              <Form.Control type="file" id="files" />
            </Form.Group>

            <Form.Group>
              <Form.Label className="labels">Password</Form.Label>
              <Form.Control
                type="password"
                placeholder="Enter Your Password"
                id="password"
              />
            </Form.Group>

            <Button type="submit" id="signUpSubmit">
              Sign Up
            </Button>

            <Form.Text
              className="text-muted"
              style={{ fontSize: "12px", textAlign: "center" }}
            >
              Do you already have an account?{" "}
              <Link to="/sign-in" style={{ color: "#0a95b6" }}>
                Log in
              </Link>
            </Form.Text>
          </Form>
        </div>

        {/* <form onSubmit={handleSubmit}>
        <h2>SignUp</h2>
        <input type="text" placeholder="Username" id="username" />
        <input type="text" placeholder="Fullname" id="fullName" />
        <input type="email" placeholder="Email" id="email" />
        <input type="file" placeholder="image" id="files" />
        <input type="password" placeholder="Password" id="password" />
        <button>submit</button>
      </form> */}
      </div>
      <Image src={signUpImg} id="signUpImg" />
    </div>
  );
}

export default SignUp;

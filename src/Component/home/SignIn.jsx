import React from "react";
import { useDispatch } from "react-redux";
import { Link } from "react-router-dom";
import Header from "./Header";
import { signIn } from "../../features/auth/authSlice";
import { Form, Button, Image } from "react-bootstrap";
import "./SignIn.css";
import loginImg from "../../assets/images/login.png";
import logo from "../../assets/SPOTSLOGO-PP.png";

function SignIn() {
  const dispatcher = useDispatch();

  // ************************ Handle Submission  *************************
  const handleSubmit = (e) => {
    e.preventDefault();
    dispatcher(
      signIn({
        username: e.target.username.value,
        password: e.target.password.value,
      })
    );
  };

  return (
    <>
      {/* ************************ Header ************************* */}
      <Header />

      <div className="signInContainer">
        {/* ************************ Background Image ************************* */}
        <div id="signInImgDiv">
          <Image src={loginImg} id="signInImg" />
        </div>

        {/* ************************ SignIn Form ************************* */}
        <div id="signInFormDiv">
          <Form onSubmit={handleSubmit} id="signInForm">
            <h1>
              Log In <br /> <img src={logo} id="logo" />
            </h1>
            <Form.Group className="mb-3">
              <Form.Label>Username</Form.Label>
              <Form.Control
                type="text"
                placeholder="Enter Your Username"
                id="username"
              />
            </Form.Group>

            <Form.Group className="mb-3">
              <Form.Label>Password</Form.Label>
              <Form.Control
                type="password"
                placeholder="Password"
                id="password"
              />
              <Form.Text className="text-muted" id="muted-text-signIn">
                Forgot Your Password?
              </Form.Text>
            </Form.Group>
            <Button variant="primary" type="submit" id="signInSubmit">
              Go inside!
            </Button>

            <Form.Text
              className="text-muted"
              style={{ fontSize: "12px", textAlign: "center" }}
            >
              Do you need an account?{" "}
              <Link to="/sign-up" style={{ color: "#0a95b6" }}>
                Create new account
              </Link>
            </Form.Text>
          </Form>
        </div>
      </div>
    </>
  );
}

export default SignIn;

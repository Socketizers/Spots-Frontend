import React from "react";
import { Link } from "react-router-dom";
import { useDispatch } from "react-redux";
import Header from "./Header";
import { signUp } from "../../features/auth/authSlice";
import { Form, Button, Image } from "react-bootstrap";
import "./SignUp.css";
import signUpImg from "../../assets/images/signup.png";
import logo from "../../assets/SPOTSLOGO-PP.png";
import { storage } from "../../app/firebase";

function SignUp() {
  const dispatcher = useDispatch();

  // ************************ Handle Submission *************************
  const handleSubmit = (e) => {
    e.preventDefault();
    const body = {
      username: e.target.username.value,
      fullName: e.target.fullName.value,
      email: e.target.email.value,
      password: e.target.password.value,
      image: null,
    };

    const file = document.getElementById("files").files[0];

    if (file !== undefined) {
      const name = e.target.username.value + "_" + file.name;
      const uploadTask = storage.ref(`users/${name}`).put(file);
      console.log("uploaded successfully");
      uploadTask.on(
        "state_changed",
        (snapshot) => {},
        (error) => {
          console.log(error);
        },
        () => {
          storage
            .ref("users")
            .child(name)
            .getDownloadURL()
            .then((url) => {
              body.image = url;
              dispatcher(signUp(body));
            });
        }
      );
    } else dispatcher(signUp(body));

    // const file = document.getElementById("files").files[0];
    // const body = new FormData();
    // body.append("username", e.target.username.value);
    // body.append("fullName", e.target.fullName.value);
    // body.append("email", e.target.email.value);
    // body.append("password", e.target.password.value);
    // if (file) body.append("image", file);
    // dispatcher(signUp(body));
  };

  return (
    <>
      {/* ************************ Header ************************* */}
      <Header />

      <div id="signUpContainer">
        {/* ************************ Background Image ************************* */}
        <Image src={signUpImg} id="signUpImg" />

        <div id="signUpDiv">
          {/* ************************ SignUp Form ************************* */}
          <div id="signUpFormDiv">
            <Form onSubmit={handleSubmit} id="signUpForm">
              <h2>
                SignUp <br /> <img src={logo} id="logo" alt="" />
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
        </div>
      </div>
    </>
  );
}

export default SignUp;

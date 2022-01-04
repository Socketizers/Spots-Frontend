import React from "react";
import { signIn } from "../../features/auth/authSlice";
import { useDispatch, useSelector } from "react-redux";
import { Form, Button, Image } from "react-bootstrap";
import loginImg from "../../assets/images/login.png";
import "./SignIn.css";
import { Link } from "react-router-dom";
// import { logOut } from "../../features/auth/authSlice";
import { useNavigate } from "react-router-dom";
import logo from "../../assets/SPOTSLOGO-PP.png";
import { getAllServers } from "../../features/server/serverSlice";

function SignIn() {
  const { status } = useSelector((state) => state.auth);
  const dispatcher = useDispatch();
  const navigate = useNavigate();

  const handleSubmit = (e) => {
    e.preventDefault();

    dispatcher(
      signIn({
        username: e.target.username.value,
        password: e.target.password.value,
      })
    );

    setTimeout(() => {
      if (status === "idle") {
        dispatcher(getAllServers());
        navigate("/");
      }
    }, 500);
  };

  return (
    <div className="signInContainer">
      <div id="signInImgDiv">
        <Image src={loginImg} id="signInImg" />
      </div>

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

      {/* <h1>{status}</h1>
      <form onSubmit={handleSubmit}>
        <input type="text" placeholder="Username" id="username" />
        <input type="password" placeholder="Password" id="password" />
        <button>submit</button>
      </form> */}

      {/* <button onClick={() => dispatcher(logOut())}> logout </button> */}
    </div>
  );
}

export default SignIn;

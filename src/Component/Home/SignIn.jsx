import React, { useEffect } from "react";
import { signIn } from "../../features/auth/authSlice";
import { useDispatch } from "react-redux";
// import cookie from "react-cookies";
import { logIn } from "../../features/auth/authSlice";
// var rs = require("jsrsasign");

function SignIn() {
  const dispatcher = useDispatch();

  const handleSubmit = (e) => {
    e.preventDefault();

    dispatcher(
      signIn({
        username: e.target.username.value,
        password: e.target.password.value,
      })
    );
  };
  useEffect(() => {
    dispatcher(logIn());
  }, []);
  return (
    <div>
      <form onSubmit={handleSubmit}>
        <input type="text" placeholder="Username" id="username" />
        <input type="password" placeholder="Password" id="password" />
        <button>submit</button>
      </form>
    </div>
  );
}

export default SignIn;

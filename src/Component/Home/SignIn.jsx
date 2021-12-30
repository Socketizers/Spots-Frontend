import React, { useEffect } from "react";
import { signIn } from "../../features/auth/authSlice";
import { useDispatch, useSelector } from "react-redux";
import { logIn, logOut } from "../../features/auth/authSlice";
import cookie from "react-cookies";

function SignIn() {
const {status} = useSelector(state=> state.auth)
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

    if(cookie.load("token")) dispatcher(logIn());
  }, []);

  return (
    <div>
      <h1>{status}</h1>
      <form onSubmit={handleSubmit}>
        <input type="text" placeholder="Username" id="username" />
        <input type="password" placeholder="Password" id="password" />
        <button>submit</button>
      </form>

      <button onClick={()=> dispatcher(logOut())}> logout </button>
    </div>
  );
}

export default SignIn;

import React from "react";
import { signUp } from "../../features/auth/authSlice";
import { useDispatch } from "react-redux";
// import FormData from "form-data";

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
    body.append("image", file);
    dispatcher(signUp(body));
  };

  return (
    <div>
      <form onSubmit={handleSubmit}>
        <h2>SignUp</h2>
        <input type="text" placeholder="Username" id="username" />
        <input type="text" placeholder="Fullname" id="fullName" />
        <input type="email" placeholder="Email" id="email" />
        <input type="file" placeholder="image" id="files" />
        <input type="password" placeholder="Password" id="password" />
        <button>submit</button>
      </form>
    </div>
  );
}

export default SignUp;

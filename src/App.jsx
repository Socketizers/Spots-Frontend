import React, { useEffect } from "react";
import { BrowserRouter, Routes, Route } from "react-router-dom";
import { useSelector, useDispatch } from "react-redux";
import Header from "./Component/Header";
import AboutUs from "./Component/Home/AboutUs";
import Home from "./Component/Home/HomePage";
import SignIn from "./Component/Home/SignIn";
import SignUp from "./Component/Home/SignUp";
import UserHomePage from "./Component/user-page/UserHomePage";
import ServerList from "./Component/user-page/ServerList";
import Chat from "./Component/user-page/server/Chat";
import { logIn } from "./features/auth/authSlice";
import cookie from "react-cookies";
import "bootstrap/dist/css/bootstrap.min.css";

function App() {
  const status = useSelector((state) => state.auth.status);
  const dispatcher = useDispatch();

  useEffect(() => {
    if (cookie.load("token")) dispatcher(logIn());
  }, []);

  return (
    <BrowserRouter>
      {/* <Header /> */}
      <Routes>
        <Route
          path="/"
          element={status === "idle" ? <><Header /> <UserHomePage /></> : <Home />}
        />
        <Route
          path="/sign-in"
          element={
            <>
              <Header />
              <SignIn />
            </>
          }
        />
        <Route
          path="/sign-up"
          element={
            <>
              <Header />
              <SignUp />
            </>
          }
        />
        <Route path="/servers" element={<ServerList />} />
        <Route path="/about-us" element={<AboutUs />} />
        <Route path="/chat" element={<Chat />} />
      </Routes>
    </BrowserRouter>
  );
}

export default App;

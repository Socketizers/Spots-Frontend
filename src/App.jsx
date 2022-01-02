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
import { logIn } from "./features/auth/authSlice";
import cookie from "react-cookies";
import RoomsList from "./Component/user-page/server/RoomsList";
import PrivateChat from "./Component/user-page/private-room/PrivateChat";

function App() {
  const status = useSelector((state) => state.auth.status);
  const dispatcher = useDispatch();

  useEffect(() => {
    if (cookie.load("token")) dispatcher(logIn());
  }, [dispatcher]);

  return (
    <BrowserRouter>
      <Header />
      <Routes>
        <Route
          path="/"
          element={status === "idle" ? <UserHomePage /> : <Home />}
        />
        <Route
          path="/sign-in"
          element={
            <>
              <SignIn />
              <SignUp />
            </>
          }
        />
        <Route path="/servers" element={<ServerList />} />
        <Route path="/about-us" element={<AboutUs />} />
        <Route path="/rooms" element={<RoomsList />}>
          <Route path=":id" element={<></>} />
        </Route>
        <Route path="/private-chat" element={<PrivateChat />} />
      </Routes>
    </BrowserRouter>
  );
}

export default App;

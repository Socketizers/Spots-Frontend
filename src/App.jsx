import React, { useEffect } from "react";
import { BrowserRouter, Routes, Route, Outlet } from "react-router-dom";
import { useSelector, useDispatch } from "react-redux";
import Home from "./Component/home/HomePage";
import SignIn from "./Component/home/SignIn";
import SignUp from "./Component/home/SignUp";
import UserHomePage from "./Component/user-page/UserHomePage";
import ServerList from "./Component/user-page/ServerList";
import Chat from "./Component/user-page/server/Chat";
import ProfilePage from "./Component/user-page/profile/ProfilePage";
import { logIn } from "./features/auth/authSlice";
import { getAllServers } from "./features/server/serverSlice";
import { getUserServers } from "./features/server/userServers.Slice";
import cookie from "react-cookies";
import RoomsList from "./Component/user-page/server/RoomsList";
import "bootstrap/dist/css/bootstrap.min.css";
import UserPrivateChat from "./Component/user-page/UserPrivateChat";

function App() {
  const status = useSelector((state) => state.auth.status);
  const dispatcher = useDispatch();

  useEffect(() => {
    if (cookie.load("token")) {
      dispatcher(logIn());
      dispatcher(getAllServers());
      dispatcher(getUserServers());
    }
  }, [dispatcher]);

  return (
    <BrowserRouter>
      {/* <Header /> */}
      <Routes>
        <Route path="/"  element={status === "idle" ? <UserHomePage /> : <Home />}/>
        <Route path="/sign-in" element={<SignIn />} />
        <Route path="/sign-up" element={<SignUp />} />
        <Route path="/servers" element={<ServerList />} />
        <Route path="/server" element={<Outlet />}>
          <Route path=":serverId" element={<RoomsList />}>
            <Route path="rooms" element={<RoomsList />}>
              <Route path=":id" element={<RoomsList />} />
            </Route>
          </Route>
        </Route>
        <Route path="/chat" element={<Chat />} />
        <Route path="/profile" element={<ProfilePage />} />
        <Route path="/private-chat" element={<UserPrivateChat />} />
      </Routes>
    </BrowserRouter>
  );
}

export default App;

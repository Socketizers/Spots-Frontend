import React, {useEffect} from "react";
import { BrowserRouter, Routes, Route } from "react-router-dom";
import { useSelector, useDispatch} from "react-redux";
import Header from "./Component/Header";
import AboutUs from "./Component/Home/AboutUs";
import Home from "./Component/Home/HomePage";
import SignIn from "./Component/Home/SignIn";
import SignUp from "./Component/Home/SignUp";
import UserHomePage from "./Component/user-page/UserHomePage";
import { logIn } from "./features/auth/authSlice";
import cookie from "react-cookies";



function App() {
  
const status = useSelector(state => state.auth.status)
const dispatcher = useDispatch();

useEffect(() => {
  if(cookie.load("token")) dispatcher(logIn());
}, []);

  return (
    <BrowserRouter>
      <Header />
      <Routes>
        <Route path="/" element={status==="idle" ?  <UserHomePage />: <Home />} />
        <Route
          path="/sign-in"
          element={
            <>
              <SignIn />
              <SignUp />
            </>
          }
        />
        <Route path="/about-us" element={<AboutUs />} />
      </Routes>
    </BrowserRouter>
  );
}

export default App;

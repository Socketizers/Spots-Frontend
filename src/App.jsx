import React from "react";
import { BrowserRouter, Routes, Route } from "react-router-dom";
import { Provider } from 'react-redux';
import { store } from "./app/store";
import Header from "./Component/Header";
import AboutUs from "./Component/Home/AboutUs";
import Home from "./Component/Home/HomePage";
import SignIn from "./Component/Home/SignIn";
import SignUp from "./Component/Home/SignUp";

function App() {
  return (
    <Provider store={store}>
    <BrowserRouter>
      <Header />
      <Routes>
        <Route path="/" element={<Home />} />
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
    </Provider>
  );
}

export default App;

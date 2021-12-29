import React from "react";
import { BrowserRouter, Routes, Route } from "react-router-dom";
import Header from "./Component/Header";
import AboutUs from "./Component/Home/AboutUs";
import Home from "./Component/Home/HomePage";
import SignIn from "./Component/Home/SignIn";

function App() {
  return (
    <BrowserRouter>
      <Header />
      <Routes>
        <Route path="/" element={<Home />} />
        <Route path="/sign-in" element={<SignIn />} />
        <Route path="/about-us" element={<AboutUs />} />
      </Routes>
    </BrowserRouter>
  );
}

export default App;

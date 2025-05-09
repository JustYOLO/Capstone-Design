import React, { useEffect, useState } from "react";
import { BrowserRouter as Router, Routes, Route, useLocation } from "react-router-dom";
import Navbar from "./components/Navbar";
import HeroSection from "./components/HeroSection";
import ChatGPTWidget from "./components/ChatGPTWidget";
import Footer from "./components/Footer";
import Login from "./pages/Login";
import Lookup from "./pages/Lookup";
import SearchWhere from "./pages/Search_Where";
import Order from "./pages/Order";
import Map from "./components/Map";
import ResetPassword from "./pages/ResetPassword";
import Signup from "./pages/Signup";
import SignupCustomer from "./pages/SignupCustomer";
import SignupFlorist from "./pages/SignupFlorist";
import FlowerDictionary from "./pages/FlowerDictionary";
import FlowerMBTI from "./pages/FlowerMBTI";
import Voc from "./pages/Voc";
import Profile from "./pages/Profile";
import AfterSingup from "./pages/AfterSignup";
import Admin from "./pages/Admin";

function AppContent() {
  const location = useLocation();
  const isHome = location.pathname === "/";
  const [user, setUser] = useState(null);

  // 로그인 정보 불러오기
  useEffect(() => {
    const storedUser = localStorage.getItem("user");
    if (storedUser) {
      setUser(JSON.parse(storedUser));
    }
  }, [location.pathname]); // 경로 바뀔 때마다 user 정보 반영

  return (
    <div className="w-full min-h-screen bg-gray-50 flex flex-col">
      <Navbar user={user} />
      <Routes>
        <Route path="/" element={<HeroSection />} />
        <Route path="/lookup" element={<Lookup />} />
        <Route path="/searchwhere" element={<SearchWhere />} />
        <Route path="/order" element={<Order />} />
        <Route path="/login" element={<Login />} />
        <Route path="/resetpassword" element={<ResetPassword />} />
        <Route path="/signup" element={<Signup />} />
        <Route path="/signupcustomer" element={<SignupCustomer />} />
        <Route path="/signupflorist" element={<SignupFlorist />} />
        <Route path="/dictionary" element={<FlowerDictionary />} />
        <Route path="/FlowerMBTI" element={<FlowerMBTI />} />
        <Route path="/map" element={<Map />} />
        <Route path="/voc" element={<Voc />} />
        <Route path="/profile" element={<Profile />} />
        <Route path="/aftersignup" element={<AfterSingup />} />
        <Route path="/admin" element={<Admin />} />
      </Routes>

      {isHome && (
        <>
          <div className="flex justify-center py-16">
            <ChatGPTWidget />
          </div>
          <div className="flex justify-center py-16">
            <Map />
          </div>
        </>
      )}

      <Footer />
    </div>
  );
}

function App() {
  return (
    <Router>
      <AppContent />
    </Router>
  );
}

export default App;
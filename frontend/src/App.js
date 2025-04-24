import React from "react";
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

function AppContent() {
  const location = useLocation(); // 현재 페이지의 경로 가져오기

  // 홈 화면에서만 위젯 표시
  const isHome = location.pathname === "/";

  return (
    <div className="w-full min-h-screen bg-gray-50 flex flex-col">
      <Navbar />
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
        <Route path="/dictionary" element={<FlowerDictionary/>} />
        <Route path="/FlowerMBTI" element={<FlowerMBTI />} />
        <Route path="/map" element={<Map />} />
        <Route path="/voc" element={<Voc />} />
        <Route path="/profile" element={<Profile />} />
      </Routes>

      {/* 홈 화면(`/`)에서만 GPT & 지도 표시 */}
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
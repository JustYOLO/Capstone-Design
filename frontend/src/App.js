import React, { useEffect, useState } from "react";
import { BrowserRouter as Router, Routes, Route, useLocation } from "react-router-dom";

// common
import Navbar from "./components/common/Navbar";
import HeroSection from "./components/common/HeroSection";
import Footer from "./components/common/Footer";

// Map
import Map from "./components/map/Map";
import NaverMapLoader from "./components/map/NaverMapLoader";
import FlowerShopMarker from "./components/map/FlowerShopMarker";
import UserLocationMap from "./components/map/UserLocationMap";

// chatbot
import ChatButton from "./components/chatbot/ChatButton";
import ChatInput from "./components/chatbot/ChatInput";
import ChatResponse from "./components/chatbot/ChatResponse";
import ChatWidget from "./components/chatbot/ChatWidget";
import UseChat from "./components/chatbot/UseChat";

// pages
import Login from "./pages/Login";
import SearchWhere from "./pages/Search_Where";
import Order from "./pages/Order";
import ResetPassword from "./pages/ResetPassword";
import Signup from "./pages/Signup";
import SignupCustomer from "./pages/SignupCustomer";
import SignupFlorist from "./pages/SignupFlorist";
import FlowerDictionary from "./pages/FlowerDictionary";
import FlowerMBTI from "./pages/FlowerMBTI";
import Profile from "./pages/Profile";
import AfterSingup from "./pages/AfterSignup";
import Admin from "./pages/Admin";
import AfterLoginFlorist from "./pages/AfterLoginFlorist";
import FlowerHouse from "./pages/FlowerHouse";
import FlowerHouseView from "./pages/FlowerHouseView";
import FlowerHouseAddFlower from "./pages/FlowerHouseAddFlower";
import OrderPage from "./pages/OrderPage";
import OrderHistoryPage from "./pages/OrderHistoryPage";

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
  }, [location.pathname]);

  return (
    <div className="w-full min-h-screen bg-gray-50 flex flex-col">
      <Navbar user={user} />
      <Routes>
        <Route path="/" element={<HeroSection />} />
        <Route path="/searchwhere" element={<SearchWhere />} />
        <Route path="/order" element={<Order />} />
        <Route path="/login" element={<Login />} />
        <Route path="/resetpassword" element={<ResetPassword />} />
        <Route path="/password-reset/confirm" element={<PasswordResetConfirm />} />
        <Route path="/signup" element={<Signup />} />
        <Route path="/signupcustomer" element={<SignupCustomer />} />
        <Route path="/signupflorist" element={<SignupFlorist />} />
        <Route path="/dictionary" element={<FlowerDictionary />} />
        <Route path="/FlowerMBTI" element={<FlowerMBTI />} />
        <Route path="/map" element={<Map />} />
        <Route path="/profile" element={<Profile />} />
        <Route path="/aftersignup" element={<AfterSingup />} />
        <Route path="/admin" element={<Admin />} />
        <Route path="/afterloginflorist" element={<AfterLoginFlorist />} />
        <Route path="/flowerhouse" element={<FlowerHouse />} />
        <Route path="/flowerhouse/view/:business_id" element={<FlowerHouseView />} />
        <Route path="/flowerhouse/addflower" element={<FlowerHouseAddFlower />} />
        <Route path="/order/:business_id" element={<OrderPage />} />
        <Route path="/orderhistory" element={<OrderHistoryPage />} />
      </Routes>

      {isHome && (
        <>
          <div className="flex justify-center py-16">
            <ChatWidget />
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

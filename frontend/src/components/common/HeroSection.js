import React from "react";
import Snowfall from "./effects/Snowfall";
import CherryBlossom from "./effects/CherryBlossom";
import GreenLeaves from "./effects/GreenLeaves";
import AutumnLeaves from "./effects/AutumnLeaves";
import { Link } from "react-router-dom";

const HeroSection = () => {
  const today = new Date();
  const month = (today.getMonth() + 1).toString().padStart(2, "0");
  const day = today.getDate().toString().padStart(2, "0");
  const dateNumber = parseInt(`${month}${day}`);

  function getBackgroundColor() {
    if (dateNumber >= 301 && dateNumber <= 430) {
      return "bg-gradient-to-r from-pink-200 to-yellow-200"; // 봄
    } else if (dateNumber >= 501 && dateNumber <= 915) {
      return "bg-gradient-to-r from-green-200 to-blue-200"; // 여름
    } else if (dateNumber >= 916 && dateNumber <= 1114) {
      return "bg-gradient-to-r from-red-400 to-orange-300"; // 가을
    } else {
      return "bg-gradient-to-r from-blue-300 to-gray-300"; // 겨울
    }
  }

  return (
    <section className={`hero-section ${getBackgroundColor()}`}>
      <h1 className="hero-title">🌷 꽃에 대한 모든 것을 검색하세요 🌷</h1>
      <p className="hero-description">꽃말 검색 · 꽃집 검색 · 꽃 추천 <br /> 상황에 딱 맞는 꽃을 찾아보세요!</p>

      {/* 계절별 효과 */}
      {dateNumber >= 301 && dateNumber <= 430 && <CherryBlossom />}
      {dateNumber >= 501 && dateNumber <= 915 && <GreenLeaves />}
      {dateNumber >= 916 && dateNumber <= 1114 && <AutumnLeaves />}
      {dateNumber >= 1115 || dateNumber <= 227 ? <Snowfall /> : null}

      {/* 버튼 */}
      <div className="flex flex-col md:flex-row justify-center gap-4 md:gap-6 mt-10">
        <Link to="/dictionary" className="hero-button">꽃말 사전 📖</Link>
        <Link to="/order" className="hero-button">꽃집 주문 🛒</Link>
        <Link to="/searchwhere" className="hero-button">꽃집 조회 🗺️</Link>
        <Link to="/FlowerMBTI" className="hero-button">🌸 꽃BTI 테스트하기 💐</Link>
      </div>
    </section>
  );
};

export default HeroSection;

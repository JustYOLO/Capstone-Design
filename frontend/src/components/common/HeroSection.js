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
    <section className={`w-full text-center py-20 sm:py-24 text-white ${getBackgroundColor()}`}>
      {/* 제목 */}
      <h1 className="text-2xl sm:text-3xl md:text-4xl lg:text-5xl font-spring mb-4 text-black mt-16 sm:mt-20 text-center max-w-3xl mx-auto">
      🌷 꽃에 대한 모든 것을 검색하세요 🌷
      </h1>

      <p className="text-base sm:text-lg md:text-xl lg:text-2xl leading-relaxed text-black font-spring text-center max-w-3xl mx-auto">
      꽃말 검색 · 꽃집 검색 · 꽃 추천 <br />
      상황에 딱 맞는 꽃을 찾아보세요!
      </p>

      {/* 계절별 효과 */}
      {dateNumber >= 301 && dateNumber <= 430 && <CherryBlossom />}
      {dateNumber >= 501 && dateNumber <= 915 && <GreenLeaves />}
      {dateNumber >= 916 && dateNumber <= 1114 && <AutumnLeaves />}
      {dateNumber >= 1115 || dateNumber <= 227 ? <Snowfall /> : null}

      {/* 네비게이션 버튼 */}
      <div className="flex flex-col md:flex-row justify-center gap-4 md:gap-6 mt-10">
        <Link 
          to="/dictionary" 
          className="px-6 py-3 md:px-10 md:py-4 bg-white text-purple-600 rounded-lg shadow hover:bg-gray-100 transition text-sm md:text-lg"
        >
          꽃말 사전 📖
        </Link>
        <Link 
          to="/order" 
          className="px-6 py-3 md:px-10 md:py-4 bg-white text-purple-600 rounded-lg shadow hover:bg-gray-100 transition text-sm md:text-lg"
        >
          꽃집 주문 🛒
        </Link>
        <Link 
          to="/searchwhere" 
          className="px-6 py-3 md:px-10 md:py-4 bg-white text-purple-600 rounded-lg shadow hover:bg-gray-100 transition text-sm md:text-lg"
        >
          꽃집 조회 🗺️
        </Link>
        <Link 
          to="/FlowerMBTI" 
          className="px-6 py-3 md:px-10 md:py-4 bg-white text-purple-600 rounded-lg shadow hover:bg-gray-100 transition text-sm md:text-lg"
        >
          🌸 꽃BTI 테스트하기 💐
        </Link>
      </div>
    </section>
  );
};

export default HeroSection;

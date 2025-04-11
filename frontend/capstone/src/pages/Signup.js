import React from "react";
import { useNavigate } from "react-router-dom";
import Snowfall from "../components/effects/Snowfall";
import CherryBlossom from "../components/effects/CherryBlossom";
import GreenLeaves from "../components/effects/GreenLeaves";
import AutumnLeaves from "../components/effects/AutumnLeaves";

const Signup = () => {
  const navigate = useNavigate();

  // 🔹 날짜에 따라 효과 변경
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
    <div className={`relative flex flex-col items-center justify-center min-h-screen px-4 overflow-hidden ${getBackgroundColor()}`}>
      {/* 🔹 계절별 효과 추가 */}
      {dateNumber >= 301 && dateNumber <= 430 ? <CherryBlossom /> : null}
      {dateNumber >= 501 && dateNumber <= 915 ? <GreenLeaves /> : null}
      {dateNumber >= 916 && dateNumber <= 1114 ? <AutumnLeaves /> : null}
      {dateNumber >= 1115 || dateNumber <= 227 ? <Snowfall /> : null}

      <h1 className="font-tenada">
        🌸 꽃집을 운영 중이신가요?
      </h1>
      <p className="text-gray-700 text-lg mb-8">
        회원 유형을 선택하고 가입을 진행해주세요.
      </p>

      <div className="flex space-x-6">
        {/* 꽃집 운영진으로 가입 버튼 */}
        <div
          className="w-64 h-80 bg-white bg-opacity-80 flex flex-col items-center justify-center rounded-xl shadow-lg cursor-pointer hover:scale-105 transition transform duration-300"
          onClick={() => navigate("/SignupFlorist")}
        >
          <p className="text-lg font-semibold text-gray-800 mb-2">
            🌿 꽃집 운영진으로 가입
          </p>
          <span className="text-2xl">→</span>
        </div>

        {/* 꽃집 고객으로 가입 버튼 */}
        <div
          className="w-64 h-80 bg-white bg-opacity-80 flex flex-col items-center justify-center rounded-xl shadow-lg cursor-pointer hover:scale-105 transition transform duration-300"
          onClick={() => navigate("/SignupCustomer")}
        >
          <p className="text-lg font-semibold text-gray-800 mb-2">
            💐 꽃집 고객으로 가입
          </p>
          <span className="text-2xl">→</span>
        </div>
      </div>
    </div>
  );
};

export default Signup;
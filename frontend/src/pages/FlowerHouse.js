import React from "react";
import { useLocation, useNavigate } from "react-router-dom";

const FlowerHouse = () => {
  const location = useLocation();
  const floristData = location.state;
  const navigate = useNavigate();

  // 예외 처리: 데이터가 없으면 홈으로 리다이렉트
  if (!floristData) {
    return <div className="p-6 text-center text-red-600">사업자 정보가 없습니다.</div>;
  }

  return (
    <div className="max-w-2xl mx-auto p-6 bg-white shadow-lg rounded-lg mt-10 border text-center">
      {/* 상호명 */}
      <h1 className="text-3xl font-bold text-purple-700 mb-4">{floristData["법인명"]}</h1>

      {/* 대표 이미지 */}
      {floristData.image_url ? (
        <img
          src={floristData.image_url}
          alt="꽃집 대표 이미지"
          className="w-full h-64 object-cover rounded-lg mb-4 shadow"
        />
      ) : (
        <div className="w-full h-64 flex items-center justify-center bg-gray-100 text-gray-400 rounded-lg mb-4">
          이미지가 등록되지 않았습니다
        </div>
      )}

      {/* 한 줄 소개 */}
      <p className="text-lg text-gray-700 mb-2">{floristData.intro || "아직 소개글이 등록되지 않았습니다."}</p>

      {/* 전화번호 */}
      <p className="text-gray-500 text-sm mb-6">
        📞 {floristData.phone || "전화번호 미등록"}
      </p>

      {/* 주문하기 버튼 */}
      <button
        onClick={() => navigate("/order")}
        className="px-6 py-3 bg-green-600 text-white font-bold rounded hover:bg-green-700 transition"
      >
        🛒 주문하기
      </button>
    </div>
  );
};

export default FlowerHouse;
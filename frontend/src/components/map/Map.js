import React from "react";
import { useNaverMapLoader } from "./NaverMapLoader";
import UserLocationMap from "./UserLocationMap";

const Map = () => {
  const isLoaded = useNaverMapLoader(() => {
    console.log("Naver Map loaded");
  });

  return (
    <div className="w-full max-w-4xl p-8 bg-white rounded-xl shadow-lg border border-gray-200">
      <h2 className="text-center text-xl font-semibold text-gray-700 mb-4">📍 내 위치 중심 꽃집 보기</h2>

      {isLoaded ? (
        <UserLocationMap />
      ) : (
        <div className="w-full h-[500px] flex items-center justify-center">
          <div className="loader border-4 border-blue-200 border-t-blue-600 rounded-full w-12 h-12 animate-spin"></div>
        </div>
      )}
    </div>
  );
};

export default Map;
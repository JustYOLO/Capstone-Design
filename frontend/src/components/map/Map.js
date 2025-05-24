import React from "react";
import { useNaverMapLoader } from "./NaverMapLoader";
import UserLocationMap from "./UserLocationMap";

const Map = () => {
  const isLoaded = useNaverMapLoader(() => {
    console.log("Naver Map loaded");
  });

  return (
    <div className="map-container">
      <h2 className="map-title">📍 내 위치 중심 꽃집 보기</h2>

      {isLoaded ? (
        <UserLocationMap />
      ) : (
        <div className="map-loader-wrapper">
          <div className="map-loader" />
        </div>
      )}
    </div>
  );
};

export default Map;
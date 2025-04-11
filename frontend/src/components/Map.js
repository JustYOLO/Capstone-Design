import React, { useEffect, useRef } from "react";

const Map = () => {
  const mapRef = useRef(null);

  useEffect(() => {
    const script = document.createElement("script");
    script.src = "https://oapi.map.naver.com/openapi/v3/maps.js?ncpKeyId=du06l7nq41";
    script.async = true;
    script.onload = () => {
      if (window.naver) {
        navigator.geolocation.getCurrentPosition(
          (position) => {
            const userLat = position.coords.latitude;
            const userLng = position.coords.longitude;

            const mapOptions = {
              center: new window.naver.maps.LatLng(userLat, userLng),
              zoom: 14,
            };

            const map = new window.naver.maps.Map(mapRef.current, mapOptions);

            // 🔹 현재 위치 마커
            new window.naver.maps.Marker({
              position: new window.naver.maps.LatLng(userLat, userLng),
              map,
              title: "내 위치",
            });

            // 🔹 예시 꽃집 마커들 (임의 좌표)
            const flowerShops = [
              { name: "로맨틱플라워", lat: userLat + 0.002, lng: userLng + 0.002 },
              { name: "블룸하우스", lat: userLat - 0.0015, lng: userLng - 0.001 },
              { name: "향기로운꽃집", lat: userLat + 0.001, lng: userLng - 0.001 },
            ];

            flowerShops.forEach((shop) => {
              const marker = new window.naver.maps.Marker({
                position: new window.naver.maps.LatLng(shop.lat, shop.lng),
                map,
                title: shop.name,
              });
            
              const infoWindow = new window.naver.maps.InfoWindow({
                content: `<div style="padding:8px;font-size:14px;">${shop.name}</div>`,
              });
            
              // 마커 클릭 시 InfoWindow 열기
              window.naver.maps.Event.addListener(marker, "click", () => {
                infoWindow.open(map, marker);
              });
            });
          },
          (error) => {
            alert("위치 정보를 가져올 수 없습니다. 기본 위치로 설정됩니다.");
            const defaultLatLng = new window.naver.maps.LatLng(37.5665, 126.9780); // 서울 기본 위치
            const map = new window.naver.maps.Map(mapRef.current, {
              center: defaultLatLng,
              zoom: 14,
            });
          }
        );
      }
    };

    document.head.appendChild(script);
  }, []);

  return (
    <div className="w-full max-w-4xl p-8 bg-white rounded-xl shadow-lg border border-gray-200">
      <h2 className="text-center text-xl font-semibold text-gray-700 mb-4">📍 내 위치 중심 꽃집 보기</h2>
      <div ref={mapRef} className="w-full h-[500px] rounded-lg border border-gray-300" />
    </div>
  );
};

export default Map;
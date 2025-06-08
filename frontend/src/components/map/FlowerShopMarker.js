import React, { useState, useEffect } from "react";
import { useParams } from "react-router-dom";

// 주소 목록을 마커로 표시하는 함수
const markAddresses = (map, addressList) => {
  addressList.forEach((address) => {
    console.log("📌 지오코딩 시도 주소:", address);

    window.naver.maps.Service.geocode({ query: address }, (status, response) => {
      if (status !== window.naver.maps.Service.Status.OK) {
        console.error("❌ 지오코딩 실패:", address, response);
        return;
      }

      const item = response.v2.addresses[0];
      const lat = parseFloat(item.y);
      const lng = parseFloat(item.x);

      console.log("✅ 지오코딩 성공:", { address, lat, lng });

      const marker = new window.naver.maps.Marker({
        position: new window.naver.maps.LatLng(lat, lng),
        map,
        title: address,
      });

      const infoWindow = new window.naver.maps.InfoWindow({
        content: `<div style="padding:8px;font-size:14px;">${address}</div>`,
      });

      window.naver.maps.Event.addListener(marker, "click", () => {
        infoWindow.open(map, marker);
      });
    });
  });
};

// 내 위치 + 가게 주소 마커 찍기
const FlowerShopMarker = (map, userLat, userLng, roadAddresses = []) => {
  new window.naver.maps.Marker({
    position: new window.naver.maps.LatLng(userLat, userLng),
    map,
    title: "내 위치",
    icon: {
      content:
        '<div style="background:#2b90d9;color:white;padding:5px 10px;border-radius:5px;font-size:12px;">내 위치</div>',
    },
  });

  markAddresses(map, roadAddresses);
};

const MapWithAddress = () => {
  const { pk } = useParams();
  const [shopAddress, setShopAddress] = useState(null);

  const userLat = 37.5665; // 예시: 서울시청
  const userLng = 126.9780;

  // 가게 주소 불러오기
  useEffect(() => {
    fetch(`https://blossompick.duckdns.org/api/v1/florist/stores/${pk}/`)
      .then((res) => res.json())
      .then((res) => {
        const backendAddress = res.data.address || "";
        console.log("📦 백엔드에서 받은 주소:", backendAddress);
        if (backendAddress) setShopAddress(backendAddress);
      })
      .catch((err) => console.error("❌ 주소 불러오기 실패:", err));
  }, [pk]);

  // 지도 생성 및 마커 찍기
  useEffect(() => {
    if (!window.naver || !shopAddress) return;

    const map = new window.naver.maps.Map("map", {
      center: new window.naver.maps.LatLng(userLat, userLng),
      zoom: 14,
    });

    FlowerShopMarker(map, userLat, userLng, [shopAddress]);
  }, [shopAddress]);

  return (
    <div>
      <div id="map" className="w-full h-96 mt-8 rounded shadow" />
    </div>
  );
};

export default MapWithAddress;
export { FlowerShopMarker };
import React, { useState, useEffect } from "react";
import { useParams } from "react-router-dom";

// 지도에 주소들 마커 찍는 함수
const markAddresses = (map, addressList) => {
  addressList.forEach((address) => {
    console.log("📌 [지오코딩 시도] 주소:", address);

    window.naver.maps.Service.geocode({ query: address }, (status, response) => {
      if (status !== window.naver.maps.Service.Status.OK) {
        console.error("❌ [지오코딩 실패]", address, response);
        return;
      }

      const item = response.v2.addresses[0];
      const lat = parseFloat(item.y);
      const lng = parseFloat(item.x);

      console.log("✅ [지오코딩 성공] 좌표:", { lat, lng });

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

      console.log("📍 [마커 생성 완료]:", address);
    });
  });
};

// "내 위치" + 전달받은 주소 리스트 마커 표시
const FlowerShopMarker = (map, userLat, userLng, roadAddresses = []) => {
  console.log("📌 [내 위치 마커 생성]");
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

  const userLat = 37.5665;
  const userLng = 126.9780;

  // 가게 주소 불러오기
  useEffect(() => {
    if (!pk) return;
    console.log("📡 [API 요청 시작] 가게 정보:", pk);

    fetch(`https://blossompick.duckdns.org/api/v1/florist/stores/${pk}/`)
      .then((res) => {
        if (!res.ok) throw new Error("응답 실패");
        return res.json();
      })
      .then((res) => {
        const backendAddress = res.data?.address || "";
        console.log("📦 [가게 주소 수신]", backendAddress);
        if (backendAddress.trim()) {
          setShopAddress(backendAddress.trim());
        } else {
          console.warn("⚠️ [가게 주소 없음]");
        }
      })
      .catch((err) => {
        console.error("❌ [주소 불러오기 실패]:", err);
        alert("가게 주소를 불러오지 못했습니다.");
      });
  }, [pk]);

  // 지도 초기화 및 마커 표시
  useEffect(() => {
    if (!window.naver || !shopAddress) return;

    console.log("🗺️ [지도 생성 및 마커 표시 시작]");

    window.naver.maps.Service.geocode({ query: shopAddress }, (status, response) => {
      if (status !== window.naver.maps.Service.Status.OK) {
        console.error("❌ [지오코딩 실패]:", shopAddress, response);
        alert("가게 주소를 지도에 표시할 수 없습니다.");
        return;
      }

      const item = response.v2.addresses[0];
      const lat = parseFloat(item.y);
      const lng = parseFloat(item.x);

      const map = new window.naver.maps.Map("map", {
        center: new window.naver.maps.LatLng(lat, lng),
        zoom: 14,
      });

      new window.naver.maps.Marker({
        position: new window.naver.maps.LatLng(lat, lng),
        map,
        title: shopAddress,
      });

      console.log("✅ [가게 마커 표시 완료]:", lat, lng);
    });
  }, [shopAddress]);

  return (
    <div>
      <div id="map" className="w-full h-96 mt-8 rounded shadow" />
    </div>
  );
};

export default MapWithAddress;
export { FlowerShopMarker };
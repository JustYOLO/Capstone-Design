import React, { useEffect, useRef, useState } from "react";

const markAddresses = (map, locationList, setMapCenterByAddress) => {
  locationList.forEach(({ address, housename }) => {
    console.log("📌 지오코딩 시도 주소:", address);

    window.naver.maps.Service.geocode({ query: address }, (status, response) => {
      if (status !== window.naver.maps.Service.Status.OK) {
        console.error("❌ 지오코딩 실패:", address, status);
        return;
      }

      const item = response.v2.addresses[0];
      const lat = parseFloat(item.y);
      const lng = parseFloat(item.x);

      console.log("✅ 지오코딩 성공:", { address, lat, lng });

      const marker = new window.naver.maps.Marker({
        position: new window.naver.maps.LatLng(lat, lng),
        map,
        title: housename,
      });

      const infoWindow = new window.naver.maps.InfoWindow({
        content: `<div style="padding:8px;font-size:14px;">🏠 ${housename}</div>`,
      });

      let isOpen = false;

      window.naver.maps.Event.addListener(marker, "click", () => {
        if (isOpen) {
          infoWindow.close();
        } else {
          infoWindow.open(map, marker);
        }
        isOpen = !isOpen;
      });

      // 상호명-좌표 매핑 저장
      setMapCenterByAddress((prev) => ({
        ...prev,
        [housename]: { lat, lng },
      }));
    });
  });
};

// 함수 이름은 그대로 유지
export const FlowerShopMarker = () => {
  const mapRef = useRef(null);
  const [map, setMap] = useState(null);
  const [locationList, setLocationList] = useState([]);

  // 검색 상태 및 위치 매핑 저장용
  const [search, setSearch] = useState("");
  const [mapCenterByAddress, setMapCenterByAddress] = useState({});

  useEffect(() => {
    const mapOptions = {
      center: new window.naver.maps.LatLng(37.5665, 126.9780),
      zoom: 13,
    };
    const newMap = new window.naver.maps.Map(mapRef.current, mapOptions);
    setMap(newMap);
  }, []);

  useEffect(() => {
    if (!map) return;

    // 기존 내 위치 마커
    navigator.geolocation.getCurrentPosition(
      (pos) => {
        const lat = pos.coords.latitude;
        const lng = pos.coords.longitude;
        new window.naver.maps.Marker({
          position: new window.naver.maps.LatLng(lat, lng),
          map,
          title: "내 위치",
          icon: {
            content: `
              <div style="
                background:#2b90d9;
                color:white;
                padding:5px 10px;
                border-radius:5px;
                font-size:12px;
              ">내 위치</div>
            `,
          },
        });
      },
      () => {
        const fallback = new window.naver.maps.LatLng(37.5665, 126.9780);
        new window.naver.maps.Marker({
          position: fallback,
          map,
          title: "기본 위치",
        });
      }
    );

    // 기존 API 로딩 및 마커 찍기
    const loadShops = async () => {
      try {
        const res = await fetch("https://blossompick.duckdns.org/api/v1/florist/stores/");
        const stores = await res.json();

        const list = stores
          .filter((store) => store.data?.address && store.housename)
          .map((store) => ({
            address: store.data.address,
            housename: store.housename,
          }));

        setLocationList(list);

        //  매핑 함수 전달 추가
        markAddresses(map, list, setMapCenterByAddress);
      } catch (err) {
        console.error("❌ 꽃집 주소 불러오기 실패:", err);
      }
    };

    loadShops();
  }, [map]);

  // 검색한 상호명 위치로 이동
  const handleSearch = () => {
    const coords = mapCenterByAddress[search];
    if (coords) {
      const newCenter = new window.naver.maps.LatLng(coords.lat, coords.lng);
      map.setCenter(newCenter);
      map.setZoom(16);
    } else {
      alert("❌ 해당 상호명을 찾을 수 없습니다.");
    }
  };

  return (
    <div className="w-full h-screen relative">
      {/* 검색 입력창 UI */}
      <div className="absolute z-10 top-4 left-1/2 transform -translate-x-1/2 bg-white shadow-lg rounded px-4 py-2 flex gap-2 items-center">
        <input
          type="text"
          list="shop-suggestions"
          placeholder="상호명으로 검색"
          value={search}
          onChange={(e) => setSearch(e.target.value)}
          className="border px-2 py-1 rounded"
        />
        <datalist id="shop-suggestions">
          {locationList.map(({ housename }, idx) => (
            <option key={idx} value={housename} />
          ))}
        </datalist>
        <button
          onClick={handleSearch}
          className="bg-blue-500 text-white px-3 py-1 rounded"
        >
          이동
        </button>
      </div>

      {/* 기존 지도 */}
      <div ref={mapRef} className="w-full h-full" />
    </div>
  );
};
import React, { useEffect, useState } from "react";
import axios from "axios";
import AdCarousel from "./AdCarousel";
import { useNavigate } from "react-router-dom";
import { geocodeAddress } from "../components/map/FlowerShopMarker";

const toRad = deg => (deg * Math.PI) / 180;
const haversine = (lat1, lng1, lat2, lng2) => {
  const R = 6371e3;
  const φ1 = toRad(lat1), φ2 = toRad(lat2);
  const Δφ = toRad(lat2 - lat1), Δλ = toRad(lng2 - lng1);
  const a = Math.sin(Δφ/2)**2 +
            Math.cos(φ1) * Math.cos(φ2) * Math.sin(Δλ/2)**2;
  return 2 * R * Math.atan2(Math.sqrt(a), Math.sqrt(1 - a));
};

const Order = () => {
  const [stores, setStores] = useState([]);
  const [filteredStores, setFilteredStores] = useState([]);
  const [search, setSearch] = useState("");
  const navigate = useNavigate();
  const location = useLocation();

  useEffect(() => {
    axios.get("https://blossompick.duckdns.org/api/v1/florist/stores/")
      .then(({ data }) => {
        navigator.geolocation.getCurrentPosition(async pos => {
          const userLat = pos.coords.latitude;
          const userLng = pos.coords.longitude;

          const withDist = await Promise.all(
            data.map(async store => {
              try {
                const { lat, lng } = await geocodeAddress(store.data.address);
                const distance = haversine(userLat, userLng, lat, lng);
                return { ...store, distance };
              } catch {
                return { ...store, distance: Infinity };
              }
            })
          );

          withDist.sort((a, b) => a.distance - b.distance);
          // setStores(withDist);
          // setFilteredStores(withDist);
          setStores(withDist);
         // state.recommended === true 면 자동 필터링
          if (location.state?.recommended) {
            const names = JSON.parse(localStorage.getItem("flowerNames") || "[]");
            const rec = withDist.filter(store =>
              store.inventory?.some(item => names.includes(item.name))
            );
            setFilteredStores(rec);
            setRecommendedOnly(true);
          } else {
            setFilteredStores(withDist);
          }
        },
        () => {
          setStores(data.map(s => ({ ...s, distance: undefined })));
          setFilteredStores(data.map(s => ({ ...s, distance: undefined })));
        });
      })
      .catch(err => {
        console.error("꽃집 리스트 가져오기 실패:", err);
      });
  }, []);

  useEffect(() => {
    const filtered = stores.filter(store =>
      store.housename.toLowerCase().includes(search.toLowerCase())
    );
    setFilteredStores(filtered);
  }, [search, stores]);

  const getTodayKoreanDay = () => {
    const days = ["일", "월", "화", "수", "목", "금", "토"];
    return days[new Date().getDay()];
  };
  const today = getTodayKoreanDay();

  return (
    <div className="min-h-screen bg-white pt-20 px-4">
      <div className="flex justify-center mb-6">
        <AdCarousel />
      </div>

      {/* 검색 입력 필드 */}
      <div className="mb-6 max-w-4xl mx-auto">
        <input
          type="text"
          placeholder="꽃집 이름으로 검색..."
          value={search}
          onChange={(e) => setSearch(e.target.value)}
          className="w-full border rounded p-2 shadow-sm"
          list="shop-suggestions"
        />
        <datalist id="shop-suggestions">
          {stores.map((store, idx) => (
            <option key={idx} value={store.housename} />
          ))}
        </datalist>
      </div>

      <div className="max-w-4xl mx-auto">
        {filteredStores.length === 0 ? (
          <p className="text-center text-gray-500 mt-8">
            등록된 꽃집이 없습니다.
          </p>
        ) : (
          filteredStores.map((store, idx) => {
            const isClosedToday = store.data?.hours?.[today]?.closed === true;
            const distKm = store.distance !== undefined && store.distance !== Infinity
              ? (store.distance / 1000).toFixed(2) + " km"
              : "거리 정보 없음";

            return (
              <div
                key={idx}
                className="border rounded p-4 shadow mb-4 bg-gray-50"
              >
                <div className="flex items-start">
                  <img
                    src={store.data?.images?.[0]?.url || "/no-image.png"}
                    alt={store.housename}
                    className="w-24 h-24 object-cover rounded mr-4"
                  />
                  <div className="flex-1">
                    <p className="font-bold text-lg">{store.housename}</p>
                    <p>🌍 주소: {store.data?.address || "주소 없음"}</p>
                    <p>
                      🌸 인기 꽃 종류: {store.inventory?.map(f => f.name).join(", ") || "정보 없음"}
                    </p>
                    <p>📞 전화번호: {store.data?.phone || "없음"}</p>
                    {isClosedToday && (
                      <p className="text-red-500 font-semibold mt-1">
                        🚫 오늘은 휴무일입니다.
                      </p>
                    )}
                    <p className="mt-1">📏 거리: {distKm}</p>
                    <button
                      onClick={() => navigate(`/flowerhouse/view/${store.business_id}`)}
                      className="mt-2 text-blue-600 hover:underline text-sm"
                    >
                      자세히 보기
                    </button>
                  </div>
                </div>
              </div>
            );
          })
        )}
      </div>
    </div>
  );
};

export default Order;
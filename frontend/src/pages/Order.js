import React, { useEffect, useState } from "react";
import axios from "axios";
import AdCarousel from "./AdCarousel";
import { useNavigate } from "react-router-dom";

const Order = () => {
  const [stores, setStores] = useState([]);
  const navigate = useNavigate();

  useEffect(() => {
    axios.get("https://blossompick.duckdns.org/api/v1/florist/stores/")
      .then((res) => {
        setStores(res.data);
      })
      .catch((err) => {
        console.error("❌ 꽃집 리스트 가져오기 실패:", err);
      });
  }, []);

  // 오늘 요일을 한글로 반환하는 유틸
  const getTodayKoreanDay = () => {
    const days = ["일", "월", "화", "수", "목", "금", "토"];
    const today = new Date().getDay();
    return days[today];
  };

  const today = getTodayKoreanDay();

  return (
    <div className="min-h-screen bg-white pt-20 px-4">
      <div className="flex justify-center mb-6">
        <AdCarousel />
      </div>

      <div className="max-w-4xl mx-auto">
        {stores.length === 0 ? (
          <p className="text-center text-gray-500 mt-8">등록된 꽃집이 없습니다.</p>
        ) : (
          stores.map((store, idx) => {
            const isClosedToday = store.data?.hours?.[today]?.closed === true;

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
                    <p>🌸 인기 꽃 종류: {store.inventory?.map(f => f.name).join(", ") || "정보 없음"}</p>
                    <p>📞 전화번호: {store.data?.phone || "없음"}</p>

                    {/* 오늘 휴무 여부 표시 */}
                    {isClosedToday && (
                      <p className="text-red-500 font-semibold mt-1">🚫 오늘은 휴무일입니다.</p>
                    )}

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
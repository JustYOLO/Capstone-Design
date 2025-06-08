import React, { useEffect, useState } from "react";
import { useParams } from "react-router-dom";
import axios from "axios";
import AdCarousel from "./AdCarousel"; // 배너 컴포넌트 import

const weekdays = ["월", "화", "수", "목", "금", "토", "일"];

const Order = () => {
  const { pk } = useParams();
  const [shopData, setShopData] = useState(null);

  useEffect(() => {
    axios.get(`https://api/v1/florist/stores/${pk}/`)
      .then((res) => {
        setShopData(res.data.data); // data 안에 data가 있음
      })
      .catch((err) => console.error("가게 정보 가져오기 실패:", err));
  }, [pk]);

  if (!shopData) return <div className="p-8 text-center text-gray-600">로딩 중...</div>;

  return (
    <div className="min-h-screen bg-white pt-20 px-4">
      {/* 배너 */}
      <div className="flex justify-center mb-6">
        <AdCarousel />
      </div>

      <div className="max-w-4xl mx-auto bg-white p-6 rounded shadow">
        <h1 className="text-3xl font-bold mb-2 text-purple-800">{shopData.storeName}</h1>
        <p className="mb-1 text-gray-700">📍 {shopData.address} {shopData.detailAddress}</p>
        <p className="mb-1 text-gray-700">📞 {shopData.phone}</p>
        <p className="mb-4 text-gray-800">📢 {shopData.intro}</p>

        <h2 className="text-xl font-semibold mt-6 mb-2">🕒 영업 시간</h2>
        <ul className="space-y-1 text-sm">
          {weekdays.map((day) => (
            <li key={day}>
              <strong>{day}:</strong>{" "}
              {shopData.hours[day]?.closed
                ? "휴무"
                : `${shopData.hours[day].start} ~ ${shopData.hours[day].end}`}
            </li>
          ))}
        </ul>

        <h2 className="text-xl font-semibold mt-6 mb-2">📷 사진</h2>
        <div className="grid grid-cols-2 sm:grid-cols-3 gap-4 mt-2">
          {shopData.images?.length > 0 ? (
            shopData.images.map((img, idx) => (
              <img
                key={idx}
                src={img.url}
                alt={`img-${idx}`}
                className="w-full h-48 object-cover rounded"
              />
            ))
          ) : (
            <p className="col-span-full text-gray-500 text-sm">등록된 사진이 없습니다.</p>
          )}
        </div>
      </div>
    </div>
  );
};

export default Order;
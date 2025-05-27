import React, { useEffect, useState, useRef } from "react";
import { useNavigate } from "react-router-dom";

const weekdays = ["월", "화", "수", "목", "금", "토", "일"];

const FlowerHouseView = () => {
  const [data, setData] = useState(null);
  const [showHours, setShowHours] = useState(false);
  const containerRef = useRef(null);
  const navigate = useNavigate();

  useEffect(() => {
    const saved = JSON.parse(localStorage.getItem("flowerhouse"));
    setData(saved);
  }, []);

  if (!data) {
    return <div className="text-center p-8 text-red-500">저장된 꽃집 정보가 없습니다.</div>;
  }

  return (
    <div
      ref={containerRef}
      className="min-h-screen px-4 py-24 bg-gray-50 flex flex-col items-center relative"
    >
      <h1 className="text-4xl font-bold text-purple-700 mb-2">꽃집 상호명</h1>
      <p className="text-lg mb-1 text-gray-700">{data.intro || "소개 문구가 없습니다."}</p>
      <p className="text-sm text-gray-500">{`📞 ${data.phone || "전화번호 없음"}`}</p>
      <p className="text-sm text-gray-500 mb-6">
        📍 {data.address || "주소 정보 없음"}
        {data.detailAddress ? `, ${data.detailAddress}` : ""}
    </p>

      <div className="flex justify-between items-center w-full max-w-4xl mb-6">
        <div className="flex items-center space-x-2">
          <span className="text-xl font-semibold">🕒 영업 시간</span>
          <button
            onClick={() => setShowHours((prev) => !prev)}
            className="text-blue-600 text-sm hover:underline"
          >
            {showHours ? "접기▲" : "펼치기▼"}
          </button>
        </div>
        <button
          onClick={() => navigate("/order")}
          className="px-4 py-2 bg-green-600 text-white rounded hover:bg-pink-300"
        >
          🛍️ 주문하러 가기
        </button>
      </div>

      {showHours && (
        <div className="w-full max-w-3xl bg-white p-6 rounded shadow mb-8">
          <ul className="space-y-2">
            {weekdays.map((day) => {
              const dayData = data.hours?.[day];
              return (
                <li key={day} className="flex justify-between text-sm">
                  <span className="font-medium">{day}</span>
                  {dayData?.closed ? (
                    <span className="text-red-500 font-semibold">휴무</span>
                  ) : (
                    <span>
                      {dayData?.start || "??:??"} ~ {dayData?.end || "??:??"}
                    </span>
                  )}
                </li>
              );
            })}
          </ul>
        </div>
      )}

      <div className="w-full max-w-4xl bg-white p-6 rounded shadow">
        <h2 className="text-lg font-semibold mb-4">📷 사진</h2>
        <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 gap-4">
          {data.images?.map((img, idx) => (
            <img
              key={idx}
              src={img.url}
              alt={`img-${idx}`}
              className="w-full h-48 object-cover rounded shadow"
            />
          ))}
        </div>
      </div>
    </div>
  );
};

export default FlowerHouseView;
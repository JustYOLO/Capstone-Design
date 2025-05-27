import React, { useEffect, useState } from "react";
import { useParams } from "react-router-dom";
import axios from "axios";

const weekdays = ["월", "화", "수", "목", "금", "토", "일"];

const OrderDetail = () => {
  const { pk } = useParams();
  const [shopData, setShopData] = useState(null);

  useEffect(() => {
    axios.get(`/api/v1/florist/stores/${pk}/`)
      .then((res) => {
        setShopData(res.data.data); // data 안에 data가 있음
      })
      .catch((err) => console.error("가게 정보 가져오기 실패:", err));
  }, [pk]);

  if (!shopData) return <div>로딩 중...</div>;

  return (
    <div className="p-6">
      <h1 className="text-3xl font-bold mb-2">{shopData.storeName}</h1>
      <p className="mb-1">📍 {shopData.address} {shopData.detailAddress}</p>
      <p className="mb-1">📞 {shopData.phone}</p>
      <p className="mb-4">📢 {shopData.intro}</p>

      <h2 className="text-xl font-semibold mt-6 mb-2">🕒 영업 시간</h2>
      <ul className="space-y-1">
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
      <div className="grid grid-cols-2 gap-4">
        {shopData.images?.map((img, idx) => (
          <img key={idx} src={img.url} alt={`img-${idx}`} className="w-full h-48 object-cover" />
        ))}
      </div>
    </div>
  );
};

export default OrderDetail;
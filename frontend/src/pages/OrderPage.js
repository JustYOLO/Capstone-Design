import React, { useEffect, useState } from "react";
import { useParams } from "react-router-dom";
import axios from "axios";

const OrderPage = () => {
  const { pk } = useParams();
  const [shopData, setShopData] = useState(null);
  const [quantities, setQuantities] = useState({});
  const [showConfirm, setShowConfirm] = useState(false);
  const [confirmed, setConfirmed] = useState(false);
  const [readyTime, setReadyTime] = useState(15); // 기본 준비 시간 (분)

  useEffect(() => {
    axios.get(`https://blossompick.duckdns.org/api/v1/florist/stores/${pk}/`)
      .then((res) => {
        setShopData(res.data);
        const initialQuantities = {};
        res.data.inventory.forEach((item) => {
          initialQuantities[item.name] = 0;
        });
        setQuantities(initialQuantities);
      })
      .catch((err) => console.error("❌ 꽃집 정보 가져오기 실패:", err));
  }, [pk]);

  const updateQuantity = (name, delta) => {
    setQuantities((prev) => ({
      ...prev,
      [name]: Math.max(0, (prev[name] || 0) + delta),
    }));
  };

  const totalCount = Object.values(quantities).reduce((sum, v) => sum + v, 0);

  const totalPrice = totalCount * 5000; // 가격은 꽃 1개당 5000원으로 가정

  const handleConfirm = () => {
    setShowConfirm(false);
    setConfirmed(true);
  };

  const pickupTime = new Date(Date.now() + readyTime * 60000)
    .toLocaleTimeString([], { hour: "2-digit", minute: "2-digit" });

  if (!shopData) return <div className="p-8 text-center">꽃집 정보를 불러오는 중...</div>;

  return (
    <div className="min-h-screen px-6 py-20 bg-gray-50">
      <h1 className="text-3xl font-bold text-purple-800 mb-4">{shopData.housename}</h1>
      <p className="mb-2">📍 {shopData.data.address} {shopData.data.detailAddress}</p>
      <p className="mb-4">📞 {shopData.data.phone}</p>

      <h2 className="text-xl font-semibold mb-2">🌸 꽃 주문</h2>
      {shopData.inventory.map((item) => (
        <div key={item.name} className="flex justify-between items-center mb-2 bg-white p-3 rounded shadow">
          <div>
            <p className="font-medium">{item.name}</p>
            <p className="text-sm text-gray-500">{item.meaning}</p>
          </div>
          <div className="flex items-center space-x-2">
            <button onClick={() => updateQuantity(item.name, -1)} className="px-2 py-1 bg-gray-200 rounded">-</button>
            <span>{quantities[item.name]}</span>
            <button onClick={() => updateQuantity(item.name, 1)} className="px-2 py-1 bg-gray-200 rounded">+</button>
          </div>
        </div>
      ))}

      <div className="mt-6">
        <p className="mb-2">총 수량: <strong>{totalCount}개</strong></p>
        <p className="mb-4">예상 금액: <strong>{totalPrice.toLocaleString()}원</strong></p>

        <button
          onClick={() => setShowConfirm(true)}
          className="bg-green-600 text-white px-4 py-2 rounded hover:bg-green-700"
        >
          🛒 주문하기
        </button>
      </div>

      {showConfirm && (
        <div className="mt-8 p-4 bg-white shadow rounded">
          <h3 className="font-semibold mb-2">📦 배송 정보 확인</h3>
          <p className="mb-1">주소: {shopData.data.address} {shopData.data.detailAddress}</p>
          <p className="mb-1">총 금액: {totalPrice.toLocaleString()}원</p>
          <button
            onClick={handleConfirm}
            className="mt-2 bg-blue-600 text-white px-3 py-1 rounded"
          >
            다 확인했습니다
          </button>
        </div>
      )}

      {confirmed && (
        <div className="mt-6 bg-yellow-100 p-4 rounded text-center">
          <p className="text-lg font-semibold">✅ 주문 확인 중입니다</p>
          <p className="mt-1">사장님이 확인하면 <strong>{pickupTime}까지 픽업</strong> 오세요 💐</p>
        </div>
      )}
    </div>
  );
};

export default OrderPage;
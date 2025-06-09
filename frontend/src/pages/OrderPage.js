import React, { useEffect, useState } from "react";
import { useParams } from "react-router-dom";
import axios from "axios";

const OrderPage = () => {
  const { business_id } = useParams();
  const [shopData, setShopData] = useState(null);
  const [quantities, setQuantities] = useState({});
  const [showConfirm, setShowConfirm] = useState(false);
  const [confirmed, setConfirmed] = useState(false);
  const [readyTime, setReadyTime] = useState(15);

  useEffect(() => {
    axios
      .get(`https://blossompick.duckdns.org/api/v1/florist/stores/${business_id}/`)
      .then((res) => {
        setShopData(res.data);
        const initialQuantities = {};
        res.data.inventory.forEach((item) => {
          initialQuantities[item.name] = 0;
        });
        setQuantities(initialQuantities);
      })
      .catch((err) => console.error("❌ 꽃집 정보 가져오기 실패:", err));
  }, [business_id]);

  const updateQuantity = (name, delta) => {
    setQuantities((prev) => ({
      ...prev,
      [name]: Math.max(0, (prev[name] || 0) + delta),
    }));
  };

  const totalCount = Object.values(quantities).reduce((sum, v) => sum + v, 0);
  const totalPrice = totalCount * 5000;

  const handleConfirm = () => {
    const orderedItems = Object.entries(quantities)
      .filter(([_, qty]) => qty > 0)
      .map(([name, quantity]) => ({ name, quantity }));

    if (orderedItems.length === 0) {
      alert("🌸 최소 1개 이상의 꽃을 선택해주세요!");
      return;
    }
    
    const token = localStorage.getItem("access_token");

    axios.post("https://blossompick.duckdns.org/api/v1/florist/order/", {
        business_id: parseInt(business_id),
        items: orderedItems,
      })
      .then((res) => {
        console.log("✅ 주문 성공:", res.data);
        setShowConfirm(false);
        setConfirmed(true);
      })
      .catch((err) => {
        if (err.response) {
          const data = err.response.data;
          if (data.business_id) {
            alert("🚫 유효하지 않거나 인증되지 않은 꽃집입니다.");
          } else if (data.non_field_errors) {
            alert(`🚫 주문 실패: ${data.non_field_errors.join(", ")}`);
          } else {
            alert("⚠️ 주문 중 알 수 없는 오류가 발생했습니다.");
            console.error("기타 에러:", data);
          }
        } else {
          alert("서버에 연결할 수 없습니다. 다시 시도해주세요.");
          console.error("❌ 네트워크 오류:", err);
        }
      });
  };

  const pickupTime = new Date(Date.now() + readyTime * 60000).toLocaleTimeString([], {
    hour: "2-digit",
    minute: "2-digit",
  });

  if (!shopData) return <div className="p-8 text-center">꽃집 정보를 불러오는 중...</div>;

  return (
    <div className="min-h-screen bg-gray-50 px-4 py-20 flex justify-center">
      <div className="w-full max-w-4xl bg-white p-8 rounded-lg shadow">
        <h1 className="text-4xl font-bold text-purple-800 mb-2 text-center">
          {shopData.housename}
        </h1>
        <p className="text-center text-gray-700 mb-1">💬 {shopData.data.intro || "소개 없음"}</p>
        <p className="text-center text-gray-600">📞 {shopData.data.phone}</p>
        <p className="text-center text-gray-600 mb-6">
          📍 {shopData.data.address} {shopData.data.detailAddress}
        </p>

        <h2 className="text-xl font-semibold mb-2">🌸 꽃 주문</h2>
        {shopData.inventory.map((item) => (
          <div
            key={item.name}
            className="flex justify-between items-center mb-2 bg-gray-100 p-3 rounded"
          >
            <div>
              <p className="font-medium">{item.name}</p>
              <p className="text-sm text-gray-500">{item.meaning}</p>
            </div>
            <div className="flex items-center space-x-2">
              <button
                onClick={() => updateQuantity(item.name, -1)}
                className="px-2 py-1 bg-gray-200 rounded"
              >
                -
              </button>
              <span>{quantities[item.name]}</span>
              <button
                onClick={() => updateQuantity(item.name, 1)}
                className="px-2 py-1 bg-gray-200 rounded"
              >
                +
              </button>
            </div>
          </div>
        ))}

        <div className="mt-6">
          <p className="mb-1">
            총 수량: <strong>{totalCount}개</strong>
          </p>
          <p className="mb-4">
            예상 금액: <strong>{totalPrice.toLocaleString()}원</strong>
          </p>

          <button
            onClick={() => setShowConfirm(true)}
            className="bg-green-600 text-white px-4 py-2 rounded w-full hover:bg-green-700"
          >
            🛒 주문하기
          </button>
        </div>

        {showConfirm && (
          <div className="mt-8 p-4 bg-white border rounded shadow">
            <h3 className="font-semibold mb-2">📦 배송 정보 확인</h3>
            <p className="mb-1">
              주소: {shopData.data.address} {shopData.data.detailAddress}
            </p>
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
            <p className="mt-1">
              사장님이 확인하면 <strong>{pickupTime}까지 픽업</strong> 오세요 💐
            </p>
          </div>
        )}
      </div>
    </div>
  );
};

export default OrderPage;
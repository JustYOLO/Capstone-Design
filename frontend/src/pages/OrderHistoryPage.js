import React, { useEffect, useState } from "react";
import axios from "axios";

const OrderHistoryPage = () => {
  const [orders, setOrders] = useState([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const token = localStorage.getItem("access_token");
    if (!token) {
      alert("로그인이 필요합니다.");
      setLoading(false);
      return;
    }

    axios
      .get("https://blossompick.duckdns.org/api/v1/orders/", {
        headers: {
          Authorization: `Bearer ${token}`,
        },
      })
      .then((res) => {
        setOrders(res.data);
        setLoading(false);
      })
      .catch((err) => {
        console.error("❌ 주문 내역 조회 실패:", err);
        alert("주문 내역을 불러오는 데 실패했습니다.");
        setLoading(false);
      });
  }, []);

  if (loading) {
    return <div className="p-8 text-center text-gray-600">주문 내역을 불러오는 중...</div>;
  }

  return (
    <div className="min-h-screen bg-gray-50 px-6 pt-28 pb-12">
      <h1 className="text-3xl font-bold text-purple-800 mb-6">🧾 나의 주문 내역</h1>

      {orders.length === 0 ? (
        <p className="text-gray-500">주문한 내역이 없습니다.</p>
      ) : (
        <div className="space-y-6">
          {orders.map((order) => (
            <div
              key={order.id}
              className="bg-white shadow rounded p-4 border border-gray-200"
            >
              <div className="flex justify-between mb-2">
                <span className="font-semibold text-lg">📦 주문 번호 #{order.id}</span>
                <span className="text-sm text-gray-500">
                  {new Date(order.created_at).toLocaleString("ko-KR")}
                </span>
              </div>
              <p className="text-sm text-gray-600 mb-1">
                주문자: {order.customer_name} ({order.customer_email})
              </p>
              <div className="text-sm">
                <strong>주문한 꽃:</strong>
                <ul className="list-disc ml-5 mt-1">
                  {order.items.map((item, idx) => (
                    <li key={idx}>
                      {item.name} × {item.quantity}
                    </li>
                  ))}
                </ul>
              </div>
            </div>
          ))}
        </div>
      )}
    </div>
  );
};

export default OrderHistoryPage;
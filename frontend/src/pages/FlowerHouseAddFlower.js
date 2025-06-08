import React, { useState, useEffect } from "react";
import { useParams, useNavigate } from "react-router-dom";

const FlowerHouseAddFlower = () => {
  const { pk } = useParams();
  const [flowerData, setFlowerData] = useState([]);
  const [searchTerm, setSearchTerm] = useState("");
  const [inventory, setInventory] = useState([]);
  const navigate = useNavigate();

  useEffect(() => {
    fetch("/flowers.json")
      .then((res) => res.json())
      .then((data) => setFlowerData(data))
      .catch((err) => console.error("❌ 꽃말 데이터 불러오기 실패:", err));

    const token = localStorage.getItem("access_token");
    fetch("https://blossompick.duckdns.org/api/v1/florist/inventory/", {
      headers: {
        Authorization: `Bearer ${token}`,
      },
    })
      .then((res) => res.json())
      .then((data) => {
        setInventory(data?.flowers || []);
      })
      .catch((err) => console.error("❌ 재고 불러오기 실패:", err));
  }, []);

  const filteredFlowers = flowerData.filter((flower) =>
    flower.name.includes(searchTerm)
  );

  const handleAddFlower = (flower) => {
    if (inventory.find((item) => item.name === flower.name)) return;
    setInventory((prev) => [
      ...prev,
      { name: flower.name, meaning: flower.meaning, quantity: 0 },
    ]);
  };

  const updateQuantity = (name, delta) => {
    setInventory((prev) =>
      prev.map((item) =>
        item.name === name
          ? { ...item, quantity: Math.max(0, item.quantity + delta) }
          : item
      )
    );
  };

  const handleSave = async () => {
    try {
      const token = localStorage.getItem("access_token");

      const response = await fetch(
        "https://blossompick.duckdns.org/api/v1/florist/inventory/",
        {
          method: "POST",
          headers: {
            "Content-Type": "application/json",
            Authorization: `Bearer ${token}`,
          },
          body: JSON.stringify({ flowers: inventory }),
        }
      );

      if (!response.ok) throw new Error("저장 실패");

      alert("🌸 꽃 재고 저장 완료!");

      const res2 = await fetch(
        "https://blossompick.duckdns.org/api/v1/florist/housename/",
        {
          headers: {
            Authorization: `Bearer ${token}`,
          },
        }
      );


      navigate("flowerhouse/view/${pk}/");
    } catch (err) {
      console.error("❌ 저장 오류:", err);
      alert("저장 중 문제가 발생했습니다.");
    }
  };

  return (
    <div className="min-h-screen px-6 py-24 bg-gray-50">
      <h1 className="text-3xl font-bold mb-6">🌷 꽃 재고 등록</h1>

      <div className="flex flex-col lg:flex-row gap-8">
        {/* 왼쪽 2/3 */}
        <div className="lg:w-2/3">
          <input
            type="text"
            placeholder="꽃 이름을 검색하세요"
            value={searchTerm}
            onChange={(e) => setSearchTerm(e.target.value)}
            className="border px-4 py-2 rounded w-full mb-4"
          />

          <div className="grid grid-cols-2 sm:grid-cols-3 gap-4">
            {filteredFlowers.map((flower, idx) => (
              <div
                key={idx}
                className="p-3 border rounded shadow hover:bg-purple-50 cursor-pointer"
                onClick={() => handleAddFlower(flower)}
              >
                <p className="font-semibold">{flower.name}</p>
                <p className="text-sm text-gray-500">{flower.meaning}</p>
              </div>
            ))}
          </div>
        </div>

        {/* 오른쪽 1/3 */}
        <div className="lg:w-1/3 bg-white p-4 rounded shadow">
          <h2 className="text-xl font-semibold mb-4">📦 등록한 꽃 목록</h2>
          <div className="space-y-4">
            {inventory.map((flower, idx) => (
              <div
                key={idx}
                className="flex items-center justify-between border-b pb-2"
              >
                <div>
                  <p className="font-semibold">{flower.name}</p>
                  <p className="text-sm text-gray-500">{flower.meaning}</p>
                </div>
                <div className="flex items-center space-x-2">
                  <button
                    onClick={() => updateQuantity(flower.name, -1)}
                    className="px-2 py-1 bg-gray-200 rounded"
                  >
                    -
                  </button>
                  <span>{flower.quantity}개</span>
                  <button
                    onClick={() => updateQuantity(flower.name, 1)}
                    className="px-2 py-1 bg-gray-200 rounded"
                  >
                    +
                  </button>
                </div>
              </div>
            ))}
          </div>

          <button
            onClick={handleSave}
            className="mt-6 w-full py-2 bg-green-600 text-white rounded hover:bg-green-700"
          >
            ✅ 저장하기
          </button>
        </div>
      </div>
    </div>
  );
};

export default FlowerHouseAddFlower;

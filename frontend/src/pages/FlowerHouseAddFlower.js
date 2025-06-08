import React, { useState, useEffect } from "react";

const FlowerHouseAddFlower = () => {
  const [flowerData, setFlowerData] = useState([]);
  const [searchTerm, setSearchTerm] = useState("");
  const [inventory, setInventory] = useState([]);

  // JSON에서 꽃말 데이터 불러오기
  useEffect(() => {
    fetch("/flowers.json") // public 디렉토리에 있어야 함
      .then((res) => res.json())
      .then((data) => setFlowerData(data))
      .catch((err) => console.error("❌ 꽃말 데이터 불러오기 실패:", err));
  }, []);

  // 검색 필터링
  const filteredFlowers = flowerData.filter((flower) =>
    flower.name.includes(searchTerm)
  );

  // 꽃 추가
  const handleAddFlower = (flower) => {
    if (inventory.find((item) => item.name === flower.name)) return;
    setInventory((prev) => [
      ...prev,
      { name: flower.name, meaning: flower.meaning, quantity: 0 },
    ]);
  };

  // 수량 조절
  const updateQuantity = (name, delta) => {
    setInventory((prev) =>
      prev.map((item) =>
        item.name === name
          ? { ...item, quantity: Math.max(0, item.quantity + delta) }
          : item
      )
    );
  };

  return (
    <div className="min-h-screen px-6 py-24 bg-gray-50">
      <h1 className="text-3xl font-bold mb-4">🌷 꽃 재고 등록</h1>

      {/* 검색창 */}
      <input
        type="text"
        placeholder="꽃 이름을 검색하세요"
        value={searchTerm}
        onChange={(e) => setSearchTerm(e.target.value)}
        className="border px-4 py-2 rounded w-full mb-4"
      />

      {/* 검색 결과 */}
      <div className="grid grid-cols-2 sm:grid-cols-3 gap-4 mb-8">
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

      <hr className="my-6" />

      {/* 재고 리스트 */}
      <h2 className="text-2xl font-semibold mb-4">📦 등록한 꽃 목록</h2>
      <div className="space-y-4">
        {inventory.map((flower, idx) => (
          <div
            key={idx}
            className="flex items-center justify-between bg-white p-4 rounded shadow"
          >
            <div>
              <p className="font-semibold">{flower.name}</p>
              <p className="text-sm text-gray-500">의미: {flower.meaning}</p>
            </div>
            <div className="flex items-center space-x-2">
              <button
                onClick={() => updateQuantity(flower.name, -1)}
                className="px-3 py-1 bg-gray-200 rounded hover:bg-gray-300"
              >
                -
              </button>
              <span>{flower.quantity}개</span>
              <button
                onClick={() => updateQuantity(flower.name, 1)}
                className="px-3 py-1 bg-gray-200 rounded hover:bg-gray-300"
              >
                +
              </button>
            </div>
          </div>
        ))}
      </div>
    </div>
  );
};

export default FlowerHouseAddFlower;
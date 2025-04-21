import React, { useState, useEffect } from "react";

const FlowerDictionary = () => {
  const [searchTerm, setSearchTerm] = useState(""); // 검색어 상태
  const [flowerData, setFlowerData] = useState([]); // 꽃말 데이터

  // JSON 파일에서 꽃말 데이터 불러오기
  useEffect(() => {
    fetch("flowers.json") // `public/flowers.json`에서 데이터 가져옴
      .then((response) => response.json())
      .then((data) => setFlowerData(data))
      .catch((error) => console.error("Error loading flowers:", error));
  }, []);

  // 검색 기능 (입력한 검색어가 포함된 꽃만 필터링)
  const filteredFlowers = flowerData.filter((flower) =>
    flower.name.includes(searchTerm)
  );

  return (
    <div className="flex flex-col items-center justify-center min-h-screen bg-gray-50 px-4 pt-20">
      {/* Navbar에 가리지 않도록 pt-20 추가 */}
      <h1 className="text-4xl font-bold text-gray-900 mb-4">🌺 꽃말 사전</h1>
      <p className="text-gray-600 mb-6">꽃의 이름을 검색하고 꽃말을 알아보세요!</p>

      {/* 검색창 */}
      <input
        type="text"
        placeholder="🌿 꽃 이름 검색..."
        className="w-full max-w-md px-4 py-3 border rounded-lg shadow-sm focus:ring-2 focus:ring-purple-400 text-gray-800"
        value={searchTerm}
        onChange={(e) => setSearchTerm(e.target.value)}
      />

      {/* 검색 결과 (고정된 높이 설정) */}
      <div className="mt-6 w-full max-w-md h-[600px] overflow-y-auto bg-white shadow-lg rounded-lg p-4">
        {filteredFlowers.length > 0 ? (
          filteredFlowers.map((flower, index) => (
            <div
              key={index}
              className="bg-white p-4 mb-3 shadow-md rounded-lg border-l-4 border-pink-400"
            >
              <p className="text-lg font-semibold text-gray-800">{flower.name}</p>
              <p className="text-gray-600">{flower.meaning}</p>
            </div>
          ))
        ) : (
          <p className="text-gray-500 text-center py-4">🌱 검색된 꽃이 없습니다.</p>
        )}
      </div>
    </div>
  );
};

export default FlowerDictionary;

import React, { useState } from "react";
import { Link } from "react-router-dom";
import AdCarousel from "./AdCarousel";

const Order = () => {
  const [searchTerm, setSearchTerm] = useState("");

  // 꽃집 샘플 데이터
  const flowerShops = [
    {
      id: 1,
      name: "꽃비꽃집",
      address: "서울시 강남구",
      popularFlowers: ["장미", "튤립"],
      phone: "010-1234-5678",
      image: "/shop1.jpg",
    },
    {
      id: 2,
      name: "블로썸플라워",
      address: "서울시 마포구",
      popularFlowers: ["해바라기", "프리지아"],
      phone: "010-8765-4321",
      image: "/shop2.jpg",
    },
    {
      id: 3,
      name: "루나블룸",
      address: "서울시 서초구",
      popularFlowers: ["백합", "수국"],
      phone: "010-2222-3333",
      image: "/shop3.jpg",
    },
    {
      id: 4,
      name: "오월의꽃",
      address: "부산시 해운대구",
      popularFlowers: ["작약", "장미"],
      phone: "010-4444-5555",
      image: "/shop4.jpg",
    },
    {
      id: 5,
      name: "피오니하우스",
      address: "대전시 유성구",
      popularFlowers: ["피오니", "튤립"],
      phone: "010-6666-7777",
      image: "/shop5.jpg",
    },
    {
      id: 6,
      name: "그린플로라",
      address: "광주시 남구",
      popularFlowers: ["안개꽃", "카네이션"],
      phone: "010-8888-9999",
      image: "/shop6.jpg",
    },
    {
      id: 7,
      name: "퍼퓸플라워",
      address: "제주시 애월읍",
      popularFlowers: ["라넌큘러스", "히아신스"],
      phone: "010-1010-1111",
      image: "/shop7.jpg",
    },
  ];

  const filteredShops = flowerShops.filter(
    (shop) =>
      shop.name.includes(searchTerm) ||
      shop.popularFlowers.some((f) => f.includes(searchTerm))
  );

  return (
    <div className="min-h-screen bg-white pt-20 px-4">
      {/* 광고 영역 */}
      <div className="flex justify-center mb-4">
        <AdCarousel />
      </div>

      {/* 검색창 */}
      <div className="flex items-center border border-gray-300 rounded-lg overflow-hidden w-full max-w-2xl mx-auto mb-4">
        <input
          type="text"
          placeholder="꽃집 이름 또는 꽃 이름으로 검색!"
          value={searchTerm}
          onChange={(e) => setSearchTerm(e.target.value)}
          className="flex-grow px-4 py-2 focus:outline-none"
        />
        <button className="bg-gray-200 px-4 py-2">🔍</button>
      </div>

      {/* 꽃집 목록 */}
      <div className="max-h-[500px] overflow-y-scroll border rounded-lg p-4 bg-gray-50 max-w-2xl mx-auto">
        {filteredShops.map((shop) => (
          <div key={shop.id} className="flex mb-4 border-b pb-4">
            <img
              src={shop.image}
              alt={shop.name}
              className="w-24 h-24 object-cover rounded-md mr-4"
            />
            <div className="flex-grow">
              <p><strong>꽃집 이름:</strong> {shop.name}</p>
              <p><strong>꽃집 주소:</strong> {shop.address}</p>
              <p><strong>인기있는 꽃 종류:</strong> {shop.popularFlowers.join(", ")}</p>
              <p><strong>전화번호:</strong> {shop.phone}</p>
              <Link to={`/order/${shop.id}`} className="text-blue-500 mt-1 inline-block">자세히 보기</Link>
            </div>
          </div>
        ))}
      </div>
    </div>
  );
};

export default Order;
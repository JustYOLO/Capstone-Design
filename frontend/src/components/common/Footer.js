import React from "react";

const Footer = () => {
  return (
    <footer className="w-full bg-gray-800 py-6 md:py-10 mt-8 md:mt-12 text-center text-gray-200">
      <p className="text-lg sm:text-xl md:text-2xl font-semibold mb-2">🌸 BlossomPick 프로젝트</p>
      
      {/* 팀원 정보 (모바일에서는 세로, 데스크톱에서는 가로 정렬) */}
      <div className="flex flex-col md:flex-row justify-center space-y-2 md:space-y-0 md:space-x-6 mb-4">
        <span>👨‍💻 김민성: 32200538</span>
        <span>👩‍💻 위다연: 32222797</span>
        <span>👨‍💻 이용민: 32203349</span>
      </div>

      {/* 설명 문구 */}
      <p className="text-gray-400 text-sm sm:text-base">
        꽃집을 등록하고 손쉽게 주문을 받아보세요! 🌿
      </p>
    </footer>
  );
};

export default Footer;
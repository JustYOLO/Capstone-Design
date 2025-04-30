import React from "react";

const Profile = () => {
  const dummyUser = {
    name: "홍길동",
    email: "hong@example.com",
    is_florist: false,
  };

  return (
    <div className="flex flex-col items-center justify-center min-h-screen bg-gray-50 px-4">
      <h1 className="text-3xl font-bold text-gray-800 mb-6">내 프로필</h1>
      <div className="bg-white rounded-xl shadow-md p-6 w-full max-w-md border border-gray-200">
        <p className="text-lg text-gray-700 mb-2">
          <span className="font-semibold">이름: </span> {dummyUser.name}
        </p>
        <p className="text-lg text-gray-700 mb-2">
          <span className="font-semibold">이메일: </span> {dummyUser.email}
        </p>
        <p className="text-lg text-gray-700 mb-6">
          <span className="font-semibold">계정 유형: </span>{" "}
          {dummyUser.is_florist ? "꽃집 운영자" : "일반 사용자"}
        </p>

        {/* 보라색 정보 수정하기 버튼 */}
        <button className="w-full bg-purple-600 text-white font-semibold py-2 px-4 rounded-lg hover:bg-purple-700 transition">
          정보 수정하기
        </button>
      </div>
    </div>
  );
};

export default Profile;
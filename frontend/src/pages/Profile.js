import React, { useEffect, useState } from "react";
import axios from "axios";

const Profile = () => {
  const [user, setUser] = useState(null);
  const [isFlorist, setIsFlorist] = useState(false);

  useEffect(() => {
    const storedUser = localStorage.getItem("user");
    if (storedUser) {
      const parsed = JSON.parse(storedUser);
      setUser(parsed.user);
    }

    const token = localStorage.getItem("access_token");
    if (token) {
      axios
        .get("https://blossompick.duckdns.org/api/v1/florist/housename/", {
          headers: { Authorization: `Bearer ${token}` },
        })
        .then((res) => {
          if (res.data?.housename) {
            setIsFlorist(true);
          }
        })
        .catch((err) => {
          console.warn("꽃집 운영자 아님 or 확인 실패:", err);
        });
    }
  }, []);

  if (!user) {
    return (
      <div className="flex items-center justify-center min-h-screen text-xl text-gray-500">
        사용자 정보를 불러오는 중입니다...
      </div>
    );
  }

  return (
    <div className="flex flex-col items-center justify-center min-h-screen bg-gray-50 px-4">
      <h1 className="text-3xl font-bold text-gray-800 mb-6">내 프로필</h1>
      <div className="bg-white rounded-xl shadow-md p-6 w-full max-w-md border border-gray-200">
        <p className="text-lg text-gray-700 mb-2">
          <span className="font-semibold">이름: </span> {user.name ?? "-"}
        </p>
        <p className="text-lg text-gray-700 mb-2">
          <span className="font-semibold">이메일: </span> {user.email}
        </p>
        <p className="text-lg text-gray-700 mb-6">
          <span className="font-semibold">계정 유형: </span>{" "}
          {isFlorist ? "꽃집 운영자" : "일반 사용자"}
        </p>
      </div>
    </div>
  );
};

export default Profile;
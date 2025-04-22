import React, { useEffect, useState } from "react";

const Profile = () => {
  const [user, setUser] = useState(null);
  const [errorMsg, setErrorMsg] = useState("");

  useEffect(() => {
    const storedUser = localStorage.getItem("user");

    if (!storedUser) {
      setErrorMsg("로그인 정보가 없습니다. 먼저 로그인해주세요.");
      return;
    }

    const token = JSON.parse(storedUser)?.key;

    fetch("https://blossompick.duckdns.org//api/v1/user/profile/", {
      method: "GET",
      headers: {
        "Authorization": `Token ${token}`,
        "Content-Type": "application/json"
      },
    })
      .then((res) => {
        if (!res.ok) throw new Error("사용자 정보를 가져올 수 없습니다.");
        return res.json();
      })
      .then((data) => setUser(data))
      .catch((err) => setErrorMsg(err.message));
  }, []);

  if (errorMsg) {
    return (
      <div className="flex items-center justify-center h-screen text-gray-600">
        {errorMsg}
      </div>
    );
  }

  if (!user) {
    return (
      <div className="flex items-center justify-center h-screen text-gray-600">
        사용자 정보를 불러오는 중입니다...
      </div>
    );
  }

  return (
    <div className="flex flex-col items-center justify-center min-h-screen bg-gray-50 px-4">
      <h1 className="text-3xl font-bold text-gray-800 mb-6">내 프로필</h1>
      <div className="bg-white rounded-xl shadow-md p-6 w-full max-w-md border border-gray-200">
        <p className="text-lg text-gray-700 mb-2">
          <span className="font-semibold">이름: </span> {user.name || "이름 없음"}
        </p>
        <p className="text-lg text-gray-700 mb-2">
          <span className="font-semibold">이메일: </span> {user.email}
        </p>
        {user.is_florist !== undefined && (
          <p className="text-lg text-gray-700">
            <span className="font-semibold">계정 유형: </span>{" "}
            {user.is_florist ? "꽃집 운영자" : "일반 사용자"}
          </p>
        )}
      </div>
    </div>
  );
};

export default Profile;
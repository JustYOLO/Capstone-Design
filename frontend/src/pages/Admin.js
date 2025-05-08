import React, { useEffect, useState } from "react";
import { useNavigate } from "react-router-dom";

const Admin = () => {
  const [authorized, setAuthorized] = useState(null);
  const navigate = useNavigate();

  useEffect(() => {
    const user = JSON.parse(localStorage.getItem("user"));
    if (user?.email?.trim().toLowerCase() === "sslabplusai@gmail.com") {
      setAuthorized(true); // 관리자 인증됨
    } else {
      setAuthorized(false); // 관리자 아님
    }
  }, []);

  if (authorized === null) {
    return <div className="text-center mt-20 text-gray-500">로딩 중...</div>;
  }

  if (!authorized) {
    return (
      <div className="text-center mt-20 text-red-500 font-semibold">
        접근 권한이 없습니다. 홈으로 이동합니다.
        {setTimeout(() => navigate("/"), 2000)}
      </div>
    );
  }

  return (
    <div className="p-6">
      <h1 className="text-3xl font-bold mb-4">관리자 페이지</h1>
      {/* 관리자 전용 콘텐츠 */}
    </div>
  );
};

export default Admin;
import React, { useEffect, useState } from "react";
import { useNavigate } from "react-router-dom";

const Admin = () => {
  const navigate = useNavigate();
  const [isAuthorized, setIsAuthorized] = useState(null); // 초기 상태 null

  useEffect(() => {
    const user = JSON.parse(localStorage.getItem("user"));
    if (user?.isAdmin) {
      setIsAuthorized(true); // 접근 허용
    } else {
      setIsAuthorized(false); // 접근 불가
    }
  }, []);

  if (isAuthorized === null) {
    return <div>로딩 중...</div>; // localStorage 확인 전까지는 아무것도 안 보여줌
  }

  if (!isAuthorized) {
    return <div>접근 권한이 없습니다</div>;
  }

  return (
    <div>
      <h1>관리자 페이지</h1>
      {/* 관리자만 볼 수 있는 내용 */}
    </div>
  );
};

export default Admin;
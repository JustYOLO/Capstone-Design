// AdminPage.js
import React, { useEffect } from "react";
import { useNavigate } from "react-router-dom";

const Admin = () => {
  const navigate = useNavigate();

  useEffect(() => {
    const user = JSON.parse(localStorage.getItem("user"));
    if (!user?.isAdmin) {
      alert("접근 권한이 없습니다.");
      navigate("/");
    }
  }, []);

  return (
    <div className="p-8">
      <h1 className="text-3xl font-bold">🌟 관리자 페이지</h1>
      <p className="mt-2">여기서 모든 주문 및 회원 정보를 확인하고 관리할 수 있습니다.</p>
    </div>
  );
};

export default Admin;
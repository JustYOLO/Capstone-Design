import React, { useState } from "react";
import { Link, useNavigate } from "react-router-dom";

const Login = () => {
  const [loading, setLoading] = useState(false); 
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const navigate = useNavigate();

  const handleLogin = async () => {
    try {
      setLoading(true);
      const response = await fetch("https://blossompick.duckdns.org/api/v1/auth/login/", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ email, password }),
      });

      const data = await response.json();

      if (response.ok) {
        const isAdmin = data.email?.trim().toLowerCase() === "sslabplusai@gmail.com";
        const userData = { ...data, isAdmin };
        localStorage.setItem("user", JSON.stringify(userData));

        const accessToken = data.access;
        localStorage.setItem("access_token", accessToken);
        localStorage.setItem("refresh_token", data.refresh);

        setTimeout(() => {
          navigate(isAdmin ? "/admin" : "/");
        }, 0);

        alert("로그인 성공!");
      } else {
        alert(data.detail || "로그인 실패");
      }
    } catch (error) {
      alert("서버 오류: 로그인 실패");
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="flex flex-col items-center justify-center min-h-screen bg-gray-50">
      <h1 className="text-4xl font-bold text-gray-900">로그인</h1>
      <p className="text-gray-600 mt-1">로그인을 하고 더 많은 혜택을 누리세요!</p>

      <div className="mt-6 w-80">
        <input
          type="email"
          placeholder="E-MAIL"
          value={email}
          onChange={(e) => setEmail(e.target.value)}
          className="w-full px-4 py-3 border rounded-lg focus:ring-2 focus:ring-purple-500"
        />
        <input
          type="password"
          placeholder="PASSWORD"
          value={password}
          onChange={(e) => setPassword(e.target.value)}
          className="w-full mt-3 px-4 py-3 border rounded-lg focus:ring-2 focus:ring-purple-500"
        />

        <button
          onClick={handleLogin}
          disabled={loading}
          className="w-full mt-4 px-4 py-3 bg-blue-600 text-white font-bold rounded-lg hover:bg-blue-700 transition"
        >
          {loading ? "로그인 중..." : "LOGIN"}
        </button>

        {/* 로딩 스피너 */}
        {loading && (
          <div className="mt-4 flex justify-center">
            <div className="w-8 h-8 border-4 border-blue-200 border-t-blue-600 rounded-full animate-spin" />
          </div>
        )}
      </div>

      <div className="mt-4 flex justify-between w-80 text-sm text-gray-500">
        <Link to="/signup" className="hover:underline">회원가입</Link>
        <Link to="/resetpassword" className="hover:underline">비밀번호 재설정</Link>
      </div>
    </div>
  );
};

export default Login;

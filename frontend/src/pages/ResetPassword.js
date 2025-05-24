import React, { useState } from "react";

const [loading, setLoading] = useState(false); // 로딩

const ResetPassword = () => {
  const [email, setEmail] = useState("");

  const handleReset = async () => {
    try {
      setLoading(true);
      const response = await fetch("https://blossompick.duckdns.org/api/v1/auth/password/reset/", {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify({ email }),
      });

      const data = await response.json();

      if (response.ok) {
        alert("비밀번호 재설정 메일이 발송되었습니다!");
      } else {
        alert("오류 발생: " + (data.detail || "다시 시도해주세요."));
      }
    } catch (err) {
      alert("서버 오류");
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="flex flex-col items-center justify-center min-h-screen bg-gray-50 px-4">
      <h1 className="text-2xl font-bold mb-4">🔑 비밀번호 재설정</h1>
      <input
        type="email"
        placeholder="가입된 이메일을 입력하세요"
        value={email}
        onChange={(e) => setEmail(e.target.value)}
        className="w-full max-w-sm px-4 py-2 border rounded-md mb-4"
      />
      <button
        onClick={handleReset}
        className="px-4 py-2 bg-blue-600 text-white rounded hover:bg-blue-700"
      >
        재설정 메일 보내기
      </button>
    </div>
  );
};

export default ResetPassword;
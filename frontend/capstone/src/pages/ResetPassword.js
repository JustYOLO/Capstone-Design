import React, { useState } from "react";

const ResetPassword = () => {
  const [email, setEmail] = useState("");
  const [message, setMessage] = useState("");

  // 🔹 이메일 입력 값 변경
  const handleChange = (e) => {
    setEmail(e.target.value);
  };

  // 🔹 비밀번호 재설정 요청 (백엔드 API 호출할 수 있음)
  const handleResetPassword = async (e) => {
    e.preventDefault();

    // 백엔드 API가 있다면 요청을 보낼 부분 (현재는 UI만 구현)
    try {
      // 예제: 백엔드 API 요청
      // const response = await fetch("http://api.example.com/reset-password", {
      //   method: "POST",
      //   headers: { "Content-Type": "application/json" },
      //   body: JSON.stringify({ email }),
      // });

      // const result = await response.json();
      // if (response.ok) {
      //   setMessage("비밀번호 재설정 링크를 이메일로 보냈습니다.");
      // } else {
      //   setMessage("오류 발생: " + result.message);
      // }

      setMessage("비밀번호 재설정 링크를 이메일로 보냈습니다. 📩");
    } catch (error) {
      setMessage("오류가 발생했습니다. 다시 시도해주세요.");
    }
  };

  return (
    <div className="flex flex-col items-center justify-center min-h-screen bg-gray-50 px-4">
      <h1 className="text-3xl font-bold text-gray-900">🔐 비밀번호 재설정</h1>
      <p className="text-gray-600 mt-1">비밀번호 재설정 링크를 이메일로 보내드립니다.</p>

      <form className="mt-6 w-full max-w-md" onSubmit={handleResetPassword}>
        <input
          type="email"
          placeholder="이메일 입력"
          className="w-full px-4 py-3 border rounded-lg focus:ring-2 focus:ring-blue-500"
          value={email}
          onChange={handleChange}
          required
        />
        <button
          type="submit"
          className="w-full mt-4 px-4 py-3 bg-blue-600 text-white font-bold rounded-lg hover:bg-blue-700 transition"
        >
          비밀번호 재설정
        </button>
      </form>

      {message && <p className="mt-4 text-green-600">{message}</p>}
    </div>
  );
};

export default ResetPassword;
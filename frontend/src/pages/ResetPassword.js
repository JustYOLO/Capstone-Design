import React, { useState } from "react";
import { useSearchParams, useNavigate } from "react-router-dom";
import axios from "axios";

export default function ResetPassword() {
  const [searchParams] = useSearchParams();
  const uid   = searchParams.get("uid")   || "";
  const token = searchParams.get("token") || "";
  const navigate = useNavigate();

  const [newPwd1, setNewPwd1] = useState("");
  const [newPwd2, setNewPwd2] = useState("");
  const [error,   setError]   = useState("");
  const [success, setSuccess] = useState(false);
  const [loading, setLoading] = useState(false);

  const handleSubmit = async (e) => {
    e.preventDefault();
    setError("");
    if (!newPwd1 || !newPwd2) {
      return setError("두 개의 비밀번호를 모두 입력하세요.");
    }
    if (newPwd1 !== newPwd2) {
      return setError("비밀번호가 일치하지 않습니다.");
    }

    setLoading(true);
    try {
      await axios.post(
        "https://blossompick.duckdns.org/api/v1/auth/password/reset/confirm/",
        {
          uid,
          token,
          new_password1: newPwd1,
          new_password2: newPwd2,
        }
      );
      setSuccess(true);
      // Optionally redirect after a delay:
      setTimeout(() => navigate("/login"), 3000);
    } catch (err) {
      console.error(err);
      setError(
        err.response?.data?.detail ||
        "비밀번호 재설정에 실패했습니다. 링크가 유효한지 확인하세요."
      );
    } finally {
      setLoading(false);
    }
  };

  if (success) {
    return (
      <div className="flex flex-col items-center justify-center min-h-screen px-4">
        <h1 className="text-2xl font-bold mb-4">비밀번호 재설정 완료</h1>
        <p>새 비밀번호가 성공적으로 설정되었습니다.</p>
        <p>3초 후 로그인 페이지로 이동합니다…</p>
      </div>
    );
  }

  return (
    <div className="flex flex-col items-center justify-center min-h-screen bg-gray-50 px-4">
      <h1 className="text-3xl font-bold mb-6">비밀번호 재설정</h1>
      <form
        onSubmit={handleSubmit}
        className="bg-white p-6 rounded-lg shadow-md w-full max-w-md"
      >
        {error && (
          <div className="text-red-600 mb-4">{error}</div>
        )}
        <input
          type="password"
          placeholder="새 비밀번호"
          value={newPwd1}
          onChange={(e) => setNewPwd1(e.target.value)}
          className="w-full px-4 py-2 mb-4 border rounded"
        />
        <input
          type="password"
          placeholder="새 비밀번호 확인"
          value={newPwd2}
          onChange={(e) => setNewPwd2(e.target.value)}
          className="w-full px-4 py-2 mb-4 border rounded"
        />
        <button
          type="submit"
          disabled={loading}
          className={`w-full py-2 font-bold rounded ${
            loading
              ? "bg-gray-400 cursor-not-allowed"
              : "bg-blue-600 hover:bg-blue-700 text-white"
          }`}
        >
          {loading ? "처리 중…" : "비밀번호 재설정"}
        </button>
      </form>
    </div>
  );
}

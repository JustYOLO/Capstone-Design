import React, { useState } from "react";

const SignupCustomer = () => {
  const [name, setName] = useState("");
  const [email, setEmail] = useState("");
  const [password1, setPassword1] = useState("");
  const [password2, setPassword2] = useState("");
  const [loading, setLoading] = useState(false); // 로딩

  const handleSignup = async () => {
    try {
      setLoading(true);
      const response = await fetch("https://blossompick.duckdns.org/api/v1/auth/registration/", {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify({
          username: name,
          email: email, // 기존에 존재하는 이메일에 대해서도 처리해줘야 함
          password1: password1,
          password2: password2,
        }),
      });

      const data = await response.json();

      if (response.ok) {
        alert("이메일로 전송된 링크를 눌러주세요!");
        // 여기서 response ok 다시 뜨면 aftersignup 페이지로 이동하게 하면 됨
        window.location.href = "/aftersignup"; // 로그인 페이지로 이동
      } else {
        if (data.email) {
          alert("이미 등록된 이메일입니다.");
        } else if (data.password1) {
          alert("비밀번호 오류: " + data.password1.join(" "));
        } else if (data.non_field_errors) {
          alert("오류: " + data.non_field_errors.join(" "));
        } else {
          alert("회원가입 실패: " + JSON.stringify(data));
        } 
      }
    } catch (error) {
      console.error("에러:", error);
      alert("에러 발생!");
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="flex flex-col items-center justify-center min-h-screen bg-gray-50 px-4">
      <h1 className="text-4xl font-bold text-gray-900">회원가입</h1>
      <p className="text-gray-600 mt-1">간단한 정보를 입력하고 가입하세요!</p>

      <div className="mt-6 w-full max-w-md">
        <input
          type="text"
          placeholder="이름"
          value={name}
          onChange={(e) => setName(e.target.value)}
          className="w-full px-4 py-3 border rounded-lg mt-3"
        />
        <input
          type="email"
          placeholder="E-MAIL"
          value={email}
          onChange={(e) => setEmail(e.target.value)}
          className="w-full px-4 py-3 border rounded-lg mt-3"
        />
        <input
          type="password"
          placeholder="비밀번호"
          value={password1}
          onChange={(e) => setPassword1(e.target.value)}
          className="w-full px-4 py-3 border rounded-lg mt-3"
        />
        <input
          type="password"
          placeholder="비밀번호 확인"
          value={password2}
          onChange={(e) => setPassword2(e.target.value)}
          className="w-full px-4 py-3 border rounded-lg mt-3"
        />
        <button
          onClick={handleSignup}
          disabled={loading}
          className={`w-full mt-4 px-4 py-3 font-bold rounded-lg transition 
            ${loading ? "bg-gray-400 cursor-not-allowed" : "bg-blue-600 hover:bg-blue-700 text-white"}`}
        >
          {loading ? "가입 처리 중..." : "가입하기"}
        </button>

        {loading && (
          <div className="mt-4 flex justify-center">
            <div className="w-8 h-8 border-4 border-blue-200 border-t-blue-600 rounded-full animate-spin" />
          </div>
        )}
      </div>

      <p className="mt-4 text-sm text-gray-500">
        이미 계정이 있나요?{" "}
        <a href="/login" className="text-blue-600 hover:underline">
          로그인
        </a>
      </p>
    </div>
  );
};

export default SignupCustomer;

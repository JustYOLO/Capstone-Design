import React, { useState } from "react";

const SignupFlorist = () => {
  const [file, setFile] = useState(null);
  const [preview, setPreview] = useState(null);
  const [name, setName] = useState("");
  const [email, setEmail] = useState("");
  const [password1, setPassword1] = useState("");
  const [password2, setPassword2] = useState("");
  const [loading, setLoading] = useState(false); // 로딩

  const handleFileChange = (event) => {
    const selected = event.target.files[0];
    if (selected) {
      setFile(selected);
      setPreview(URL.createObjectURL(selected));
    }
  };

  const handleSignup = async () => {
    if (!name || !email || !password1 || !password2 || !file) {
      alert("모든 항목을 입력해주세요.");
      return;
    }

    const formData = new FormData();
    formData.append("name", name);
    formData.append("email", email);
    formData.append("password1", password1);
    formData.append("password2", password2);
    formData.append("file", file);

    try {
      setLoading(true); // 시작
      const response = await fetch("https://blossompick.duckdns.org/api/v1/florist/registration/", {
        method: "POST",
        body: formData,
      });

      if (!response.ok) {
        const errorText = await response.text();
        throw new Error(errorText);
      }

      const data = await response.json();
      alert("회원가입 성공!");
      console.log("응답 결과:", data);

    } catch (err) {
      console.error("❌ 회원가입 오류:", err);
      alert("회원가입 중 오류가 발생했습니다.");
    } finally {
       setLoading(false); // 종료
    }
  };

  return (
    <div className="flex flex-col items-center justify-center min-h-screen bg-gray-50 px-4">
      <h1 className="text-4xl font-bold text-gray-900">회원가입</h1>
      <p className="text-gray-600 mt-1">간단한 정보를 입력하고 가입하세요!</p>

      <div className="mt-6 w-full max-w-md">
        <input type="text" placeholder="이름" value={name} onChange={(e) => setName(e.target.value)}
          className="w-full px-4 py-3 border rounded-lg focus:outline-none focus:ring-2 focus:ring-purple-500" />

        <input type="email" placeholder="E-MAIL" value={email} onChange={(e) => setEmail(e.target.value)}
          className="w-full mt-3 px-4 py-3 border rounded-lg focus:outline-none focus:ring-2 focus:ring-purple-500" />

        <input type="password" placeholder="비밀번호" value={password1} onChange={(e) => setPassword1(e.target.value)}
          className="w-full mt-3 px-4 py-3 border rounded-lg focus:outline-none focus:ring-2 focus:ring-purple-500" />

        <input type="password" placeholder="비밀번호 확인" value={password2} onChange={(e) => setPassword2(e.target.value)}
          className="w-full mt-3 px-4 py-3 border rounded-lg focus:outline-none focus:ring-2 focus:ring-purple-500" />

        <div className="mt-4">
          <label className="block text-gray-700 font-medium">📄 사업자등록증 업로드 (PDF 형태)</label>
          <input 
            type="file" 
            accept="application/pdf" 
            onChange={handleFileChange} 
            className="w-full mt-2 px-4 py-2 border rounded-lg cursor-pointer bg-white focus:ring-2 focus:ring-purple-500"
          />
          {preview && (
            <div className="mt-4 flex flex-col items-center">
              <p className="text-sm text-gray-600">미리보기:</p>
              <iframe src={preview} className="mt-2 w-40 h-40 rounded border shadow" title="preview" />
            </div>
          )}
        </div>

        <button onClick={handleSignup} className="w-full mt-4 px-4 py-3 bg-blue-600 text-white font-bold rounded-lg hover:bg-blue-700 transition">
          가입하기
        </button>
      </div>

      <p className="mt-4 text-sm text-gray-500">
        이미 계정이 있나요? <a href="/login" className="text-blue-600 hover:underline">로그인</a>
      </p>
    </div>
  );
};

export default SignupFlorist;
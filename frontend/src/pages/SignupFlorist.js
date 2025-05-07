import React, { useState } from "react";

const SignupFlorist = () => {
  const [file, setFile] = useState(null);
  const [preview, setPreview] = useState(null);

  // 파일 선택 시 실행되는 함수
  const handleFileChange = async (event) => {
    const file = event.target.files[0];
    if (!file) return;
  
    const formData = new FormData();
    formData.append("file", file);
  
    try {
      const response = await fetch("https://blossompick.duckdns.org/api/v1/upload-pdf/", {
        method: "POST",
        body: formData,
      });
  
      if (!response.ok) throw new Error("파일 업로드 실패");
  
      const data = await response.json();
      alert("파일 업로드 성공!");
      console.log("서버 응답:", data);
  
    } catch (err) {
      console.error("파일 업로드 오류:", err);
      alert("파일 업로드 중 오류가 발생했습니다.");
    }
  };

  return (
    <div className="flex flex-col items-center justify-center min-h-screen bg-gray-50 px-4">
      {/* 제목 */}
      <h1 className="text-4xl font-bold text-gray-900">회원가입</h1>
      <p className="text-gray-600 mt-1">간단한 정보를 입력하고 가입하세요!</p>

      {/* 입력 폼 */}
      <div className="mt-6 w-full max-w-md">
        <input type="text" placeholder="이름"
          className="w-full px-4 py-3 border rounded-lg focus:outline-none focus:ring-2 focus:ring-purple-500" />

        <input type="email" placeholder="E-MAIL"
          className="w-full mt-3 px-4 py-3 border rounded-lg focus:outline-none focus:ring-2 focus:ring-purple-500" />

        <input type="password" placeholder="비밀번호"
          className="w-full mt-3 px-4 py-3 border rounded-lg focus:outline-none focus:ring-2 focus:ring-purple-500" />

        <input type="password" placeholder="비밀번호 확인"
          className="w-full mt-3 px-4 py-3 border rounded-lg focus:outline-none focus:ring-2 focus:ring-purple-500" />

        {/* 사업자등록증 업로드 */}
        <div className="mt-4">
          <label className="block text-gray-700 font-medium">📄 사업자등록증 업로드 (pdf형태로 업로드 해주세요)</label>
          <input 
            type="file" 
            accept="application/pdf" 
            onChange={handleFileChange} 
            className="w-full mt-2 px-4 py-2 border rounded-lg cursor-pointer bg-white focus:ring-2 focus:ring-purple-500"
          />
          
          {/* 미리보기 이미지 */}
          {preview && (
            <div className="mt-4 flex flex-col items-center">
              <p className="text-sm text-gray-600">미리보기:</p>
              <img src={preview} alt="미리보기" className="mt-2 w-40 h-40 object-cover rounded-lg shadow-md" />
            </div>
          )}
        </div>

        {/* 가입하기 버튼 */}
        <button className="w-full mt-4 px-4 py-3 bg-blue-600 text-white font-bold rounded-lg hover:bg-blue-700 transition">
          가입하기
        </button>
      </div>

      {/* 로그인 이동 링크 */}
      <p className="mt-4 text-sm text-gray-500">
        이미 계정이 있나요? <a href="/login" className="text-blue-600 hover:underline">로그인</a>
      </p>
    </div>
  );
};

export default SignupFlorist;

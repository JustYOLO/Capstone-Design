import React from "react";
import { Link } from "react-router-dom";

const AfterSingup = () => {
  return (
    <div className="flex flex-col items-center justify-center min-h-screen bg-gray-50 text-center px-4">
      <h1 className="text-3xl sm:text-4xl font-bold text-green-600 mb-4">
        ✅ 이메일 인증이 완료되었습니다!
      </h1>
      <p className="text-gray-700 mb-6">
        이제 모든 기능을 이용하실 수 있습니다. <br />
        BlossomPick에 오신 것을 환영합니다 🌸
      </p>
      <Link
        to="/login"
        className="px-6 py-3 bg-blue-600 text-white rounded-lg hover:bg-blue-700 transition font-semibold"
      >
        로그인하러 가기
      </Link>
    </div>
  );
};

export default AfterSingup;
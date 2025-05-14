import React, { useEffect, useState } from "react";

const AfterLoginFlorist = () => {
  const [floristData, setFloristData] = useState(null);
  const [loading, setLoading] = useState(true);
  const [confirmed, setConfirmed] = useState(false);

  useEffect(() => {
    // 서버에서 사업자 등록정보 불러오기
    const fetchData = async () => {
      try {
        const res = await fetch("https://blossompick.duckdns.org/api/v1/florist/profile/", {
          credentials: "include",
        });
        const data = await res.json();
        setFloristData(data);
      } catch (err) {
        console.error("❌ 사업자 정보 불러오기 실패:", err);
      } finally {
        setLoading(false);
      }
    };

    fetchData();
  }, []);

  const handleConfirm = async () => {
    try {
      const res = await fetch("https://blossompick.duckdns.org/api/v1/florist/confirm/", {
        method: "POST",
        credentials: "include",
      });

      if (res.ok) {
        alert("🎉 꽃집 등록이 완료되었습니다!");
        setConfirmed(true);
      } else {
        alert("⚠️ 등록 중 오류가 발생했습니다.");
      }
    } catch (err) {
      console.error("❌ 등록 실패:", err);
    }
  };

  if (loading) return <div className="p-8 text-center">로딩 중...</div>;

  if (!floristData) return <div className="p-8 text-center">사업자 정보가 없습니다.</div>;

  return (
    <div className="p-8 max-w-2xl mx-auto bg-white rounded shadow border">
      <h1 className="text-2xl font-bold text-center mb-6">🌼 사업자 등록 정보 확인</h1>

      <table className="w-full text-sm mb-6 border">
        <tbody>
          <tr><td className="font-medium p-2 border">법인명</td><td className="p-2 border">{floristData["법인명"]}</td></tr>
          <tr><td className="font-medium p-2 border">사업자등록번호</td><td className="p-2 border">{floristData["사업자등록번호"]}</td></tr>
          <tr><td className="font-medium p-2 border">대표자</td><td className="p-2 border">{floristData["대표자"]}</td></tr>
          <tr><td className="font-medium p-2 border">사업장소재지</td><td className="p-2 border">{floristData["사업장소재지"]}</td></tr>
          <tr><td className="font-medium p-2 border">개업연월일</td><td className="p-2 border">{floristData["개업연월일"]}</td></tr>
          <tr><td className="font-medium p-2 border">종목</td><td className="p-2 border">{floristData["종목"]}</td></tr>
        </tbody>
      </table>

      {!confirmed ? (
        <>
          <button
            onClick={handleConfirm}
            className="w-full py-3 bg-green-600 text-white font-bold rounded hover:bg-green-700 transition"
          >
            ✅ 정보가 맞습니다. 등록하기
          </button>

          <p className="text-center text-sm text-gray-500 mt-4">
            정보가 잘못되었나요?{" "}
            <a href="/upload" className="text-blue-600 underline">PDF 다시 업로드</a>
          </p>
        </>
      ) : (
        <div className="text-center text-green-600 font-semibold mt-4">🎉 이미 등록을 완료했습니다.</div>
      )}
    </div>
  );
};

export default AfterLoginFlorist;
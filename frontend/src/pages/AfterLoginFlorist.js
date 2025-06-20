import React, { useEffect, useState } from "react";
import { useNavigate } from "react-router-dom";

const AfterLoginFlorist = () => {
  const [floristData, setFloristData] = useState(null);
  const [loading, setLoading] = useState(true);
  const [confirmed, setConfirmed] = useState(false);
  const navigate = useNavigate();

  useEffect(() => {
    const fetchData = async () => {
      try {
        setLoading(true);
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
      setLoading(true);
      const res = await fetch("https://blossompick.duckdns.org/api/v1/florist/confirm/", {
        method: "POST",
        credentials: "include",
      });

      if (res.ok) {
        alert("🎉 꽃집 등록이 완료되었습니다!");
        setConfirmed(true);

        // 등록 후 floristData 넘기며 이동
        setTimeout(() => {
          navigate("/flowerhouse", { state: floristData });
        }, 1500);
      } else {
        alert("⚠️ 등록 중 오류가 발생했습니다.");
      }
    } catch (err) {
      console.error("❌ 등록 실패:", err);
    } finally {
      setLoading(false);
    }
  };

  if (loading && !floristData) {
    return <div className="p-8 text-center">로딩 중...</div>;
  }

  if (!floristData) {
    return <div className="p-8 text-center">사업자 정보가 없습니다.</div>;
  }

  return (
    <div className="p-8 max-w-2xl mx-auto bg-white rounded shadow border">
      <h1 className="text-2xl font-bold text-center mb-2">🌼 사업자 등록 정보 확인</h1>
      <p className="text-center text-gray-600 text-sm mb-6">
        아래는 회원님이 업로드한 사업자등록증의 정보입니다. <br />
        실제 꽃집 정보와 일치하는지 확인해주세요.
      </p>

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
            disabled={loading}
            className="w-full py-3 bg-green-600 text-white font-bold rounded hover:bg-green-700 transition"
          >
            {loading ? "등록 처리 중..." : "✅ 정보가 맞습니다. 등록하기"}
          </button>

          {loading && (
            <div className="flex justify-center mt-4">
              <div className="w-8 h-8 border-4 border-green-200 border-t-green-600 rounded-full animate-spin" />
            </div>
          )}

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
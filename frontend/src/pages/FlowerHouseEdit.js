import React, { useState, useEffect } from "react";
import { useNavigate } from "react-router-dom";
import axios from "axios";

const weekdays = ["월", "화", "수", "목", "금", "토", "일"];

const FlowerHouseEdit = () => {
  const [intro, setIntro] = useState("");
  const [phone, setPhone] = useState("");
  const [address, setAddress] = useState("");
  const [detailAddress, setDetailAddress] = useState("");
  const [hours, setHours] = useState({});
  const [images, setImages] = useState([]);
  const [houseName, setHouseName] = useState("🌼 꽃집 상호명");
  const navigate = useNavigate();

  useEffect(() => {
    const token = localStorage.getItem("access_token");

    if (!token) {
      alert("로그인이 필요합니다.");
      return;
    }

    axios.defaults.headers.common["Authorization"] = `Bearer ${token}`;

    // 상호명 불러오기
    axios.get("https://blossompick.duckdns.org/api/v1/florist/housename/")
      .then((res) => {
        console.log("✅ housename 응답:", res.data);
        if (res.data.housename) setHouseName(res.data.housename);
      })
      .catch((err) => console.error("❌ 상호명 불러오기 실패:", err));

    // 기존 데이터 불러오기
    axios.get("https://blossompick.duckdns.org/api/v1/florist/data/")
      .then((res) => {
        console.log("✅ florist/data 응답:", res.data);
        const data = res.data.data ?? res.data;
        setIntro(data.intro || "");
        setPhone(data.phone || "");
        setAddress(data.address || "");
        setDetailAddress(data.detailAddress || "");
        setHours(data.hours || {});
        setImages(data.images || []);
      })
      .catch((err) => {
        console.error("❌ 초기 데이터 불러오기 실패:", err);
      });

    const script = document.createElement("script");
    script.src = "//t1.daumcdn.net/mapjsapi/bundle/postcode/prod/postcode.v2.js";
    script.async = true;
    document.body.appendChild(script);
  }, []);

  const openPostcode = () => {
    new window.daum.Postcode({
      oncomplete: (data) => {
        setAddress(data.roadAddress || data.jibunAddress);
      },
    }).open();
  };

  const handleTimeChange = (day, field, value) => {
    setHours((prev) => ({
      ...prev,
      [day]: { ...prev[day], [field]: value },
    }));
  };

  const toggleClosed = (day) => {
    setHours((prev) => ({
      ...prev,
      [day]: {
        ...prev[day],
        closed: !prev[day].closed,
      },
    }));
  };

  const handleImageChange = (e) => {
    const files = Array.from(e.target.files);
    const newImages = files.map((file) => ({ url: URL.createObjectURL(file) }));
    setImages((prev) => [...prev, ...newImages]);
  };

  const handleSave = async () => {
    const token = localStorage.getItem("access_token");
    const payload = {
      intro,
      phone,
      address,
      detailAddress,
      hours,
      images,
    };

    console.log("📤 PATCH 전송 payload:", payload);

    try {
      const res = await axios.patch("https://blossompick.duckdns.org/api/v1/florist/data/", payload, {
        headers: {
          "Content-Type": "application/json",
          Authorization: `Bearer ${token}`,
        },
      });
      console.log("✅ PATCH 성공 응답:", res.data);
      alert("서버에 저장되었습니다!");
      navigate("/flowerhouse/view");
    } catch (err) {
      console.error("❌ 저장 실패:", err);
      alert("저장 실패! 콘솔을 확인해주세요.");
    }
  };

  return (
    <div className="min-h-screen bg-white px-4 py-24 flex flex-col items-center">
      <h1 className="text-4xl font-bold text-center mb-8">{houseName}</h1>
      <div className="w-full max-w-4xl space-y-6">
        <input
          type="text"
          placeholder="📢 한 줄 소개를 입력하세요 !"
          value={intro}
          onChange={(e) => setIntro(e.target.value)}
          className="w-full border px-4 py-3 rounded text-lg"
        />
        <input
          type="text"
          placeholder="📞 전화번호를 입력하세요 !"
          value={phone}
          onChange={(e) => setPhone(e.target.value)}
          className="w-full border px-4 py-3 rounded text-lg"
        />

        <hr className="my-6 border-gray-300" />

        <div>
          <label className="block text-lg font-semibold mb-2">📍 주소</label>
          <div className="flex space-x-2">
            <input
              type="text"
              value={address}
              readOnly
              className="flex-1 border px-4 py-2 rounded"
              placeholder="도로명 주소"
            />
            <button
              type="button"
              onClick={openPostcode}
              className="px-4 py-2 bg-blue-600 text-white rounded hover:bg-blue-700"
            >
              검색
            </button>
          </div>
          <input
            type="text"
            placeholder="상세 주소를 입력하세요"
            value={detailAddress}
            onChange={(e) => setDetailAddress(e.target.value)}
            className="w-full border mt-2 px-4 py-2 rounded"
          />
        </div>

        <hr className="my-6 border-gray-300" />

        <div>
          <label className="block text-lg font-semibold mb-2">🕒 영업 시간 및 휴무일</label>
          {weekdays.map((day) => (
            <div key={day} className="flex items-center space-x-4 mb-3">
              <span className="w-12 font-medium">{day}</span>
              {hours[day]?.closed ? (
                <span className="text-red-500 font-semibold">휴무일</span>
              ) : (
                <>
                  <input
                    type="time"
                    value={hours[day]?.start || ""}
                    onChange={(e) => handleTimeChange(day, "start", e.target.value)}
                    className="border px-2 py-1 rounded"
                  />
                  <span>~</span>
                  <input
                    type="time"
                    value={hours[day]?.end || ""}
                    onChange={(e) => handleTimeChange(day, "end", e.target.value)}
                    className="border px-2 py-1 rounded"
                  />
                </>
              )}
              <label className="ml-4 flex items-center space-x-2">
                <input
                  type="checkbox"
                  checked={hours[day]?.closed || false}
                  onChange={() => toggleClosed(day)}
                />
                <span>휴무</span>
              </label>
            </div>
          ))}
        </div>

        <hr className="my-6 border-gray-300" />

        <div>
          <label className="block text-lg font-semibold mb-2">📷 사진 업로드</label>
          <input
            type="file"
            accept="image/*"
            multiple
            onChange={handleImageChange}
          />
          <div className="grid grid-cols-2 sm:grid-cols-3 gap-4 mt-4">
            {images.map((img, idx) => (
              <img
                key={idx}
                src={img.url}
                alt={`img-${idx}`}
                className="w-full h-48 object-cover rounded shadow"
              />
            ))}
          </div>
        </div>

        <div className="text-center">
          <button
            onClick={handleSave}
            className="mt-6 px-8 py-4 bg-blue-600 text-white font-bold rounded-lg text-lg hover:bg-blue-700 transition"
          >
            📂 저장하기
          </button>
        </div>
      </div>
    </div>
  );
};

export default FlowerHouseEdit;
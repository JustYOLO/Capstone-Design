// FlowerHouse.js (Updated to include address + 카카오 주소 검색 + 상호명 API 연동)
import React, { useState, useEffect, useRef } from "react";
import axios from "axios";

const weekdays = ["월", "화", "수", "목", "금", "토", "일"];

const FlowerHouse = () => {
  const [storeName, setStoreName] = useState("꽃집 상호명");
  const [intro, setIntro] = useState("");
  const [phone, setPhone] = useState("");
  const [address, setAddress] = useState("");
  const [detailAddress, setDetailAddress] = useState("");
  const [hours, setHours] = useState({});
  const [images, setImages] = useState([]);
  const containerRef = useRef(null);

  useEffect(() => {
    // grab the token you stored earlier
    const token = localStorage.getItem("access_token");

    axios.get("/api/v1/florist/housename/", {
      headers: {
        // attach it here as a Bearer token
        Authorization: `Bearer ${token}`
      }
    })
    .then((res) => {
      if (res.data?.housename) {
        setStoreName(res.data.housename);
      }
    })
    .catch((err) => {
      console.error("상호명 가져오기 실패:", err);
    });


  // useEffect(() => {
  //   // 상호명 받아오기
  //   axios.get("/api/v1/florist/housename/"), {
  //     headers
  //   }
  //     .then((res) => {
  //       if (res.data?.housename) {
  //         setStoreName(res.data.housename);
  //       }
  //     })
  //     .catch((err) => {
  //       console.error("상호명 가져오기 실패:", err);
  //     });

    // 기존 저장 데이터 불러오기
    const savedData = JSON.parse(localStorage.getItem("flowerhouse"));
    if (savedData) {
      setIntro(savedData.intro || "");
      setPhone(savedData.phone || "");
      setAddress(savedData.address || "");
      setDetailAddress(savedData.detailAddress || "");
      setHours(savedData.hours || {});
      setImages(savedData.images || []);
    } else {
      const defaultHours = {};
      weekdays.forEach((day) => {
        defaultHours[day] = { start: "09:00", end: "18:00", closed: false };
      });
      setHours(defaultHours);
    }

    // Load Kakao Postcode script
    const script = document.createElement("script");
    script.src = "//t1.daumcdn.net/mapjsapi/bundle/postcode/prod/postcode.v2.js";
    script.async = true;
    document.body.appendChild(script);
  }, []);

  const handleSave = () => {
    const data = { intro, phone, address, detailAddress, hours, images };
    localStorage.setItem("flowerhouse", JSON.stringify(data));
    alert("저장되었습니다!");
  };

  const handleTimeChange = (day, field, value) => {
    setHours((prev) => ({ ...prev, [day]: { ...prev[day], [field]: value } }));
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

  const openPostcode = () => {
    new window.daum.Postcode({
      oncomplete: function (data) {
        setAddress(data.roadAddress || data.jibunAddress);
      },
    }).open();
  };

  return (
    <div ref={containerRef} className="min-h-screen bg-white px-4 py-24 flex flex-col items-center relative">
      <h1 className="text-4xl font-bold text-center mb-8">{storeName}</h1>
      <hr className="my-6 border-gray-300" />
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
            💾 저장하기
          </button>
        </div>
      </div>
    </div>
  );
};

export default FlowerHouse;

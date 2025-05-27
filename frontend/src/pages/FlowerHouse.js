// FlowerHouse.js (최신 서버 동기화 기반)
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
    const token = localStorage.getItem("access_token");

    // 1. 상호명 불러오기
    axios.get("/api/v1/florist/housename/", {
      headers: { Authorization: `Bearer ${token}` },
    })
      .then((res) => {
        if (res.data?.housename) setStoreName(res.data.housename);
      })
      .catch((err) => console.error("상호명 가져오기 실패:", err));

    // 2. 서버에서 저장된 데이터 불러오기
    axios.get("/api/v1/florist/data/", {
      headers: { Authorization: `Bearer ${token}` },
    })
      .then((res) => {
        const d = res.data;
        setIntro(d.intro || "");
        setPhone(d.phone || "");
        setAddress(d.address || "");
        setDetailAddress(d.detailAddress || "");
        setHours(d.hours || defaultHourInit());
        setImages(d.images || []);
      })
      .catch((err) => {
        console.error("전체 정보 불러오기 실패:", err);
        setHours(defaultHourInit());
      });

    const script = document.createElement("script");
    script.src = "//t1.daumcdn.net/mapjsapi/bundle/postcode/prod/postcode.v2.js";
    script.async = true;
    document.body.appendChild(script);
  }, []);

  const defaultHourInit = () => {
    const def = {};
    weekdays.forEach((day) => {
      def[day] = { start: "09:00", end: "18:00", closed: false };
    });
    return def;
  };

  const handleSave = async () => {
    const token = localStorage.getItem("access_token");
    const payload = { storeName, intro, phone, address, detailAddress, hours, images };

    try {
      await axios.patch("/api/v1/florist/data/", payload, {
        headers: {
          "Content-Type": "application/json",
          Authorization: `Bearer ${token}`,
        },
      });
      alert("\uC800\uC7A5\uB418\uC5C8\uC2B5\uB2C8\uB2E4!");
    } catch (err) {
      console.error("\uC800\uC7A5 \uC2E4\uD328:", err);
      alert("\uC800\uC7A5\uC5D0 \uC2E4\uD328\uD588\uC2B5\uB2C8\uB2E4.");
    }
  };

  const openPostcode = () => {
    new window.daum.Postcode({
      oncomplete: function (data) {
        setAddress(data.roadAddress || data.jibunAddress);
      },
    }).open();
  };

  const handleImageChange = (e) => {
    const files = Array.from(e.target.files);
    const newImages = files.map((file) => ({ url: URL.createObjectURL(file) }));
    setImages((prev) => [...prev, ...newImages]);
  };

  const handleTimeChange = (day, field, value) => {
    setHours((prev) => ({ ...prev, [day]: { ...prev[day], [field]: value } }));
  };

  const toggleClosed = (day) => {
    setHours((prev) => ({
      ...prev,
      [day]: { ...prev[day], closed: !prev[day].closed },
    }));
  };

  return (
    <div ref={containerRef} className="min-h-screen bg-white px-4 py-24 flex flex-col items-center">
      <h1 className="text-4xl font-bold text-center mb-8">{storeName}</h1>
      <div className="w-full max-w-4xl space-y-6">
        <input placeholder="\uD55C \uC904 \uC18C\uAC1C" value={intro} onChange={(e) => setIntro(e.target.value)} className="w-full border px-4 py-3 rounded text-lg" />
        <input placeholder="\uC804\uD654\uBC88\uD638" value={phone} onChange={(e) => setPhone(e.target.value)} className="w-full border px-4 py-3 rounded text-lg" />
        <div>
          <label className="block text-lg font-semibold mb-2">\uC8FC\uC18C</label>
          <div className="flex space-x-2">
            <input type="text" value={address} readOnly className="flex-1 border px-4 py-2 rounded" placeholder="\uB3C4\uB85C\uBA85 \uC8FC\uC18C" />
            <button onClick={openPostcode} className="px-4 py-2 bg-blue-600 text-white rounded hover:bg-blue-700">검색</button>
          </div>
          <input type="text" placeholder="상세 주소를 입력하세요" value={detailAddress} onChange={(e) => setDetailAddress(e.target.value)} className="w-full border mt-2 px-4 py-2 rounded" />
        </div>
        <div>
          <label className="block text-lg font-semibold mb-2">영업 시간 및 휴무일</label>
          {weekdays.map((day) => (
            <div key={day} className="flex items-center space-x-4 mb-3">
              <span className="w-12 font-medium">{day}</span>
              {hours[day]?.closed ? (
                <span className="text-red-500 font-semibold">휴무일</span>
              ) : (
                <>
                  <input type="time" value={hours[day]?.start || ""} onChange={(e) => handleTimeChange(day, "start", e.target.value)} className="border px-2 py-1 rounded" />
                  <span>~</span>
                  <input type="time" value={hours[day]?.end || ""} onChange={(e) => handleTimeChange(day, "end", e.target.value)} className="border px-2 py-1 rounded" />
                </>
              )}
              <label className="ml-4 flex items-center space-x-2">
                <input type="checkbox" checked={hours[day]?.closed || false} onChange={() => toggleClosed(day)} />
                <span>휴무</span>
              </label>
            </div>
          ))}
        </div>
        <div>
          <label className="block text-lg font-semibold mb-2">사진 업로드</label>
          <input type="file" accept="image/*" multiple onChange={handleImageChange} />
          <div className="grid grid-cols-2 sm:grid-cols-3 gap-4 mt-4">
            {images.map((img, idx) => (
              <img key={idx} src={img.url} alt={`img-${idx}`} className="w-full h-48 object-cover rounded shadow" />
            ))}
          </div>
        </div>
        <div className="text-center">
          <button onClick={handleSave} className="mt-6 px-8 py-4 bg-blue-600 text-white font-bold rounded-lg text-lg hover:bg-blue-700 transition">💾 저장하기</button>
        </div>
      </div>
    </div>
  );
};

export default FlowerHouse;
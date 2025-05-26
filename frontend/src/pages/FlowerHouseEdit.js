import React, { useState, useEffect } from "react";
import { useNavigate } from "react-router-dom";

const weekdays = ["월", "화", "수", "목", "금", "토", "일"];

const FlowerHouseEdit = () => {
  const [intro, setIntro] = useState("");
  const [phone, setPhone] = useState("");
  const [address, setAddress] = useState("");
  const [detailAddress, setDetailAddress] = useState("");
  const [hours, setHours] = useState({});
  const [images, setImages] = useState([]);
  const [houseName, setHouseName] = useState("꽃집 상호명");
  const navigate = useNavigate();

  useEffect(() => {
    const saved = JSON.parse(localStorage.getItem("flowerhouse"));
    if (saved) {
      setIntro(saved.intro || "");
      setPhone(saved.phone || "");
      setAddress(saved.address || "");
      setDetailAddress(saved.detailAddress || "");
      setHours(saved.hours || {});
      setImages(saved.images || []);
    } else {
      const defaultHours = {};
      weekdays.forEach((day) => {
        defaultHours[day] = { start: "09:00", end: "18:00", closed: false };
      });
      setHours(defaultHours);
    }

    // Load Daum Postcode script
    const script = document.createElement("script");
    script.src = "//t1.daumcdn.net/mapjsapi/bundle/postcode/prod/postcode.v2.js";
    script.async = true;
    document.body.appendChild(script);

    // Fetch house name from API
    fetch("https://blossompick.duckdns.org/api/v1/florist/housename/", {
      credentials: "include",
    })
      .then((res) => res.json())
      .then((data) => {
        if (data.housename) {
          setHouseName(data.housename);
        }
      })
      .catch((err) => console.error("❌ 상호명 불러오기 실패:", err));
  }, []);

  const openPostcode = () => {
    if (window.daum && window.daum.Postcode) {
      new window.daum.Postcode({
        oncomplete: function (data) {
          setAddress(data.roadAddress || data.jibunAddress);
        },
      }).open();
    } else {
      alert("주소 검색 기능을 불러오는 중입니다. 잠시 후 다시 시도해 주세요.");
    }
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

  const handleSave = () => {
    const data = {
      intro,
      phone,
      address,
      detailAddress,
      hours,
      images,
    };
    localStorage.setItem("flowerhouse", JSON.stringify(data));
    alert("저장되었습니다!");
    navigate("/flowerhouse/view");
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

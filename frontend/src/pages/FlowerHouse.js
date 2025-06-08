import React, { useState, useEffect } from "react";
import { useNavigate } from "react-router-dom";
import axios from "axios";

const weekdays = ["월", "화", "수", "목", "금", "토", "일"];

const FlowerHouse = () => {
  const [houseName, setHouseName] = useState("🌼 꽃집 상호명");
  const [intro, setIntro] = useState("");
  const [phone, setPhone] = useState("");
  const [address, setAddress] = useState("");
  const [detailAddress, setDetailAddress] = useState("");
  const [hours, setHours] = useState({});
  const [images, setImages] = useState([]);
  const [housePk, setHousePk] = useState(null);

  const navigate = useNavigate();

  useEffect(() => {
    const token = localStorage.getItem("access_token");
    if (!token) {
      alert("로그인이 필요합니다.");
      return;
    }

    axios.defaults.headers.common["Authorization"] = `Bearer ${token}`;

    // 상호명 및 pk 불러오기
    axios.get("https://blossompick.duckdns.org/api/v1/florist/housename/")
      .then((res) => {
        if (res.data?.housename) setHouseName(res.data.housename);
        if (res.data?.pk) setHousePk(res.data.pk);
      })
      .catch((err) => console.error("❌ housename 불러오기 실패:", err));

    // 기존 florist data 불러오기
    axios.get("https://blossompick.duckdns.org/api/v1/florist/data/")
      .then((res) => {
        const d = res.data?.data ?? res.data;
        setIntro(d.intro ?? "");
        setPhone(d.phone ?? "");
        setAddress(d.address ?? "");
        setDetailAddress(d.detailAddress ?? "");
        setHours(d.hours ?? defaultHourInit());
        setImages(d.images ?? []);
      })
      .catch((err) => {
        console.error("❌ florist/data 실패:", err);
        setHours(defaultHourInit());
      });

    // 카카오 주소 API 로딩
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
      [day]: { ...prev[day], closed: !prev[day].closed },
    }));
  };

  const handleImageChange = async (e) => {
    const files = Array.from(e.target.files);
    const token = localStorage.getItem("access_token");

    const uploaded = [];
    for (let file of files) {
      const form = new FormData();
      form.append("image", file);
      const res = await axios.post("https://blossompick.duckdns.org/api/v1/florist/images/", form, {
        headers: {
          Authorization: `Bearer ${token}`,
        },
      });
      uploaded.push({ url: res.data.image });
    }

    setImages((prev) => [...prev, ...uploaded]);
  };

  const handleSave = async () => {
    const token = localStorage.getItem("access_token");
    const payload = {
      data: { intro, phone, address, detailAddress, hours, images },
    };

    try {
      const res = await axios.patch("https://blossompick.duckdns.org/api/v1/florist/data/", payload, {
        headers: {
          "Content-Type": "application/json",
          Authorization: `Bearer ${token}`,
        },
      });
      alert("🌸 저장되었습니다!");
      navigate("/flowerhouse/addflower");
    } catch (err) {
      console.error("❌ 저장 실패:", err);
      alert("저장 중 오류 발생! 콘솔을 확인해주세요.");
    }
  };

  return (
    <div className="min-h-screen bg-white px-4 py-24 flex flex-col items-center">
      <h1 className="text-4xl font-bold text-center mb-8">{houseName}</h1>
      <div className="w-full max-w-4xl space-y-6">
        <input
          type="text"
          placeholder="📢 한 줄 소개"
          value={intro}
          onChange={(e) => setIntro(e.target.value)}
          className="w-full border px-4 py-3 rounded text-lg"
        />
        <input
          type="text"
          placeholder="📞 전화번호"
          value={phone}
          onChange={(e) => setPhone(e.target.value)}
          className="w-full border px-4 py-3 rounded text-lg"
        />
        <div>
          <label className="block text-lg font-semibold mb-2">📍 주소</label>
          <div className="flex space-x-2">
            <input type="text" value={address} readOnly className="flex-1 border px-4 py-2 rounded" />
            <button onClick={openPostcode} className="px-4 py-2 bg-blue-600 text-white rounded hover:bg-blue-700">검색</button>
          </div>
          <input
            type="text"
            placeholder="상세 주소"
            value={detailAddress}
            onChange={(e) => setDetailAddress(e.target.value)}
            className="w-full border mt-2 px-4 py-2 rounded"
          />
        </div>

        <div>
          <label className="block text-lg font-semibold mb-2">🕒 영업 시간</label>
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
          <label className="block text-lg font-semibold mb-2">📷 사진 업로드</label>
          <input type="file" accept="image/*" multiple onChange={handleImageChange} />
          <div className="grid grid-cols-2 sm:grid-cols-3 gap-4 mt-4">
            {images.map((img, idx) => (
              <img key={idx} src={img.url} alt={`img-${idx}`} className="w-full h-48 object-cover rounded shadow" />
            ))}
          </div>
        </div>

        <div className="text-center">
          <button onClick={handleSave} className="mt-6 px-8 py-4 bg-blue-600 text-white font-bold rounded-lg text-lg hover:bg-blue-700 transition">
            📂 저장하기
          </button>
        </div>
      </div>
    </div>
  );
};

export default FlowerHouse;
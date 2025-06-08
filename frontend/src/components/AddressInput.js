import React, { useEffect } from "react";

const AddressInput = ({ address, setAddress, detail, setDetail }) => {
  useEffect(() => {
    const script = document.createElement("script");
    script.src = "//t1.daumcdn.net/mapjsapi/bundle/postcode/prod/postcode.v2.js";
    script.async = true;
    document.body.appendChild(script);
  }, []);

  const openPostcode = () => {
    new window.daum.Postcode({
      oncomplete: function (data) {
        const fullAddr = data.roadAddress || data.jibunAddress;
        setAddress(fullAddr);
      },
    }).open();
  };

  return (
    <div className="space-y-2">
      <label className="block text-lg font-semibold">📍 주소</label>
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
        value={detail}
        onChange={(e) => setDetail(e.target.value)}
        className="w-full border px-4 py-2 rounded"
        placeholder="상세 주소"
      />
    </div>
  );
};

export default AddressInput;
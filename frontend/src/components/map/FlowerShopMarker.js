const markAddresses = (map, addressList) => {
  addressList.forEach((address) => {
    console.log("📌 지오코딩 시도 주소:", address);

    window.naver.maps.Service.geocode({ query: address }, (status, response) => {
      if (status !== window.naver.maps.Service.Status.OK) {
        console.error("❌ 지오코딩 실패:", address, status);
        return;
      }

      const item = response.v2.addresses[0];
      const lat = parseFloat(item.y);
      const lng = parseFloat(item.x);

      console.log("✅ 지오코딩 성공:", { address, lat, lng });

      const marker = new window.naver.maps.Marker({
        position: new window.naver.maps.LatLng(lat, lng),
        map,
        title: address,
      });

      const infoWindow = new window.naver.maps.InfoWindow({
        content: `<div style="padding:8px;font-size:14px;">${address}</div>`,
      });

      window.naver.maps.Event.addListener(marker, "click", () => {
        infoWindow.open(map, marker);
      });
    });
  });
};

// 🔧 여기서부터 business_id 사용
export const FlowerShopMarker = async (map, business_id) => {
  const userLat = 37.5665;
  const userLng = 126.9780;

  // 사용자 위치 마커
  new window.naver.maps.Marker({
    position: new window.naver.maps.LatLng(userLat, userLng),
    map,
    title: "내 위치",
    icon: {
      content: '<div style="background:#2b90d9;color:white;padding:5px 10px;border-radius:5px;font-size:12px;">내 위치</div>',
    },
  });

  const roadAddresses = [
    "경기도 용인시 수지구 죽전로 152",
    "동백죽전대로 1066",
  ];

  // API에서 business_id로 주소 가져오기
  try {
    const res = await fetch(`https://blossompick.duckdns.org/api/v1/florist/stores/${business_id}/`);
    const json = await res.json();

    const fetchedAddress = json.data.data?.address;
    console.log("🏠 백엔드에서 받아온 주소:", fetchedAddress);

    if (fetchedAddress) {
      roadAddresses.push(fetchedAddress);
    }
  } catch (err) {
    console.error("❌ 주소 불러오기 실패:", err);
  }

  // 📌 마커 표시
  markAddresses(map, roadAddresses);
};
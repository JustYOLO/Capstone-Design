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

      let isOpen = false;

      window.naver.maps.Event.addListener(marker, "click", () => {
        if (isOpen) {
          infoWindow.close();
        } else {
          infoWindow.open(map, marker);
        }
        isOpen = !isOpen;
      });
    });
  });
};

export const FlowerShopMarker = async (map) => {
  const userLat = 37.5665;
  const userLng = 126.9780;

  // 사용자 현재 위치 마커
  const userMarker = new window.naver.maps.Marker({
    position: new window.naver.maps.LatLng(userLat, userLng),
    map,
    title: "내 위치",
    icon: {
      content: '<div style="background:#2b90d9;color:white;padding:5px 10px;border-radius:5px;font-size:12px;">내 위치</div>',
    },
  });

  const userInfoWindow = new window.naver.maps.InfoWindow({
    content: `<div style="padding:8px;font-size:14px;">📍 내 위치</div>`,
  });

  let userInfoOpen = false;

  window.naver.maps.Event.addListener(userMarker, "click", () => {
    if (userInfoOpen) {
      userInfoWindow.close();
    } else {
      userInfoWindow.open(map, userMarker);
    }
    userInfoOpen = !userInfoOpen;
  });

  // 꽃집 주소 마커 생성
  try {
    const res = await fetch("https://blossompick.duckdns.org/api/v1/florist/stores/");
    const json = await res.json();

    const addressList = json
      .map((store) => store.data?.address)
      .filter((addr) => !!addr);

    console.log("📍 전체 받아온 주소들:", addressList);

    markAddresses(map, addressList);
  } catch (err) {
    console.error("❌ 주소 불러오기 실패:", err);
  }
};
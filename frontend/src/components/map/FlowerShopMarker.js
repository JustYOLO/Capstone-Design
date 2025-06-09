const markAddresses = (map, locationList) => {
  locationList.forEach(({ address, housename }) => {
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
        title: housename,
      });

      const infoWindow = new window.naver.maps.InfoWindow({
        content: `<div style="padding:8px;font-size:14px;">🏠 ${housename}</div>`,
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
  // 실제 사용자 위치 가져오기
  navigator.geolocation.getCurrentPosition(
    (position) => {
      const userLat = position.coords.latitude;
      const userLng = position.coords.longitude;

      new window.naver.maps.Marker({
        position: new window.naver.maps.LatLng(userLat, userLng),
        map,
        title: "내 위치",
        icon: {
          content: `
            <div style="
              background:#2b90d9;
              color:white;
              padding:5px 10px;
              border-radius:5px;
              font-size:12px;
            ">내 위치</div>
          `,
        },
      });
    },
    (error) => {
      console.warn("⚠️ 위치 정보 사용 불가. 기본 위치(서울) 사용:", error);
      const fallbackLat = 37.5665;
      const fallbackLng = 126.9780;

      new window.naver.maps.Marker({
        position: new window.naver.maps.LatLng(fallbackLat, fallbackLng),
        map,
        title: "내 위치",
        icon: {
          content: `
            <div style="
              background:#2b90d9;
              color:white;
              padding:5px 10px;
              border-radius:5px;
              font-size:12px;
            ">내 위치</div>
          `,
        },
      });
    }
  );

  // 꽃집 주소 및 이름 가져오기
  try {
    const res = await fetch("https://blossompick.duckdns.org/api/v1/florist/stores/");
    const stores = await res.json();

    const locationList = stores
      .filter((store) => store.data?.address && store.housename)
      .map((store) => ({
        address: store.data.address,
        housename: store.housename,
      }));

    console.log("📍 전체 꽃집 위치 목록:", locationList);

    markAddresses(map, locationList);
  } catch (err) {
    console.error("❌ 꽃집 주소 불러오기 실패:", err);
  }
};
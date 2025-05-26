export const FlowerShopMarkers = (map, userLat, userLng) => {
  // 사용자 위치 마커
  new window.naver.maps.Marker({
    position: new window.naver.maps.LatLng(userLat, userLng),
    map,
    title: "내 위치",
    icon: {
      content: '<div style="background:#2b90d9;color:white;padding:5px 10px;border-radius:5px;font-size:12px;">내 위치</div>',
    },
  });

  // 기존 임의 꽃집 마커들
  const flowerShops = [
    { name: "로맨틱플라워", lat: userLat + 0.002, lng: userLng + 0.002 },
    { name: "블룸하우스", lat: userLat - 0.0015, lng: userLng - 0.001 },
    { name: "향기로운꽃집", lat: userLat + 0.001, lng: userLng - 0.001 },
  ];

  flowerShops.forEach((shop) => {
    const marker = new window.naver.maps.Marker({
      position: new window.naver.maps.LatLng(shop.lat, shop.lng),
      map,
      title: shop.name,
    });

    const infoWindow = new window.naver.maps.InfoWindow({
      content: `<div style="padding:8px;font-size:14px;">${shop.name}</div>`,
    });

    window.naver.maps.Event.addListener(marker, "click", () => {
      infoWindow.open(map, marker);
    });
  });

  // 주소: 죽전로 152 => 위도/경도로 변환하여 마커 추가
  window.naver.maps.Service.geocode(
    { query: "죽전로 152" },
    (status, response) => {
      if (status !== window.naver.maps.Service.Status.OK) {
        console.error("지오코딩 실패:", status);
        return;
      }

      const item = response.v2.addresses[0];
      const lat = parseFloat(item.y);
      const lng = parseFloat(item.x);

      const marker = new window.naver.maps.Marker({
        position: new window.naver.maps.LatLng(lat, lng),
        map,
        title: "죽전로 152",
      });

      const infoWindow = new window.naver.maps.InfoWindow({
        content: `<div style="padding:8px;font-size:14px;">죽전로 152</div>`,
      });

      window.naver.maps.Event.addListener(marker, "click", () => {
        infoWindow.open(map, marker);
      });
    }
  );
};

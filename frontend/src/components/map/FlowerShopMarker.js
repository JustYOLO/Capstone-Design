export const FlowerShopMarkers = (map, userLat, userLng) => {
  // 사용자 위치 마커 추가
  new window.naver.maps.Marker({
    position: new window.naver.maps.LatLng(userLat, userLng),
    map,
    title: "내 위치",
    icon: {
      content: '<div style="background:#2b90d9;color:white;padding:5px 10px;border-radius:5px;font-size:12px;">내 위치</div>',
    },
  });

  // 꽃집 리스트 마커
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

  // 지오코딩: 대지로 42 위치 마커
  window.naver.maps.Service.geocode(
    {
      query: "경기 용인시 수지구 대지로 42",
    },
    function (status, response) {
      if (status !== window.naver.maps.Service.Status.OK) {
        console.error("지오코딩 실패:", status);
        return;
      }

      const result = response.v2.addresses[0];
      const lat = parseFloat(result.y);
      const lng = parseFloat(result.x);

      const marker = new window.naver.maps.Marker({
        position: new window.naver.maps.LatLng(lat, lng),
        map: map,
        title: "대지로 42",
      });

      const infoWindow = new window.naver.maps.InfoWindow({
        content: `<div style="padding:8px;font-size:14px;">대지로 42</div>`,
      });

      window.naver.maps.Event.addListener(marker, "click", () => {
        infoWindow.open(map, marker);
      });
    }
  );
};

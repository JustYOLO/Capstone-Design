// 주소 배열을 받아 마커를 생성하는 함수
const markAddresses = (map, addressList) => {
  addressList.forEach((address) => {
    window.naver.maps.Service.geocode({ query: address }, (status, response) => {
      if (status !== window.naver.maps.Service.Status.OK) {
        console.error("지오코딩 실패:", address, status);
        return;
      }

      const item = response.v2.addresses[0];
      const lat = parseFloat(item.y);
      const lng = parseFloat(item.x);

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


  // 도로명 주소 목록 → 마커 생성
  const roadAddresses = ["경기도 용인시 수지구 죽전로 152", "대지로 131-1", "동백죽전대로 1066"];
  markAddresses(map, roadAddresses);
};
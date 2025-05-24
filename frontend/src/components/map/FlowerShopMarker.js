export const FlowerShopMarkers = (map, userLat, userLng) => {
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
};
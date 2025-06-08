import React, { useState, useEffect } from "react";
import AddressInput from "../AddressInput";

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

const FlowerShopMarker = (map, userLat, userLng, roadAddresses = []) => {
  new window.naver.maps.Marker({
    position: new window.naver.maps.LatLng(userLat, userLng),
    map,
    title: "내 위치",
    icon: {
      content:
        '<div style="background:#2b90d9;color:white;padding:5px 10px;border-radius:5px;font-size:12px;">내 위치</div>',
    },
  });

  markAddresses(map, roadAddresses);
};

const MapWithAddress = () => {
  const [address, setAddress] = useState("");
  const [detail, setDetail] = useState("");

  const userLat = 37.5665;
  const userLng = 126.9780;

  useEffect(() => {
    if (!window.naver || !address) return;

    const map = new window.naver.maps.Map("map", {
      center: new window.naver.maps.LatLng(userLat, userLng),
      zoom: 14,
    });

    FlowerShopMarker(map, userLat, userLng, [address]);
  }, [address]);

  return (
    <div>
      <AddressInput
        address={address}
        setAddress={setAddress}
        detail={detail}
        setDetail={setDetail}
      />
      <div id="map" className="w-full h-96 mt-8 rounded shadow" />
    </div>
  );
};

export { FlowerShopMarker };

export default MapWithAddress;
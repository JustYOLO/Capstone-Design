// FlowerMapWrapper.js
import React, { useEffect, useRef } from "react";
import { FlowerShopMarker } from "./FlowerShopMarker";

const FlowerMapWrapper = ({ userLat, userLng, addressList }) => {
  const mapRef = useRef(null);

  useEffect(() => {
    const map = new window.naver.maps.Map(mapRef.current, {
      center: new window.naver.maps.LatLng(userLat, userLng),
      zoom: 14,
    });

    FlowerShopMarker(map, userLat, userLng, addressList);
  }, [userLat, userLng, addressList]);

  return <div ref={mapRef} style={{ width: "100%", height: "500px" }} />;
};

export default FlowerMapWrapper;

import { useEffect, useRef } from "react";
import { FlowerShopMarker } from "./FlowerShopMarker";

const UserLocationMap = () => {
  const mapRef = useRef(null);

  useEffect(() => {
    if (!window.naver) return;

    navigator.geolocation.getCurrentPosition(
      (position) => {
        const { latitude: lat, longitude: lng } = position.coords;
        const map = new window.naver.maps.Map(mapRef.current, {
          center: new window.naver.maps.LatLng(lat, lng),
          zoom: 14,
        });

        new window.naver.maps.Marker({
          position: new window.naver.maps.LatLng(lat, lng),
          map,
          title: "내 위치",
        });

        FlowerShopMarker(map, lat, lng);
      },
      () => {
        const defaultLatLng = new window.naver.maps.LatLng(37.5665, 126.9780);
        new window.naver.maps.Map(mapRef.current, {
          center: defaultLatLng,
          zoom: 14,
        });
      }
    );
  }, []);

  return <div ref={mapRef} className="w-full h-[500px] rounded-lg border border-gray-300" />;
};

export default UserLocationMap;
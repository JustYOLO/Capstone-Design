import { useEffect, useState } from "react";

export const useNaverMapLoader = (onLoad) => {
  const [loaded, setLoaded] = useState(false);

  useEffect(() => {
    const existingScript = document.querySelector('script[src*="naver.com/openapi/v3/maps.js"]');
    if (existingScript) {
      // 이미 로드된 경우 바로 처리
      setLoaded(true);
      onLoad?.();
      return;
    }

    const script = document.createElement("script");
    script.src = "https://oapi.map.naver.com/openapi/v3/maps.js?ncpKeyId=du06l7nq41";
    script.async = true;
    script.onload = () => {
      if (window.naver) {
        setLoaded(true);
        onLoad?.();
      }
    };
    document.head.appendChild(script);
  }, [onLoad]);

  return loaded;
};
import React, { useEffect, useState } from "react";

const AdCarousel = () => {
  const [currentIndex, setCurrentIndex] = useState(0);

  const bannerImages = [
    "/banner1.jpg",
    "/banner2.jpg",
    "/banner3.jpg",
    "/banner4.jpg",
    "/banner5.jpg"
  ];

  useEffect(() => {
    const interval = setInterval(() => {
      setCurrentIndex((prev) => (prev + 1) % bannerImages.length);
    }, 5000);
    return () => clearInterval(interval);
  }, [bannerImages.length]);

  return (
    <div className="w-full flex justify-center items-center bg-gray-100 py-6">
      <div className="w-full max-w-5xl h-48 relative overflow-hidden rounded-xl shadow-md">
        {bannerImages.map((src, idx) => (
          <img
            key={idx}
            src={src}
            alt={`배너 ${idx + 1}`}
            className={`absolute inset-0 w-full h-full object-cover transition-opacity duration-700 ease-in-out ${
              idx === currentIndex ? "opacity-100" : "opacity-0"
            }`}
          />
        ))}
      </div>
    </div>
  );
};

export default AdCarousel;
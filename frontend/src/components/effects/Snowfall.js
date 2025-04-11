import React, { useEffect, useState } from "react";

const Snowfall = () => {
  const [flakes, setFlakes] = useState([]);

  useEffect(() => {
    const createFlakes = () => {
      const newFlakes = Array.from({ length: 25 }).map(() => ({
        id: Math.random(),
        left: Math.random() * 100 + "vw",
        duration: Math.random() * 6 + 3 + "s",
        delay: Math.random() * 5 + "s",
        size: Math.random() * 8 + 12 + "px", // 눈송이 크기 (12px ~ 20px)
        opacity: Math.random() * 0.5 + 0.5, // 투명도 (0.5 ~ 1)
        rotation: Math.random() * 360 + "deg", // 랜덤 회전
      }));
      setFlakes(newFlakes);
    };

    createFlakes();
  }, []);

  return (
    <div className="absolute top-0 left-0 w-full h-full pointer-events-none overflow-hidden">
      {flakes.map((flake) => (
        <svg
          key={flake.id}
          className="absolute opacity-80"
          style={{
            left: flake.left,
            width: flake.size,
            height: flake.size,
            opacity: flake.opacity,
            transform: `rotate(${flake.rotation})`,
            animation: `fallingSnow ${flake.duration} linear infinite`,
            animationDelay: flake.delay,
          }}
          viewBox="0 0 24 24"
          fill="none"
          xmlns="http://www.w3.org/2000/svg"
        >
          {/* ❄️ 눈 결정 모양 */}
          <path
            stroke="white"
            strokeWidth="2"
            strokeLinecap="round"
            strokeLinejoin="round"
            d="M12 2V22M2 12H22M4 4L20 20M4 20L20 4"
          />
        </svg>
      ))}
      <style>
        {`
          @keyframes fallingSnow {
            0% { transform: translateY(-10vh) rotate(0deg); opacity: 1; }
            100% { transform: translateY(100vh) rotate(360deg); opacity: 0; }
          }
        `}
      </style>
    </div>
  );
};

export default Snowfall;
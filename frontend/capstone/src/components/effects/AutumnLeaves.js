import React, { useEffect, useState } from "react";

const AutumnLeaves = () => {
  const [leaves, setLeaves] = useState([]);

  useEffect(() => {
    const createLeaves = () => {
      const newLeaves = Array.from({ length: 20 }).map(() => ({
        id: Math.random(),
        left: Math.random() * 100 + "vw",
        duration: Math.random() * 8 + 4 + "s",
        delay: Math.random() * 5 + "s",
        color: ["#FF4500", "#FFA500", "#FFD700"][Math.floor(Math.random() * 3)], // 빨강, 주황, 노랑 랜덤
        rotation: Math.random() * 360 + "deg", // 랜덤 회전
      }));
      setLeaves(newLeaves);
    };

    createLeaves();
  }, []);

  return (
    <div className="absolute top-0 left-0 w-full h-full pointer-events-none overflow-hidden">
      {leaves.map((leaf) => (
        <svg
          key={leaf.id}
          className="absolute w-10 h-10 opacity-80"
          style={{
            left: leaf.left,
            transform: `rotate(${leaf.rotation})`,
            animation: `fallingLeaves ${leaf.duration} linear infinite`,
            animationDelay: leaf.delay,
          }}
          viewBox="0 0 64 64"
          fill="none"
          xmlns="http://www.w3.org/2000/svg"
        >
          {/* 단풍잎 SVG 모양 */}
          <path
            fill={leaf.color}
            d="M32 2L37 22L56 18L44 32L58 42L39 43L41 58L32 48L23 58L25 43L6 42L20 32L8 18L27 22L32 2Z"
          />
          <path fill="brown" d="M31 48H33V64H31V48Z" />
        </svg>
      ))}
      <style>
        {`
          @keyframes fallingLeaves {
            0% { transform: translateY(-10vh) rotate(0deg); opacity: 1; }
            100% { transform: translateY(100vh) rotate(360deg); opacity: 0; }
          }
        `}
      </style>
    </div>
  );
};

export default AutumnLeaves;
import React, { useEffect, useState } from "react";

const GreenLeaves = () => {
  const [leaves, setLeaves] = useState([]);

  useEffect(() => {
    const createLeaves = () => {
      const newLeaves = Array.from({ length: 20 }).map(() => ({
        id: Math.random(),
        left: Math.random() * 100 + "vw",
        duration: Math.random() * 7 + 4 + "s",
        delay: Math.random() * 5 + "s",
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
          className="absolute w-6 h-6 opacity-80"
          style={{
            left: leaf.left,
            animation: `fallingLeaves ${leaf.duration} linear infinite`,
            animationDelay: leaf.delay,
          }}
          viewBox="0 0 64 64"
          fill="none"
          xmlns="http://www.w3.org/2000/svg"
        >
          <path fill="#32CD32" d="M32 2C15 15 3 32 15 48C26 61 38 62 50 48C62 34 49 18 32 2Z" />
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

export default GreenLeaves;
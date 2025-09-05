import React from "react";

interface MedalProps {
  rank: 1 | 2 | 3;
  size?: number; // 奖牌大小
}

const Medal: React.FC<MedalProps> = ({ rank, size = 64 }) => {
  const gradients = {
    1: { id: "gold", from: "#FFD700", to: "#B8860B" },
    2: { id: "silver", from: "#E0E0E0", to: "#A9A9A9" },
    3: { id: "bronze", from: "#CD7F32", to: "#8B4513" },
  };

  const { id, from, to } = gradients[rank];

  return (
    <svg
      width={size}
      height={size + size * 0.6}
      viewBox="0 0 100 140"
      xmlns="http://www.w3.org/2000/svg"
    >
      <defs>
        <linearGradient id={id} x1="0%" y1="0%" x2="100%" y2="100%">
          <stop offset="0%" stopColor={from} />
          <stop offset="100%" stopColor={to} />
        </linearGradient>
      </defs>

      {/* 绶带 */}
      <polygon points="30,0 45,0 50,40 40,40" fill="#1E3A8A" />
      <polygon points="55,0 70,0 60,40 50,40" fill="#EF4444" />

      {/* 奖牌本体 */}
      <circle cx="50" cy="90" r="40" fill={`url(#${id})`} stroke="#333" strokeWidth="3" />

      {/* 内圈高光 */}
      <circle cx="50" cy="90" r="28" fill="none" stroke="white" strokeOpacity="0.5" strokeWidth="2" />

      {/* 名次数字 */}
      <text
        x="50"
        y="95"
        textAnchor="middle"
        fontSize="32"
        fontWeight="bold"
        fill="white"
        stroke="#000"
        strokeWidth="1"
      >
        {rank}
      </text>
    </svg>
  );
};

export default Medal;

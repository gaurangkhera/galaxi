import React from 'react';

interface SpaceRouteProps {
  fromName: string;
  toName: string;
  fromCoordinates: { x: number; y: number; z: number };
  toCoordinates: { x: number; y: number; z: number };
}

const SpaceRoute: React.FC<SpaceRouteProps> = ({
  fromName,
  toName,
  fromCoordinates,
  toCoordinates
}) => {
  // Convert 3D coordinates to 2D for visualization
  const scale = 100; // Adjust this value to fit your design
  const fromX = fromCoordinates.x * scale + 150;
  const fromY = fromCoordinates.y * scale + 150;
  const toX = toCoordinates.x * scale + 150;
  const toY = toCoordinates.y * scale + 150;

  return (
    <div className="w-full h-64 bg-gray-900 rounded-lg overflow-hidden">
      <svg width="100%" height="100%" viewBox="0 0 300 300">
        {/* Background stars */}
        {[...Array(100)].map((_, i) => (
          <circle
            key={i}
            cx={Math.random() * 300}
            cy={Math.random() * 300}
            r={Math.random() * 1.5}
            fill="#ffffff"
            opacity={Math.random() * 0.8 + 0.2}
          />
        ))}

        {/* Route line */}
        <line
          x1={fromX}
          y1={fromY}
          x2={toX}
          y2={toY}
          stroke="#00ffff"
          strokeWidth="2"
          strokeDasharray="5,5"
        />

        {/* Departure planet */}
        <circle cx={fromX} cy={fromY} r="8" fill="#4CAF50" />
        <text x={fromX} y={fromY + 20} fill="#ffffff" textAnchor="middle" fontSize="12">
          {fromName}
        </text>

        {/* Arrival planet */}
        <circle cx={toX} cy={toY} r="8" fill="#FF5722" />
        <text x={toX} y={toY - 10} fill="#ffffff" textAnchor="middle" fontSize="12">
          {toName}
        </text>

        {/* Spaceship */}
        <path
          d="M-5,-4 L5,0 L-5,4 Z"
          fill="#ffffff"
          transform={`translate(${(fromX + toX) / 2}, ${(fromY + toY) / 2}) rotate(${Math.atan2(toY - fromY, toX - fromX) * 180 / Math.PI})`}
        />
      </svg>
    </div>
  );
};

export default SpaceRoute;
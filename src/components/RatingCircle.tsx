'use client';

interface RatingCircleProps {
  rating: number;
  size?: number;
}

export default function RatingCircle({ rating, size = 56 }: RatingCircleProps) {
  let color = '#ef4444'; // Red (below 7)
  let colorName = 'red';

  if (rating >= 9) {
    color = '#10b981'; // Green
    colorName = 'green';
  } else if (rating >= 8) {
    color = '#3b82f6'; // Blue
    colorName = 'blue';
  } else if (rating >= 7) {
    color = '#f59e0b'; // Yellow/Amber
    colorName = 'amber';
  }

  const percentage = (rating / 10) * 100;
  const circumference = 2 * Math.PI * (size / 2 - 6);
  const offset = circumference - (percentage / 100) * circumference;

  const fontSize = size > 56 ? '1.25rem' : '0.875rem';
  const labelSize = size > 56 ? '0.875rem' : '0.625rem';

  return (
    <div className="flex items-center justify-center">
      <svg width={size} height={size} className="transform -rotate-90">
        {/* Background circle */}
        <circle
          cx={size / 2}
          cy={size / 2}
          r={size / 2 - 6}
          fill="none"
          stroke="#e5e7eb"
          strokeWidth="3"
        />
        {/* Progress circle */}
        <circle
          cx={size / 2}
          cy={size / 2}
          r={size / 2 - 6}
          fill="none"
          stroke={color}
          strokeWidth="3"
          strokeDasharray={circumference}
          strokeDashoffset={offset}
          strokeLinecap="round"
          className="transition-all duration-300"
        />
        {/* Inner white circle background */}
        <circle
          cx={size / 2}
          cy={size / 2}
          r={size / 2 - 12}
          fill="white"
        />
        {/* Rating text */}
        <text
          x={size / 2}
          y={size / 2 - 4}
          textAnchor="middle"
          dominantBaseline="middle"
          className="font-bold"
          style={{ fontSize, fill: color }}
        >
          {rating.toFixed(1)}
        </text>
        {/* /10 text */}
        <text
          x={size / 2}
          y={size / 2 + 8}
          textAnchor="middle"
          dominantBaseline="middle"
          style={{ fontSize: labelSize, fill: '#6b7280' }}
        >
          /10
        </text>
      </svg>
    </div>
  );
}

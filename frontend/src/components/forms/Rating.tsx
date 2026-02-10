import React from "react";
import { Star, StarHalf } from "lucide-react";

interface RatingProps {
  value: number;
  size?: number;
}

const Rating: React.FC<RatingProps> = ({ value, size = 16 }) => {
  const fullStars = Math.floor(value);
  const halfStar = value % 1 >= 0.5;
  const emptyStars = 5 - fullStars - (halfStar ? 1 : 0);

  return (
    <div className="flex items-center">
      {/* Full stars */}
      {[...Array(fullStars)].map((_, i) => (
        <Star
          key={`full-${i}`}
          size={size}
          className="fill-yellow-400 text-yellow-400 mr-1"
        />
      ))}

      {/* Half star */}
      {halfStar && (
        <StarHalf
          size={size}
          className="fill-yellow-400 text-yellow-400 mr-1"
        />
      )}

      {/* Empty stars */}
      {[...Array(emptyStars)].map((_, i) => (
        <Star key={`empty-${i}`} size={size} className="text-gray-300 mr-1" />
      ))}

      {/* Rating text */}
      <span className="text-sm text-gray-700 ml-1">{value.toFixed(1)}</span>
    </div>
  );
};

export default Rating;

import React, { useState } from "react";
import { Star } from "lucide-react";

const RatingStars = ({
  rating = 0,
  maxRating = 5,
  size = "md",
  interactive = false,
  onChange,
  onRatingChange, // Add support for onRatingChange
}) => {
  const [hoverRating, setHoverRating] = useState(0);

  const sizeClasses = {
    sm: "w-4 h-4",
    md: "w-5 h-5",
    lg: "w-6 h-6",
    xl: "w-8 h-8",
  };

  const handleClick = (value) => {
    if (interactive && (onChange || onRatingChange)) {
      // Support both onChange and onRatingChange
      if (onRatingChange) onRatingChange(value);
      if (onChange) onChange(value);
    }
  };

  return (
    <div className="flex items-center gap-1">
      {[...Array(maxRating)].map((_, index) => {
        const starValue = index + 1;
        const isFilled = starValue <= (hoverRating || rating);

        return (
          <button
            key={index}
            type="button"
            onClick={() => handleClick(starValue)}
            onMouseEnter={() => interactive && setHoverRating(starValue)}
            onMouseLeave={() => interactive && setHoverRating(0)}
            className={`${interactive ? "cursor-pointer hover:scale-110" : "cursor-default"} transition-transform`}
            disabled={!interactive}
          >
            <Star
              className={`${sizeClasses[size]} ${
                isFilled
                  ? "fill-yellow-500 text-yellow-500"
                  : "fill-none text-muted-foreground"
              } transition-colors`}
            />
          </button>
        );
      })}
    </div>
  );
};

export { RatingStars };

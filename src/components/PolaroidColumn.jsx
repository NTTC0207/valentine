import React from "react";
import PolaroidCard from "./PolaroidCard";
import "./PolaroidColumn.css";

const PolaroidColumn = ({
  images,
  direction = "up",
  speed = 20,
  onImageClick,
}) => {
  // Duplicate images for seamless loop
  const duplicatedImages = [...images, ...images];

  const animationStyle = {
    animationDuration: `${speed}s`,
    animationDirection: direction === "up" ? "normal" : "reverse",
  };

  return (
    <div className="polaroid-column">
      <div className="polaroid-track" style={animationStyle}>
        {duplicatedImages.map((img, index) => (
          <PolaroidCard
            key={`${img.id}-${index}`}
            layoutId={`${img.id}-${index}`}
            image={img}
            onClick={onImageClick}
          />
        ))}
      </div>
    </div>
  );
};

export default PolaroidColumn;

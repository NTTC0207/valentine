import React from "react";
import { motion } from "framer-motion";
import "./PolaroidCard.css";

const PolaroidCard = ({ image, onClick, layoutId }) => {
  // Random rotation between -3 and 3 degrees for organic feel
  const rotation = React.useMemo(() => Math.random() * 6 - 3, []);

  return (
    <motion.div
      className="polaroid-card"
      style={{ rotate: rotation }}
      onClick={() => onClick(image, layoutId)}
      whileHover={{ scale: 1.05, rotate: 0, zIndex: 10 }}
      layoutId={`card-container-${layoutId}`}
      transition={{ type: "spring", stiffness: 300, damping: 25 }}
    >
      <div className="polaroid-inner">
        <div className="polaroid-image-frame">
          <motion.img
            src={image.src}
            alt={image.caption}
            className="polaroid-image"
            layoutId={layoutId}
            initial={false}
            loading="lazy"
            decoding="async"
          />
        </div>
        <div className="polaroid-caption">{image.caption}</div>
      </div>
    </motion.div>
  );
};

export default PolaroidCard;

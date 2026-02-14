import React from "react";
import { motion, AnimatePresence } from "framer-motion";
import "./ImageModal.css";

const ImageModal = ({ image, onClose, layoutId }) => {
  if (!image) return null;

  return (
    <motion.div
      className="modal-overlay"
      onClick={onClose}
      initial={{ opacity: 0, backdropFilter: "blur(0px)" }}
      animate={{ opacity: 1, backdropFilter: "blur(8px)" }}
      exit={{ opacity: 0, backdropFilter: "blur(0px)" }}
      transition={{ duration: 0.3 }}
    >
      <div className="modal-content" onClick={(e) => e.stopPropagation()}>
        <motion.div
          className="modal-card-container"
          layoutId={`card-container-${layoutId}`}
          style={{
            background: "white",
            padding: "10px 10px 35px 10px",
            borderRadius: "2px",
            boxShadow: "0 4px 15px rgba(0,0,0,0.2)",
            display: "flex",
            flexDirection: "column",
            alignItems: "center",
            position: "relative",
          }}
          transition={{ type: "spring", stiffness: 250, damping: 25 }}
        >
          <motion.img
            src={image.src}
            alt={image.caption}
            className="modal-image"
            layoutId={layoutId}
            transition={{ type: "spring", stiffness: 250, damping: 25 }}
          />
          <motion.p
            className="modal-caption"
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            exit={{ opacity: 0, y: 20, transition: { duration: 0.1 } }}
            transition={{ delay: 0.2, duration: 0.4 }}
          >
            {image.caption}
          </motion.p>
        </motion.div>
      </div>
    </motion.div>
  );
};

export default ImageModal;

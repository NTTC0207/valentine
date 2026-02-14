import React, { useState, useEffect } from "react";
import { useNavigate } from "react-router-dom";
import { AnimatePresence, motion } from "framer-motion";
import "../App.css";
import PolaroidColumn from "../components/PolaroidColumn";
import ImageModal from "../components/ImageModal";
import ValentineQuiz from "../components/ValentineQuiz";
import DevToolsBlocker from "../components/DevToolsBlocker";
import { APP_CONFIG } from "../config";

import galleryData from "../data/gallery.json";

const ALL_IMAGES = galleryData;

const containerVariants = {
  hidden: { opacity: 0 },
  visible: {
    opacity: 1,
    transition: {
      staggerChildren: 0.3,
      delayChildren: 0.5,
      duration: 1,
    },
  },
};

const itemVariants = {
  hidden: { y: 20, opacity: 0 },
  visible: {
    y: 0,
    opacity: 1,
    transition: { type: "spring", stiffness: 100, damping: 12 },
  },
};

const titleVariants = {
  hidden: { y: 20, opacity: 0, filter: "blur(10px)" },
  visible: {
    y: 0,
    opacity: 1,
    filter: "blur(0px)",
    transition: {
      duration: 1.2,
      ease: [0.16, 1, 0.3, 1],
      delay: 0.2,
    },
  },
};

const gridVariants = {
  hidden: { opacity: 0, scale: 1.05, filter: "blur(10px)" },
  visible: {
    opacity: 1,
    scale: 1,
    filter: "blur(0px)",
    transition: { duration: 1.5, ease: "easeOut" },
  },
};

// --- Component ---
function Gallery({ isReady }) {
  const [selectedImage, setSelectedImage] = useState(null);
  const [selectedLayoutId, setSelectedLayoutId] = useState(null);
  const [columns, setColumns] = useState([]);
  const [showQuiz, setShowQuiz] = useState(false);
  const [isUnlocked, setIsUnlocked] = useState(() => {
    return localStorage.getItem("val_gift_unlocked") === "true";
  });

  const navigate = useNavigate();

  // Responsive column calculation
  useEffect(() => {
    const calculateColumns = () => {
      const width = window.innerWidth;
      let numCols = 3;
      if (width < 600) numCols = 2;
      else if (width < 900) numCols = 3;
      else numCols = 4;

      // Distribute images into columns
      const newColumns = Array.from({ length: numCols }, (_, colIndex) => {
        return ALL_IMAGES.filter(
          (_, imgIndex) => imgIndex % numCols === colIndex,
        );
      });

      setColumns(newColumns);
    };

    calculateColumns();
    window.addEventListener("resize", calculateColumns);
    return () => window.removeEventListener("resize", calculateColumns);
  }, []);

  const handleImageClick = (image, layoutId) => {
    setSelectedImage(image);
    setSelectedLayoutId(layoutId);
  };

  const handleUnlock = () => {
    setIsUnlocked(true);
    localStorage.setItem("val_gift_unlocked", "true");
    setShowQuiz(false);
  };

  // Memoize hearts to prevent jumpy randomization on re-renders
  const hearts = React.useMemo(() => {
    return Array.from({ length: 15 }).map((_, i) => {
      const duration = 4 + Math.random() * 4;
      return {
        id: i,
        left: `${Math.random() * 100}%`,
        delay: `-${Math.random() * duration}s`, // Negative delay
        duration: `${duration}s`,
        scale: 0.5 + Math.random() * 1,
      };
    });
  }, []);
  return (
    <motion.div
      className="app-container"
      initial="hidden"
      animate={isReady ? "visible" : "hidden"}
      variants={containerVariants}
    >
      <DevToolsBlocker enabled={APP_CONFIG.ENABLE_DEV_TOOLS_BLOCKER} />

      {/* Background Hearts */}
      <div className="hearts-bg">
        {hearts.map((heart) => (
          <div
            key={heart.id}
            className="heart"
            style={{
              left: heart.left,
              animationDelay: heart.delay,
              animationDuration: heart.duration,
              transform: `scale(${heart.scale}) rotate(-45deg)`,
            }}
          />
        ))}
      </div>

      {/* Global Cinematic Overlays */}
      <div className="vignette-global"></div>
      <div className="scanlines-global"></div>

      {/* Main Content with Entrance Animation */}
      <motion.div
        className="cinema-container gallery-cinema-container"
        initial={{ opacity: 0 }}
        animate={{ opacity: 1 }}
        transition={{ duration: 1 }}
      >
        <header className="selection-header">
          <div className="cinema-eyebrow">
            <span className="dot"></span> CHAPTER ONE: THE MEMORIES
          </div>
          <motion.h1 className="cinema-title" variants={titleVariants}>
            VALENTINE <span className="outline">GALLERY</span>
          </motion.h1>
          <div className="cinema-divider"></div>
        </header>

        <motion.div
          className="gallery-grid"
          variants={gridVariants}
          style={{
            gridTemplateColumns: `repeat(${columns.length}, 1fr)`,
          }}
        >
          {columns.map((imgs, index) => (
            <PolaroidColumn
              key={index}
              images={imgs}
              direction={index % 2 === 0 ? "down" : "up"} // Alternate directions
              speed={20 + (index % 2) * 5} // Varied speeds (20s, 25s)
              onImageClick={handleImageClick}
            />
          ))}
        </motion.div>

        <footer className="cinema-footer">
          <div className="coords">20°F / 02.14</div>
          <div className="sequence">
            MEMORY_BUFFER: {ALL_IMAGES.length} ITEMS
          </div>
        </footer>
      </motion.div>

      {/* Navigation Button */}
      <motion.div variants={itemVariants} className="gallery-nav-container">
        {isUnlocked ? (
          <button
            className="cinema-action-btn unlocked"
            onClick={() => navigate("/gift-selection")}
          >
            CHOOSE YOUR GIFT <span className="arrow">→</span>
          </button>
        ) : (
          <button
            className="cinema-action-btn locked"
            onClick={() => setShowQuiz(true)}
          >
            UNLOCK EXPERIENCED <span className="lock">🔐</span>
          </button>
        )}
      </motion.div>

      {/* Quiz Modal */}
      {showQuiz && (
        <ValentineQuiz
          onUnlock={handleUnlock}
          onClose={() => setShowQuiz(false)}
        />
      )}

      {/* Modal */}
      <AnimatePresence>
        {selectedImage && (
          <ImageModal
            key="modal"
            image={selectedImage}
            layoutId={selectedLayoutId}
            onClose={() => {
              setSelectedImage(null);
              setSelectedLayoutId(null);
            }}
          />
        )}
      </AnimatePresence>
    </motion.div>
  );
}

export default Gallery;

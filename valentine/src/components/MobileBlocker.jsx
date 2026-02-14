import React, { useState, useEffect } from "react";
import { motion } from "framer-motion";
import "./MobileBlocker.css";

const MobileBlocker = () => {
  const [isMobile, setIsMobile] = useState(false);

  useEffect(() => {
    const checkMobile = () => {
      // Check if width is less than 1024px (standard tablet/desktop breakpoint)
      // Or checking specific mobile user agent if preferred, but screen size is safer for layout issues
      setIsMobile(window.innerWidth < 1024);
    };

    // Initial check
    checkMobile();

    // Listener
    window.addEventListener("resize", checkMobile);
    return () => window.removeEventListener("resize", checkMobile);
  }, []);

  if (!isMobile) return null;

  return (
    <motion.div
      className="mobile-blocker"
      initial={{ opacity: 0 }}
      animate={{ opacity: 1 }}
      exit={{ opacity: 0 }}
    >
      {/* Cinematic Overlays */}
      <div className="vignette-global"></div>
      <div className="scanlines-global"></div>

      <div className="mobile-content-cinema">
        <div className="cinema-eyebrow warning">
          <span className="dot red"></span> SYSTEM_ALERT // RESOLUTION_MISMATCH
        </div>

        <h1 className="cinema-title glitch-text">
          ACCESS <span className="outline-red">DENIED</span>
        </h1>

        <div className="lock-icon-container">
          <svg viewBox="0 0 100 100" className="lock-svg">
            <motion.circle
              cx="50"
              cy="50"
              r="45"
              fill="none"
              stroke="var(--cinema-red)"
              strokeWidth="1"
              strokeDasharray="10 5"
              animate={{ rotate: 360 }}
              transition={{ duration: 10, repeat: Infinity, ease: "linear" }}
            />
            <motion.path
              d="M35,45 V35 A15,15 0 0,1 65,35 V45 H70 V75 H30 V45 Z M40,45 V35 A10,10 0 0,1 60,35 V45 Z"
              fill="none"
              stroke="var(--cinema-red)"
              strokeWidth="2"
              initial={{ pathLength: 0, opacity: 0 }}
              animate={{ pathLength: 1, opacity: 1 }}
              transition={{
                duration: 2,
                repeat: Infinity,
                repeatType: "reverse",
              }}
            />
          </svg>
        </div>

        <p className="mobile-message">
          TERMINAL DISPLAY TOO SMALL.
          <br />
          THE VALENTINE ARCHIVE REQUIRES A DESKTOP INTERFACE FOR FULL IMMERSION.
        </p>

      </div>
    </motion.div>
  );
};

export default MobileBlocker;

import React, { useState, useEffect } from "react";
import { motion, AnimatePresence } from "framer-motion";
import "./Preloader.css";

const Preloader = ({ onComplete }) => {
  const [progress, setProgress] = useState(0);
  const [isFading, setIsFading] = useState(false);

  useEffect(() => {
    const duration = 2500; // Faster duration for a snappy feels
    const intervalTime = 16; // ~60fps
    const step = (intervalTime / duration) * 100;

    const timer = setInterval(() => {
      setProgress((prev) => {
        const next = prev + step;
        if (next >= 100) {
          clearInterval(timer);
          setTimeout(() => setIsFading(true), 500);
          setTimeout(() => onComplete(), 1300); // Allow 800ms for exit animation
          return 100;
        }
        return next;
      });
    }, intervalTime);

    return () => clearInterval(timer);
  }, [onComplete]);

  // Elegant Architectural Heart Path (200x200)
  const mainHeart =
    "M100,180c-25-35-80-69-80-111c0-26,19-49,45-49c18,0,31,10,35,22c4-12,17-22,35-22c26,0,45,23,45,49 C180,111,125,145,100,180z";
  const outerOrbit =
    "M100,195c-35-42-95-80-95-126c0-30,25-56,58-56c22,0,38,12,37,25c-1-13,15-25,37-25c33,0,58,26,58,56 C195,115,135,153,100,195z";
  const innerCore =
    "M100,165c-20-30-65-58-65-96c0-22,15-42,38-42c15,0,26,9,27,19c1-10,12-19,27-19c23,0,38,20,38,42 C165,107,120,135,100,165z";

  return (
    <div className={`preloader-overlay ${isFading ? "fade-out" : ""}`}>
      {/* Cinematic Overlays */}
      <div className="vignette-global"></div>
      <div className="scanlines-global"></div>

      <motion.div
        className="preloader-content"
        initial={{ opacity: 0, scale: 0.8 }}
        animate={
          isFading
            ? { scale: [1, 40], opacity: [1, 0] }
            : { opacity: 1, scale: 1 }
        }
        transition={{
          duration: 0.8,
          ease: "easeInOut",
        }}
      >
        <div className="cinema-eyebrow preloader-eyebrow">
          <span className="dot"></span> ESTABLISHING_CONNECTION /
          V.A.L.E.N.T.I.N.E
        </div>

        <div className="orb-container">
          <svg viewBox="0 0 200 200" className="orb-svg">
            {/* Outer Rotating Data Ring */}
            <motion.circle
              cx="100"
              cy="100"
              r="80"
              fill="none"
              stroke="var(--cinema-title)"
              strokeWidth="1"
              strokeDasharray="4 8"
              opacity="0.3"
              animate={{ rotate: 360 }}
              transition={{ duration: 10, repeat: Infinity, ease: "linear" }}
            />

            {/* Satellite Particles (Love Satellites) */}
            <motion.g
              animate={{ rotate: 360 }}
              transition={{ duration: 3, repeat: Infinity, ease: "linear" }}
            >
              <circle
                cx="100"
                cy="10"
                r="4"
                fill="var(--accent-pink)"
                style={{ filter: "drop-shadow(0 0 5px var(--accent-pink))" }}
              />
              <circle
                cx="100"
                cy="190"
                r="4"
                fill="var(--accent-pink)"
                style={{ filter: "drop-shadow(0 0 5px var(--accent-pink))" }}
              />
            </motion.g>

            {/* Progress Arc */}
            <motion.circle
              cx="100"
              cy="100"
              r="70"
              fill="none"
              stroke="var(--cinema-title)"
              strokeWidth="4"
              strokeLinecap="round"
              transform="rotate(-90 100 100)"
              initial={{ pathLength: 0 }}
              animate={{ pathLength: progress / 100 }}
              transition={{ ease: "linear" }}
              style={{
                filter: "drop-shadow(0 0 8px var(--cinema-title))",
              }}
            />

            {/* Inner Spinning Core Rings */}
            <motion.circle
              cx="100"
              cy="100"
              r="55"
              fill="none"
              stroke="var(--cinema-title)"
              strokeWidth="1"
              opacity="0.5"
              strokeDasharray="40 20"
              animate={{ rotate: -360 }}
              transition={{ duration: 8, repeat: Infinity, ease: "linear" }}
            />
            <motion.circle
              cx="100"
              cy="100"
              r="45"
              fill="none"
              stroke="white"
              strokeWidth="0.5"
              opacity="0.3"
              strokeDasharray="10 10"
              animate={{ rotate: 360 }}
              transition={{ duration: 5, repeat: Infinity, ease: "linear" }}
            />

            {/* Central Pulsing Core */}
            <motion.circle
              cx="100"
              cy="100"
              r={30 + progress / 10}
              fill="url(#core-gradient)"
              opacity="0.8"
              animate={{ scale: [1, 1.1, 1] }}
              transition={{
                duration: 1.5,
                repeat: Infinity,
                ease: "easeInOut",
              }}
            />

            {/* Gradient Definition */}
            <defs>
              <radialGradient
                id="core-gradient"
                cx="50%"
                cy="50%"
                r="50%"
                fx="50%"
                fy="50%"
              >
                <stop offset="0%" stopColor="#fff" stopOpacity="0.9" />
                <stop
                  offset="100%"
                  stopColor="var(--cinema-title)"
                  stopOpacity="0.6"
                />
              </radialGradient>
            </defs>
          </svg>

          <div className="progress-center">
            <motion.span
              className="progress-percentage"
              key={Math.floor(progress)}
            >
              {Math.round(progress)}
            </motion.span>
            <span className="unit">%</span>
          </div>
        </div>

        <div className="loading-status">
          <motion.div
            className="status-text"
            animate={{ opacity: [0.3, 1, 0.3] }}
            transition={{ duration: 1.5, repeat: Infinity }}
          >
            {progress < 30
              ? "CACHING_MEMORIES..."
              : progress < 60
                ? "CALIBRATING_EMOTIONS..."
                : progress < 90
                  ? "ESTABLISHING_CONVERGENCE..."
                  : "READY_TO_LAUNCH"}
          </motion.div>
        </div>
      </motion.div>

      {/* Ambient Glows */}
      <div className="preloader-glow"></div>

      {/* Rising Particles */}
      <div className="particles-container">
        {Array.from({ length: 30 }).map((_, i) => (
          <div
            key={i}
            className="particle"
            style={{
              left: `${Math.random() * 100}%`,
              top: `${70 + Math.random() * 40}%`, // Start in bottom 30% area
              animationDuration: `${12 + Math.random() * 18}s`,
              width: `${2 + Math.random() * 4}px`,
              height: `${2 + Math.random() * 4}px`,
              filter: `blur(${Math.random() * 1.5}px)`,
            }}
          ></div>
        ))}
      </div>
    </div>
  );
};

export default Preloader;

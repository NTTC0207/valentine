import React, { useState } from "react";
import { useNavigate } from "react-router-dom";
import { motion, AnimatePresence } from "framer-motion";
import "./GiftSelection.css";

const GiftSelection = () => {
  const navigate = useNavigate();
  const [hovered, setHovered] = useState(null);

  const containerVariants = {
    hidden: { opacity: 0 },
    visible: {
      opacity: 1,
      transition: {
        staggerChildren: 0.15,
        delayChildren: 0.3,
      },
    },
  };

  const cinematicEntrance = {
    hidden: {
      opacity: 0,
      y: 100,
      scale: 1.1,
      filter: "blur(20px)",
    },
    visible: {
      opacity: 1,
      y: 0,
      scale: 1,
      filter: "blur(0px)",
      transition: {
        duration: 1.2,
        ease: [0.16, 1, 0.3, 1],
      },
    },
  };

  const lineVariants = {
    hidden: { width: 0, opacity: 0 },
    visible: {
      width: "100%",
      opacity: 0.3,
      transition: { duration: 1.5, ease: "easeInOut", delay: 0.8 },
    },
  };

  const cardVariants = {
    hidden: {
      opacity: 0,
      x: (i) => (i === 0 ? -50 : 50),
      rotateY: (i) => (i === 0 ? 15 : -15),
    },
    visible: {
      opacity: 1,
      x: 0,
      rotateY: 0,
      transition: {
        duration: 1.5,
        ease: [0.16, 1, 0.3, 1],
      },
    },
  };

  const options = [
    {
      id: "luck",
      title: "FORTUNE",
      subtitle: "WHEEL",
      desc: "TRUST IN DESTINY",
      path: "/fortune-wheel",
      color: "var(--accent-pink)",
      accent: "rgba(255, 107, 107, 0.15)",
    },
    {
      id: "skill",
      title: "RED",
      subtitle: "PACKET",
      desc: "TEST YOUR REFLEX",
      path: "/red-packet",
      color: "var(--accent-red)",
      accent: "rgba(214, 51, 108, 0.15)",
    },
  ];

  return (
    <div className="gift-selection-root cinema-root">
      {/* Global Cinematic Overlays */}
      <div className="vignette-global"></div>
      <div className="scanlines-global"></div>

      <motion.button
        className="cinema-back-btn"
        onClick={() => navigate("/")}
        initial={{ opacity: 0, x: -20 }}
        animate={{ opacity: 1, x: 0 }}
        transition={{ delay: 1 }}
      >
        <span className="line"></span>
        <span className="text">RETURN TO GALLERY</span>
      </motion.button>

      <motion.div
        className="cinematic-container cinema-container"
        variants={containerVariants}
        initial="hidden"
        animate="visible"
      >
        <header className="selection-header">
          <motion.div className="cinema-eyebrow" variants={cinematicEntrance}>
            <span className="dot"></span> CHAPTER TWO: THE CHOICE
          </motion.div>
          <motion.h1 className="cinema-title" variants={cinematicEntrance}>
            CHOOSE YOUR <span className="outline">LEGACY</span>
          </motion.h1>
          <motion.div
            className="cinema-divider"
            variants={lineVariants}
          ></motion.div>
        </header>

        <div className="split-selection">
          {options.map((opt, i) => (
            <motion.div
              key={opt.id}
              className={`selection-pane ${hovered === opt.id ? "active" : ""} ${hovered && hovered !== opt.id ? "dimmed" : ""}`}
              variants={cardVariants}
              custom={i}
              onMouseEnter={() => setHovered(opt.id)}
              onMouseLeave={() => setHovered(null)}
              onClick={() => navigate(opt.path)}
            >
              <div className="pane-content">
                <motion.div
                  className="pane-bg"
                  style={{ background: opt.accent }}
                  animate={{
                    scale: hovered === opt.id ? 1.1 : 1,
                    opacity: hovered === opt.id ? 1 : 0.3,
                  }}
                />

                <div className="text-group">
                  <motion.span
                    className="pane-desc"
                    animate={{
                      y: hovered === opt.id ? 0 : 10,
                      opacity: hovered === opt.id ? 1 : 0.5,
                    }}
                  >
                    {opt.desc}
                  </motion.span>
                  <h2 className="pane-title">
                    {opt.title} <span>{opt.subtitle}</span>
                  </h2>
                </div>

                <div className="pane-footer">
                  <div className="action-tag">
                    <span className="bracket">[</span>
                    SELECT PATH
                    <span className="bracket">]</span>
                  </div>
                </div>
              </div>

              {/* Dynamic light streak effect */}
              <AnimatePresence>
                {hovered === opt.id && (
                  <motion.div
                    className="light-streak"
                    initial={{ left: "-100%" }}
                    animate={{ left: "100%" }}
                    exit={{ opacity: 0 }}
                    transition={{ duration: 0.8, ease: "easeInOut" }}
                  />
                )}
              </AnimatePresence>
            </motion.div>
          ))}
        </div>

        <motion.footer className="cinema-footer" variants={cinematicEntrance}>
          <div className="coords">20°F / 02.14</div>
          <div className="sequence">00:14:02:14</div>
        </motion.footer>
      </motion.div>

      {/* Ambient Bokeh Particles */}
      <div className="ambient-particles">
        {Array.from({ length: 8 }).map((_, i) => (
          <motion.div
            key={i}
            className="bokeh"
            initial={{
              x: Math.random() * 100 + "%",
              y: Math.random() * 100 + "%",
              scale: Math.random() * 2 + 1,
              opacity: 0,
            }}
            animate={{
              y: ["-10%", "110%"],
              opacity: [0, 0.15, 0],
            }}
            transition={{
              duration: 15 + Math.random() * 15,
              repeat: Infinity,
              ease: "linear",
              delay: Math.random() * 10,
            }}
          />
        ))}
      </div>
    </div>
  );
};

export default GiftSelection;

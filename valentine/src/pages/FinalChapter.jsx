import React, { useState, useEffect, useRef } from "react";
import { useNavigate } from "react-router-dom";
import { motion, AnimatePresence } from "framer-motion";
import "./FinalChapter.css";

const FinalChapter = () => {
  const [mousePos, setMousePos] = useState({ x: 0, y: 0 });
  const [sync, setSync] = useState(0);
  const [isMerged, setIsMerged] = useState(false);
  const [showLetter, setShowLetter] = useState(false);
  const navigate = useNavigate();

  const containerRef = useRef(null);
  const fixedOrbPos = { x: window.innerWidth / 2, y: window.innerHeight / 2 };

  useEffect(() => {
    const handleMouseMove = (e) => {
      setMousePos({ x: e.clientX, y: e.clientY });

      // Calculate distance between fixed orb and mouse orb
      const dx = e.clientX - fixedOrbPos.x;
      const dy = e.clientY - fixedOrbPos.y;
      const distance = Math.sqrt(dx * dx + dy * dy);

      // Calculate sync percentage (100% at distance < 50px)
      const maxDist = 400;
      const newSync = Math.max(
        0,
        Math.min(100, 100 * (1 - (distance - 50) / (maxDist - 50))),
      );
      setSync(Math.floor(newSync));

      if (distance < 40 && !isMerged) {
        handleMerge();
      }
    };

    window.addEventListener("mousemove", handleMouseMove);
    return () => window.removeEventListener("mousemove", handleMouseMove);
  }, [isMerged]);

  const handleMerge = () => {
    setIsMerged(true);
    setTimeout(() => {
      setShowLetter(true);
    }, 1500); // Wait for supernova flash
  };

  return (
    <div className="final-chapter-root cinema-root" ref={containerRef}>
      <div className="vignette-global"></div>
      <div className="scanlines-global"></div>

      <AnimatePresence>
        {!showLetter && (
          <motion.div className="convergence-container" exit={{ opacity: 0 }}>
            <div className="sync-status">
              SYNC_LEVEL: {sync}% {sync === 100 ? "// READY" : ""}
            </div>

            {/* Fixed Orb (Her) */}
            <motion.div
              className="orb orb-fixed"
              style={{
                left: fixedOrbPos.x - 75,
                top: fixedOrbPos.y - 75,
              }}
              animate={{
                scale: [1, 1.1 + sync / 200, 1],
                opacity: 0.4 + sync / 200,
              }}
              transition={{ repeat: Infinity, duration: 2, ease: "easeInOut" }}
            />

            {/* Mouse Orb (You) */}
            {!isMerged && (
              <motion.div
                className="orb orb-mouse"
                style={{
                  left: mousePos.x - 75,
                  top: mousePos.y - 75,
                }}
                animate={{
                  scale: 1 + sync / 100,
                  opacity: 0.3 + sync / 150,
                }}
              />
            )}

            <div className="convergence-instruction">
              [ DIRECTIVE: BRING THE LIGHTS TOGETHER ]
            </div>
          </motion.div>
        )}
      </AnimatePresence>

      {/* Supernova Flash */}
      <AnimatePresence>
        {isMerged && !showLetter && (
          <motion.div
            className="supernova-overlay"
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            transition={{ duration: 1, ease: "easeIn" }}
          />
        )}
      </AnimatePresence>

      {/* Final Love Letter */}
      <AnimatePresence>
        {showLetter && (
          <motion.div
            className="cinema-container"
            initial={{ opacity: 0, y: 50, filter: "blur(20px)" }}
            animate={{ opacity: 1, y: 0, filter: "blur(0px)" }}
            transition={{ duration: 2, ease: [0.16, 1, 0.3, 1] }}
          >
            <header className="selection-header">
              <div className="cinema-eyebrow">
                <span className="dot"></span> CHAPTER FINAL: THE CONVERGENCE
              </div>
              <h1 className="cinema-title">
                FOREVER <span className="outline">US</span>
              </h1>
              <div className="cinema-divider"></div>
            </header>

            <div className="final-letter-container">
              <div className="letter-header">
                <div className="cinema-eyebrow">建立于：02.14.2026</div>
              </div>
              <div className="letter-body">
                我的宝贝，
                <br />
                <br />
                虽然我们有时候会吵架，会有意见不合，
                但我知道，我们的爱一直都在， 那份心动、那份在乎，从来没有消失。
                <br />
                <br />
                谢谢你一直陪在我身边， 包容我的脾气，也愿意跟我一起成长。
                <br />
                <br />
                情人节快乐。 希望我们的故事，还能继续写下去，
                一起经历更多属于我们的回忆。
              </div>
              <div className="letter-footer">
                永远爱你的，
                <br />
                HY
              </div>

              <motion.div
                className="letter-actions"
                initial={{ opacity: 0 }}
                animate={{ opacity: 1 }}
                transition={{ delay: 1.5 }}
                style={{
                  marginTop: "40px",
                  display: "flex",
                  justifyContent: "center",
                }}
              >
                <button
                  className="cinema-action-btn"
                  onClick={() => {
                    const lastGame = localStorage.getItem("val_last_game");
                    if (lastGame === "wheel") navigate("/fortune-wheel")
                    else navigate("/gift-selection");
                  }}
                >
                  <span className="arrow">←</span> RETURN TO CLAIM YOUR REWARD
                </button>
              </motion.div>
            </div>

            <footer className="cinema-footer">
              <div className="coords">20°F / 02.14</div>
              <div className="sequence">
                END_LOG: SESSION_COMPLETE // TO_BE_CONTINUED
              </div>
            </footer>
          </motion.div>
        )}
      </AnimatePresence>
    </div>
  );
};

export default FinalChapter;

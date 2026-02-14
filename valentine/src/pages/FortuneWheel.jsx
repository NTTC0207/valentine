import React, { useState, useRef, useEffect } from "react";
import { useNavigate } from "react-router-dom";
import { motion, AnimatePresence } from "framer-motion";
import "./FortuneWheel.css";

const FortuneWheel = () => {
  const [isSpinning, setIsSpinning] = useState(false);
  const [rotation, setRotation] = useState(0);
  const [result, setResult] = useState(null);
  const [showResult, setShowResult] = useState(false);
  const [message, setMessage] = useState("Spin the wheel for a surprise! 🎡");
  const navigate = useNavigate();
  const wheelRef = useRef(null);

  // Load saved state on mount
  useEffect(() => {
    const saved = localStorage.getItem("val_wheel_result");
    if (saved) {
      const parsed = JSON.parse(saved);
      setResult(parsed);
      setShowResult(true);
      setMessage(`Congratulations! You won ${parsed.label}! 💖`);
    }
  }, []);

  const amounts = [
    { value: 5.2, label: "RM 5.20", color: "#ff9a9e" },
    { value: 150, label: "大餐", color: "#ff85a1" },
    { value: 520.0, label: "RM 520.00", color: "#ffb3c1" },
    { value: 5200.0, label: "RM 5,200.00", color: "#ffc8dd" },
    { value: 52000.0, label: "Iphone 17 Pro Max", color: "#ffafcc" },
    { value: 520.0, label: "2 天 1 夜 trip", color: "#fb6f92" },
    { value: 0, label: "Try Again", color: "#fad0c4" },
  ];

  const spinWheel = () => {
    if (isSpinning) return;

    setIsSpinning(true);
    setShowResult(false);
    setMessage("Spinning... Good luck! ✨");

    // Logic: Never select amounts > 520
    // Selected indices can only be 0 (5.2), 1 (52), 2 (520), or 5 (Try Again)
    const safeIndices = [0, 1, 2, 5, 6];
    const randomIndex =
      safeIndices[Math.floor(Math.random() * safeIndices.length)];

    const extraSpins = 5 + Math.floor(Math.random() * 5); // 5-10 full spins
    const segmentAngle = 360 / amounts.length;

    // The angle we want at the top is the middle of the selected segment
    const targetMiddle = randomIndex * segmentAngle + segmentAngle / 2;
    // To bring 'targetMiddle' to top, we need the wheel to be at:
    const targetRotation = (360 - targetMiddle) % 360;

    // Find how much to add to reach that rotation, ensuring we only turn forward
    const currentAngle = rotation % 360;
    let diff = targetRotation - currentAngle;
    if (diff <= 0) diff += 360;

    const nextRotationValue = rotation + diff + extraSpins * 360;
    setRotation(nextRotationValue);

    setTimeout(() => {
      setIsSpinning(false);
      setResult(amounts[randomIndex]);
      setShowResult(true);

      if (amounts[randomIndex].value === 0) {
        setMessage("Oops! Try one more time? 🥺");
      } else {
        setMessage(
          `Congratulations! You won ${amounts[randomIndex].label}! 💖`,
        );
        // Save win state
        localStorage.setItem(
          "val_wheel_result",
          JSON.stringify(amounts[randomIndex]),
        );
        localStorage.setItem("val_last_game", "wheel");
      }
    }, 5000);
  };

  const handleClaim = () => {
    if (result.value === 0) {
      setShowResult(false);
      return;
    }

    // Clear saved win on claim
    localStorage.removeItem("val_wheel_result");

    // Same WhatsApp logic as RedPacket
    const phone = "60128869861";
    const text = encodeURIComponent(
      `我在幸运大转盘抽中了 ${result.label}！🧧 看来这就是缘分，赶快发给我吧`,
    );
    window.location.href = `https://wa.me/${phone}?text=${text}`;

    // Navigate to final chapter after a delay
    setTimeout(() => {
      navigate("/final-chapter");
    }, 2000);
  };

  return (
    <div className="fortune-page cinema-root">
      {/* Global Cinematic Overlays */}
      <div className="vignette-global"></div>
      <div className="scanlines-global"></div>

      <motion.button
        className="cinema-back-btn"
        onClick={() => navigate("/gift-selection")}
        initial={{ opacity: 0, x: -20 }}
        animate={{ opacity: 1, x: 0 }}
        transition={{ delay: 0.5 }}
      >
        <span className="line"></span>
        <span className="text">RETURN TO PATH</span>
      </motion.button>

      <motion.div
        className="fortune-container cinema-container"
        initial={{ opacity: 0, y: 30 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 1, ease: [0.16, 1, 0.3, 1] }}
      >
        <header className="selection-header">
          <div className="cinema-eyebrow">
            <span className="dot"></span> CHAPTER THREE: THE SPIN
          </div>
          <h1 className="cinema-title">
            FORTUNE <span className="outline">WHEEL</span>
          </h1>
          <div className="cinema-divider"></div>
        </header>

        <p className="wheel-subtitle cinematic-text">{message}</p>

        <div className="wheel-wrapper">
          <div className="wheel-pointer">▼</div>
          <div
            className="wheel"
            style={{
              transform: `rotate(${rotation}deg)`,
              transition: isSpinning
                ? "transform 5s cubic-bezier(0.15, 0, 0.15, 1)"
                : "none",
              background: `conic-gradient(${amounts
                .map((amt, i) => {
                  const start = i * (360 / amounts.length);
                  const end = (i + 1) * (360 / amounts.length);
                  return `${amt.color} ${start}deg ${end}deg`;
                })
                .join(", ")})`,
            }}
          >
            {/* Individual Divider Lines for perfect alignment */}
            {amounts.map((_, i) => (
              <div
                key={`div-${i}`}
                className="wheel-divider-line"
                style={{
                  transform: `rotate(${i * (360 / amounts.length)}deg)`,
                }}
              />
            ))}
            {amounts.map((amt, i) => (
              <div
                key={i}
                className="wheel-label-container"
                style={{
                  // Position label in the middle of each segment
                  transform: `rotate(${i * (360 / amounts.length) + 360 / amounts.length / 2 - 90}deg)`,
                }}
              >
                <div className="wheel-label-text">{amt.label}</div>
              </div>
            ))}
          </div>
          <button
            className={`spin-button ${isSpinning ? "disabled" : ""}`}
            onClick={spinWheel}
            disabled={isSpinning}
          >
            {isSpinning ? "..." : "SPIN"}
          </button>
        </div>

        <footer className="cinema-footer">
          <div className="coords">20°F / 02.14</div>
          <div className="sequence">*注意：若发现作弊，奖励将被没收</div>
        </footer>
      </motion.div>

      <AnimatePresence>
        {showResult && (
          <motion.div
            className="wheel-modal-overlay"
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            onClick={() => setShowResult(false)}
          >
            <motion.div
              className="wheel-modal"
              initial={{ scale: 0.5, y: 50 }}
              animate={{ scale: 1, y: 0 }}
              onClick={(e) => e.stopPropagation()}
            >
              <button
                className="modal-close-btn"
                onClick={() => setShowResult(false)}
              >
                ×
              </button>
              <div className="modal-icon">{result.value > 0 ? "🎉" : "😢"}</div>
              <h2>{result.value > 0 ? "You Won!" : "Try Again"}</h2>
              <p className="result-amount">{result.label}</p>
              <div className="modal-buttons">
                {result.value > 0 ? (
                  <div className="modal-buttons vertical">
                    <button className="claim-btn" onClick={handleClaim}>
                      Claim Reward 🎁
                    </button>
                    <button
                      className="retry-btn"
                      onClick={() => navigate("/final-chapter")}
                    >
                      Proceed to Final ➔
                    </button>
                  </div>
                ) : (
                  <button
                    className="retry-btn"
                    onClick={() => setShowResult(false)}
                  >
                    Spin Again 🔄
                  </button>
                )}
              </div>
            </motion.div>
          </motion.div>
        )}
      </AnimatePresence>

      {/* Background Hearts */}
      <div className="wheel-hearts">
        {React.useMemo(
          () =>
            Array.from({ length: 15 }).map((_, i) => {
              const duration = 5 + Math.random() * 5;
              return (
                <div
                  key={i}
                  className="wheel-heart"
                  style={{
                    left: `${Math.random() * 100}%`,
                    animationDelay: `-${Math.random() * duration}s`,
                    animationDuration: `${duration}s`,
                  }}
                />
              );
            }),
          [],
        )}
      </div>
    </div>
  );
};

export default FortuneWheel;

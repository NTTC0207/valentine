import React, { useState, useRef, useEffect } from "react";
import { useNavigate } from "react-router-dom";
import { motion, AnimatePresence } from "framer-motion";
import "../index.css";

const RedPacket = () => {
  const [message, setMessage] = useState("INITIATING CATCH SEQUENCE...");
  const [showConfetti, setShowConfetti] = useState(false);

  // Use a state to track styles for each evasive button
  const [buttonStyles, setButtonStyles] = useState({});
  // Track shaking status for specific buttons
  const [shakingButtons, setShakingButtons] = useState({});

  const navigate = useNavigate();
  const containerRef = useRef(null);
  const buttonRefs = useRef({});
  const isMovingRef = useRef({}); // Track moving state to prevent jitter

  const amounts = [
    { value: 5.2, label: "5.20" },
    { value: 52.0, label: "52.0" },
    { value: 520.0, label: "520.00" },
    { value: 5200.0, label: "5,200.00" },
    { value: 52000.0, label: "52,000.00" },
  ];

  // Helper to get random pos that ensures it is NOT near the cursor
  const getRandomPosSafe = (containerW, containerH, cursorX, cursorY) => {
    const padding = 20;
    const btnW = 150;
    const btnH = 60;
    const maxLeft = containerW - btnW - padding;
    const maxTop = containerH - btnH - padding;

    // Try to find a safe spot
    let safeObj = null;
    let attempts = 0;

    while (!safeObj && attempts < 10) {
      const left = Math.max(padding, Math.random() * maxLeft);
      const top = Math.max(padding, Math.random() * maxTop);

      const dist = Math.hypot(left - cursorX, top - cursorY);

      // If distance is reasonable > 200px
      if (dist > 200) {
        safeObj = { left, top };
      }
      attempts++;
    }

    // Fallback if random attempts fail (unlikely)
    return safeObj || { left: 50, top: 50 };
  };

  // Memoize the background hearts so they don't re-render on state changes
  const backgroundHearts = React.useMemo(() => {
    return Array.from({ length: 15 }).map((_, i) => {
      const duration = 4 + Math.random() * 6;
      return {
        id: i,
        left: Math.random() * 100,
        animationDelay: -Math.random() * duration, // Negative delay to pre-warm animation
        animationDuration: duration,
      };
    });
  }, []);

  const moveButton = (value, cursorX, cursorY) => {
    if (isMovingRef.current[value]) return;

    const container = containerRef.current;
    if (!container) return;

    isMovingRef.current[value] = true;
    setTimeout(() => {
      isMovingRef.current[value] = false;
    }, 300);

    const { width, height } = container.getBoundingClientRect();

    // Pass cursor info to get safe position
    let newPos = getRandomPosSafe(width, height, cursorX, cursorY);

    setButtonStyles((prev) => ({
      ...prev,
      [value]: {
        position: "absolute",
        left: `${newPos.left}px`,
        top: `${newPos.top}px`,
        transition: "all 0.1s ease-out",
        transform: `scale(${0.9 + Math.random() * 0.2}) rotate(${Math.random() * 20 - 10}deg)`,
        zIndex: 100, // Ensure it flies over others
      },
    }));
  };

  const handleMouseMove = (e) => {
    const container = containerRef.current;
    if (!container) return;

    const containerRect = container.getBoundingClientRect();
    const cursorX = e.clientX - containerRect.left;
    const cursorY = e.clientY - containerRect.top;

    amounts.forEach((amt) => {
      // Only evade if strictly greater than 520 AND it has already been moved once
      if (amt.value > 520 && buttonStyles[amt.value]) {
        const btn = buttonRefs.current[amt.value];
        if (btn) {
          const btnRect = btn.getBoundingClientRect();
          const btnX = btnRect.left - containerRect.left + btnRect.width / 2;
          const btnY = btnRect.top - containerRect.top + btnRect.height / 2;

          const distance = Math.hypot(cursorX - btnX, cursorY - btnY);

          if (distance < 150) {
            moveButton(amt.value, cursorX, cursorY);
          }
        }
      }
    });
  };

  const handleSelect = (amount) => {
    // If user picks the "Too Small" amounts (5.2 or 52)
    if (amount.value < 520) {
      setShakingButtons((prev) => ({ ...prev, [amount.value]: true }));
      setTimeout(() => {
        setShakingButtons((prev) => ({ ...prev, [amount.value]: false }));
      }, 500);

      setMessage("INSUFFICIENT_FUNDS: TRY_HIGHER");
      return;
    }

    // Success logic for 520
    if (amount.value === 520) {
      setMessage("TARGET_ACQUIRED: PROCESSING_PAYMENT...");
      setShowConfetti(true);

      // Redirect to WhatsApp after 2 seconds
      setTimeout(() => {
        const phone = "60128869861";
        const text = encodeURIComponent(
          "宝贝情人节快乐～要个红包不过分吧🥰现在发的话，就算你答应接下来一个月的晚饭都让我请咯～爱你！",
        );
        window.location.href = `https://wa.me/${phone}?text=${text}`;

        // Final transition
        setTimeout(() => {
          navigate("/final-chapter");
        }, 3000);
      }, 4500);

      return;
    }

    // Logic for > 520 - Disable selection entirely!
    if (amount.value > 520) {
      // Even if they catch it, it does nothing! Pure UI pranking.
      setMessage("ERROR: BYPASS_DETECTED // EVASIVE_ACTION_INITIATED");
      // Do NOT set showConfetti
    }
  };

  return (
    <div className="red-packet-container cinema-root">
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
        className="rp-main-container cinema-container"
        initial={{ opacity: 0, y: 30 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 1, ease: [0.16, 1, 0.3, 1] }}
      >
        <header className="selection-header">
          <div className="cinema-eyebrow">
            <span className="dot"></span> CHAPTER THREE: THE CATCH
          </div>
          <h1 className="cinema-title">
            RED <span className="outline">PACKET</span>
          </h1>
          <div className="cinema-divider"></div>
        </header>

        <p className="rp-subtitle cinematic-text">{message}</p>

        <div
          className="rp-game-area"
          ref={containerRef}
          onMouseMove={handleMouseMove}
        >
          <div className="hearts-bg">
            {backgroundHearts.map((heart) => (
              <div
                key={heart.id}
                className="rp-heart"
                style={{
                  left: `${heart.left}%`,
                  animationDelay: `${heart.animationDelay}s`,
                  animationDuration: `${heart.animationDuration}s`,
                }}
              />
            ))}
          </div>

          <div className="rp-grid">
            {amounts.map((amt) => (
              <div key={amt.value} className="rp-btn-wrapper">
                <button
                  ref={(el) => (buttonRefs.current[amt.value] = el)}
                  className={`rp-btn ${shakingButtons[amt.value] ? "shake" : ""}`}
                  style={buttonStyles[amt.value] || {}}
                  // Initialize evasion on first hover for boss buttons
                  onMouseEnter={(e) => {
                    if (amt.value > 520 && !buttonStyles[amt.value]) {
                      const rect = containerRef.current.getBoundingClientRect();
                      moveButton(
                        amt.value,
                        e.clientX - rect.left,
                        e.clientY - rect.top,
                      );
                    }
                  }}
                  // Disable click interaction for > 520 to enforce "pure UI"
                  onClick={() => handleSelect(amt)}
                >
                  <span className="currency-symbol">RM</span>
                  <span>{amt.label}</span>
                </button>
              </div>
            ))}
          </div>
        </div>

        <footer className="cinema-footer">
          <div className="coords">20°F / 02.14</div>
          <div className="sequence">CATCH_SEQUENCE_ACTIVE // REFLEX_TEST</div>
        </footer>
      </motion.div>

      {showConfetti && (
        <div className="celebration-overlay">
          <div className="celebration-content">
            <h1 className="celebration-title">
              {"情人節快樂".split("").map((char, index) => (
                <span
                  key={index}
                  className="celebration-char"
                  style={{ animationDelay: `${index * 0.2}s` }}
                >
                  {char}
                </span>
              ))}
            </h1>
            <p className="celebration-text">
              Sending your gift<span className="loading-dots"></span>
            </p>
          </div>
        </div>
      )}
    </div>
  );
};

export default RedPacket;

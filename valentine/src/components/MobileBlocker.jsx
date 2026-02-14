import React, { useState, useEffect } from "react";
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
    <div className="mobile-blocker">
      <div className="mobile-content">
        <h1 className="mobile-title">Oops! Screen Too Small</h1>
        <p className="mobile-text">
          My love for you is too big to fit on this tiny screen! 💖
          <br />
          <br />
          Please open this on a laptop or computer to see the surprise!
        </p>
      </div>

      {/* Background Hearts */}
      <div className="hearts-bg" style={{ zIndex: -1 }}>
        {Array.from({ length: 10 }).map((_, i) => (
          <div
            key={i}
            className="heart"
            style={{
              left: `${Math.random() * 100}%`,
              animationDelay: `${Math.random() * 5}s`,
              animationDuration: `${3 + Math.random() * 4}s`,
              opacity: 0.5,
            }}
          />
        ))}
      </div>
    </div>
  );
};

export default MobileBlocker;

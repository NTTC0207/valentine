import React, { useState, useEffect } from "react";
import questions from "../data/questions.json";
import { motion, AnimatePresence } from "framer-motion";
import "./ValentineQuiz.css";

const ValentineQuiz = ({ onUnlock, onClose }) => {
  // State from LocalStorage or Default
  const [currentQuestionIdx, setCurrentQuestionIdx] = useState(() => {
    return parseInt(localStorage.getItem("val_quiz_index")) || 0;
  });

  const [penaltyEnd, setPenaltyEnd] = useState(() => {
    return parseInt(localStorage.getItem("val_quiz_penalty_end")) || 0;
  });

  const [wrongCount, setWrongCount] = useState(() => {
    return parseInt(localStorage.getItem("val_quiz_wrong_count")) || 0;
  });

  const [timeLeft, setTimeLeft] = useState(() => {
    const savedPenaltyEnd =
      parseInt(localStorage.getItem("val_quiz_penalty_end")) || 0;
    const now = Date.now();
    return savedPenaltyEnd > now
      ? Math.ceil((savedPenaltyEnd - now) / 1000)
      : 0;
  });
  const [isShake, setIsShake] = useState(false);

  // Timer Effect
  useEffect(() => {
    const updateTimer = () => {
      const now = Date.now();
      if (penaltyEnd > now) {
        setTimeLeft(Math.ceil((penaltyEnd - now) / 1000));
      } else {
        setTimeLeft(0);
      }
    };

    updateTimer();
    const timer = setInterval(updateTimer, 1000);
    return () => clearInterval(timer);
  }, [penaltyEnd]);

  // Persist State
  useEffect(() => {
    localStorage.setItem("val_quiz_index", currentQuestionIdx);
  }, [currentQuestionIdx]);

  useEffect(() => {
    localStorage.setItem("val_quiz_penalty_end", penaltyEnd);
  }, [penaltyEnd]);

  useEffect(() => {
    localStorage.setItem("val_quiz_wrong_count", wrongCount);
  }, [wrongCount]);

  const handleAnswer = (option) => {
    const currentQ = questions[currentQuestionIdx];

    if (option === currentQ.correctAnswer) {
      const nextIdx = currentQuestionIdx + 1;
      if (nextIdx >= questions.length) {
        onUnlock();
      } else {
        setCurrentQuestionIdx(nextIdx);
      }
    } else {
      triggerPenalty();
    }
  };

  const triggerPenalty = () => {
    const penaltySeconds = 60 * Math.pow(2, wrongCount);
    const newWrongCount = wrongCount + 1;

    setWrongCount(newWrongCount);
    setPenaltyEnd(Date.now() + penaltySeconds * 250);

    setIsShake(true);
    setTimeout(() => setIsShake(false), 500);
  };

  const progress = (currentQuestionIdx / questions.length) * 100;
  const currentQ = questions[currentQuestionIdx];

  if (!currentQ && currentQuestionIdx >= questions.length) {
    return null;
  }

  const formatTime = (seconds) => {
    const m = Math.floor(seconds / 60);
    const s = seconds % 60;
    return `${m}:${s.toString().padStart(2, "0")}`;
  };

  return (
    <motion.div
      className="quiz-overlay"
      onClick={onClose}
      initial={{ opacity: 0 }}
      animate={{ opacity: 1 }}
      exit={{ opacity: 0 }}
    >
      <motion.div
        className="quiz-card"
        onClick={(e) => e.stopPropagation()}
        initial={{ y: 50, opacity: 0 }}
        animate={{
          y: 0,
          opacity: 1,
          x: isShake ? [0, -10, 10, -10, 10, 0] : 0,
        }}
        transition={{
          type: "spring",
          stiffness: 300,
          damping: 25,
          x: { duration: 0.4 }, // Custom duration for the shake
        }}
      >
        <AnimatePresence>
          {timeLeft > 0 && (
            <motion.div
              className="penalty-overlay"
              initial={{ opacity: 0, scale: 0.9 }}
              animate={{ opacity: 1, scale: 1 }}
              exit={{ opacity: 0, scale: 0.9 }}
            >
              <span className="broken-heart">💔</span>
              <div className="penalty-text">Wrong answer! My heart hurts!</div>
              <div className="penalty-timer">{formatTime(timeLeft)}</div>
              <p
                style={{ marginTop: "1rem", fontSize: "0.9rem", opacity: 0.8 }}
              >
                Wait for the penalty to retry...
              </p>
            </motion.div>
          )}
        </AnimatePresence>

        <div className="quiz-header">
          <h2 className="quiz-title">
            Love Quiz {currentQuestionIdx + 1}/{questions.length}
          </h2>
          <div className="progress-container">
            <div
              className="progress-fill"
              style={{ width: `${progress}%` }}
            ></div>
          </div>
        </div>

        <div className="question-content">
          <p className="question-text">{currentQ?.question}</p>

          <div className="options-grid">
            {currentQ?.options.map((opt, i) => (
              <button
                key={i}
                className="option-btn"
                onClick={() => handleAnswer(opt)}
                disabled={timeLeft > 0}
              >
                {opt}
              </button>
            ))}
          </div>
        </div>
      </motion.div>
    </motion.div>
  );
};

export default ValentineQuiz;

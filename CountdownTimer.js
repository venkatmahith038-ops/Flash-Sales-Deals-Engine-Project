import React, { useState, useEffect } from "react";

const CountdownTimer = ({ endsIn, compact = false }) => {
  const calc = () => {
    const diff = Math.max(0, endsIn - Date.now());
    return {
      h: Math.floor(diff / 3600000),
      m: Math.floor((diff % 3600000) / 60000),
      s: Math.floor((diff % 60000) / 1000),
      dead: diff === 0,
    };
  };

  const [time, setTime] = useState(calc());

  useEffect(() => {
    const id = setInterval(() => setTime(calc()), 1000);
    return () => clearInterval(id);
  }, [endsIn]);

  const pad = (n) => String(n).padStart(2, "0");

  if (compact) {
    return (
      <span className={`timer-compact ${time.dead ? "dead" : time.h < 1 ? "urgent" : ""}`}>
        {time.dead ? "EXPIRED" : `${pad(time.h)}:${pad(time.m)}:${pad(time.s)}`}
      </span>
    );
  }

  return (
    <div className={`timer-block ${time.dead ? "dead" : time.h < 1 ? "urgent" : ""}`}>
      <div className="timer-unit">
        <span className="timer-num">{pad(time.h)}</span>
        <span className="timer-label">HRS</span>
      </div>
      <span className="timer-sep">:</span>
      <div className="timer-unit">
        <span className="timer-num">{pad(time.m)}</span>
        <span className="timer-label">MIN</span>
      </div>
      <span className="timer-sep">:</span>
      <div className="timer-unit">
        <span className="timer-num">{pad(time.s)}</span>
        <span className="timer-label">SEC</span>
      </div>
    </div>
  );
};

export default CountdownTimer;

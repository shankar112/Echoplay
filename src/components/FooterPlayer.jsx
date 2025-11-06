// src/components/FooterPlayer.jsx
import React, { useContext, useEffect, useState, useRef } from "react";
import { PlayerContext } from "../context/PlayerContext";
import "./footer-player.css";

export default function FooterPlayer() {
  const {
    audio,
    current,
    isPlaying,
    togglePlay,
    handleNext,
    handlePrev,
    positionRef,
    playIndex,
  } = useContext(PlayerContext);

  const [duration, setDuration] = useState(0);
  const [position, setPosition] = useState(0);
  const progressRef = useRef(null);

  // Attach audio events to update UI
  useEffect(() => {
    const a = audio?.audio;
    if (!a) return;

    const onTime = () => {
      setPosition(a.currentTime || 0);
    };

    const onMeta = () => {
      // some files report Infinity for duration until loaded — guard it
      const d = Number.isFinite(a.duration) ? a.duration : 0;
      setDuration(d);
    };

    // register
    a.addEventListener("timeupdate", onTime);
    a.addEventListener("loadedmetadata", onMeta);
    a.addEventListener("loadeddata", onMeta);

    // initial sync
    onTime();
    onMeta();

    return () => {
      a.removeEventListener("timeupdate", onTime);
      a.removeEventListener("loadedmetadata", onMeta);
      a.removeEventListener("loadeddata", onMeta);
    };
  }, [audio, current]);

  // update visual width
  useEffect(() => {
    if (!progressRef.current) return;
    if (!duration) {
      progressRef.current.style.width = "0%";
      return;
    }
    const pct = Math.max(0, Math.min(1, position / Math.max(1, duration)));
    progressRef.current.style.width = `${(pct * 100).toFixed(2)}%`;
  }, [position, duration]);

  // helpers
  function formatTime(s) {
    if (!s || !isFinite(s)) return "0:00";
    const sec = Math.floor(s % 60);
    const min = Math.floor(s / 60);
    return `${min}:${String(sec).padStart(2, "0")}`;
  }

  // click to seek on bar
  function onBarClick(e) {
    const bar = e.currentTarget;
    const rect = bar.getBoundingClientRect();
    const x = e.clientX - rect.left;
    const pct = Math.max(0, Math.min(1, x / rect.width));
    const t = (duration || 0) * pct;

    // use context setters if available
    if (audio?.seek) {
      audio.seek(t);
    } else if (audio?.audio) {
      audio.audio.currentTime = t;
    }
    // reflect immediately
    setPosition(t);
  }

  if (!current) return null; // hide if nothing queued

  return (
    <div className="footer-player" role="region" aria-label="Audio player">
      <div className="fp-left">
        <div className="fp-title" title={current.title || ""}>
          {current.title || "Untitled"}
        </div>
        <div className="fp-artist">{current.artist || ""}</div>
      </div>

      <div className="fp-controls">
        <button
          className="fp-btn"
          aria-label="Previous"
          onClick={handlePrev}
          title="Previous"
        >
          ⏮
        </button>

        <button
          className="fp-btn play"
          aria-label={isPlaying ? "Pause" : "Play"}
          onClick={togglePlay}
          title={isPlaying ? "Pause" : "Play"}
        >
          {isPlaying ? "⏸" : "▶"}
        </button>

        <button
          className="fp-btn"
          aria-label="Next"
          onClick={handleNext}
          title="Next"
        >
          ⏭
        </button>
      </div>

      <div className="fp-timeline" onClick={onBarClick} role="slider" aria-valuemin={0} aria-valuemax={Math.floor(duration || 0)} aria-valuenow={Math.floor(position || 0)}>
        <div className="fp-time-left">{formatTime(position)}</div>
        <div className="fp-bar" aria-hidden="true">
          <div className="fp-progress" ref={progressRef}></div>
        </div>
        <div className="fp-time-right">{formatTime(duration)}</div>
      </div>
    </div>
  );
}

// src/components/FooterPlayer.jsx (snippet / full component part)
import React, { useContext, useEffect, useState } from "react";
import { PlayerContext } from "../context/PlayerContext";

export default function FooterPlayer() {
  const { audio, current, isPlaying, togglePlay } = useContext(PlayerContext);
  const [duration, setDuration] = useState(0);
  const [position, setPosition] = useState(0);

  useEffect(() => {
    const a = audio?.audio;
    if (!a) return;

    const onTime = () => {
      setPosition(a.currentTime || 0);
    };

    const onMeta = () => {
      setDuration(a.duration || 0);
    };

    // register events
    a.addEventListener("timeupdate", onTime);
    a.addEventListener("loadedmetadata", onMeta);

    // cleanup
    return () => {
      a.removeEventListener("timeupdate", onTime);
      a.removeEventListener("loadedmetadata", onMeta);
    };
  }, [audio]);

  // rest of component render...
  return (
    <div className="footer-player">
      {/* playback controls */}
      <button onClick={togglePlay}>{isPlaying ? "Pause" : "Play"}</button>
      <div>{current?.title} — {current?.artist}</div>
      <div>{Math.floor(position)}/{Math.floor(duration)}</div>
    </div>
  );
}

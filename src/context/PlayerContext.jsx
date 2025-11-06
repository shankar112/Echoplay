// src/context/PlayerContext.jsx
import React, { createContext, useState, useEffect, useRef, useCallback } from "react";
import useAudio from "../hooks/useAudio";
import sampleSongs from "../data/songs.json";

export const PlayerContext = createContext();

export function PlayerProvider({ children }) {
  const audio = useAudio(); // audio.audio is a real audio element
  const [queue, setQueue] = useState(sampleSongs || []);
  const [currentIndex, setCurrentIndex] = useState(0);
  const [isPlaying, setIsPlaying] = useState(false);
  const positionRef = useRef(0);

  // Play a track at given index
  const playIndex = useCallback((index) => {
    if (!queue || queue.length === 0) return;
    const track = queue[index];
    if (!track) return;
    audio.setSrc(track.audio);
    audio.play().catch(() => {});
    setCurrentIndex(index);
    setIsPlaying(true);
  }, [audio, queue]);

  const togglePlay = useCallback(() => {
    if (isPlaying) {
      audio.pause();
      setIsPlaying(false);
    } else {
      audio.play().catch(() => {});
      setIsPlaying(true);
    }
  }, [audio, isPlaying]);

  const handleNext = useCallback(() => {
    if (!queue || queue.length === 0) return;
    const next = (currentIndex + 1) % queue.length;
    playIndex(next);
  }, [queue, currentIndex, playIndex]);

  const handlePrev = useCallback(() => {
    if (!queue || queue.length === 0) return;
    const prev = (currentIndex - 1 + queue.length) % queue.length;
    playIndex(prev);
  }, [queue, currentIndex, playIndex]);

  // Attach DOM audio events only when audio exists
  useEffect(() => {
    const a = audio?.audio;
    if (!a) return;

    const onEnded = () => {
      if (queue && queue.length > 0) {
        const next = (currentIndex + 1) % queue.length;
        playIndex(next);
      }
    };

    const onTime = () => {
      positionRef.current = a.currentTime;
    };

    a.addEventListener("ended", onEnded);
    a.addEventListener("timeupdate", onTime);

    return () => {
      a.removeEventListener("ended", onEnded);
      a.removeEventListener("timeupdate", onTime);
    };
  }, [audio, queue, currentIndex, playIndex]);

  return (
    <PlayerContext.Provider
      value={{
        queue,
        setQueue,
        currentIndex,
        current: queue[currentIndex],
        isPlaying,
        playIndex,
        togglePlay,
        handleNext,
        handlePrev,
        audio,
        positionRef,
      }}
    >
      {children}
    </PlayerContext.Provider>
  );
}

// src/context/PlayerContext.jsx
import React, { createContext, useState, useEffect, useRef } from "react";
import useAudio from "../hooks/useAudio";
import sampleSongs from "../data/songs.json";

export const PlayerContext = createContext();

export function PlayerProvider({ children }) {
  const audio = useAudio();
  const [queue, setQueue] = useState(sampleSongs || []);
  const [currentIndex, setCurrentIndex] = useState(0);
  const [isPlaying, setIsPlaying] = useState(false);
  const positionRef = useRef(0);

  // playIndex uses current audio ref and updates state
  function playIndex(index) {
    const track = queue[index];
    if (!track) return;
    audio.setSrc(track.audio);
    audio
      .play()
      .catch(() => {
        // ignore play errors (autoplay / user gesture)
      });
    setCurrentIndex(index);
    setIsPlaying(true);
  }

  function togglePlay() {
    if (isPlaying) {
      audio.pause();
      setIsPlaying(false);
    } else {
      audio
        .play()
        .catch(() => {
          /* ignore */
        });
      setIsPlaying(true);
    }
  }

  function handleNext() {
    if (!queue || queue.length === 0) return;
    const next = (currentIndex + 1) % queue.length;
    playIndex(next);
  }

  function handlePrev() {
    if (!queue || queue.length === 0) return;
    const prev = (currentIndex - 1 + queue.length) % queue.length;
    playIndex(prev);
  }

  // Attach DOM audio events in a robust way
  useEffect(() => {
    const a = audio?.audio;
    if (!a) {
      console.debug("PlayerContext: audio not available yet", audio);
      return;
    }

    // Debugging info (remove later)
    // console.debug("PlayerContext: audio shape", { a, hasAdd: typeof a.addEventListener === "function" });

    const onEnded = () => {
      if (queue.length > 0) {
        const next = (currentIndex + 1) % queue.length;
        playIndex(next);
      }
    };

    const onTime = () => {
      if (typeof a.currentTime === "number") {
        positionRef.current = a.currentTime;
      }
    };

    const isHtmlAudio = typeof a.addEventListener === "function";

    if (isHtmlAudio) {
      a.addEventListener("ended", onEnded);
      a.addEventListener("timeupdate", onTime);
    } else {
      // fallback: set handlers directly if supported
      try {
        a.onended = onEnded;
        a.ontimeupdate = onTime;
      } catch (e) {
        console.warn("PlayerContext: audio object doesn't support addEventListener or onended - event wiring skipped", e);
      }
    }

    return () => {
      if (isHtmlAudio) {
        a.removeEventListener("ended", onEnded);
        a.removeEventListener("timeupdate", onTime);
      } else {
        try {
          if (a.onended === onEnded) a.onended = null;
          if (a.ontimeupdate === onTime) a.ontimeupdate = null;
        } catch (e) {}
      }
    };
  }, [audio, queue, currentIndex]); // keep these deps so we respond to index/queue changes

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

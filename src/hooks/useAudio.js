// src/hooks/useAudio.js
import { useEffect, useRef, useCallback } from "react";

export default function useAudio() {
  // Create the audio element synchronously (so consumers can use it immediately)
  const audioRef = useRef(typeof window !== "undefined" ? document.createElement("audio") : null);

  // Configure audio element once on mount
  useEffect(() => {
    const a = audioRef.current;
    if (!a) return;

    a.preload = "metadata";
    // keep the element alive across component unmounts so player persists
    return () => {
      // Optionally pause on unmount:
      // try { a.pause(); } catch (e) {}
    };
  }, []);

  const setSrc = useCallback((src) => {
    const a = audioRef.current;
    if (!a) return;
    try {
      const newHref = new URL(src, window.location.href).href;
      if (a.src !== newHref) a.src = src;
    } catch (e) {
      // fallback if src is already absolute or URL() fails
      if (a.src !== src) a.src = src;
    }
  }, []);

  const play = useCallback(() => {
    const a = audioRef.current;
    if (!a) return Promise.reject();
    return a.play();
  }, []);

  const pause = useCallback(() => {
    const a = audioRef.current;
    if (!a) return;
    a.pause();
  }, []);

  const seek = useCallback((t) => {
    const a = audioRef.current;
    if (!a) return;
    a.currentTime = t;
  }, []);

  const setVolume = useCallback((v) => {
    const a = audioRef.current;
    if (!a) return;
    a.volume = Math.max(0, Math.min(1, v));
  }, []);

  return {
    audio: audioRef.current || null,
    setSrc,
    play,
    pause,
    seek,
    setVolume,
  };
}

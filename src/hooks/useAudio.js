// src/hooks/useAudio.js
import { useEffect, useRef, useCallback } from "react";

export default function useAudio() {
  const audioRef = useRef(null);

  // Ensure the audio element exists synchronously so consumers can use it
  if (!audioRef.current && typeof window !== "undefined") {
    const a = document.createElement("audio");
    a.preload = "metadata";
    audioRef.current = a;
  }

  useEffect(() => {
    // Optional: you can keep this effect for cleanup if you prefer
    return () => {
      // If you want to cleanup on unmount, uncomment:
      // if (audioRef.current) {
      //   audioRef.current.pause();
      //   audioRef.current.src = "";
      // }
    };
  }, []);

  const setSrc = useCallback((src) => {
    const a = audioRef.current;
    if (!a || !src) return;
    try {
      const newHref = new URL(src, window.location.href).href;
      if (a.src !== newHref) {
        a.src = src;
      }
    } catch (err) {
      // if src is relative or invalid, still set
      a.src = src;
    }
  }, []);

  const play = useCallback(() => {
    const a = audioRef.current;
    if (!a) return Promise.reject(new Error("No audio element"));
    try {
      return a.play();
    } catch (err) {
      return Promise.reject(err);
    }
  }, []);

  const pause = useCallback(() => {
    const a = audioRef.current;
    if (!a) return;
    try {
      a.pause();
    } catch (_) {}
  }, []);

  const seek = useCallback((t) => {
    const a = audioRef.current;
    if (!a) return;
    try {
      a.currentTime = t;
    } catch (_) {}
  }, []);

  const setVolume = useCallback((v) => {
    const a = audioRef.current;
    if (!a) return;
    try {
      a.volume = Math.max(0, Math.min(1, v));
    } catch (_) {}
  }, []);

  return {
    audio: audioRef.current,
    setSrc,
    play,
    pause,
    seek,
    setVolume,
  };
}

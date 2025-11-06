/* eslint-disable react-refresh/only-export-components */
import React, { createContext, useState, useEffect, useRef, useCallback } from "react";
import useAudio from "../hooks/useAudio";
import sampleSongs from "../data/songs.json";

const STORAGE_KEY = "echoplay:player";

export const PlayerContext = createContext();

function readStorage() {
  try {
    const raw = localStorage.getItem(STORAGE_KEY);
    if (!raw) return null;
    return JSON.parse(raw);
  } catch (e) {
    console.warn("Failed to read player storage", e);
    return null;
  }
}

function writeStorage(payload) {
  try {
    localStorage.setItem(STORAGE_KEY, JSON.stringify(payload));
  } catch (e) {
    console.warn("Failed to read player storage", e);
    // ignore
  }
}

export function PlayerProvider({ children }) {
  const audio = useAudio();

  // initial state: try to restore
  const saved = readStorage();

  const [queue, setQueue] = useState(saved?.queue ?? sampleSongs);
  const [currentIndex, setCurrentIndex] = useState(saved?.currentIndex ?? 0);
  const [isPlaying, setIsPlaying] = useState(false);
  const [shuffle, setShuffle] = useState(saved?.shuffle ?? false);
  const [repeat, setRepeat] = useState(saved?.repeat ?? "off");
  const [volume, setVolume] = useState(saved?.volume ?? 0.9);

  const positionRef = useRef(0);

  // persist when these change (debounced-ish using effect)
  useEffect(() => {
    const toSave = { queue, currentIndex, shuffle, repeat, volume };
    // small debounce
    const id = setTimeout(() => writeStorage(toSave), 120);
    return () => clearTimeout(id);
  }, [queue, currentIndex, shuffle, repeat, volume]);

  // sync volume to native audio
  useEffect(() => {
    audio.setVolume(volume);
  }, [audio, volume]);

  const playIndex = useCallback((index) => {
    const track = queue[index];
    if (!track) return;
    audio.setSrc(track.audio);
    audio.play().catch(() => {});
    setCurrentIndex(index);
    setIsPlaying(true);
  }, [audio, queue]);

  const enqueue = useCallback((track) => {
    setQueue((q) => [...q, track]);
  }, []);

  const handleNext = useCallback(() => {
    if (!queue || queue.length === 0) return;

    if (shuffle) {
      if (queue.length === 1) { playIndex(0); return; }
      let next;
      do { next = Math.floor(Math.random() * queue.length); } while (next === currentIndex);
      playIndex(next);
      return;
    }

    if (repeat === "one") {
      playIndex(currentIndex);
      return;
    }

    const next = (currentIndex + 1) % queue.length;
    if (next === 0 && repeat === "off" && currentIndex === queue.length - 1) {
      audio.pause();
      setIsPlaying(false);
      return;
    }
    playIndex(next);
  }, [audio, queue, currentIndex, shuffle, repeat, playIndex]);

  const handlePrev = useCallback(() => {
    if (!queue || queue.length === 0) return;
    const prev = (currentIndex - 1 + queue.length) % queue.length;
    playIndex(prev);
  }, [queue, currentIndex, playIndex]);

  const togglePlay = useCallback(() => {
    if (isPlaying) {
      audio.pause();
      setIsPlaying(false);
    } else {
      audio.play().catch(() => {});
      setIsPlaying(true);
    }
  }, [audio, isPlaying]);

  // wire audio events to control next and position
  useEffect(() => {
    const a = audio.audio;
    const onEnded = () => handleNext();
    const onTimeUpdate = () => { positionRef.current = a.currentTime; };
    a.addEventListener?.("ended", onEnded);
    a.addEventListener?.("timeupdate", onTimeUpdate);
    return () => {
      a.removeEventListener?.("ended", onEnded);
      a.removeEventListener?.("timeupdate", onTimeUpdate);
    };
  }, [audio, handleNext]);

  // ensure src matches currentIndex (restore state)
  useEffect(() => {
    const track = queue[currentIndex];
    if (track) {
      const trackHref = new URL(track.audio, window.location.href).href;
      if (audio.audio.src !== trackHref) {
        audio.setSrc(track.audio);
        // if previously was playing, attempt resume
        if (isPlaying) audio.play().catch(() => {});
      }
    }
  }, [audio, currentIndex, queue, isPlaying]);

  return (
    <PlayerContext.Provider value={{
      queue, setQueue,
      currentIndex,
      current: queue[currentIndex],
      isPlaying,
      playIndex, togglePlay, handleNext, handlePrev,
      enqueue,
      shuffle, setShuffle,
      repeat, setRepeat,
      volume, setVolume,
      audio
    }}>
      {children}
    </PlayerContext.Provider>
  );
}

// basic single audio element manager
import { useEffect, useRef } from "react";

export default function useAudio() {
  const ref = useRef(null);

  if (!ref.current) {
    ref.current = new Audio();
    ref.current.preload = "metadata";
    ref.current.crossOrigin = "anonymous";
  }

  useEffect(() => {
    const audio = ref.current;
    return () => {
      audio.pause();
      audio.src = "";
    };
  }, []);

  return {
    get audio() { return ref.current; },
    setSrc: (src) => { ref.current.src = src; },
    play: () => ref.current.play(),
    pause: () => ref.current.pause(),
    seek: (t) => { ref.current.currentTime = t; },
    setVolume: (v) => { ref.current.volume = v; },
    on: (event, cb) => { ref.current[`on${event}`] = cb; },
  };
}

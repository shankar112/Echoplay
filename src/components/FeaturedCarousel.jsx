// src/components/FeaturedCarousel.jsx
import React, { useMemo, useRef, useEffect } from "react";
import { Box, IconButton } from "@mui/material";
import ArrowBackIosNewIcon from "@mui/icons-material/ArrowBackIosNew";
import ArrowForwardIosIcon from "@mui/icons-material/ArrowForwardIos";
import TrackCard from "./TrackCard";

export default function FeaturedCarousel({ items = [], onOpen = ()=>{}, onPlay = ()=>{} }) {
  const wrapRef = useRef(null);
  const angleStep = useMemo(() => (items.length ? 360 / items.length : 0), [items.length]);
  const radius = 420;

  useEffect(() => {
    const el = wrapRef.current;
    if (!el) return;
    let angle = 0;
    let raf;
    const tick = () => {
      angle = (angle + 0.08) % 360;
      el.style.transform = `rotateY(${angle}deg)`;
      raf = requestAnimationFrame(tick);
    };
    raf = requestAnimationFrame(tick);
    return () => cancelAnimationFrame(raf);
  }, []);

  const rotateBy = (deg) => {
    if (!wrapRef.current) return;
    const cur = wrapRef.current.style.transform || "rotateY(0deg)";
    const m = cur.match(/rotateY\(([-\d.]+)deg\)/);
    const curAngle = m ? parseFloat(m[1]) : 0;
    wrapRef.current.style.transform = `rotateY(${curAngle + deg}deg)`;
  };

  return (
    <Box sx={{ position: "relative", perspective: 1400, height: 280, my: 3 }}>
      <Box
        ref={wrapRef}
        sx={{ transformStyle: "preserve-3d", transition: "transform 0.6s ease-out", height: "100%" }}
      >
        {items.map((it, i) => {
          const rotation = i * angleStep; // degrees around Y
          // Use the standard rotateY(angle) translateZ(radius) ordering so each panel
          // faces outward correctly on the cylinder. This prevents mirrored/backface
          // issues compared to computing x/z manually.
          const transform = `translateX(-50%) rotateY(${rotation}deg) translateZ(${radius}px)`;

          return (
            <Box
              key={it.id}
              sx={{
                position: "absolute",
                left: "50%",
                top: 16,
                width: 220,
                transform,
                transformStyle: "preserve-3d",
                // Hide the backface so cards behind the cylinder don't show mirrored content
                backfaceVisibility: "hidden",
                WebkitBackfaceVisibility: "hidden",
              }}
            >
              <TrackCard track={it} onOpen={() => onOpen(it)} onPlay={() => onPlay(it)} />
            </Box>
          );
        })}
      </Box>

      <IconButton onClick={() => rotateBy(-angleStep * 1.5)} aria-label="prev" sx={{ position: "absolute", left: 8, top: "45%", bgcolor: "background.paper" }}>
        <ArrowBackIosNewIcon />
      </IconButton>
      <IconButton onClick={() => rotateBy(angleStep * 1.5)} aria-label="next" sx={{ position: "absolute", right: 8, top: "45%", bgcolor: "background.paper" }}>
        <ArrowForwardIosIcon />
      </IconButton>
    </Box>
  );
}

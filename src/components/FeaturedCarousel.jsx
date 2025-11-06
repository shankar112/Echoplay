// src/components/FeaturedCarousel.jsx
import React, { useMemo, useRef, useEffect } from "react";
import { Box, IconButton } from "@mui/material";
import ArrowBackIosNewIcon from "@mui/icons-material/ArrowBackIosNew";
import ArrowForwardIosIcon from "@mui/icons-material/ArrowForwardIos";
import TrackCard from "./TrackCard";

export default function FeaturedCarousel({ items = [], onOpen = () => {}, onPlay = () => {} }) {
  const wrapRef = useRef(null);
  const angleStep = useMemo(() => (items.length ? 360 / items.length : 0), [items.length]);
  const radius = 420; // tune: bigger = flatter cylinder

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

  // manual rotate helpers
  const rotateBy = (deg) => {
    if (!wrapRef.current) return;
    const current = wrapRef.current.style.transform || "rotateY(0deg)";
    const m = current.match(/rotateY\(([-\d.]+)deg\)/);
    const curAngle = m ? parseFloat(m[1]) : 0;
    wrapRef.current.style.transform = `rotateY(${curAngle + deg}deg)`;
  };

  return (
    <Box sx={{ position: "relative", perspective: 1400, height: 280, my: 3 }}>
      <Box
        ref={wrapRef}
        sx={{
          transformStyle: "preserve-3d",
          transition: "transform 0.6s ease-out",
          height: "100%",
          display: "block"
        }}
      >
        {items.map((it, i) => {
          const rotation = i * angleStep;
          const rad = (rotation * Math.PI) / 180;
          const x = Math.sin(rad) * radius;
          const z = Math.cos(rad) * radius;
          // rotateY so face outward; translateZ negative to push back
          return (
            <Box
              key={it.id}
              sx={{
                position: "absolute",
                left: "50%",
                top: 16,
                width: 220,
                transform: `translateX(-50%) translate3d(${x}px, 0, ${-z}px) rotateY(${rotation}deg)`,
                transformStyle: "preserve-3d",
                willChange: "transform",
              }}
            >
              <TrackCard track={it} onOpen={onOpen} onPlay={onPlay} />
            </Box>
          );
        })}
      </Box>

      {/* left/right controls */}
      <IconButton
        onClick={() => rotateBy(-angleStep * 1.5)}
        aria-label="prev"
        sx={{ position: "absolute", left: 8, top: "45%", bgcolor: "background.paper", zIndex: 10 }}
      >
        <ArrowBackIosNewIcon />
      </IconButton>
      <IconButton
        onClick={() => rotateBy(angleStep * 1.5)}
        aria-label="next"
        sx={{ position: "absolute", right: 8, top: "45%", bgcolor: "background.paper", zIndex: 10 }}
      >
        <ArrowForwardIosIcon />
      </IconButton>
    </Box>
  );
}

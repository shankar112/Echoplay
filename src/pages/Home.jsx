// src/pages/Home.jsx
import React, { useContext } from "react";
import { Box, Typography } from "@mui/material";
import FeaturedCarousel from "../components/FeaturedCarousel";
import songs from "../data/songs.json";
import { PlayerContext } from "../context/PlayerContext";
import { useNavigate } from "react-router-dom";

export default function Home() {
  const featured = songs.slice(0, Math.min(8, songs.length));
  const { queue, setQueue, playIndex } = useContext(PlayerContext);
  const navigate = useNavigate();

  const openDetail = (t) => navigate(`/track/${t.id}`);

  const playTrack = (t) => {
    const idx = queue.findIndex(q => q.id === t.id);
    if (idx >= 0) {
      playIndex(idx);
    } else {
      setQueue(prev => {
        const next = [t, ...prev];
        setTimeout(() => playIndex(0), 60);
        return next;
      });
    }
  };

  return (
    <Box>
      <Typography variant="h4" gutterBottom>Featured</Typography>
      <FeaturedCarousel items={featured} onOpen={openDetail} onPlay={playTrack} />
      <Typography variant="body2" color="text.secondary">Browse / Music pages for full listing.</Typography>
    </Box>
  );
}

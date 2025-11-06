// src/pages/Home.jsx
import React from "react";
import FeaturedCarousel from "../components/FeaturedCarousel";
import songs from "../data/songs.json";
import { useNavigate } from "react-router-dom";
import { Box, Typography } from "@mui/material";
import { useContext } from "react";
import { PlayerContext } from "../context/PlayerContext";

export default function Home() {
  const featured = songs.slice(0, 8); // pick top 8 (edit as needed)
  const navigate = useNavigate();
  const { playIndex, queue, setQueue } = useContext(PlayerContext);

  const openDetail = (t) => navigate(`/track/${t.id}`);

  const playTrack = (track) => {
    const idx = queue.findIndex((q) => q.id === track.id);
    if (idx >= 0) return playIndex(idx);
    setQueue((prev) => {
      const next = [track, ...prev];
      // play new first item
      setTimeout(() => playIndex(0), 60);
      return next;
    });
  };

  return (
    <Box>
      <Typography variant="h3" gutterBottom>Featured</Typography>
      <FeaturedCarousel items={featured} onOpen={openDetail} onPlay={playTrack} />

      {/* You can add other home content here */}
    </Box>
  );
}

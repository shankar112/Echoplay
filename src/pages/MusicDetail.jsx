// src/pages/MusicDetail.jsx
import React, { useContext } from "react";
import { useParams } from "react-router-dom";
import songs from "../data/songs.json";
import { PlayerContext } from "../context/PlayerContext";
import { Box, Typography, Button, Grid } from "@mui/material";

export default function MusicDetail() {
  const { id } = useParams();
  const track = songs.find(s => s.id === id);
  const { queue, setQueue, playIndex } = useContext(PlayerContext);

  if (!track) return <Typography>Track not found.</Typography>;

  const idx = queue.findIndex(t => t.id === track.id);

  return (
    <Grid container spacing={2}>
      <Grid item md={4}>
        <img src={track.cover} alt={track.title} style={{ width: "100%", borderRadius: 8 }} />
      </Grid>
      <Grid item md={8}>
        <Typography variant="h4">{track.title}</Typography>
        <Typography variant="subtitle1" color="text.secondary">{track.artist}</Typography>
        <Typography paragraph>{track.description || track.credits || ""}</Typography>

        <Box sx={{ display: "flex", gap: 1 }}>
          <Button variant="contained" onClick={() => {
            if (idx >= 0) playIndex(idx);
            else {
              setQueue(prev => {
                const next = [track, ...prev];
                setTimeout(() => playIndex(0), 60);
                return next;
              });
            }
          }}>Play Now</Button>

          <Button variant="outlined" onClick={() => setQueue(prev => [...prev, track])}>Add to Queue</Button>
        </Box>
      </Grid>
    </Grid>
  );
}

import React, { useContext } from "react";
import { useParams } from "react-router-dom";
import { Box, Typography, Button, Grid } from "@mui/material";
import songs from "../data/songs.json";
import { PlayerContext } from "../context/PlayerContext";

export default function MusicDetail() {
  const { id } = useParams();
  const track = songs.find(s => s.id === id);
  const { playIndex, queue, setQueue, enqueue } = useContext(PlayerContext);

  if (!track) return <Typography>Track not found.</Typography>;

  const idx = queue.findIndex(t => t.id === track.id);

  return (
    <Grid container spacing={2}>
      <Grid item md={4}>
        <img src={track.cover} alt={track.title} style={{ width: "100%", borderRadius: 8 }} />
      </Grid>
      <Grid item md={8}>
        <Typography variant="h4">{track.title}</Typography>
        <Typography variant="subtitle1">{track.artist}</Typography>
        <Typography paragraph>{track.description || "No description provided."}</Typography>

        <Box sx={{ display: "flex", gap: 1 }}>
          <Button variant="contained" color="primary" onClick={() => {
            if (idx >= 0) {
              playIndex(idx);
            } else {
              setQueue((q) => {
                const newQ = [track, ...q];
                setTimeout(() => playIndex(0), 50);
                return newQ;
              });
            }
          }}>Play Now</Button>

          <Button variant="outlined" onClick={() => enqueue(track)}>Add to Queue</Button>
        </Box>
      </Grid>
    </Grid>
  );
}

// src/pages/MusicList.jsx
import React, { useMemo, useState, useContext } from "react";
import songs from "../data/songs.json";
import { PlayerContext } from "../context/PlayerContext";
import { Grid, Box, Typography, TextField, MenuItem } from "@mui/material";
import TrackCard from "../components/TrackCard";
import { useNavigate } from "react-router-dom";

export default function MusicList() {
  const [q, setQ] = useState("");
  const [genre, setGenre] = useState("all");
  const { queue, setQueue, playIndex } = useContext(PlayerContext);
  const navigate = useNavigate();

  const genres = useMemo(() => ["all", ...Array.from(new Set(songs.map(s => s.genre || "Other")))], []);

  const filtered = useMemo(() => songs.filter(s => {
    const condQ = !q || `${s.title} ${s.artist}`.toLowerCase().includes(q.toLowerCase());
    const condG = genre === "all" || (s.genre || "").toLowerCase() === genre.toLowerCase();
    return condQ && condG;
  }), [q, genre]);

  const handlePlay = (t) => {
    const idx = queue.findIndex(x => x.id === t.id);
    if (idx >= 0) return playIndex(idx);
    setQueue(prev => {
      const next = [...prev, t];
      setTimeout(() => playIndex(next.length - 1), 60);
      return next;
    });
  };

  return (
    <Box>
      <Typography variant="h4" gutterBottom>All Music</Typography>

      <Box sx={{ display: "flex", gap: 2, mb: 2 }}>
        <TextField size="small" label="Search" value={q} onChange={e => setQ(e.target.value)} />
        <TextField select size="small" label="Genre" value={genre} onChange={e => setGenre(e.target.value)}>
          {genres.map(g => <MenuItem key={g} value={g}>{g}</MenuItem>)}
        </TextField>
      </Box>

      <Grid container spacing={2}>
        {filtered.map(t => (
          <Grid item xs={12} sm={6} md={4} lg={3} key={t.id}>
            <TrackCard track={t} onPlay={() => handlePlay(t)} onOpen={() => navigate(`/track/${t.id}`)} />
          </Grid>
        ))}
      </Grid>
    </Box>
  );
}

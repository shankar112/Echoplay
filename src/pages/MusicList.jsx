import React, { useMemo, useState, useContext } from "react";
import { Grid, Box, Typography } from "@mui/material";
import SearchBar from "../components/SearchBar";
import Filters from "../components/Filters";
import TrackCard from "../components/TrackCard";
import songsData from "../data/songs.json";
import { PlayerContext } from "../context/PlayerContext";

export default function MusicList() {
  const [q, setQ] = useState("");
  const [genre, setGenre] = useState(null);
  const { queue, setQueue, playIndex, enqueue } = useContext(PlayerContext);

  const genres = useMemo(() => Array.from(new Set(songsData.map(s => s.genre))).slice(0, 8), []);

  const filtered = useMemo(() => {
    return songsData.filter(s => {
      const matchesQ = !q || `${s.title} ${s.artist}`.toLowerCase().includes(q.toLowerCase());
      const matchesGenre = !genre || s.genre === genre;
      return matchesQ && matchesGenre;
    });
  }, [q, genre]);

  const handlePlayTrack = (track) => {
    // if track exists in queue, play its index; else push and play last index
    const idx = queue.findIndex(t => t.id === track.id);
    if (idx >= 0) {
      playIndex(idx);
    } else {
      // append and play
      setQueue((prev) => {
        const next = [...prev, track];
        // setQueue is synchronous here but playIndex uses next state only later; to be safe play newly added at end:
        setTimeout(() => playIndex(next.length - 1), 50);
        return next;
      });
    }
  };

  return (
    <Box>
      <Typography variant="h4" gutterBottom>All Music</Typography>
      <SearchBar value={q} onChange={setQ} />
      <Filters genres={genres} active={genre} onToggle={setGenre} />

      <Grid container spacing={2}>
        {filtered.map((t, idx) => (
          <Grid item xs={12} sm={6} md={4} lg={3} key={t.id}>
            <TrackCard
              track={t}
              onOpen={() => window.location.href = `/track/${t.id}`}
              onPlay={() => handlePlayTrack(t)}
            />
          </Grid>
        ))}
      </Grid>
    </Box>
  );
}

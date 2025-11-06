import React from "react";
import { useParams } from "react-router-dom";
import { Typography, List } from "@mui/material";
import songs from "../data/songs.json";
import TrackRow from "../components/TrackRow";

export default function Album() {
  const { id } = useParams();
  const albumTracks = songs.filter(s => s.albumId === id);
  return (
    <>
      <Typography variant="h4" gutterBottom>Album {id}</Typography>
      <List>
        {albumTracks.map((t, idx) => <TrackRow key={t.id} track={t} index={idx} />)}
      </List>
    </>
  );
}

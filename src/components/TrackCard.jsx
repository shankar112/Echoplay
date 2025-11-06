import React from "react";
import { Card, CardMedia, CardContent, Typography, CardActionArea, Box, Button } from "@mui/material";
import PlayArrow from "@mui/icons-material/PlayArrow";

export default function TrackCard({ track, onOpen, onPlay }) {
  return (
    <Card sx={{ height: "100%", bgcolor: "rgba(255,255,255,0.02)" }}>
      <CardActionArea onClick={() => onOpen(track)}>
        <CardMedia component="img" height="180" image={track.cover} alt={track.title} />
        <CardContent>
          <Typography variant="h6">{track.title}</Typography>
          <Typography variant="body2" color="text.secondary">{track.artist}</Typography>
        </CardContent>
      </CardActionArea>
      <Box sx={{ display: "flex", gap: 1, p: 1 }}>
        <Button size="small" startIcon={<PlayArrow />} onClick={() => onPlay(track)}>Play</Button>
        <Button size="small" onClick={() => onOpen(track)}>Details</Button>
      </Box>
    </Card>
  );
}

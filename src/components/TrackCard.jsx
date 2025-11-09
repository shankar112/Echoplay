// src/components/TrackCard.jsx
import React from "react";
import { Card, CardMedia, CardContent, Typography, Button, Box } from "@mui/material";

export default function TrackCard({ track, onPlay=()=>{}, onOpen=()=>{} }) {
  return (
    <Card
      sx={{
        width: 220,
        borderRadius: 2,
        overflow: "hidden",
        // Ensure the card's front face is used and the backface is hidden when rotated
        transformStyle: "preserve-3d",
        backfaceVisibility: "hidden",
        WebkitBackfaceVisibility: "hidden",
      }}
    >
      <CardMedia
        component="img"
        height="140"
        image={track.cover}
        alt={track.title}
        onError={(e) => { e.target.src = "/media/covers/fallback.jpg"; }}
      />
      <CardContent sx={{ py: 1.5 }}>
        <Typography variant="h6" sx={{ fontSize: 16 }}>{track.title}</Typography>
        <Typography variant="body2" color="text.secondary">{track.artist}</Typography>
        <Box sx={{ display: "flex", gap: 1, mt: 1 }}>
          <Button size="small" onClick={() => onPlay(track)}>Play</Button>
          <Button size="small" onClick={() => onOpen(track)}>Open</Button>
        </Box>
      </CardContent>
    </Card>
  );
}

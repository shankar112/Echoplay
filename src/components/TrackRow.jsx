import React, { useContext } from "react";
import { PlayerContext } from "../context/PlayerContext";
import { ListItem, ListItemText, IconButton, ListItemAvatar, Avatar } from "@mui/material";
import PlayArrowIcon from "@mui/icons-material/PlayArrow";

export default function TrackRow({ track, index }) {
  const { playIndex } = useContext(PlayerContext);
  return (
    <ListItem secondaryAction={
      <IconButton edge="end" aria-label="play" onClick={() => playIndex(index)}>
        <PlayArrowIcon />
      </IconButton>
    }>
      <ListItemAvatar>
        <Avatar src={track.cover} variant="rounded" />
      </ListItemAvatar>
      <ListItemText primary={track.title} secondary={`${track.artist} • ${Math.floor(track.duration/60)}:${String(track.duration%60).padStart(2,"0")}`} />
    </ListItem>
  );
}

import React, { useContext, useEffect, useState } from "react";
import { PlayerContext } from "../context/PlayerContext";
import { Paper, IconButton, Box, Typography, Slider, Tooltip } from "@mui/material";
import PlayArrow from "@mui/icons-material/PlayArrow";
import Pause from "@mui/icons-material/Pause";
import SkipNext from "@mui/icons-material/SkipNext";
import SkipPrevious from "@mui/icons-material/SkipPrevious";
import ShuffleIcon from "@mui/icons-material/Shuffle";
import RepeatIcon from "@mui/icons-material/Repeat";
import VolumeUp from "@mui/icons-material/VolumeUp";

export default function FooterPlayer() {
  const {
    current, isPlaying, togglePlay, handleNext, handlePrev, audio,
    shuffle, setShuffle, repeat, setRepeat, volume, setVolume
  } = useContext(PlayerContext);

  const [pos, setPos] = useState(0);
  const [dur, setDur] = useState(0);

  useEffect(() => {
    const a = audio.audio;
    const onTime = () => setPos(a.currentTime);
    const onLoaded = () => setDur(a.duration || 0);
    a.addEventListener?.("timeupdate", onTime);
    a.addEventListener?.("loadedmetadata", onLoaded);
    return () => {
      a.removeEventListener?.("timeupdate", onTime);
      a.removeEventListener?.("loadedmetadata", onLoaded);
    };
  }, [audio, current]);

  const handleSeek = (_, val) => {
    audio.seek(val);
    setPos(val);
  };

  const formatTime = (s = 0) => {
    if (isNaN(s) || !isFinite(s)) return "00:00";
    const m = Math.floor(s / 60), sec = Math.floor(s % 60);
    return `${String(m).padStart(2,"0")}:${String(sec).padStart(2,"0")}`;
  };

  const toggleRepeatMode = () => {
    const order = ["off", "all", "one"]; // cycle
    const idx = order.indexOf(repeat);
    setRepeat(order[(idx + 1) % order.length]);
  };

  return (
    <Paper elevation={8} sx={{ position: "fixed", bottom: 12, left: 16, right: 16, p: 2, display: "flex", alignItems: "center", gap: 2 }}>
      <IconButton onClick={() => setShuffle(!shuffle)} color={shuffle ? "primary" : "default"}><ShuffleIcon /></IconButton>
      <IconButton onClick={handlePrev}><SkipPrevious /></IconButton>
      <IconButton color="primary" onClick={togglePlay} sx={{ bgcolor: "transparent" }}>
        {isPlaying ? <Pause sx={{ fontSize: 34 }} /> : <PlayArrow sx={{ fontSize: 34 }} />}
      </IconButton>
      <IconButton onClick={handleNext}><SkipNext /></IconButton>
      <IconButton onClick={toggleRepeatMode} color={repeat === "off" ? "default" : "primary"}>
        <RepeatIcon />
      </IconButton>

      <Box sx={{ flex: 1, mx: 2 }}>
        <Typography variant="subtitle2" noWrap sx={{ mb: 0.5 }}>
          {current ? `${current.title} — ${current.artist}` : "No track selected"}
        </Typography>

        <Slider
          min={0}
          max={Math.max(0, dur)}
          value={pos}
          onChange={handleSeek}
          size="small"
          aria-label="progress"
        />
      </Box>

      <Typography variant="caption" sx={{ width: 56, textAlign: "right" }}>
        {formatTime(pos)}
      </Typography>

      <Box sx={{ display: "flex", alignItems: "center", ml: 2, width: 180 }}>
        <VolumeUp sx={{ mr: 1 }} />
        <Slider min={0} max={1} step={0.01} value={volume} onChange={(_, v) => setVolume(v)} />
      </Box>
    </Paper>
  );
}

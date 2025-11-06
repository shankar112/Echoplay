import React from "react";
import { Box, Chip } from "@mui/material";

export default function Filters({ genres = [], active, onToggle }) {
  return (
    <Box sx={{ display: "flex", gap: 1, flexWrap: "wrap", my: 2 }}>
      <Chip label="All" clickable color={!active ? "primary" : "default"} onClick={() => onToggle(null)} />
      {genres.map((g) => (
        <Chip
          key={g}
          label={g}
          clickable
          color={active === g ? "primary" : "default"}
          onClick={() => onToggle(g)}
        />
      ))}
    </Box>
  );
}

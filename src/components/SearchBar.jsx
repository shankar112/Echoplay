import React, { useState, useEffect } from "react";
import { TextField, InputAdornment, IconButton } from "@mui/material";
import SearchIcon from "@mui/icons-material/Search";
import ClearIcon from "@mui/icons-material/Clear";

export default function SearchBar({ value, onChange, placeholder = "Search songs, artists..." }) {
  const [q, setQ] = useState(value || "");

  useEffect(() => {
    const id = setTimeout(() => onChange(q.trim()), 350); // debounce
    return () => clearTimeout(id);
  }, [q, onChange]);

  return (
    <TextField
      fullWidth
      variant="filled"
      size="small"
      value={q}
      onChange={(e) => setQ(e.target.value)}
      placeholder={placeholder}
      InputProps={{
        startAdornment: (
          <InputAdornment position="start">
            <SearchIcon />
          </InputAdornment>
        ),
        endAdornment: q && (
          <InputAdornment position="end">
            <IconButton onClick={() => setQ("")}><ClearIcon /></IconButton>
          </InputAdornment>
        ),
      }}
    />
  );
}

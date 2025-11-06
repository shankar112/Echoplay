import React from "react";
import { AppBar, Toolbar, IconButton, Typography, Box, Button } from "@mui/material";
import MenuIcon from "@mui/icons-material/Menu";
import LibraryMusicIcon from "@mui/icons-material/LibraryMusic";
import { Link as RouterLink } from "react-router-dom";

export default function Header() {
  return (
    <AppBar position="static" color="transparent" sx={{ borderBottom: "1px solid rgba(255,255,255,0.04)" }}>
      <Toolbar>
        <IconButton edge="start" color="inherit" aria-label="menu" sx={{ mr: 2 }}>
          <MenuIcon />
        </IconButton>

        <Typography variant="h6" component={RouterLink} to="/" sx={{ textDecoration: "none", color: "inherit", flexGrow: 1 }}>
          EchoPlay
        </Typography>

        <Box sx={{ display: "flex", gap: 1 }}>
          <Button component={RouterLink} to="/browse" color="inherit" startIcon={<LibraryMusicIcon />}>Browse</Button>
          <Button component={RouterLink} to="/library" color="inherit">Library</Button>
        </Box>
      </Toolbar>
    </AppBar>
  );
}

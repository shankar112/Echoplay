import React from "react";
import { Routes, Route } from "react-router-dom";
import { Container, Box } from "@mui/material";

import Header from "./components/Header";
import FooterPlayer from "./components/FooterPlayer";

import Home from "./pages/Home";
import Browse from "./pages/Browse";
import Album from "./pages/Album";
import Library from "./pages/Library";
import MusicList from "./pages/MusicList";
import MusicDetail from "./pages/MusicDetail";

import { PlayerProvider } from "./context/PlayerContext";

export default function App() {
  return (
    <PlayerProvider>
      <Box sx={{ minHeight: "100vh", bgcolor: "background.default", color: "text.primary" }}>
        <Header />
        <Container maxWidth="lg" sx={{ py: 4 }}>
          <Routes>
            <Route path="/" element={<Home />} />
            <Route path="/browse" element={<Browse />} />
            <Route path="/music" element={<MusicList />} />
            <Route path="/track/:id" element={<MusicDetail />} />
            <Route path="/album/:id" element={<Album />} />
            <Route path="/library" element={<Library />} />
          </Routes>
        </Container>
        <FooterPlayer />
      </Box>
    </PlayerProvider>
  );
}

import React, { useState, useEffect } from 'react';
import { BrowserRouter as Router, Route, Routes, Link, useParams } from 'react-router-dom';
import {Drawer,List,ListItem,ListItemText,ListItemIcon,AppBar,Toolbar,Typography,CssBaseline,Box, IconButton,Menu,MenuItem,
} from '@mui/material';
import HomeIcon from '@mui/icons-material/Home';
import AlbumIcon from '@mui/icons-material/Album';
import PersonIcon from '@mui/icons-material/Person';
import QueueMusicIcon from '@mui/icons-material/QueueMusic';
import MoreVertIcon from '@mui/icons-material/MoreVert';
import HomePage from './Pages/HomePage';
import AlbumsPage from './Pages/Albums';
import ArtistsPage from './Pages/Artists';
import PlaylistsPage from './Pages/Playlists';
import Playback from './Navigation/Playback';
import ArtistAlbum from './Pages/ArtistAlbums';
import AlbumDetails from './Pages/AlbumDetails';

function App() {
  const [anchorEl, setAnchorEl] = useState(null);
  const [audioSrc, setAudioSrc] = useState('');
  const [albumCoverSrc, setAlbumCoverSrc] = useState('');
  const { trackId } = useParams(); // Assuming trackId is passed via route params

  const handleMenuOpen = (event) => {
    setAnchorEl(event.currentTarget);
  };

  const handleMenuClose = () => {
    setAnchorEl(null);
  };

  const loadMetadata = () => {
    console.log('Music Library Scanned');
    fetch('http://localhost:8080/find-new-albums');
    handleMenuClose();
  };

  useEffect(() => {
    const fetchTrackDetails = async () => {
      try {
        const response = await fetch(`http://localhost:8080/trackDetails/${trackId}`);
        if (!response.ok) {
          throw new Error('Network response was not ok');
        }
        const data = await response.json();
        setAudioSrc(data.audio_path);
        setAlbumCoverSrc(data.image_path);
      } catch (error) {
        console.error('Error fetching track details:', error);
      }
    };

    if (trackId) {
      fetchTrackDetails();
    }
  }, [trackId]);

  return (
    <div className="App">
      <CssBaseline />
      <AppBar position="fixed" style={{ zIndex: 1201 }}>
        <Toolbar>
          <Typography variant="h6" noWrap>
            Music App
          </Typography>
          <IconButton
            edge="end"
            color="inherit"
            aria-label="more"
            aria-controls="simple-menu"
            aria-haspopup="true"
            onClick={handleMenuOpen}
            style={{ color: 'white', marginLeft: 'auto' }}
          >
            <MoreVertIcon />
          </IconButton>
          <Menu
            id="simple-menu"
            anchorEl={anchorEl}
            open={Boolean(anchorEl)}
            onClose={handleMenuClose}
          >
            <MenuItem onClick={loadMetadata}>Scan Music Library</MenuItem>
          </Menu>
        </Toolbar>
      </AppBar>
      <Router>
        <Drawer
          variant="permanent"
          sx={{
            '& .MuiDrawer-paper': { width: 240, boxSizing: 'border-box', zIndex: 100 },
          }}
        >
          <Toolbar />
          <List component="nav">
            <ListItem button component={Link} to="/">
              <ListItemIcon>
                <HomeIcon />
              </ListItemIcon>
              <ListItemText primary="Home" />
            </ListItem>
            <ListItem button component={Link} to="/albums">
              <ListItemIcon>
                <AlbumIcon />
              </ListItemIcon>
              <ListItemText primary="Albums" />
            </ListItem>
            <ListItem button component={Link} to="/artists">
              <ListItemIcon>
                <PersonIcon />
              </ListItemIcon>
              <ListItemText primary="Artists" />
            </ListItem>
            <ListItem button component={Link} to="/playlists">
              <ListItemIcon>
                <QueueMusicIcon />
              </ListItemIcon>
              <ListItemText primary="Playlists" />
            </ListItem>
          </List>
        </Drawer>
        <main style={{ marginTop: 64, marginLeft: 240, padding: '15px' }}>
          <Toolbar />
          <Routes>
            <Route exact path="/" element={<HomePage />} />
            <Route path="/albums" element={<AlbumsPage />} />
            <Route path="/artists" element={<ArtistsPage />} />
            <Route path="/playlists" element={<PlaylistsPage />} />
            <Route path="/artist-albums/:artist" element={<ArtistAlbum />} />
            <Route path="/album-details/:albumId" element={<AlbumDetails />} />
          </Routes>
        </main>
        <Box
          position="fixed"
          bottom={0}
          left={0}
          width="100%"
          bgcolor="#f4f4f4"
          boxShadow="0 2px 10px rgba(0,0,0,0.1)"
          zIndex={1000}
        >
          <Box
            display="flex"
            justifyContent="center"
            alignItems="center"
            maxWidth="1200px"
            margin="0 auto"
            padding={2}
          >
            <Playback audioSrc={audioSrc} albumCoverSrc={albumCoverSrc} />
          </Box>
        </Box>
      </Router>
    </div>
  );
}

export default App;

import React from 'react';
import { BrowserRouter as Router, Route, Routes, Link } from 'react-router-dom';
import { Drawer, List, ListItem, ListItemText, ListItemIcon, AppBar, Toolbar, Typography, CssBaseline, Box, IconButton, Menu, MenuItem } from '@mui/material';
import HomeIcon from '@mui/icons-material/Home';
import AlbumIcon from '@mui/icons-material/Album';
import PersonIcon from '@mui/icons-material/Person';
import QueueMusicIcon from '@mui/icons-material/QueueMusic';
import MoreVertIcon from '@mui/icons-material/MoreVert';
import HomePage from './Pages/HomePage';
import AlbumsPage from './Pages/Albums'; // Make sure this path is correct
import ArtistsPage from './Pages/Artists'; // Make sure this path is correct
import PlaylistsPage from './Pages/Playlists'; // Make sure this path is correct
import Playback from './Navigation/Playback';
import ArtistAlbum from './Pages/ArtistAlbums';
import AlbumDetails from './Pages/AlbumDetails';

function App() {
  const [anchorEl, setAnchorEl] = React.useState(null);

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
  
  return (
    <div className="App">
      <CssBaseline />
      <AppBar position="fixed" style={{ zIndex: 1201 /* Ensure AppBar is above Drawer */ }}>
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
            '& .MuiDrawer-paper': { width: 240, boxSizing: 'border-box', zIndex: 100 /* Lower zIndex than AppBar */ },
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
        <main style={{ marginTop: 10, marginLeft: 240, padding: '15px', zIndex: 1201 /* Ensure main content is above Drawer */ }}>
          <Toolbar />
          <Routes>
            <Route exact path="/" element={<HomePage />} />
            <Route path="/albums" element={<AlbumsPage />} />
            <Route path="/artists" element={<ArtistsPage />} />
            <Route path="/playlists" element={<PlaylistsPage />} />
            <Route path="/albumsAritst" element={<ArtistAlbum />} />
            <Route path="/albumsDetails" element={<AlbumDetails/>} />
          </Routes>
        </main>
        <Box
          position="fixed"
          bottom={0}
          left={0}
          width="100%"
          bgcolor="#f4f4f4"
          boxShadow="0 2px 10px rgba(0,0,0,0.1)"
          zIndex={1000} // Adjust the zIndex as needed
        >
          <Box
            display="flex"
            justifyContent="center"
            alignItems="center"
            maxWidth="1200px" // Adjust the max-width to your preference
            margin="0 auto"
            padding={2}
          >
            <Playback audioSrc='http://localhost:8080/stream/Death%20Grips%20-%20Year%20of%20the%20Snitch%20-%201%20-%20Death%20Grips%20is%20Online.mp3' albumCoverSrc='http://localhost:8080/images/yots-1024.jpg' />
          </Box>
        </Box>
      </Router>
    </div>
  );
}

export default App;

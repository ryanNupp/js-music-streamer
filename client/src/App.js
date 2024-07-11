import React from 'react';
import { BrowserRouter as Router, Route, Routes, Link } from 'react-router-dom';
import { Drawer, List, ListItem, ListItemText, AppBar, Toolbar, Typography, CssBaseline, Divider } from '@mui/material';
import MenuIcon from '@mui/icons-material/Menu';
import HomePage from './Pages/HomePage';
import AlbumsPage from './Pages/Albums';
import ArtistsPage from './Pages/Artists';
import PlaylistsPage from './Pages/Playlists';

function App() {
  return (
    <div className="App">
      <CssBaseline />
      <AppBar position="fixed">
        <Toolbar>
          <MenuIcon />
          <Typography variant="h6" noWrap>
            Music App
          </Typography>
        </Toolbar>
      </AppBar>
      <Router>
        <Drawer
          variant="permanent" // Make the sidebar permanent
          sx={{
            width: 240,
            flexShrink: 0,
            '& .MuiDrawer-paper': { width: 240, boxSizing: 'border-box' },
          }}
        >
          <Toolbar />
          <Divider />
          <List>
            <ListItem button component={Link} to="/">
              <ListItemText primary="Home" />
            </ListItem>
            <ListItem button component={Link} to="/albums">
              <ListItemText primary="Albums" />
            </ListItem>
            <ListItem button component={Link} to="/artists">
              <ListItemText primary="Artists" />
            </ListItem>
            <ListItem button component={Link} to="/playlists">
              <ListItemText primary="Playlists" />
            </ListItem>
          </List>
        </Drawer>
        <main style={{ marginLeft: 240, padding: '20px' }}>
          <Toolbar />
          <Routes>
            <Route exact path="/" element={<HomePage />} />
            <Route path="/albums" element={<AlbumsPage />} />
            <Route path="/artists" element={<ArtistsPage />} />
            <Route path="/playlists" element={<PlaylistsPage />} />
          </Routes>
        </main>
      </Router>
    </div>
  );
}

export default App;

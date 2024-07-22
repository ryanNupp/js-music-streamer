import React, { useState, useEffect } from 'react';
import { Box, Typography } from '@mui/material';
import { Link } from 'react-router-dom'; 

const Artists = () => {
  const [artists, setArtists] = useState([]);
  const [error, setError] = useState(null);

  useEffect(() => {
    const fetchArtists = async () => {
      try {
          const response = await fetch('http://localhost:8080/artists');
          if (!response.ok) {
              throw new Error('Network response was not ok');
          }
          const data = await response.json();
          setArtists(data);
      } catch (error) {
          console.error('Error fetching artists:', error);
          setError(error);
      }
   
  };

  fetchArtists();
}, []);


  return (
    <div>
      <h1>Artists Page</h1>
      {error && <p>{error}</p>}
      <div style={{ display: 'flex', flexWrap: 'wrap' }}>
        {artists.map((artist, index) => (
            <Link 
            key={index} 
            to={`/albumsArtists/${encodeURIComponent(artist)}`} 
            style={{ textDecoration: 'none', color: 'inherit' }}
          >
          <Box
            key={index}
            m={2}
            p={2}
            borderRadius={10}
            boxShadow="0 2px 5px rgba(0,0,0,0.1)"
            style={{ maxWidth: 180, textAlign: 'center', cursor: 'pointer', transition: 'transform 0.2s' }}
            sx={{
              '&:hover': {
                transform: 'scale(1.05)'
              }
            }}
          >
          
            <Typography variant="body1">{artist.artists}</Typography>
          </Box>
          </Link>
        ))}
      </div>
    </div>
  );
}

export default Artists;

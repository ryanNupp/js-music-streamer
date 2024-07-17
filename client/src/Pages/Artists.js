import React, { useState, useEffect } from 'react';
import { Box, Typography } from '@mui/material';

const Artists = () => {
  const [artists, setArtists] = useState([]);
  const [error, setError] = useState(null);

  useEffect(() => {
    fetch('http://localhost:8080/app/songs')
      .then(response => {
        if (!response.ok) {
          throw new Error('Network response was not ok');
        }
        return response.json();
      })
      .then(data => {
        const uniqueArtists = [...new Set(data.map(song => song.artist))];
        setArtists(uniqueArtists);
      })
      .catch(error => {
        console.error('Error fetching songs:', error);
        setError('Error fetching songs');
      });
  }, []);

  return (
    <div>
      <h1>Artists Page</h1>
      {error && <p>{error}</p>}
      <div style={{ display: 'flex', flexWrap: 'wrap' }}>
        {artists.map((artist, index) => (
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
            <img
              src={`http://localhost:8080/images/yots-1024.jpg`}
              alt={artist}
              style={{ width: 150, height: 150, borderRadius: '20%' }}
            />
            <Typography variant="body1">{artist}</Typography>
          </Box>
        ))}
      </div>
    </div>
  );
}

export default Artists;

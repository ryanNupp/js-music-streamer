import React, { useState, useEffect } from 'react';
import { Box, Typography } from '@mui/material';

const Albums = () => {
  const [songs, setSongs] = useState([]);
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
        console.log('Fetched songs:', data); // For debugging
        setSongs(data);
      })
      .catch(error => {
        console.error('Error fetching songs:', error);
        setError('Error fetching songs');
      });
  }, []);

  return (
    <div>
      <h1>Albums Page</h1>
      {error && <p>{error}</p>}
      <div style={{ display: 'flex', flexWrap: 'wrap' }}>
        {songs.map(song => (
          <Box
            key={song.filename}
            m={2}
            p={2}
            borderRadius={10}
            boxShadow="0 2px 5px rgba(0,0,0,0.1)"
          >
            <img
              src={`http://localhost:8080/images/yots-1024.jpg`}
              alt={song.songName}
              style={{ width: 150, height: 150, borderRadius: '20%' }}
            />
            <Typography variant="body1">{song.artist}</Typography>
            <Typography variant="body2">{song.songname}</Typography>
          </Box>
        ))}
      </div>
    </div>
  );
};

export default Albums;

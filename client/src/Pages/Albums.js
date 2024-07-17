import React, { useState, useEffect } from 'react';
import { Box, Typography } from '@mui/material';
import { Link } from 'react-router-dom'; // Import Link from react-router-dom

const Albums = () => {
  const [albums, setAlbums] = useState([]);
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
        // Extract unique albums from the data
        const uniqueAlbums = [...new Set(data.map(song => song.album))];
        setAlbums(uniqueAlbums);
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
        {albums.map((album, index) => (
          <Link key={index} to={`/albums/${encodeURIComponent(album)}`} style={{ textDecoration: 'none', color: 'inherit' }}>
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
                alt={album} // Assuming album name can serve as alt text
                style={{ width: '100%', height: 'auto', borderRadius: '20%' }}
              />
              <Typography variant="body2">{album}</Typography>
            </Box>
          </Link>
        ))}
      </div>
    </div>
  );
};

export default Albums;

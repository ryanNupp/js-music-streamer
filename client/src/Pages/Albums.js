import React, { useState, useEffect } from 'react';
import { Box, Typography } from '@mui/material';
import { Link } from 'react-router-dom';

const Albums = () => {
  const [albums, setAlbums] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error] = useState(null);

  useEffect(() => {
    const fetchAlbums = async () => {
        try {
            const response = await fetch('http://localhost:8080/albums');
            if (!response.ok) {
                throw new Error('Network response was not ok');
            }
            const data = await response.json();
            setAlbums(data);
        } catch (error) {
            console.error('Error fetching albums:', error);
        } 
      
    };

    fetchAlbums();
}, []);



return (
  <div>
    <h1>Albums Page</h1>
    {error && <p>{error}</p>}
    <div style={{ display: 'flex', flexWrap: 'wrap' }}>
      {albums.map((album, index) => (
        <Link 
          key={index} 
          to={`/album-details/${encodeURIComponent(album.id)}`} 
          style={{ textDecoration: 'none', color: 'inherit' }}
        >
          <Box
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
              src={`http://localhost:8080/${album.image_path}`}
              alt={album.title} // Assuming album name can serve as alt text
              style={{ width: '100%', height: 'auto', borderRadius: '20%' }}
            />
            <Typography variant="body2">{album.title}</Typography>
          </Box>
        </Link>
      ))}
    </div>
  </div>
);
};

export default Albums;

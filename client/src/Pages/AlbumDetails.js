import React, { useState, useEffect } from 'react';
import { Box, Typography } from '@mui/material';
import { Link, useParams } from 'react-router-dom';

const AlbumsDisplay = () => {
  const { album } = useParams();
  const [tracks, setTracks] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);

  useEffect(() => {
    const fetchTracks = async () => {
      try {
        const response = await fetch(`http://localhost:8080/album-details/${encodeURIComponent(album)}`);
        if (!response.ok) {
          throw new Error('Network response was not ok');
        }
        const data = await response.json();
        setTracks(data);
      } catch (error) {
        console.error('Error fetching Tracks:', error);
        setError('Failed to load Tracks');
      } finally {
        setLoading(false);
      }
    };

    fetchTracks();
  }, [album]);

  if (loading) return <p>Loading...</p>;

  return (
    <div>
      <h1>Songs</h1>
      {error && <p>{error}</p>}
      <div style={{ display: 'flex', flexWrap: 'wrap' }}>
        {tracks.map((track, index) => (
          <Link 
            key={index} 
            to={`/stream/${encodeURIComponent(track.title)}`} 
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
              <Typography variant="body2">{track.file_name}</Typography>
            </Box>
          </Link>
        ))}
      </div>
    </div>
  );
};

export default AlbumsDisplay;

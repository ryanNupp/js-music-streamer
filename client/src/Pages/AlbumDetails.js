import React, { useState, useEffect } from 'react';
import { Box, Typography } from '@mui/material';
import { useParams } from 'react-router-dom';
import Playback from '../Navigation/Playback';
const AlbumDetails = () => {
  const { albumName } = useParams(); // Get albumName from URL parameter
  const [songs, setSongs] = useState([]);
  const [error, setError] = useState(null);
  const [currentSong, setCurrentSong] = useState(null);

  useEffect(() => {
    // Fetch data for the specific album using albumName
    fetch(`http://localhost:8080/albums/${encodeURIComponent(albumName)}`)
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
  }, [albumName]); // Trigger useEffect when albumName changes

 

  return (
    <div>
      <h1>{decodeURIComponent(albumName)}</h1>
      {error && <p>{error}</p>}
      <div style={{ display: 'flex', flexWrap: 'wrap' }}>
        {songs.map(song => (
          <Box
            key={song.filename}
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
              src={`http://localhost:8080/images/${encodeURIComponent(albumName)}`} // Adjust the path according to your server setup
              alt={song.songName} // Assuming songName can serve as alt text
              style={{ width: '100%', height: 'auto', borderRadius: '20%' }}
            />
            <Typography variant="body2">{song.artist}</Typography>
            <Typography variant="body2">{song.songName}</Typography>
          </Box>
        ))}
      </div>
      {currentSong && <Playback song={currentSong} />}
    </div>
  );
};

export default AlbumDetails;

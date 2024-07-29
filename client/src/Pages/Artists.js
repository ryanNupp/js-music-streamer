import React, { useState, useEffect } from 'react';
import { Link } from 'react-router-dom';
import { Box, Typography } from '@mui/material';

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
        
        // Clean up artist names
        const formattedArtists = data.map(artist => ({
          name: cleanArtistName(artist.artists) // Clean artist names
        }));
        
        setArtists(formattedArtists);
      } catch (error) {
        console.error('Error fetching artists:', error);
        setError('Failed to load artists');
      }
    };

    fetchArtists();
  }, []);

  // Function to clean up artist names
  const cleanArtistName = (name) => {
    try {
      // Parse the JSON string to handle array format and extract artist names
      const artistArray = JSON.parse(name);
      // Return the name with spaces preserved
      return artistArray[0].replace(/[[\]"']/g, '').trim();
    } catch (error) {
      console.error('Error cleaning artist name:', error);
      return name; // Return the original name in case of an error
    }
  };

  return (
    <div>
    <h1>Artists Page</h1>
    {error && <p>{error}</p>} {/* Display the error message */}
    <div style={{ display: 'flex', flexWrap: 'wrap' }}>
      {artists.map((artist, index) => (
        <Link 
          key={index} 
          to={`/artist-albums/${encodeURIComponent(artist.name)}`} 
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
            {/* Assuming you want to add an image, include the `img` tag here */}
            {/* <img
              src={`http://localhost:8080/path-to-images/${artist.name.replace(/\s+/g, '-').toLowerCase()}.jpg`} // Adjust the path
              alt={artist.name} // Use artist's name as alt text
              style={{ width: 150, height: 150, borderRadius: '20%' }}
            /> */}
            <Typography variant="body1">{artist.name}</Typography>
          </Box>
        </Link>
      ))}
    </div>
  </div>
  );
}

export default Artists;

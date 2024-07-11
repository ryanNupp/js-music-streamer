import React, { useState, useEffect } from 'react';
import axios from 'axios';

const Playlists = () => {
  const [message, setMessage] = useState('');

  useEffect(() => {
    axios.get('http://localhost:3000/playlists')
      .then((response) => {
        setMessage(response.data);
      })
      .catch((error) => {
        console.error('Error making API call:', error);
        setMessage('Error making API call');
      });
  }, []);

  return (
    <div>
      <h1>Playlists Page</h1>
      <p>{message}</p>
    </div>
  );
}

export default Playlists;

import React, { useState, useEffect } from 'react';
import axios from 'axios';

const Playlists = () => {
  const [message, setMessage] = useState('');

  useEffect(() => {
    axios.get('http://localhost:8080/playlists')
      .then((response) => {
        setMessage(response.data);
      })
      .catch((error) => {
        console.error('Error making API call:', error);
        setMessage('Error making API call');
      });
  }, []);

  function playMusic() {
    axios({
      method: 'get',
      url: 'http://localhost:8080/stream/Death Grips - Year of the Snitch - 1 - Death Grips is Online.mp3',
      responseType: 'stream'
    })
    .then(function (response) {
      response.data.pipe()
    });
  }

  return (
    <div>
      <h1>Playlists Page</h1>
      <p>{message}</p>

      <button onClick={playMusic}>Play Music</button>
    </div>
  );
}

export default Playlists;

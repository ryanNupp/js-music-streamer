import React, { useState, useEffect } from 'react';
import axios from 'axios';

const Artists = () => {
  const [message, setMessage] = useState('');

  useEffect(() => {
    axios.get('http://localhost:3000/artists')
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
      <h1>Artists Page</h1>
      <p>{message}</p>
    </div>
    
  );
}

export default Artists;

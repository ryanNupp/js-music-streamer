//import React, { useState, useRef } from 'react';
import {Howl} from 'howler';

const Playlists = () => {

  var sound = new Howl({
    src: ['http://localhost:8080/stream/Death%20Grips%20-%20Year%20of%20the%20Snitch%20-%201%20-%20Death%20Grips%20is%20Online.mp3']
  });

  return (
    <div>
      <h1>Playlists Page</h1>

      <button onClick={() => sound.play()}>Music Stream</button>
    </div>
  );
};

export default Playlists;

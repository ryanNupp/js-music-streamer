import React, { useState, useEffect, useRef } from 'react';
import { IconButton, Slider, Box, Typography } from '@mui/material';
import PlayArrowIcon from '@mui/icons-material/PlayArrow';
import PauseIcon from '@mui/icons-material/Pause';
import VolumeUpIcon from '@mui/icons-material/VolumeUp';
import VolumeOffIcon from '@mui/icons-material/VolumeOff';
import useSound from 'use-sound';
import { Howler } from 'howler';


const albumCover = "http://localhost:8080/images/Death Grips - Year of the Snitch.jpg"; // Replace with your actual album cover URL

const soundUrl = 'http://localhost:8080/stream/Death%20Grips%20-%20Year%20of%20the%20Snitch%20-%201%20-%20Death%20Grips%20is%20Online.mp3';

export default function Playback({song}) {
  const [isPlaying, setIsPlaying] = useState(false);
  const [play, { pause, duration, sound }] = useSound(soundUrl);
  const [volume, setVolume] = useState(50);
  const [position, setPosition] = useState(0);

  const playPause = () => {
    // only be able to interact with pause/play button if song is loaded
    if (sound) {
      if (isPlaying) {
        pause();
      } else {
        play();
      }
      setIsPlaying(!isPlaying);
    }
  };

  const handleVolumeChange = (event, value) => {
    setVolume(value);
    // change global volume, not sound volume
    Howler.volume(parseFloat(value) / 100);
  };

  const toggleMute = () => {
    const newVolume = volume === 0 ? 50 : 0;
    setVolume(newVolume);
    if (sound != null) {
      // change global volume, not sound volume
      Howler.volume(newVolume / 100);
    }
  };

  useEffect(() => {
    const interval = setInterval (() => {
      if (sound) {
        setPosition(sound.seek());
      }
    }, 1000);
    return () => clearInterval(interval);
  }, [sound]);

  const handlePositionChange = (event, newValue) => {
    setPosition(newValue);
    if (sound) {
      sound.seek(newValue)
    }
  };

  const formatTime = (timeInSeconds) => {
    const minutes = Math.floor(timeInSeconds / 60);
    const seconds = Math.floor(timeInSeconds % 60);
    return `${minutes}:${seconds < 10 ? '0' : ''}${seconds}`;
  };

  return (
    <Box display="flex" alignItems="center" p={1.5} bgcolor="#f4f4f4" borderRadius="10px" boxShadow="0 2px 10px rgba(0,0,0,0.1)" width={600}>
      <Box mr={2}>
        <img src={albumCover} alt="Loading..." style={{ width: 50, height: 50, borderRadius: '20%' }} />
      </Box>
      <IconButton onClick={playPause}>
        {isPlaying ? <PauseIcon /> : <PlayArrowIcon />}
      </IconButton>
      <Typography variant="body2" style={{ margin: '0 16px' }}>
        {formatTime(position)} 
      </Typography>
      <Slider
        size="small"
        value={position}
        min={0}
        step={1}
        max={duration/1000}
        onChange={handlePositionChange}
      />
      <Typography variant="body2" style={{ margin: '0 16px' }}>
        {formatTime(duration / 1000)}
      </Typography>
      <IconButton onClick={toggleMute}>
        {volume === 0 ? <VolumeOffIcon /> : <VolumeUpIcon />}
      </IconButton>
      <Slider
        value={volume}
        onChange={handleVolumeChange}
        style={{ width: 100 }}
      />
    </Box>
  );
}
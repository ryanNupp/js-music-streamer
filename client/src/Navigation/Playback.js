import React, { useRef, useState, useEffect } from 'react';
import { IconButton, Slider, Box, Typography } from '@mui/material';
import PlayArrowIcon from '@mui/icons-material/PlayArrow';
import PauseIcon from '@mui/icons-material/Pause';
import VolumeUpIcon from '@mui/icons-material/VolumeUp';
import VolumeOffIcon from '@mui/icons-material/VolumeOff';
import { Howl } from 'howler';

const Playback = ({ audioSrc }) => {
  const sound = useRef(null);
  const [isPlaying, setIsPlaying] = useState(false);
  const [currentTime, setCurrentTime] = useState(0);
  const [duration, setDuration] = useState(0);
  const [volume, setVolume] = useState(50); // Default volume (0 to 100)

  useEffect(() => {
    sound.current = new Howl({
      src: ['http://localhost:8080/stream/Death%20Grips%20-%20Year%20of%20the%20Snitch%20-%201%20-%20Death%20Grips%20is%20Online.mp3'],
      html5: true, 
      volume: volume / 100, 
      onplay: () => setIsPlaying(true),
      onpause: () => setIsPlaying(false),
      onload: () => setDuration(sound.current.duration()),
      onend: () => setIsPlaying(false),
      onseek: () => setCurrentTime(sound.current.seek())
    });

    return () => {
      sound.current.unload();
    };
  }, [audioSrc, volume]);

  const handlePlayPause = () => {
    if (isPlaying) {
      sound.current.pause();
    } else {
      sound.current.play();
    }
    setIsPlaying(!isPlaying);
  };

  const handleSliderChange = (event, newValue) => {
    sound.current.seek(newValue);
    setCurrentTime(newValue);
  };

  const handleVolumeChange = (event, newValue) => {
    const newVolume = parseFloat(newValue);
    sound.current.volume(newVolume / 100);
    setVolume(newVolume);
  };

  const formatTime = (timeInSeconds) => {
    const minutes = Math.floor(timeInSeconds / 60);
    const seconds = Math.floor(timeInSeconds % 60);
    return `${minutes}:${seconds < 10 ? '0' : ''}${seconds}`;
  };

  return (
    <Box
      display="flex"
      alignItems="center"
      padding={1.5}
      bgcolor="#f4f4f4"
      borderRadius="10px"
      boxShadow="0 2px 10px rgba(0,0,0,0.1)"
      width="600px"
    >
      <IconButton onClick={handlePlayPause}>
        {isPlaying ? <PauseIcon /> : <PlayArrowIcon />}
      </IconButton>
      <Typography variant="body2" padding="0 16px">
        {formatTime(currentTime)} / {formatTime(duration)}
      </Typography>
      <Slider
        min={0}
        max={duration}
        value={currentTime}
        onChange={handleSliderChange}
        aria-labelledby="continuous-slider"
        style={{ flex: 1, margin: '0 16px' }}
      />
      <IconButton onClick={() => setVolume(volume === 0 ? 100 : 0)}>
        {volume === 0 ? <VolumeOffIcon /> : <VolumeUpIcon />}
      </IconButton>
      <Slider
        value={volume}
        onChange={handleVolumeChange}
        aria-labelledby="volume-slider"
        style={{ width: 100 }}
      />
    </Box>
  );
};

export default Playback;

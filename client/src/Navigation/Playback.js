import React, { useState, useEffect, useRef } from 'react';
import { IconButton, Slider, Box, Typography } from '@mui/material';
import PlayArrowIcon from '@mui/icons-material/PlayArrow';
import PauseIcon from '@mui/icons-material/Pause';
import VolumeUpIcon from '@mui/icons-material/VolumeUp';
import VolumeOffIcon from '@mui/icons-material/VolumeOff';
import { Howl } from 'howler';

const sound = new Howl({
  src: ['http://localhost:8080/stream/Death%20Grips%20-%20Year%20of%20the%20Snitch%20-%201%20-%20Death%20Grips%20is%20Online.mp3'],
  html5: true,
  volume: 0.5,
});

const albumCover = "bruh"; // Replace with your actual album cover URL

export default function Playback() {
  const [isPlaying, setIsPlaying] = useState(false);
  const [currentTime, setCurrentTime] = useState(0);
  const [duration, setDuration] = useState(0);
  const [volume, setVolume] = useState(50);
  const [seeking, setSeeking] = useState(false);
  const sliderRef = useRef();

  useEffect(() => {
    // Load event listener to set the duration
    sound.once('load', () => {
      setDuration(sound.duration());
    });

    // Play event listener for updating current time
    sound.on('play', () => {
      requestAnimationFrame(updateCurrentTime);
    });

    // End event listener to reset state when the sound ends
    sound.on('end', () => {
      setIsPlaying(false);
      setCurrentTime(0);
    });

    return () => {
      // Clean up event listeners
      sound.off('load');
      sound.off('play');
      sound.off('end');
    };
  }, []);

  const updateCurrentTime = () => {
    if (isPlaying && !seeking) {
      setCurrentTime(sound.seek());
      requestAnimationFrame(updateCurrentTime);
    }
  };

  const handlePlayPause = () => {
    if (isPlaying) {
      sound.pause();
    } else {
      if (currentTime === duration) {
        sound.seek(0); // Restart from the beginning if song ended
      } else {
        sound.seek(currentTime);
      }
      sound.play();
      requestAnimationFrame(updateCurrentTime); // Start updating current time
    }
    setIsPlaying(!isPlaying);
  };

  const handleSliderChange = (event, newValue) => {
    setCurrentTime(newValue);
    console.log(newValue);
    setSeeking(true);
  };

  const handleSliderChangeCommitted = (event, newValue) => {
    sound.seek(newValue);
    setCurrentTime(newValue);
    setSeeking(false);

    if (!isPlaying) {
      sound.play();
      setIsPlaying(true);
      requestAnimationFrame(updateCurrentTime); // Start updating current time
    }
  };

  const handleVolumeChange = (event, newValue) => {
    const newVolume = parseFloat(newValue);
    setVolume(newVolume);
    sound.volume(newVolume / 100);
  };

  const toggleMute = () => {
    const newVolume = volume === 0 ? 50 : 0;
    setVolume(newVolume);
    sound.volume(newVolume / 100);
  };

  const formatTime = (timeInSeconds) => {
    const minutes = Math.floor(timeInSeconds / 60);
    const seconds = Math.floor(timeInSeconds % 60);
    return `${minutes}:${seconds < 10 ? '0' : ''}${seconds}`;
  };

  useEffect(() => {
    const slider = sliderRef.current;

    const handleProgress = () => {
      if (!seeking) {
        setCurrentTime(sound.seek());
      }
    };

    const interval = setInterval(handleProgress, 100);

    return () => clearInterval(interval);
  }, [seeking]);

  return (
    <Box display="flex" alignItems="center" p={1.5} bgcolor="#f4f4f4" borderRadius="10px" boxShadow="0 2px 10px rgba(0,0,0,0.1)" width={600}>
      <Box mr={2}>
        <img src={albumCover} alt="Album Cover" style={{ width: 50, height: 50, borderRadius: '50%' }} />
      </Box>
      <IconButton onClick={handlePlayPause}>
        {isPlaying ? <PauseIcon /> : <PlayArrowIcon />}
      </IconButton>
      <Typography variant="body2" style={{ margin: '0 16px' }}>
        {formatTime(currentTime)} / {formatTime(duration)}
      </Typography>
      <Slider
        ref={sliderRef}
        min={0}
        max={duration}
        value={currentTime}
        onChange={handleSliderChange}
        onChangeCommitted={handleSliderChangeCommitted}
        style={{ flex: 1, margin: '0 16px' }}
      />
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

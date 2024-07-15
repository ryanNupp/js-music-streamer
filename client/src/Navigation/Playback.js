import React, { useState, useEffect, useRef } from 'react';
import { IconButton, Slider, Box, Typography } from '@mui/material';
import PlayArrowIcon from '@mui/icons-material/PlayArrow';
import PauseIcon from '@mui/icons-material/Pause';
import VolumeUpIcon from '@mui/icons-material/VolumeUp';
import VolumeOffIcon from '@mui/icons-material/VolumeOff';
import useSound from 'use-sound';
import { Howler } from 'howler';


const albumCover = "http://localhost:8080/images/yots-1024.jpg"; // Replace with your actual album cover URL

const soundUrl = 'http://localhost:8080/stream/Death%20Grips%20-%20Year%20of%20the%20Snitch%20-%201%20-%20Death%20Grips%20is%20Online.mp3';

export default function Playback() {
  const [isPlaying, setIsPlaying] = useState(false);
  const [play, { pause, duration, sound }] = useSound(soundUrl);
  const [volume, setVolume] = useState(50);
  const [position, setPosition] = useState(0);

  const positionRef = useRef();

  const playPause = () => {
    // only be able to interact with pause/play button if song is loaded
    if (sound != null) {
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
    // changed code to affect Howler global volume, rather than individual sound volume
    // ( this helps ensure volume can be changed while sound is null or loading or smth )
    Howler.volume(parseFloat(value) / 100);
  };

  const toggleMute = () => {
    const newVolume = volume === 0 ? 50 : 0;
    setVolume(newVolume);
    if (sound != null) {
      // changed code to affect Howler global volume, rather than individual sound volume
      // ( this helps ensure volume can be changed while sound is null or loading or smth )
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
      <Slider
        size="small"
        value={position}
        min={0}
        step={1}
        max={duration/1000}
        onChange={handlePositionChange}
      />
      <Typography variant="body2" style={{ margin: '0 16px' }}>
        {formatTime(position)} / {formatTime(duration / 1000)}
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
/**
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
*/



/**
export default function Playback() {
  const [isPlaying, setIsPlaying] = useState(false);
  const [currentTime, setCurrentTime] = useState(0);
  const [duration, setDuration] = useState(0);
  const [volume, setVolume] = useState(50);
  const [seeking, setSeeking] = useState(false);
  const sliderRef = useRef();

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
*/
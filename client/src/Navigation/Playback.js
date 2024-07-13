import React, { useRef, useState, useEffect } from 'react';
import { IconButton, Slider, Box, Typography } from '@mui/material';
import PlayArrowIcon from '@mui/icons-material/PlayArrow';
import PauseIcon from '@mui/icons-material/Pause';
import VolumeUpIcon from '@mui/icons-material/VolumeUp';
import VolumeOffIcon from '@mui/icons-material/VolumeOff';
import { Howl } from 'howler';

const Playback = ({ audioSrc, albumCover }) => {
  const sound = useRef(null);
  const [isPlaying, setIsPlaying] = useState(false);
  const [currentTime, setCurrentTime] = useState(0);
  const [duration, setDuration] = useState(0);
  const [volume, setVolume] = useState(50);
  const [seeking, setSeeking] = useState(false);

  useEffect(() => {
    sound.current = new Howl({
      src: [audioSrc],
      html5: true,
      volume: volume / 100,
      onplay: () => setIsPlaying(true),
      onpause: () => setIsPlaying(false),
      onload: () => setDuration(sound.current.duration()),
      onend: () => setIsPlaying(false),
      onseek: () => {
        if (!seeking) setCurrentTime(sound.current.seek());
      },
    });

    const intervalId = setInterval(() => {
      if (sound.current.playing() && !seeking) setCurrentTime(sound.current.seek());
    }, 1000);

    return () => {
      clearInterval(intervalId);
      sound.current.unload();
    };
  }, [audioSrc, volume, seeking]);

  const handlePlayPause = () => {
    if (isPlaying) sound.current.pause();
    else sound.current.play();
    setIsPlaying(!isPlaying);
  };

  const handleSliderChange = (event, newValue) => {
    setCurrentTime(newValue);
  };

  const handleSliderChangeCommitted = (event, newValue) => {
    sound.current.seek(newValue);
    setSeeking(false);
  };

  const handleVolumeChange = (event, newValue) => {
    const newVolume = parseFloat(newValue);
    setVolume(newVolume);
    sound.current.volume(newVolume / 100);
  };

  const formatTime = (timeInSeconds) => {
    const minutes = Math.floor(timeInSeconds / 60);
    const seconds = Math.floor(timeInSeconds % 60);
    return `${minutes}:${seconds < 10 ? '0' : ''}${seconds}`;
  };

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
        min={0}
        max={duration}
        value={currentTime}
        onChange={handleSliderChange}
        onChangeCommitted={handleSliderChangeCommitted}
        style={{ flex: 1, margin: '0 16px' }}
      />
      <IconButton onClick={() => setVolume(volume === 0 ? 100 : 0)}>
        {volume === 0 ? <VolumeOffIcon /> : <VolumeUpIcon />}
      </IconButton>
      <Slider
        value={volume}
        onChange={handleVolumeChange}
        style={{ width: 100 }}
      />
    </Box>
  );
};

export default Playback;

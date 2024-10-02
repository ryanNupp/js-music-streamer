import { useEffect, useState } from "react";
import * as Slider from "@radix-ui/react-slider";

// components
import IconButton from "./IconButton";

// icons
import PlayIcon from "../assets/play.svg?react";
import PauseIcon from "../assets/pause.svg?react";
import BackIcon from "../assets/play-back.svg?react";
import ForwardIcon from "../assets/play-forward.svg?react";
import VolumeIcon from "../assets/volume-high.svg?react";
import MuteIcon from "../assets/volume-mute.svg?react";
import fallbackImage from "../assets/no-image.png"

export default function Playbar({ currSong, currMetadata, isPlaying, volume, setVolume, nextInQueue, back }) {
  const [isSeeking, setIsSeeking] = useState(false)
  const [position, setPosition] = useState(0)
  const duration = currSong ? currSong.duration : 0

  useEffect(() => {
    if (isPlaying && !isSeeking) {
      const interval = setInterval(() => {
        setPosition(currSong.currentTime)
      }, 1000)
      return () => clearInterval(interval)
    }
    if (!currSong) {
      setPosition(0)
    }
  }, [isPlaying, currSong, isSeeking]);


  function togglePlayPause() {
    if (currSong) {
      isPlaying ? currSong.pause() : currSong.play()
    }
  }

  function toggleMute() {
    volume == 0 ? setVolume(50) : setVolume(0)
  }

  function handleVolumeChange(e) {
    setVolume(e)
    if (currSong) {
      currSong.volume = e / 100
    }
  }

  function handlePositionChange(e) {
    if (currSong) {
      setIsSeeking(true)
      setPosition(e)
    }
  }

  function handlePositionCommit(e) {
    if (currSong) {
      currSong.fastSeek(e)
      setPosition(e)
      setIsSeeking(false)
    }
  }

  function formatTime(seconds) {
    let minutes = Math.floor(seconds / 60)
    seconds = Math.floor(seconds % 60)
    return `${minutes}:${seconds < 10 ? "0" : ""}${seconds}`
  }

  return (
    <div className="col-span-2 text-white flex justify-around items-center">
      <div className="h-full flex-auto flex items-center justify-center bg-gray-600">
        <IconButton Icon={BackIcon} onClick={back} />
        <IconButton
          Icon={isPlaying ? PauseIcon : PlayIcon}
          onClick={togglePlayPause}
        />
        <IconButton Icon={ForwardIcon} onClick={nextInQueue} />
      </div>
      <div className="flex-none h-full w-[500px] grid grid-rows-track-info grid-cols-track-info bg-gray-900">
        <img src={currMetadata ? `${globalThis.BACKEND}/images/${currMetadata.imageFile}` : fallbackImage} alt="album cover" className="row-span-4 h-full" />
        <p className="col-span-3 text-sm">{currMetadata ? currMetadata.songTitle : ""}</p>
        <p className="col-span-3 text-sm">{currMetadata ? `${currMetadata.albumTitle} -- ${currMetadata.albumArtists}` : ""}</p>

        <Slider.Root
          className="col-span-3 relative flex items-center px-1 h-[20px]"
          value={[position]}
          onValueChange={handlePositionChange}
          onValueCommit={handlePositionCommit}
          max={duration}
          step={1}
        >
          <Slider.Track className="bg-black relative flex-grow rounded-xl h-[3px]">
            <Slider.Range className="absolute bg-white rounded-xl h-full" />
          </Slider.Track>
          <Slider.Thumb
            className="block w-2 h-3 bg-white rounded-xl hover:bg-gray-200 focus:bg-gray-300"
            aria-label="Song Position"
          />
        </Slider.Root>

        <p className="col-start-2 text-sm p-0 m-0">{formatTime(position)}</p>
        <p className="col-start-4 text-sm p-0 m-0">{formatTime(duration)}</p>
      </div>
      <div className="h-full flex-auto flex items-center justify-center bg-gray-600">
        <IconButton 
          Icon={ volume == 0 ? MuteIcon : VolumeIcon }
          onClick={toggleMute}
        />

        <Slider.Root
          className="relative flex items-center w-[135px] h-2"
          value={[volume]}
          onValueChange={handleVolumeChange}
          max={100}
          step={1}
        >
          <Slider.Track className="bg-black relative flex-grow rounded-xl h-[3px]">
            <Slider.Range className="absolute bg-white rounded-xl h-full" />
          </Slider.Track>
          <Slider.Thumb
            className="block w-3 h-4 bg-white rounded-xl hover:bg-gray-200 focus:bg-gray-300"
            aria-label="Volume"
          />
        </Slider.Root>
      </div>
    </div>
  );
}

import { useState } from "react";
import * as Separator from "@radix-ui/react-separator";
import { Routes, Route } from "react-router-dom";

// pages
import Home from "./pages/Home";
import Albums from "./pages/Albums";
import AlbumInfo from "./pages/AlbumInfo";
import Artists from "./pages/Artists";
import ArtistInfo from "./pages/ArtistInfo"
import Songs from "./pages/Songs";

// components
import SidebarLink from "./components/SidebarLink";
import Playbar from "./components/Playbar";

// icons
import HomeIcon from "./assets/home.svg?react";
import NoteIcon from "./assets/musical-note.svg?react";
import NotesIcon from "./assets/musical-notes.svg?react";
import DiscIcon from "./assets/disc.svg?react";
import PeopleIcon from "./assets/people.svg?react";

globalThis.PORT = 8080
globalThis.BACKEND = `http://${window.location.hostname}:${PORT}`

console.log(globalThis.BACKEND)

export default function App() {
  const [queue, setQueue] = useState([])
  const [currSong, setCurrSong] = useState(null)
  const [currMetadata, setCurrMetadata] = useState(null)
  const [isPlaying, setIsPlaying] = useState(false)
  const [volume, setVolume] = useState(50)

  function startSong(song) {
    if (currSong) currSong.pause();

    let next = new Audio(`${globalThis.BACKEND}/stream/${song.albumFolder}/${song.songFile}`)
    next.autoplay = true
    next.volume = volume / 100
    next.onplay = () => { setIsPlaying(true) }
    next.onpause = () => { setIsPlaying(false) }
    next.onended = () => { 
      setIsPlaying(false)
      nextInQueue()
    }

    // let next = new Audio({
    //   src: `${globalThis.BACKEND}/stream/${song.albumFolder}/${song.songFile}`,
    //   autoplay: true,
    //   volume: volume / 100,
    //   onplay: () => { setIsPlaying(true) },
    //   onpause: () => { setIsPlaying(false) },
    //   onended: () => { 
    //     setIsPlaying(false)
    //     nextInQueue()
    //   }
    // })

    setCurrSong(next)
    setCurrMetadata(song)
  }

  // plays song next up in queue
  function nextInQueue() {
    if (currSong) {
      currSong.pause()
    }

    if (queue.length > 0) {
      let newQueue = queue
      startSong(newQueue.shift())
      setQueue(newQueue)
    } else {
      setCurrSong(null)
    }
  }

  function back() {
    if (currSong) {
      currSong.fastSeek(0);
    }
  }

  // give multiple songs to queue up, play the first song
  function queueMultiple(first, ...songs) {
    startSong(first)
    setQueue([...songs])
  }

  // add given song to front of queue, unless there isnt a currSong then just play it
  function queueNext(song) {
    currSong ? setQueue([song, ...queue]) : startSong(song);
  }

  // add given song to back of queue, unless there isnt a currSong then just play it
  function queueLast(song) {
    currSong ? setQueue([...queue, song]) : startSong(song);
  }

  return (
    <div className="h-screen grid grid-cols-layout grid-rows-layout">
      <div className="bg-gray-800 text-white">
        <div className="flex items-center m-5">
          <NotesIcon />
          <h1 className="px-4 text-xl font-bold">MusicStreamer</h1>
        </div>

        <Separator.Root className="my-2 h-[1px] w-full bg-white" />

        <SidebarLink Icon={HomeIcon} text="Home" location="/" />
        <SidebarLink Icon={DiscIcon} text="Albums" location="/albums" />
        <SidebarLink Icon={PeopleIcon} text="Artists" location="/artists" />
        <SidebarLink Icon={NoteIcon} text="Songs" location="/songs" />
      </div>

      <div className="bg-gray-400 overflow-y-auto">
        <Routes>
          <Route path="/" element={<Home />} />
          <Route path="/albums" element={<Albums />} />
          <Route path="/albuminfo/:folder" element={<AlbumInfo  queueMultiple={queueMultiple} />} />
          <Route path="/artists" element={<Artists />} />
          <Route path="/artistinfo/:artist" element={<ArtistInfo />} />
          <Route path="/songs" element={<Songs />} />
        </Routes>
      </div>

      <Playbar currSong={currSong} currMetadata={currMetadata} isPlaying={isPlaying} volume={volume} setVolume={setVolume} nextInQueue={nextInQueue} back={back} />
    </div>
  );
}

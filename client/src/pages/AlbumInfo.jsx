import { useEffect, useState } from "react";
import { useParams } from "react-router-dom";
import * as Separator from "@radix-ui/react-separator";

import IconButton from "../components/IconButton";

import PlayIcon from "../assets/play.svg?react"
import fallbackImage from "../assets/no-image.png";

export default function AlbumInfo({ queueMultiple }) {
  const { folder } = useParams();
  const [album, setAlbum] = useState({ title: "loading..." });
  const [tracks, setTracks] = useState([{ title: "loading..." }]);

  useEffect(() => {
    fetch(`${globalThis.BACKEND}/albumDetails/${folder}`)
      .then((response) => {
        if (response.ok) {
          return response.json();
        }
        console.error(response);
      })
      .then((data) => {
        setAlbum(data);
      });

    fetch(`${globalThis.BACKEND}/albumTracks/${folder}`)
      .then((response) => {
        if (response.ok) {
          return response.json();
        }
        console.error(response);
      })
      .then((data) => {
        data.sort((a, b) => a.position - b.position);
        setTracks(data);
      });
  }, [folder]);

  function queueSelected(position) {
    let selected = tracks.slice(position).map((track) => {
      if (track.position >= position) {
        return { 
          songFile: track.filename,
          songTitle: track.title,
          albumFolder: folder,
          albumTitle: album.title,
          albumArtists: album.artists,
          imageFile: album.image_file,
        }
      }
    })

    console.log(selected)

    queueMultiple(...selected)
  }

  return (
    <div className="m-6">
      <div className="h-60 flex flex-row p-2">
        <img
          className="m-1"
          src={
            album.image_file
              ? `${globalThis.BACKEND}/images/${album.image_file}`
              : fallbackImage
          }
          alt=""
        />
        <div className="m-1">
          <h1 className="text-4xl font-bold">{album.title}</h1>
          <p className="text-xl">{album.artists}</p>
          <p className="text-sm">{Number(album.release_year)}</p>
        </div>
      </div>
      <Separator.Root className="my-2 h-[1px] w-full bg-black" />

      <table>
        <thead>
          <tr>
            <th></th>
            <th>Position</th>
            <th>Title</th>
          </tr>
        </thead>
        <tbody>
          {tracks.map((track) => {
            return (
              <tr key={track.position}>
                <IconButton Icon={PlayIcon} onClick={() => queueSelected(track.position)} />
                <td>{track.position}</td>
                <td>{track.title}</td>
              </tr>
            )
          })}
        </tbody>
      </table>
    </div>
  );
}

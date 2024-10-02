import { useState, useEffect } from "react"
import { useParams } from "react-router-dom"
import * as Separator from "@radix-ui/react-separator"
import AlbumCard from "../components/AlbumCard"
import fallbackImage from "../assets/no-image.png"

export default function ArtistInfo() {
  const artist = useParams();
  const [albums, setAlbums] = useState([]);

  useEffect(() => {
    fetch(`${globalThis.BACKEND}/albumsArtist/${artist.artist}`)
      .then((response) => {
        if (response.ok) {
          return response.json();
        }
        throw response;
      })
      .then((data) => {
        setAlbums(data);
      });
  }, [artist]);

  return (
    <div className="m-6">
      <h1 className="text-4xl font-bold text-center">{artist.artist}</h1>
      <Separator.Root className="my-2 h-[1px] w-full bg-black" />
      <div className="grid grid-cols-[repeat(auto-fill,minmax(200px,2fr))] w-full">
        {albums.map((album) => {
          return (
            <AlbumCard
              coverart={
                album.image_file
                  ? `${globalThis.BACKEND}/images/${album.image_file}`
                  : fallbackImage
              }
              title={album.title || album.album_folder}
              artist={artist.artists}
              albumfolder={album.album_folder}
              key={album.album_folder}
            />
          );
        })}
      </div>
    </div>
  );
}

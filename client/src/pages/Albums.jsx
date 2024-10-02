import { useEffect, useState } from "react";
import * as Separator from "@radix-ui/react-separator";
import AlbumCard from "../components/AlbumCard";

import fallbackImage from "../assets/no-image.png";

export default function Albums() {
  const [albums, setAlbums] = useState([])

  useEffect(() => {
    fetch(`${globalThis.BACKEND}/albums`)
      .then((response) => {
        if (response.ok) {
          return response.json();
        }
        throw response;
      })
      .then((data) => {
        setAlbums(data);
      })
  }, [])

  return (
    <div className="m-6">
      <h1 className="text-4xl font-bold text-center">Albums</h1>
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
              artist={album.artists}
              albumfolder={album.album_folder}
              key={album.album_folder}
            />
          );
        })}
      </div>
    </div>
  )
}

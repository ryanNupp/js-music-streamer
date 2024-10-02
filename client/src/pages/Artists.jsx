import { useEffect, useState } from "react";
import * as Separator from "@radix-ui/react-separator";
import ArtistCard from "../components/ArtistCard";

export default function Albums() {
  const [artists, setArtists] = useState([]);

  useEffect(() => {
    fetch(`${globalThis.BACKEND}/artists`)
      .then((response) => {
        if (response.ok) {
          return response.json();
        }
        throw response;
      })
      .then((data) => {
        setArtists(data);
      });
  }, []);

  return (
    <div className="m-6">
      <h1 className="text-4xl font-bold text-center">Artists</h1>
      <Separator.Root className="my-2 h-[1px] w-full bg-black" />
      <div className="grid grid-cols-[repeat(auto-fill,minmax(200px,2fr))] w-full">
        {artists.map((artist) => {
          return (
            <ArtistCard
              artist={artist}
              key={artist}
            />
          );
        })}
      </div>
    </div>
  );
}

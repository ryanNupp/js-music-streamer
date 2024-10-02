import { Link } from "react-router-dom";

export default function ArtistCard({ artist }) {
  return (
    <Link
      to={"/artistinfo/" + artist.artists}
      className="w-[200px] h-[300px] m-1 bg-gray-700 text-white text-center"
    >
     <h1>{artist.artists}</h1>
    </Link>
  );
}

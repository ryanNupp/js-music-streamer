import { Link } from "react-router-dom";

export default function AlbumCard({ coverart, title, artist, albumfolder }) {
  return (
    <Link
      to={"/albuminfo/" + albumfolder}
      className="w-[200px] h-[300px] m-1 bg-gray-700 text-white text-center"
    >
      <img src={coverart} alt="album cover" className="w-full" />
      <h1>{title}</h1>
      <p>{artist || ""}</p>
    </Link>
  );
}

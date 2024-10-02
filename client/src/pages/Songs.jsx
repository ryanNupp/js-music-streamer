import { useState, useEffect } from 'react'

export default function Songs() {
  const [songs, setSongs] = useState([])

  useEffect(() => {
    fetch(`${globalThis.BACKEND}/tracks`)
      .then((response) => {
        if (response.ok) {
          return response.json();
        }
        throw response;
      })
      .then((data) => {
        setSongs(data);
      })
  }, [])

  return (
    <div>
      <table>
        <thead>
          <tr>
            <th>Title</th>
            <th>Album</th>            
            <th>Artist</th>
          </tr>
        </thead>
        <tbody>
          {songs.map((song) => {
            return (
              <tr key={song.album_folder + "/" + song.filename}>
                <td>{song.title}</td>
                <td>{song.album}</td>
                <td>{song.artists}</td>
              </tr>
            )
          })}
        </tbody>
      </table>
    </div>
  )
}

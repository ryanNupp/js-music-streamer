//use db to push stuff to the front end in a way that
//it can be processed
import getDB from './database.js';

const db = getDB();

export function getAlbums() {
    const stmt = db.prepare('SELECT title, image_path FROM Albums'); // Adjust the query as needed
    const info = stmt.all();
    return info;
};
export function getArtists(){
    const stmt = db.prepare('SELECT artists FROM Albums'); // Adjust the query as needed
    const info = stmt.all();
    return info;
};
export function getAlbumsByArtist(artist) {
    // Ensure the input is correctly formatted for the SQL query
    const formattedArtist = `%${artist}%`;

    // Prepare the query with the LIKE operator for partial matching
    const stmt = db.prepare('SELECT title, image_path FROM Albums WHERE artists LIKE ?');
    
    // Execute the query with the formatted input
    const info = stmt.all(formattedArtist);
    console.log(info); // Debugging: log the result
    return info;
}
export function getAlbumSongs(album){
    // const stmt = db.prepare('SELECT track, image_path FROM Albums WHERE album = ?'); // Adjust the query as needed
    // const info = stmt.all(album);
    // return info;
};
export function getTrackDetailsById(trackId) {
    // const stmt = db.prepare('SELECT audio_path, image_path FROM Tracks WHERE id = ?'); // Adjust the query as needed
    // const info = stmt.get(trackId);
    // return info;
};
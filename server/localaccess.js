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
    console.log(info);
    return info;
};
export function getAlbumsByArtist(artist){
    const stmt = db.prepare('SELECT title, image_path FROM Albums WHERE artist = ?'); // Adjust the query as needed
    const info = stmt.all(artist);
    return info;
};
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
//use db to push stuff to the front end in a way that
//it can be processed
import database from 'better-sqlite3'
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
export function getAlbumsByArtist(){
    const stmt = db.prepare('SELECT title, image_path FROM Albums WHERE artist = ?'); // Adjust the query as needed
    const info = stmt.all();
    return info;
};
// export function getAlbumtracks(){
//     const stmt = db.prepare('SELECT title, image_path FROM Albums WHERE artist = ?'); // Adjust the query as needed
//     const info = stmt.all();
//     return info;
// };
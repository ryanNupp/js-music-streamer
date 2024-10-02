//use db to push stuff to the front end in a way that
//it can be processed
import getDB from './database.js'

const db = getDB()

export function getAlbums() {
    const stmt = db.prepare('SELECT title, image_file, album_folder, artists FROM Albums')
    const info = stmt.all()
    return info
}

export function getArtists(){
    const stmt = db.prepare('SELECT artists FROM Albums') // Adjust the query as needed
    const info = stmt.all()
    return info
}

export function getTracks(){
    const stmt = db.prepare('SELECT * FROM Tracks')
    const info = stmt.all()
    return info
}

export function getAlbumsByArtist(artist) {
    const stmt = db.prepare('SELECT title, image_file, album_folder FROM Albums WHERE artists LIKE ?')
    const info = stmt.all(artist)
    return info
}

export function getAlbumTracks(albumFolderName){
    const stmt = db.prepare(`SELECT title, filename, position FROM Tracks WHERE album_folder = ?`)
    const info = stmt.all(albumFolderName)
    return info
}

export function getAlbumDetails(albumFolderName){
    const stmt = db.prepare('SELECT title, release_year, artists, image_file FROM Albums WHERE album_folder = ?')
    const info = stmt.get(albumFolderName)
    return info
}

export function getTrackDetails(filename) {
    const stmt = db.prepare(`
        SELECT Tracks.title, Tracks.artists, Tracks.album, Albums.image_file
        FROM Tracks
        JOIN Albums ON Tracks.album_folder = Albums.album_folder
        WHERE Tracks.filename = ?
    `)
    const info = stmt.get(filename)
    return info
}
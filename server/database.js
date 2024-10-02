import Database from 'better-sqlite3';

// Database that holds all metadata
const db = new Database('./db/metadata.db');
db.pragma('journal_mode = WAL')

// Albums table
db.prepare(`CREATE TABLE IF NOT EXISTS Albums ( 
    album_folder TEXT PRIMARY KEY,
    title TEXT,
    release_year TEXT,
    artists TEXT,
    release_group_mbid TEXT,
    release_mbid TEXT,
    image_file TEXT
);`).run();

// Tracks table
db.prepare(`CREATE TABLE IF NOT EXISTS Tracks (
    filename TEXT NOT NULL PRIMARY KEY,
    album_folder TEXT,
    title TEXT,
    position INTEGER,
    disc INTEGER,
    artists TEXT,
    genres TEXT,
    album TEXT,
    albumartist TEXT,
    year TEXT,
    FOREIGN KEY (album_folder) REFERENCES Albums (album_folder)
);`).run();

export default function getDB() {
    return db;
}
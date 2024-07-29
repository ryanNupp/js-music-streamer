import Database from 'better-sqlite3';

// Database that holds all metadata
const db = new Database('./db/metadata.db');
db.pragma('journal_mode = WAL')

// Albums table
db.prepare(`CREATE TABLE IF NOT EXISTS Albums ( 
    album_folder TEXT PRIMARY KEY,
    title TEXT,
    release_date TEXT,
    artists TEXT,
    release_group_mbid TEXT,
    release_mbid TEXT,
    image_path TEXT
);`).run();

// Songs table
db.prepare(`CREATE TABLE IF NOT EXISTS Songs (
    track_name TEXT NOT NULL,
    position INTEGER,
    album_title TEXT,
    FOREIGN KEY(album_title) REFERENCES Albums(title)
);`).run();

export default function getDB() {
    return db;
}
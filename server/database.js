import Database from 'better-sqlite3';

// Database that holds all metadata
const db = new Database('./db/metadata.db');
db.pragma('journal_mode = WAL')

// Albums table
db.prepare(`CREATE TABLE IF NOT EXISTS Albums ( 
    album_folder TEXT PRIMARY KEY,
    title TEXT,
    mbids TEXT,
    release_date TEXT,
    artists TEXT,
    image_path TEXT
)`).run();

export default function getDB() {
    return db;
}
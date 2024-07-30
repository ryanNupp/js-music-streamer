import * as fs from 'node:fs';
import * as path from 'node:path';
import axios from 'axios';
import { CoverArtArchiveApi } from 'musicbrainz-api';
import { mbApiSearch, mbApiLookup } from './mb-api.js';
import getDB from './database.js'; 
import 'dotenv/config';

const IMAGE_FOLDER = process.env.IMAGE_FOLDER;
const MUSIC_FOLDER = process.env.MUSIC_FOLDER;

const APP_NAME = process.env.APP_NAME;
const APP_VERSION = process.env.APP_VERSION;
const APP_MAIL = process.env.APP_MAIL;

const caaApi = new CoverArtArchiveApi();
const mbApi = new MusicBrainzApi({
    appName: process.env.APP_NAME,
    appVersion: process.env.APP_VERSION,
    appMail: process.env.APP_CONTACT
});
const db = getDB();

export default function checkNewAlbums() {
    const albumFolders = fs.readdirSync(MUSIC_FOLDER);
    // for each album folder in music folder
    albumFolders.forEach(async albumFolderName =>{
        const albumPath = path.join(MUSIC_FOLDER, albumFolderName);
        // if database entry for this album does not exist
        if (fs.lstatSync(albumPath).isDirectory()){
            const albumEntry = db.prepare(
                `SELECT * FROM Albums WHERE album_folder = ?`
            ).get(albumFolderName);

            if(!albumEntry){
                console.log(`Fetching metadata for album: ${albumFolderName}`);
                addAlbumMetadata(albumFolderName);
            }
        }
    });
}

// Searches and adds album metadata into database using MusicBrainz API
async function addAlbumMetadata(albumFolderName) {
    // find musicbrainz release group of album
    //let searchResult = await mbApi.search('release-group', { query: albumFolderName });
    let searchResult = await mbApiSearch('release-group', albumFolderName)
    const releaseGroup = searchResult['release-groups'].find(group => group['primary-type'] === "Album");
    const releaseGroupId = releaseGroup['id'];
    const albumName = releaseGroup['title'];
    const releaseDate = releaseGroup['first-release-date'];
    const artists = [];
    releaseGroup['artist-credit'].forEach(artist => {
        artists.push(artist.name);   
    });

    // now search through all releases in the release group, find a digital release
    //searchResult = await mbApi.search('release', { query: `rgid:${releaseGroupId}` });
    searchResult = await mbApiSearch('release', `rgid:${releaseGroupId}`);
    const releaseId = searchResult['releases'].find(release => release.count === 1 && release.media[0].format === "Digital Media").id;
    const releaseInfo = await mbApiLookup('release', releaseId, 'recordings');
    const tracks = releaseInfo.media[0];
    console.log(tracks);

    // download album image & create new row in Albums table in the db
    let imagePath = await downloadImage(releaseId, albumFolderName);
    const newAlbum = db.prepare(`
        INSERT INTO Albums (album_folder, title, release_date, artists, release_group_mbid, release_mbid, image_path)
        VALUES (?, ?, ?, ?, ?, ?, ?)
    `);
    newAlbum.run(albumFolderName, albumName, releaseDate, JSON.stringify(artists), releaseGroupId, releaseId, imagePath);

    // add each track file to songs table
    const songFiles = fs.readdirSync(`${MUSIC_FOLDER}/${albumFolderName}`);
    songFiles.forEach(async file => {
        if (isMusicFile(`${MUSIC_FOLDER}/${albumFolderName}/${file}`)) {
            // TODO: compare local file to track, get metadata  --- FINALLY got tracks variable above to hold all tracks per album & each track's metadata

            db.prepare(`
                INSERT INTO Songs (file_name, album_folder)
                VALUES (?, ?)
            `).run(file, albumFolderName);
        }
    });
}

// idk how to format this horrible looking function. i feel gross for even typing this. wouldn't be surprised if this is the worst way to do this but idc it works and we ball fr.
function isMusicFile(filepath) {
    const ext = path.extname(filepath);
    if (fs.lstatSync(filepath).isFile() &&
        ext == '.mp3'   ||
        ext == '.mpeg'  ||
        ext == '.opus'  ||
        ext == '.ogg'   ||
        ext == '.oga'   ||
        ext == '.wav'   ||
        ext == '.aac'   ||
        ext == '.caf'   ||
        ext == '.m4a'   ||
        ext == '.mp4'   ||
        ext == '.weba'  ||
        ext == '.webm'  ||
        ext == '.dolby' ||
        ext == '.flac'  ) 
    { return true; } 
    else 
    { return false; }
}

async function downloadImage(releaseMBID, albumFolderName) {
    try {
        const releaseCoverInfo = await caaApi.getReleaseCovers(releaseMBID);
        const caaImageUrl = releaseCoverInfo.images[0].image;
        const localImageName = albumFolderName + path.extname(caaImageUrl);
        const response = await axios.get(caaImageUrl, { responseType: 'arraybuffer' });

        fs.writeFile(IMAGE_FOLDER + "/" + localImageName, response.data, (err) => {
            if (err) throw err;
            console.log(`Image downloaded: ${localImageName}`);
        });
    
        return `${localImageName}`;
    } catch (err) {
        console.error(`Error saving image - MBID: ${releaseMBID} - Album: ${albumFolderName}`);
        return null;
    };
}

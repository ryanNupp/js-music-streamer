import * as fs from 'node:fs';
import * as path from 'node:path';
import axios from 'axios';
import { mbApiSearch, mbApiLookup, caaApiGetCovers } from './mb-api.js';
import { parseFile } from 'music-metadata';
import { inspect } from 'util';
import getDB from './database.js'; 
import 'dotenv/config';
import * as mime from 'mime-types';

const IMAGE_FOLDER = process.env.IMAGE_FOLDER;
const MUSIC_FOLDER = process.env.MUSIC_FOLDER;
const db = getDB();

// Check for albums not in the local database, add their metadata
export default function checkNewAlbums() {
    const albumFolders = fs.readdirSync(MUSIC_FOLDER);

    albumFolders.forEach(async albumFolderName =>{
        const albumPath = path.join(MUSIC_FOLDER, albumFolderName);

        if (fs.lstatSync(albumPath).isDirectory()){
            const albumEntry = db.prepare(
                `SELECT * FROM Albums WHERE album_folder = ?`
            ).get(albumFolderName);

            if(!albumEntry){
                console.log(`Fetching metadata for album: ${albumFolderName}`);
                addAlbumMetadata(albumFolderName).then(() => {
                    db.prepare(`
                        UPDATE Albums
                        SET title = album,
                            artists = albumartist,
                            release_year = year
                        FROM Tracks 
                        WHERE Albums.album_folder = Tracks.album_folder;
                    `).run();
                });
            }
        }
    });
}

// add all metadata for album & all its tracks
async function addAlbumMetadata(albumFolderName) {
    const currDir = `${MUSIC_FOLDER}/${albumFolderName}`;
    const albumFiles = fs.readdirSync(currDir);

    db.prepare(`
        INSERT INTO Albums (album_folder)
        VALUES (?)
    `).run(albumFolderName);

    await Promise.all(albumFiles.map(file => {
        return localTrackMetadata(albumFolderName, file);
    }))
}

// pull local file metadata from a songfile & add to Tracks table in database
async function localTrackMetadata(albumFolderName, filename) {
    if (!isAudioFile(`${MUSIC_FOLDER}/${albumFolderName}/${filename}`)) {
        return;
    }
    try {
        const metadata = await parseFile(`${MUSIC_FOLDER}/${albumFolderName}/${filename}`);
        const title = metadata.common.title;
        const position = metadata.common.track['no'];
        const disc = metadata.common.disk['no'];
        const artists = metadata.common.artists;
        const genres = JSON.stringify(metadata.common.genre);
        const album = metadata.common.album;
        const albumartist = metadata.common.albumartist;
        const year = metadata.common.year;
        
        // store track metadata in database
        db.prepare(`
            INSERT INTO Tracks (filename, album_folder, title, position, disc, artists, genres, album, albumartist, year)
            VALUES (?, ?, ?, ?, ?, ?, ?, ?, ?, ?)
        `).run(filename, albumFolderName, title, position, disc, artists, genres, album, albumartist, year);

        // save embedded track picture
        const embeddedCoverart = metadata.common.picture;

        if (embeddedCoverart && embeddedCoverart.length > 0) {
            let pictureData = embeddedCoverart[0].data;
            let pictureFile = albumFolderName + '.' + mime.extension(embeddedCoverart[0].format);
            if (!fs.existsSync(`${IMAGE_FOLDER}/${pictureFile}`)) {
                fs.writeFile(`${IMAGE_FOLDER}/${pictureFile}`, pictureData, (err) => {
                    if (err) {
                        console.log(err);
                    }
                    else {
                        console.log(`Successfully saved '${pictureFile}' in the image folder ${IMAGE_FOLDER}`)
                        db.prepare(`
                            UPDATE Albums
                            SET image_file = ?
                            WHERE album_folder = ?
                        `).run(pictureFile, albumFolderName);
                    }
                })
            }
        }
    } catch (err) {
        console.error(err);
    }
}

// return true if file at filepath is an audio file
function isAudioFile(filepath) {
    let fileType = mime.lookup(filepath);
    if (fileType == false) {
        return false;
    } else if (fileType.slice(0, 5) == "audio") {
        return true;
    } else {
        return false;
    }
}``


// OLD CODE TO PULL METADATA USING THE ALBUM FOLDER NAME
// (This was in a semi-working state for albums only)

/*
// Searches and adds album metadata into database using MusicBrainz API
async function addAlbumMetadata(albumFolderName) {
    // find musicbrainz release group of album
    let searchResult = await mbApiSearch('release-group', albumFolderName.replaceAll('-', ' '))
    console.log(albumFolderName.replaceAll('-', ' '))
    const releaseGroup = searchResult['release-groups'].find(group => group['primary-type'] === "Album");
    const releaseGroupId = releaseGroup['id'];
    const albumName = releaseGroup['title'];
    const releaseDate = releaseGroup['first-release-date'];
    const artists = [];
    releaseGroup['artist-credit'].forEach(artist => {
        artists.push(artist.name);   
    });

    // now search through all releases in the release group, find a digital release
    searchResult = await mbApiSearch('release', `rgid:${releaseGroupId}`);
    console.log(releaseGroup);
    console.log(searchResult);

    // TODO: improve this logic:
    //  1. Look for digital release
    //  2. If no digital release, check for a CD release
    //  3. If no CD release, check for some Vinyl release
    //  4. Check for anything I guess idk? idk if albums will reach this stage
    
    var releaseId;
    try {
        releaseId = searchResult['releases'].find(release => release.status === "Official" && release.count === 1 && release.media[0].format === "Digital Media").id;
    } catch (err) {
        console.log(`No digital release, doing CD release instead for Album: ${albumName}`)
        try {
            releaseId = searchResult['releases'].find(release => release.status === "Official" && release.count === 1 && release.media[0].format === "CD").id;
        } catch (err) {
            console.log(`No CD release, finding the first release of any kind for: ${albumName}`)
            releaseId = searchResult.releases[0].id;
        }
    }


    // /\ /\ /\ /\ /\ /\ /\ /\ /\
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
        if (isAudioFile(`${MUSIC_FOLDER}/${albumFolderName}/${file}`)) {
            // TODO: compare local file to track, get metadata  --- FINALLY got tracks variable above to hold all tracks per album & each track's metadata

            db.prepare(`
                INSERT INTO Songs (file_name, album_folder)
                VALUES (?, ?)
            `).run(file, albumFolderName);
        }
    });
}

async function downloadImage(releaseMBID, albumFolderName) {
    try {
        const releaseCoverInfo = await caaApiGetCovers(releaseMBID);
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
*/
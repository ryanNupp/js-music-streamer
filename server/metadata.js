import * as fs from 'node:fs';
import * as path from 'node:path';
import axios from 'axios';
import { MusicBrainzApi, CoverArtArchiveApi } from 'musicbrainz-api';
import getDB from './database.js'; 
import 'dotenv/config';

const IMAGE_FOLDER = process.env.IMAGE_FOLDER;
const MUSIC_FOLDER = process.env.MUSIC_FOLDER;
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

// album entry in database stores an array of all MBIDs to releases related to the release-group
// shift the array so we download the image of the next release
// move array[0] to the back so user can continuously shuffle through all the album cover arts
//
// then replace the image in the images folder with the cover art for MBID stored at array[0]
////////////export function shiftImage(albumFolderName) {
// array = somehow get the releaseMBIDs array from album entry in the database
// array.push(array.shift())    // this would remove first element of array, and then push it to the back.
//                                 what was array[1] before would now become array[0] 
// replace db entry releaseMBIDs array with this new array after its all shifted around
//
// now download & replace new image
// downloadImage(array[0], albumFolderName)


// Searches and pulls album metadata using MusicBrainz API
// Adds new album entry to database
async function addAlbumMetadata(albumFolderName) {
    let searchResult = await mbApi.search('release-group', { query: albumFolderName });
    const releaseGroup = searchResult['release-groups'].find(group => group['primary-type'] === "Album")
    const albumName = releaseGroup['title'];
    const releaseDate = releaseGroup['first-release-date'];
    const artists = [];
    releaseGroup['artist-credit'].forEach(artist => {
        artists.push(artist.name);   
    });
    const releaseMBIDs = releaseGroup['releases'].filter(release => 
        release['title'] === albumName &&
        release['status'] === 'Official'
    );
    releaseMBIDs.forEach((releaseMBID, index) => {
        releaseMBIDs[index] = releaseMBID['id'];
    });
    let imagePath = await downloadImage(releaseMBIDs[0], albumFolderName);

    // TODO: insert all the stuff above into a new db entry in the 'Albums' table
    const newAlbum = db.prepare(`
        INSERT INTO Albums (album_folder, title, mbids, release_date, artists, image_path)
        VALUES (?, ?, ?, ?, ?, ?)
    `);
    newAlbum.run(albumFolderName, albumName, JSON.stringify(releaseMBIDs), releaseDate, JSON.stringify(artists), imagePath);
}

// Download an image from CAA given an MBID
async function downloadImage(releaseMbid, albumFolderName) {
    const extension = await caaApi.getReleaseCovers(releaseMbid).then(async releaseCoverInfo => {
        let caaImageUrl = releaseCoverInfo.images[0].image;
        let imageFileExtension = caaImageUrl.slice(-4);

        // download the file
        const response = await axios.get(caaImageUrl, { responseType: 'arraybuffer' });
        fs.writeFile(`${IMAGE_FOLDER}/${albumFolderName + imageFileExtension}`, response.data, (err) => {
            if (err) throw err;
            console.log(`Image downloaded: ${albumFolderName + imageFileExtension}`);
        });
        return imageFileExtension;
    })

    return `${albumFolderName + extension}`;
}


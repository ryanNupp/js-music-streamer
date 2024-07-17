import express from 'express';
import cors from 'cors';
import * as fs from 'node:fs';
import * as path from 'node:path';
import axios from 'axios';
import { MusicBrainzApi, CoverArtArchiveApi } from 'musicbrainz-api';

const app = express();
const PORT = 8080;
const USER_MUSIC_FOLDER = '../temp_music_collection/Death Grips - Year of the Snitch';
const mbApi = new MusicBrainzApi({
    appName: 'PersonalMusicStreamer',
    appVersion: '0.1.0',
    appMail: 'ryan.nuppenau02@gmail.com'
});
const caaApi = new CoverArtArchiveApi();

// probably remove this once db & metadata pulling gets workin how we want 
const imagesFolder = './images'; // Adjust this path if necessary
const songsFolder = '../temp_music_collection/Death Grips - Year of the Snitch'; // Adjust this path if necessary

app.use(cors());

// download image given url
async function downloadImage(url, filename) {
    const response = await axios.get(url, { responseType: 'arraybuffer' });

    fs.writeFile(filename, response.data, (err) => {
        if (err) throw err;
        console.log('Image downloaded successfully!');
    });
}

// use musicbrainz api & coverartarchive api to grab info about an album
// & download cover art to images folder
async function getAlbumMetadata(albumName) {
    // TODO: Create database entry for album

    // search for a list of releases that match query string input
    const searchResult = await mbApi.search('release', { query: albumName });

    // TODO: find first search result that is Digital Release 
    //       ( in efforts to get most applicable metadata )
    const releaseMbid = searchResult.releases[1].id;

    // TODO: 
    // Once a specific MBID is found for a release, look up info on this release.
    // Add this to database
    //const lookup = await mbApi.lookup('release', releaseMbid)

    // user converartarchive.org to find art for this release with MBID
    caaApi.getReleaseCovers(releaseMbid).then(releaseCoverInfo => {
        let imageUrl = releaseCoverInfo.images[0].image;

        downloadImage(imageUrl, imagesFolder + "/" + albumName + imageUrl.substr(imageUrl.length - 4));
    });

    // TODO: add local image url to database entry for the album
}

// IN FUTURE THIS WILL CHANGE: IT WILL GRAB INFO FROM THE INTERNAL DATABASE INSTEAD
// TODO: Make internal database, get seperate function to pull metadata into local database
//
// Route for album info
app.get('/album-info/:foldername', (req, res) => {
    const { foldername } = req.params;

    getAlbumMetadata(foldername);
});

// Route for streaming audio
app.get('/stream/:filename', (req, res) => {
    const { filename } = req.params;
    const file = path.join(USER_MUSIC_FOLDER, filename);
    if (fs.existsSync(file)) {
        const audioStream = fs.createReadStream(file);
        audioStream.pipe(res); // Stream audio file to the client
    } else {
        res.status(404).send('File not found');
    }
});

app.get('/app/songs', (req, res) => {
    fs.readdir(songsFolder, (err, files) => {
        if (err) {
            console.error('Error reading songs directory:', err);
            res.status(500).json({ error: 'Internal server error' });
            return;
        }

        // Filter out image files based on their extensions
        const songsData = files.filter(file => {
            const fileExtension = path.extname(file).toLowerCase();
            return !['.jpg', '.jpeg', '.png', '.gif'].includes(fileExtension);
        }).map(file => {
            const filePath = path.join(songsFolder, file);
            const { artist,album, title } = parseSongFilename(file); // Implement this function

            return {
                filename: file,
                albumName: album,
                artist: artist,
                title: title,
                filePath: filePath, // optional, include any other metadata you need
            };
        });

        res.json(songsData);
    });
});

// Function to parse song filename and extract artist and title
function parseSongFilename(filename) {
    // Implement your logic to parse the filename and extract artist and title
    // Example logic: Split filename based on delimiter or use regex to extract data
    // Replace with actual logic based on your filenames
    const parts = filename.split('-').map(part => part.trim());
    const album = parts[1];
    const artist = parts[0]; // Assuming artist is the first part before the first dash
    const title = parts.slice(1).join(' - ').replace('.mp3', '').trim(); // Join remaining parts and remove file extension

    return { artist, album, title };
}

// Serve individual images based on filename
app.get('/images/:filename', (req, res) => {
    const { filename } = req.params;
    const file = path.join(imagesFolder, filename);

    if (fs.existsSync(file)) {
        const imageStream = fs.createReadStream(file);
        imageStream.pipe(res); // Stream image file to the client
    } else {
        res.status(404).send('Image not found');
    }
});
// Routes for other pages
app.get('/albums', (req, res) => {
    res.send('This is the Albums Page');
});

app.get('/artists', (req, res) => {
    res.send('This is the Artist Page');
});

app.get('/playlists', (req, res) => {
    res.send('This is the Playlist Page');
});
app.get('/home', (req, res) => {
    res.send('This is the Home Page');
});
// Start server
app.listen(PORT, () => {
    console.log(`Server listening on port ${PORT}`);
});

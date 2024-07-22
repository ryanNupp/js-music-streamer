import express from 'express';
import cors from 'cors';
import * as fs from 'node:fs';
import * as path from 'node:path';
import 'dotenv/config';
import checkNewAlbums from './metadata.js'
import { getAlbums, getArtists, getAlbumsByArtist, getAlbumSongs } from './localaccess.js';

const app = express();
const PORT = Number(process.env.PORT);
const MUSIC_FOLDER = process.env.MUSIC_FOLDER;
const IMAGE_FOLDER = process.env.IMAGE_FOLDER;
app.use(cors());

// Add new albums in music library
app.get('/find-new-albums', () => {  checkNewAlbums();  });

// Get list of all albums
app.get('/albums', (req, res) => {  res.json(getAlbums())  });

//get 
app.get('/albums/*', (req, res) => {  const album = decodeURIComponent(req.params.artist);
    res.json(getAlbumSongs(album))  

});

//get all artists 
app.get('/artists', (req, res) => {  res.json(getArtists())  });

//get albums by artist
app.get('/albumsAritst/*', (req, res) => {
    const artistName = decodeURIComponent(req.params.artist);
    try {
        const albums = getAlbumsByArtist(artistName);
        res.json(albums); // Send albums data as JSON
    } catch (error) {
        res.status(500).json({ error: error.message });
    }
});
// get songs off a specified album
app.get('/album-details/:id', (req, res) => {
    try {
        const songs  = getAlbumSongs(album);
        res.json(songs); // Send albums data as JSON
    } catch (error) {
        res.status(500).json({ error: error.message });
    }
});
// Route for streaming audio
app.get('/stream/*', (req, res) => {
    const filepath  = decodeURIComponent(req.params[0]);
    const file = path.join(MUSIC_FOLDER, filepath);
    
    if (fs.existsSync(file)) {
        const audioStream = fs.createReadStream(file);
        audioStream.pipe(res); // Stream audio file to the client
    } else {
        res.status(404).send('File not found');
    }
});

// Serve individual images based on filename
app.get('/images/:filename', (req, res) => {
    const { filename } = req.params;
    const file = path.join(IMAGE_FOLDER, filename);

    if (fs.existsSync(file)) {
        const imageStream = fs.createReadStream(file);
        imageStream.pipe(res); // Stream image file to the client
    } else {
        res.status(404).send('Image not found');
    }
});
//get track details
app.get('/trackDetails/:trackId', (req, res) => {
    const trackId = decodeURIComponent(req.params.trackId);
    try {
        const trackDetails = getTrackDetailsById(trackId); // A function to fetch track details from your database
        res.json(trackDetails);
    } catch (error) {
        res.status(500).json({ error: error.message });
    }
});

// Start server
app.listen(PORT, () => {
    console.log(`Server listening on port ${PORT}`);
});
